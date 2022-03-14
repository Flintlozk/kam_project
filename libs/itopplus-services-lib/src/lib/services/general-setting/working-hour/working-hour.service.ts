import { createTransporter, getDynamicDayOfWeek, isAllowCaptureException, isSameDay, parseTimestampToDayjs, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  AudienceDomainStatus,
  EnumDayOfWeek,
  EPageMessageTrackMode,
  IAggregateMessageModel,
  IAudience,
  IPageMessageTrackMode,
  IPageWorkingHoursOptionAdditional,
  IPageWorkingHoursOptionDates,
  IPageWorkingHoursOptionNotifyList,
  IPageWorkingHoursOptionOffTime,
  IPageWorkingHoursOptions,
  IUserEmail,
  PageSettingType,
  WorkhourShopStatus,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { getCustomerByAudienceIDsForOfftimeNotify, getEmailOfCaseOwnerOnTrackByAssignee, getEmailOfCaseOwnerOnTrackByTag, removeTempMessageByIDs } from '../../../data';
import { getAudienceByID, getCustomerByAudienceID } from '../../../data/audience/get-audience.data';
import { setAudienceOffTimes, updateLastSendOffTime } from '../../../data/audience/set-audience.data';
import { deleteAudienceWorkhourRedis, getAudienceWorkhourRedis, setAudienceWorkhourRedis } from '../../../data/working-hour.data';
import { getMessagePayloadTemplate } from '../../../domains/message';
import {
  combineCaseOwner,
  combineEachMessagesOfftime,
  getEmailContentOnAllCase,
  getEmailContentOnCaseByCase,
  getWorkingTimeInRange,
  setWorkhoursDate,
} from '../../../domains/working-hour/working-hour.domain';
import { LineAutomateMessageService } from '../../message';
import { FacebookAutomateMessageService } from '../../message/facebook/facebook-automate-message.service';
import { PageSettingsService } from '../../page-settings/page-settings.service';
import { PlusmarService } from '../../plusmarservice.class';

interface WorkingHourConfig {
  offTime: IPageWorkingHoursOptionOffTime;
  additional: IPageWorkingHoursOptionAdditional;
  dayOfWeek: {
    yesterday?: IPageWorkingHoursOptionDates;
    today: IPageWorkingHoursOptionDates;
    tomorrow?: IPageWorkingHoursOptionDates;
  };
}

export class WorkingHourService {
  private pageSettingsService: PageSettingsService;
  private facebookAutomateMessageService: FacebookAutomateMessageService;
  private lineAutomateMessageService: LineAutomateMessageService;
  constructor() {
    this.pageSettingsService = new PageSettingsService();
    this.facebookAutomateMessageService = new FacebookAutomateMessageService();
    this.lineAutomateMessageService = new LineAutomateMessageService();
  }

  async getDailyWorkingHourOption(pageID: number): Promise<WorkingHourConfig> {
    const config = await this.pageSettingsService.getPageSetting(pageID, PageSettingType.WORKING_HOURS);
    if (!isEmpty(config)) {
      if (config.status === true) {
        const options = config.options as IPageWorkingHoursOptions;

        // const yesterday = EnumDayOfWeek[getDynamicDayOfWeek(-1)]; // from today - 1
        // const yesterdayConfig: IPageWorkingHoursOptionDates = options[yesterday];

        const today = EnumDayOfWeek[getDynamicDayOfWeek(0)]; // 0 today
        const todayConfig: IPageWorkingHoursOptionDates = options[today];

        // const tomorrowConfig: IPageWorkingHoursOptionDates = options[tomorrow];
        // const tomorrow = EnumDayOfWeek[getDynamicDayOfWeek(1)]; // from today + 1

        return {
          offTime: options.offTime,
          additional: options.additional,
          dayOfWeek: {
            // yesterday: { day: yesterday, ...yesterdayConfig, times: setWorkhoursDate(yesterdayConfig.times, -1) },
            today: { day: today, ...todayConfig, times: setWorkhoursDate(todayConfig.times) },
            // tomorrow: { day: tomorrow, ...tomorrowConfig, times: setWorkhoursDate(tomorrowConfig.times, 1) },
          },
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async setWorkingHourSetting(pageID: number, config: IPageWorkingHoursOptions): Promise<boolean> {
    try {
      const settingType = PageSettingType.WORKING_HOURS;
      await this.pageSettingsService.savePageSettingOption(pageID, settingType, config);
      return true;
    } catch (err) {
      console.log('setWorkingHourSetting err : ', err);
      throw err;
    }
  }

  async resetAudienceOffTime(pageID: number, audienceID: number, audience?: IAudience, client = PlusmarService.writerClient): Promise<void> {
    if (isEmpty(audience)) {
      audience = await getAudienceByID(client, audienceID, pageID);
    }
    const { is_offtime: isOffTimeSet } = audience;
    if (isOffTimeSet) {
      await setAudienceOffTimes(client, pageID, audienceID, false);
    }
  }

  async checkIsShopClosedByWorkingHour(pageID: number, audience: IAudience, incomingTime: string, subscriptionID: string): Promise<{ condition: string; isClose: boolean }> {
    try {
      // noted : return true means Shop is closed
      const { is_offtime: isOfftimeSet, status, last_send_offtime: lastSendOfftime } = audience;
      let isNew = false;

      const utcIncomimgTime = parseTimestampToDayjs(incomingTime);

      const isTheSameDay = lastSendOfftime !== null ? isSameDay(dayjs(lastSendOfftime), utcIncomimgTime) : false;

      if (isOfftimeSet && isTheSameDay) {
        // NOTE : already set and still in the same day and Shop is close
        return {
          condition: '[0] Is offtime and samedays',
          isClose: WorkhourShopStatus.CLOSE,
        }; // ?
      } else {
        const config = await this.getDailyWorkingHourOption(pageID); // can be return as Null according to no config || turn off

        if (config !== null) {
          const { dayOfWeek, offTime, additional } = config;
          const { today } = dayOfWeek;

          if ([AudienceDomainStatus.INBOX, AudienceDomainStatus.COMMENT, AudienceDomainStatus.LIVE].includes(status as AudienceDomainStatus)) isNew = true;
          if (today.isActive) {
            if (!today.allTimes) {
              const isInWorkTime = getWorkingTimeInRange(utcIncomimgTime, today, isNew, additional);

              if (isEmpty(isInWorkTime)) {
                // NOTE : means shop is in between closes time
                await this.setAudienceOffTimeStatus(pageID, audience, WorkhourShopStatus.CLOSE);
                if (!isTheSameDay) await this.sendOffTimeMessage(pageID, audience, offTime, subscriptionID);

                // NOTE : Shop in between closed time
                return {
                  condition: '[1] Shop in between closed time',
                  isClose: WorkhourShopStatus.CLOSE,
                }; // ?
              } else {
                // NOTE : Shop in opening time
                return {
                  condition: '[2] Shop in opening time',
                  isClose: WorkhourShopStatus.OPEN,
                }; // ?
              }
            } else {
              // NOTE : always open
              return {
                condition: '[3] Shop always open',
                isClose: WorkhourShopStatus.OPEN,
              }; // ?
            }
          } else {
            // NOTE : today is closed
            await this.setAudienceOffTimeStatus(pageID, audience, WorkhourShopStatus.CLOSE);
            if (!isTheSameDay) await this.sendOffTimeMessage(pageID, audience, offTime, subscriptionID);

            return {
              condition: '[4] Shop close all day',
              isClose: WorkhourShopStatus.CLOSE,
            }; // ?
          }
        } else {
          // NOTE : No Config for the shop
          return {
            condition: '[5] Has no Config for the shop',
            isClose: WorkhourShopStatus.CLOSE,
          }; // ?
        }
      }
    } catch (err) {
      return {
        condition: '[6] Error',
        isClose: false,
      }; // ?
    }
  }

  async setAudienceOffTimeStatus(pageID: number, audience: IAudience, isOfftime: boolean): Promise<boolean> {
    const { id: audienceID } = audience;
    await setAudienceOffTimes(PlusmarService.writerClient, pageID, audienceID, isOfftime);
    if (isOfftime) {
      await updateLastSendOffTime(PlusmarService.writerClient, audienceID, pageID);
    }
    return true;
  }

  async sendOffTimeMessage(pageID: number, audience: IAudience, offTime: IPageWorkingHoursOptionOffTime, subscriptionID: string): Promise<boolean> {
    const redisKey = `OFFTIME_${audience.id}`;
    const exists = await getAudienceWorkhourRedis(PlusmarService.redisClient, redisKey);

    if (exists) return;
    else setAudienceWorkhourRedis(PlusmarService.redisClient, redisKey, new Date());

    try {
      const { isActive: offTimeActive, message: offTimeMessage } = offTime;
      if (offTimeActive) {
        const { psid, platform } = await getCustomerByAudienceID(PlusmarService.readerClient, audience.id, pageID);
        switch (platform) {
          case AudiencePlatformType.FACEBOOKFANPAGE: {
            const messagePayload = getMessagePayloadTemplate(offTimeMessage, audience.id, pageID);
            await this.facebookAutomateMessageService.sendFacebookAutomateMessage(pageID, psid, messagePayload);
            break;
          }
          case AudiencePlatformType.LINEOA: {
            const messagePayload = getMessagePayloadTemplate(offTimeMessage, audience.id, pageID);
            await this.lineAutomateMessageService.sendLineAutomateMessage(pageID, messagePayload, subscriptionID);
            break;
          }
          default:
            break;
        }

        await deleteAudienceWorkhourRedis(PlusmarService.redisClient, redisKey);
        return true;
      }
    } catch (err) {
      // Working Send Offtime Message error
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      await deleteAudienceWorkhourRedis(PlusmarService.redisClient, redisKey);

      return false;
    }
  }

  async sendNotifyUsersViaEmail(messages: IAggregateMessageModel[]): Promise<void> {
    const transporter = createTransporter(PlusmarService.environment.transporterConfig);
    const origin = PlusmarService.environment.origin;

    for (let index = 0; index < messages.length; index++) {
      const messageGroup = messages[index];
      const pageID = messageGroup?._id?.pageID;

      const config = await this.pageSettingsService.getPageSetting(pageID, PageSettingType.WORKING_HOURS);

      if (!isEmpty(config)) {
        const option = <IPageWorkingHoursOptions>config.options;
        const notify = option.notifyList;

        await this.processMessageAndEmailToSend(transporter, pageID, notify, messageGroup, origin);
      } else {
        const messageIDforDelete = messageGroup.data.map((message) => message._id);
        await removeTempMessageByIDs(messageIDforDelete, PlusmarService.environment);
      }
    }
  }

  async processMessageAndEmailToSend(transporter, pageID: number, notify: IPageWorkingHoursOptionNotifyList, messageGroup: IAggregateMessageModel, origin: string): Promise<void> {
    if (notify && notify.isActive) {
      const emails = notify.emails.map((email) => email.email);
      const audienceIDs = <number[]>Array.from(new Set(messageGroup.data.map((message) => message.audienceID)));
      const groupIDs = PostgresHelper.joinInQueries(audienceIDs);

      const customers = await getCustomerByAudienceIDsForOfftimeNotify(PlusmarService.readerClient, groupIDs, pageID);

      const shopDetail = {
        shopName: customers[0].shopName,
        shopPicture: customers[0].shopPicture,
      };

      const messages = combineEachMessagesOfftime(messageGroup.data, customers, origin);

      // * Send by Case Owner
      const caseOwners = await this.getEmailOfCaseOwner(pageID, audienceIDs);
      if (caseOwners.length > 0) {
        const users = combineCaseOwner(caseOwners);
        for (let index = 0; index < users.length; index++) {
          const user = users[index];
          const htmlByCase = getEmailContentOnCaseByCase(messages, shopDetail, user);
          await this.sendNotificationEmail(transporter, user.email, htmlByCase, shopDetail.shopName, false);
        }
      }

      if (emails.length > 0) {
        // * Send all set emails
        const html = getEmailContentOnAllCase(messages, shopDetail);
        await this.sendNotificationEmail(transporter, emails.join(','), html, shopDetail.shopName, true);
      }

      const messageIDforDelete = messages.map((message) => message._id);
      await removeTempMessageByIDs(messageIDforDelete, PlusmarService.environment);
    } else {
      const messageIDforDelete = messageGroup.data.map((message) => message._id);
      await removeTempMessageByIDs(messageIDforDelete, PlusmarService.environment);
    }
  }

  async sendNotificationEmail(transporter, emails: string, messageHTML: string, shopName: string, isSummary: boolean): Promise<void> {
    const type = isSummary ? '(overview)' : '(individual)';
    await transporter.sendMail({
      from: 'no-reply@more-commerce.com',
      to: emails,
      subject: `More-Commerce - You may missed messages ${shopName} : ${type}`,
      attachments: null,
      html: messageHTML,
    });
    return;
  }

  async getEmailOfCaseOwner(pageID: number, audienceIDs: number[]): Promise<IUserEmail[]> {
    const config = await this.pageSettingsService.getPageSetting(pageID, PageSettingType.MESSAGE_TRACK);

    const audienceID = PostgresHelper.joinInQueries(audienceIDs);

    if (!isEmpty(config)) {
      const option = <IPageMessageTrackMode>config.options;
      switch (option.trackMode) {
        case EPageMessageTrackMode.TRACK_BY_ASSIGNEE: {
          return await getEmailOfCaseOwnerOnTrackByAssignee(PlusmarService.readerClient, pageID, audienceID);
        }
        case EPageMessageTrackMode.TRACK_BY_TAG: {
          return await getEmailOfCaseOwnerOnTrackByTag(PlusmarService.readerClient, pageID, audienceID);
        }
      }
    } else {
      return [];
    }
  }
}
