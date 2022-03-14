import { getTimeRange, isEmpty, isAllowCaptureException, getDiffrentSecond } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  AudienceContactActionMethod,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceStepStatus,
  AudienceViewType,
  IAudience,
  IAudienceWithCustomer,
  ICustomerTemp,
  IFacebookMessagePayloadTypeEnum,
  IHandleDefault,
  ILineProfile,
  ILineRoomOrGroupMember,
  ILineSourceType,
  ILineWebhook,
  IMessageModel,
  IMessageModelInput,
  IMessageSource,
  IPages,
  IPayload,
  MessageSentByEnum,
  NotificationStatus,
  PageExitsType,
} from '@reactor-room/itopplus-model-lib';
import {
  ApplicationService,
  AudienceContactService,
  AudienceService,
  AudienceStepService,
  CustomerService,
  FacebookMessageService,
  LineService,
  MessageService,
  NotificationService,
  PagesService,
  PlusmarService,
  WorkingHourService,
  WebhookPatternMessageService,
} from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { updateCustomerUpdatedAt } from 'libs/itopplus-services-lib/src/lib/data';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { FacebookCreateAudienceError, LineCreateAudienceError } from '../../errors';
export class SharedService {
  public webhookHelper = new WebHookHelpers();
  public pageService = new PagesService();
  public lineService = new LineService();
  public customerService = new CustomerService();
  public audienceContactService = new AudienceContactService();
  public notificationService = new NotificationService();
  public audienceService = new AudienceService();
  public messageService = new MessageService();
  public facebookMessageService = new FacebookMessageService();
  public audienceStepService = new AudienceStepService();
  public workingHourService = new WorkingHourService();
  public applicationService = new ApplicationService();
  public webhookPatternMessageService = new WebhookPatternMessageService();

  public start = async (
    webhook,
    domain: AudienceDomainType,
    status: AudienceStepStatus,
    platform: AudiencePlatformType,
    allowToCreateAudience: boolean,
  ): Promise<IHandleDefault> => {
    const page = await this.getPageByPlatformType(webhook, platform);

    try {
      await this.messageService.upsertTraceMessage(webhook, { type: 'INBOX', traceStage1: getDiffrentSecond(webhook.entry[0].time, new Date()) });
    } catch (ex) {
      //
    }

    if (isEmpty(page)) {
      return { isPageNotFound: true, audience: null, customer: null, isAudienceCreated: false, page: null };
    } else {
      switch (platform) {
        case AudiencePlatformType.LINEOA:
          return await this.linePlatForm(webhook, page, domain, status);
        default:
          return await this.facebookPlatForm(webhook, page, domain, status, allowToCreateAudience);
      }
    }
  };

  facebookPlatForm = async (webhook, page: IPages, domain: AudienceDomainType, status: AudienceStepStatus, allowToCreateAudience: boolean): Promise<IHandleDefault> => {
    // ! Should implement messageFlow more than 1 before use
    const facebookPageID = this.webhookHelper.getPageID(webhook);
    const customer = await this.createCustomerFromFacebook(webhook, facebookPageID, page);

    try {
      await this.messageService.upsertTraceMessage(webhook, { traceStage2: getDiffrentSecond(webhook.entry[0].time, new Date()) });
    } catch (ex) {
      //
    }

    if (customer?.blocked) return { isPageNotFound: false, audience: null, customer: null, isAudienceCreated: false, page };
    let result: IHandleDefault;
    if (customer) {
      // note : mostly in case of inbox (prople to people conversation)
      // accepted type : WEBHOOK_TYPE.INBOX, WEBHOOK_TYPE.PAGE_CONTENT_CHANGE
      const audience = allowToCreateAudience ? await this.createAudienceFromFacebook(customer, domain, status, webhook, page) : null;
      try {
        await this.messageService.upsertTraceMessage(webhook, { traceStage3: getDiffrentSecond(webhook.entry[0].time, new Date()) });
      } catch (ex) {
        //
      }
      result = {
        customer: customer,
        audience: audience,
        isPageNotFound: false,
        isAudienceCreated: allowToCreateAudience,
        page,
      };
      return result;
    } else {
      // accepted type : WEBHOOK_TYPE.PAGE_CONTENT_CHANGE
      result = {
        customer: null,
        audience: { page_id: page.id } as IAudience,
        isPageNotFound: false,
        isAudienceCreated: true, // Page as an audience
        page,
      };

      // this.applicationService.deleteCloudMessageQueue(page.id);
      return result;
    }
  };

  createCustomerFromFacebook = async (webhook, facebookPageID: string, page: IPages, psid = null): Promise<ICustomerTemp> => {
    try {
      if (psid === null) {
        psid = this.webhookHelper.getFacebookPsID(webhook);
        if (!psid) return null;
      }

      let newCustomer = false;
      let customer = await this.customerService.getCustomerByPSID(psid, page.id);
      if (!customer && psid) {
        newCustomer = true;
        customer = await this.customerService.create(
          {
            psid: psid,
            fb_page_id: facebookPageID,
          },
          page,
        );
        // get Facebook Profile on create new Customer
        customer = await this.updateFacebookCustomerProfile(webhook, customer, facebookPageID, newCustomer);
      }

      // Page is not responded
      if (!customer?.id) {
        return null;
      }

      if (!customer?.active) {
        await this.audienceService.activateCustomer(customer.page_id, customer.id);
      }

      // Update Facebook Profile Every 3 Days
      const checkLastestUpdate = getTimeRange(String(customer.updated_at));
      const dayToUpdate = PlusmarService.environment.facebookUpdateProfileThreshold;
      if (checkLastestUpdate >= dayToUpdate) {
        customer = await this.updateFacebookCustomerProfile(webhook, customer, facebookPageID, newCustomer);
      }

      // Update Facebook Profile Picture Every 3 Days
      const checkLastestUpdateProfile = getTimeRange(String(customer.profile_pic_updated_at));
      const dayToUpdateProfile = PlusmarService.environment.facebookUpdateProfilePictureThreshold;
      if (checkLastestUpdateProfile >= dayToUpdateProfile) {
        await this.customerService.updateProfilePicture(page.id, customer.id, AudiencePlatformType.FACEBOOKFANPAGE, facebookPageID);
      }

      return customer;
    } catch (err) {
      console.log('createCustomerFromFacebook ', err.message);
      throw err;
    }
  };

  async updateFacebookCustomerProfile(webhook, customer: ICustomerTemp, facebookPageID: string, newCustomer: boolean): Promise<ICustomerTemp> {
    const fromName = this.webhookHelper.getNameFromWebHook(webhook);
    return await this.customerService.update(customer.id, facebookPageID, customer.page_id, fromName, newCustomer);
  }

  createAudienceFromFacebook = async (customer: ICustomerTemp, domain: AudienceDomainType, status: AudienceStepStatus, webhook, page: IPages): Promise<IAudience> => {
    try {
      const { id: customerID, page_id: pageID } = customer;
      const psid: string = this.webhookHelper.getCustomerByPSID(webhook) || this.webhookHelper.getCustomerPSIDByComment(webhook);

      // const isShop = psid !== customer.psid;
      const isToSetNotify = psid === customer.psid; // set is_notify to false if it is a shop

      const audience = await this.audienceService.getAudienceAndInsertOnNotExist(customerID, pageID, domain, status, NotificationStatus.UNREAD);
      if (isEmpty(audience)) return null;
      else {
        if (audience.isNew) await this.audienceStepService.logNewAudienceHistory(PlusmarService.writerClient, audience.id, pageID, status as AudienceDomainStatus);
      }

      await updateCustomerUpdatedAt(pageID, customerID, PlusmarService.writerClient);
      if (isToSetNotify) await this.setCustomerNotify(audience, isToSetNotify);
      else {
        const attach = this.webhookHelper.getAttachmentFromMessage(webhook);
        if (!isEmpty(attach) && attach[0].type === IFacebookMessagePayloadTypeEnum.TEMPLATE) await this.setCustomerNotify(audience, true);
        else await this.setCustomerNotify(audience, false);
      }

      if (audience.page_id !== page.id) await this.audienceService.updateAudiencePageIDByID(audience.id, page.id, audience.page_id);

      return audience;
    } catch (err) {
      throw new FacebookCreateAudienceError(err);
    }
  };

  linePlatForm = async (webhook: ILineWebhook, page: IPages, domain: AudienceDomainType, status: AudienceStepStatus): Promise<IHandleDefault> => {
    // SET REDIS KEY RUNNING

    // const { bypass, data: queueAttribute } = await this.applicationService.getCloudMessageQueue(page.id);
    // if (!bypass && queueAttribute === EnumCloudMessageQueueAttribute.RUNNING) {
    //   await onWaitFor(1); // wait for x sec
    // }

    const userID = this.webhookHelper.getLineEventID(webhook);
    let lineProfile: ILineProfile;
    const sourceType: ILineSourceType = webhook?.events?.[0]?.source?.type;
    if (sourceType === ILineSourceType.USER) {
      lineProfile = await this.lineService.getLineProfileUser(page.line_channel_accesstoken, userID);
    } else {
      lineProfile = {
        displayName: await this.getMembersName(userID, page.line_channel_accesstoken, sourceType),
        pictureUrl: null,
        userId: userID,
      } as ILineProfile;
    }
    // GET REDIS KEY is RUNNING ? sleep 2s : SET TO RUNNING THEN RUN
    const customer = await this.createCustomerFromLine(lineProfile, page, userID, sourceType);
    if (customer?.blocked) return { isPageNotFound: false, audience: null, customer: null, isAudienceCreated: false, page };
    let result: IHandleDefault;
    if (customer) {
      result = {
        customer: customer,
        audience: await this.createAudienceFromLine(customer, domain, status, webhook, page, userID, lineProfile),
        isPageNotFound: false,
        isAudienceCreated: true,
        page,
      };
    } else {
      result = {
        customer: null,
        audience: { page_id: page.id } as IAudience,
        isPageNotFound: false,
        isAudienceCreated: true,
        page,
      };
    }
    //SET TO EMPTY

    // this.applicationService.deleteCloudMessageQueue(page.id);
    return result;
  };

  getMembersName = async (id: string, line_channel_accesstoken: string, sourcetype: ILineSourceType): Promise<string> => {
    let members: ILineRoomOrGroupMember;
    let name = '';
    switch (sourcetype) {
      case ILineSourceType.GROUP:
        //REASON is on lineOA free account LINE API not allow to retrive the member data
        try {
          members = await this.lineService.getGroupMembers(line_channel_accesstoken, id);
        } catch {}
        name = 'Group';
        break;
      case ILineSourceType.ROOM:
        //REASON is on lineOA free account LINE API not allow to retrive the member data
        try {
          members = await this.lineService.getRoomMembers(line_channel_accesstoken, id);
        } catch {}
        name = 'Room';
        break;
    }

    if (members) {
      let profile: ILineProfile;
      //REASON is on lineOA free account LINE API not allow to retrive the member data
      try {
        for (let index = 0; index < members.memberIds.length; index++) {
          switch (sourcetype) {
            case ILineSourceType.GROUP:
              profile = await this.lineService.getGroupMemberProfile(line_channel_accesstoken, id, members.memberIds[index]);
              break;
            case ILineSourceType.ROOM:
              profile = await this.lineService.getRoomMemberProfile(line_channel_accesstoken, id, members.memberIds[index]);
              break;
          }
          name += `,${profile.displayName}`;
        }
      } catch (err) {
        console.log('getMembersName err:', err.message);
        name += ',' + id;
      }
    } else {
      name += ',' + id;
    }
    return name;
  };

  createCustomerFromLine = async (lineUserProfile: ILineProfile, page: IPages, userID: string, sourceType: ILineSourceType): Promise<ICustomerTemp> => {
    if (lineUserProfile === null) return null;

    let customer = await this.customerService.getCustomerByLineUserID(userID, page.id);
    if (!customer) {
      const customerData = {
        first_name: lineUserProfile?.displayName ? lineUserProfile?.displayName : '',
        last_name: null,
        email: null,
        phone_number: null,
        customer_type: null,
        location: null,
        notes: null,
        social: {
          Line: null,
        },
        line_user_id: userID,
        profile_pic: lineUserProfile?.pictureUrl ? lineUserProfile?.pictureUrl : '',
        platform: AudiencePlatformType.LINEOA,
      } as ICustomerTemp;
      customer = await this.customerService.createNewCustomerFromLineOa(customerData, page);
    }
    // Page is not responded
    if (!customer?.id) {
      return null;
    }

    if (!customer.active) {
      await this.audienceService.activateCustomer(customer.page_id, customer.id);
    }

    const checkLastestUpdateProfile = getTimeRange(String(customer.profile_pic_updated_at));
    const dayToUpdateProfile = PlusmarService.environment.lineUpdateProfilePictureThreshold;
    if (checkLastestUpdateProfile >= dayToUpdateProfile && sourceType === ILineSourceType.USER && lineUserProfile?.pictureUrl) {
      await this.customerService.updateCustomerProfilePicture(page.id, customer.id, lineUserProfile?.pictureUrl);
    }

    return customer;
  };

  createAudienceFromLine = async (
    customer: ICustomerTemp,
    domain: AudienceDomainType,
    status: AudienceStepStatus,
    webhook: ILineWebhook,
    page: IPages,
    lineUserID: string,
    lineUserProfile: ILineProfile,
  ): Promise<IAudience> => {
    try {
      const { id: customerID, page_id: pageID, line_user_id } = customer;
      const isShop = lineUserID !== line_user_id;
      const audience = await this.audienceService.getAudienceAndInsertOnNotExist(customerID, pageID, domain, status, NotificationStatus.UNREAD);
      if (isEmpty(audience)) return null;
      else {
        if (audience.isNew) await this.audienceStepService.logNewAudienceHistory(PlusmarService.writerClient, audience.id, pageID, status as AudienceDomainStatus);
      }
      if (isShop) {
        // in the case Webhook wont come back again if shop reply from More-Commerce neither Line Platform (webhook surely disabled)
        // so this case should not possibly happened
        return { page_id: page.id } as IAudience;
      } else {
        customer.first_name = lineUserProfile.displayName;
        customer.profile_pic = lineUserProfile.pictureUrl;
        await this.customerService.updateCustomerFromLineOA(customer, page);

        const statusnotify =
          webhook.events[0].source.type === ILineSourceType.USER ||
          webhook.events[0].source.type === ILineSourceType.ROOM ||
          webhook.events[0].source.type === ILineSourceType.GROUP;
        await this.setCustomerNotify(audience, statusnotify);

        if (audience.page_id !== page.id) await this.audienceService.updateAudiencePageIDByID(audience.id, page.id, audience.page_id);

        return audience;
      }
    } catch (err) {
      throw new LineCreateAudienceError(err);
    }
  };

  setCustomerNotify = async (audience: IAudience, isnotify: boolean): Promise<void> => {
    await this.notificationService.toggleAudienceNotification(audience, isnotify);
    await this.notificationService.toggleChildAudienceNotification(audience, isnotify);
  };

  getPageByPlatformType = async (payload, platform: AudiencePlatformType): Promise<IPages> => {
    let page = null as IPages;
    let facebookPageID: string;
    switch (platform) {
      case AudiencePlatformType.LINEOA: {
        page = await this.pageService.getPageByLineUserID(payload.destination);
        // page = await redisWrapperFunction(PlusmarService.redisClient, payload.destination, this.pageService.getPageByLineUserID, [payload.destination]);
        break;
      }
      default:
        facebookPageID = this.webhookHelper.getPageID(payload);
        page = await this.pageService.getPageByFacebookPageID(facebookPageID);
        // page = await redisWrapperFunction(PlusmarService.redisClient, facebookPageID, this.pageService.getPageByFacebookPageID, [facebookPageID]);
        break;
    }
    return page;
  };

  pageExist = async (payload, type_exits: PageExitsType): Promise<boolean> => {
    let page = null;
    const facebookPageID = this.webhookHelper.getPageID(payload);
    switch (type_exits) {
      case PageExitsType.FACEBOOK:
        page = await this.pageService.getPageByFacebookPageID(facebookPageID);
        break;
      case PageExitsType.LINE:
        page = await this.pageService.getPageByLineUserID(payload['destination']);
        break;
      default:
        page = await this.pageService.getPageByID(payload['page_id']);
        break;
    }
    if (!isEmpty(page)) {
      return true;
    } else {
      console.log('on pageExist return false');
      return false;
    }
  };

  setMessageToDB = async (audience: IAudience, mid: string, messageData: IMessageModelInput, webhook, source: IMessageSource, subscriptionID: string): Promise<IMessageModel> => {
    try {
      //TODO :: audience id not available on tracking dialog
      if (audience?.id) {
        await this.audienceService.setLastPlatformActivityDate(audience.page_id, audience.id);
        await this.audienceService.updateAudienceLatestSentBy(audience.page_id, audience.id, messageData.sentBy);

        if (messageData.sentBy === MessageSentByEnum.PAGE) {
          await this.notificationService.toggleNotificationStatus(audience, NotificationStatus.READ);
        }

        if (messageData.sentBy === MessageSentByEnum.AUDIENCE) {
          await this.audienceService.setAudienceEncounterTime(audience.page_id, audience.id, messageData.createdAt);
          const { isClose } = await this.workingHourService.checkIsShopClosedByWorkingHour(audience.page_id, audience, messageData.createdAt, subscriptionID);

          if (isClose) {
            await this.messageService.addMessageToTempDB(messageData);
          }
        }
      }

      await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.MESSAGE, audience.page_id, {
        method: AudienceContactActionMethod.TRIGGER_UPDATE,
        audienceID: audience.id,
        customerID: audience.customer_id,
        sentBy: messageData.sentBy,
      });

      const messageExists = await this.messageService.getMessageExistenceById(mid, Number(audience.page_id));

      let facebookSenderId = null;
      if (source === IMessageSource.FACEBOOK) facebookSenderId = this.webhookHelper.getSenderByPSID(webhook);
      // TODO : if messageData.audienceID have to create for ( incase of page send message to customer first)
      if (messageData.audienceID) {
        if (messageExists) {
          const result = await this.messageService.updateMessageFromHook(messageData);
          await this.webhookPatternMessageService.webhookPatternMessage(audience.id, audience.page_id, audience.customer_id, facebookSenderId, source, messageData);
          return result;
        } else {
          const audienceWithCustomer = await this.audienceService.getSingleAudienceByID(Number(messageData.audienceID), audience.page_id);
          const addedResult = await this.messageService.addMessageToDB(
            { pageID: audience.page_id, userID: null } as IPayload,
            audienceWithCustomer as IAudienceWithCustomer,
            messageData,
          );

          await this.webhookPatternMessageService.webhookPatternMessage(audience.id, audience.page_id, audience.customer_id, facebookSenderId, source, messageData);
          return addedResult;
        }
      }
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      console.log('err [LOG]:--> ', err);
      console.log('handleMessageCreateFlow', err.message);
      throw err;
    }
  };
}
