import { combineHourAndMinute, isTimeBefore } from '@reactor-room/itopplus-back-end-helpers';
import {
  EPageMessageTrackMode,
  ICustomerSLATime,
  ICustomerTagSLA,
  IEachPageSettingsSLA,
  IPageCustomerSlaTimeOptions,
  IPageMessageTrackMode,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty, isNumber } from 'lodash';
import {
  countAssignedCustomerExceedSLATime,
  countCustomerExceedSLATime,
  countTaggedCustomerExceedSLATime,
  countUnassignedCustomerExceedSLATime,
  countUntaggedCustomerExceedSLATime,
  getAssigneeCustomerExceedSLATime,
  getTaggedCustomerExceedSLATime,
} from '../../data';
import { convertSLAStringToTime } from '../../domains';
import { PageSettingsService } from '../page-settings';
import { PlusmarService } from '../plusmarservice.class';

export class CustomerSLAService {
  private pageSettingsService: PageSettingsService;
  constructor() {
    this.pageSettingsService = new PageSettingsService();
  }

  async getSLAExceedTimes(pageID?: number, options?: IPageCustomerSlaTimeOptions): Promise<string> {
    if (!options) {
      const config = await this.pageSettingsService.getPageSettingConfig(pageID, PageSettingType.CUSTOMER_SLA_TIME);
      options = <IPageCustomerSlaTimeOptions>config.options;
    }

    const time = convertSLAStringToTime(options?.hour, options?.minute);
    return time;
  }
  async getSLABeforeExceedTimes(pageID?: number, options?: IPageCustomerSlaTimeOptions): Promise<string> {
    if (!options) {
      const config = await this.pageSettingsService.getPageSettingConfig(pageID, PageSettingType.CUSTOMER_SLA_TIME);
      options = <IPageCustomerSlaTimeOptions>config.options;
    }

    const time = convertSLAStringToTime(options?.hour - options?.alertHour, options?.minute - options?.alertMinute);
    return time;
  }

  async getSLATimes(pageID: number): Promise<{ alertSLA: string; exceedSLA: string }> {
    const config = await this.pageSettingsService.getPageSettingConfig(pageID, PageSettingType.CUSTOMER_SLA_TIME);
    const options = <IPageCustomerSlaTimeOptions>config.options;

    const times = {
      alertSLA: await this.getSLABeforeExceedTimes(pageID, options),
      exceedSLA: await this.getSLAExceedTimes(pageID, options),
    };
    return times;
  }

  async getSLAPageSettingByEachPage({ subscriptionID }: { subscriptionID: string }): Promise<IEachPageSettingsSLA[]> {
    const pageSettiings = await this.pageSettingsService.getPageSettingUnderGivenSubscription(subscriptionID, PageSettingType.CUSTOMER_SLA_TIME);
    if (isEmpty(pageSettiings)) return null;
    const queriesByEachPage = await Promise.all(
      pageSettiings.map((item) => {
        return this.getSLATimesWithExistsOption(item.page_id, item.options as IPageCustomerSlaTimeOptions, item.status);
      }),
    );
    const result = queriesByEachPage.filter((x) => x !== null);

    const pageMessageTrackSettiings = await this.pageSettingsService.getPageSettingUnderGivenSubscription(subscriptionID, PageSettingType.MESSAGE_TRACK);
    const mapValue = result.map((item) => {
      const pageOption = pageMessageTrackSettiings.find((page) => page.page_id === item.pageID);
      item.messageTrack = (<IPageMessageTrackMode>pageOption?.options)?.trackMode;
      return item;
    });
    return mapValue;
  }

  async getSLATimesWithExistsOption(pageID: number, options: IPageCustomerSlaTimeOptions, isEnabled: boolean): Promise<IEachPageSettingsSLA> {
    if (!isEnabled) return null;
    const times = {
      pageID,
      messageTrack: EPageMessageTrackMode.TRACK_BY_TAG,
      alertSLA: await this.getSLABeforeExceedTimes(null, options),
      exceedSLA: await this.getSLAExceedTimes(null, options),
    };
    return times;
  }

  async countExceededCustomers(pageID: number): Promise<number> {
    const exceedTime = await this.getSLAExceedTimes(pageID);
    const { count } = await countCustomerExceedSLATime(PlusmarService.readerClient, exceedTime, pageID);
    const amount = Number(count);

    return amount;
  }

  async getCustomerSLAAllTags(pageID: number): Promise<ICustomerTagSLA[]> {
    const { alertSLA, exceedSLA } = await this.getSLATimes(pageID);

    const tagged = await countTaggedCustomerExceedSLATime(PlusmarService.readerClient, alertSLA, exceedSLA, pageID);

    const customers = await getTaggedCustomerExceedSLATime(PlusmarService.readerClient, alertSLA, exceedSLA, pageID);
    const untagged = await countUntaggedCustomerExceedSLATime(PlusmarService.readerClient, alertSLA, exceedSLA, pageID);

    const head = [
      {
        id: -1,
        name: 'Total',
        color: 'CODE_53B1FF',
        total: tagged.totalTag + untagged.totalTag,
        alert: tagged.almostExceed + untagged.almostExceed,
        customer: tagged.totalExceed + untagged.totalExceed || 0,
      },
    ];
    const untag = [{ id: -2, name: 'Untag', color: 'CODE_53B1FF', total: untagged.totalTag, alert: untagged.almostExceed, customer: untagged.totalExceed || 0 }];
    const slaResult = [...head, ...customers, ...untag];
    return slaResult;
  }

  async getCustomerSLATime(pageID: number): Promise<ICustomerSLATime> {
    const settingType = PageSettingType.CUSTOMER_SLA_TIME;
    const config = await this.pageSettingsService.getPageSetting(pageID, settingType);
    if (isEmpty(config)) {
      const defaultSlaConfig = {
        time: {
          hour: 3,
          minute: 0,
          alertHour: 0,
          alertMinute: 45,
        },
      };
      return defaultSlaConfig;
    } else {
      const options = <IPageCustomerSlaTimeOptions>config.options;

      const slaConfig = {
        time: {
          hour: !isNumber(options.hour) ? 3 : options.hour,
          minute: !isNumber(options.minute) ? 0 : options.minute,
          alertHour: !isNumber(options.alertHour) ? 0 : options.alertHour,
          alertMinute: !isNumber(options.alertMinute) ? 45 : options.alertMinute,
        },
      };

      return slaConfig;
    }
  }

  async setCustomerSLATime(pageID: number, time: IPageCustomerSlaTimeOptions): Promise<boolean> {
    const settingType = PageSettingType.CUSTOMER_SLA_TIME;

    const beforeAlert = combineHourAndMinute(time.alertHour, time.alertMinute);
    const alertSla = combineHourAndMinute(time.hour, time.minute);

    const isBefore = isTimeBefore(beforeAlert, alertSla);
    if (isBefore) {
      await this.pageSettingsService.savePageSettingOption(pageID, settingType, time);
      return true;
    } else {
      throw new Error('Time before reach SLA must be set before over SLA time');
      // throw new Error('ALERT_MUST_BEFORE_SLA');
    }
  }

  async getCustomerSLAAllAssginee(pageID: number): Promise<ICustomerTagSLA[]> {
    const { alertSLA, exceedSLA } = await this.getSLATimes(pageID);
    const tagged = await countAssignedCustomerExceedSLATime(PlusmarService.readerClient, alertSLA, exceedSLA, pageID);
    const customers = await getAssigneeCustomerExceedSLATime(PlusmarService.readerClient, alertSLA, exceedSLA, pageID);
    const untagged = await countUnassignedCustomerExceedSLATime(PlusmarService.readerClient, alertSLA, exceedSLA, pageID);

    const head = [
      {
        id: -1,
        name: 'Total',
        color: 'CODE_53B1FF',
        total: tagged.totalTag + untagged.totalTag,
        alert: tagged.almostExceed + untagged.almostExceed,
        customer: tagged.totalExceed + untagged.totalExceed || 0,
      },
    ];
    const untag = [{ id: -2, name: 'Unassign', color: 'CODE_53B1FF', total: untagged.totalTag, alert: untagged.almostExceed, customer: untagged.totalExceed || 0 }];
    const slaResult = [...head, ...customers, ...untag];
    return slaResult;
  }
}
