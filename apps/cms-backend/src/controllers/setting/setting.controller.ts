import { IHTTPResult } from '@reactor-room/model-lib';
import type {
  IGetShopDetail,
  IGetUserPhone,
  IGQLContext,
  IPages,
  IPageWebhookPatternSetting,
  IPayload,
  ISettingPageMember,
  ISettingSubscriptionDetail,
  logisticTrackingDetail,
} from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, ICompanyInfo, ILineResponse, ILineSetting, ISocialConnect } from '@reactor-room/itopplus-model-lib';
import { createObjPage, createObjSubScription, SettingService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { requireOwner } from '../../domains/plusmar';
import { environment } from '../../environments/environment';
import { validateRequestPageID, validateSubscriptionIDValidate } from '../../schema/common';
import {
  validateCompanyInfoResponse,
  validateGetPhoneUser,
  validateGetLogisticTrackingType,
  validatePageParam,
  validateRequestSetLineChannelDetail,
  validateRequestSocialConnect,
  validateResponseGetShopDetail,
  validateResponseLineChannelSetting,
  validateResponseLineResponse,
  validateResponseSettingPageMember,
  validateResponseSettingSubScription,
  validateResponseShopProfile,
  validateResponseSocialConnect,
  validateResponseVerifyLineChannelSetting,
  validateRequestWebhookPattern,
  validateResponseWebhookPattern,
  validateRequestRemoveWebhookPattern,
} from '../../schema/settings';
import { graphQLHandler } from '../graphql-handler';
import { validateResponseHTTPObject } from '../../schema';

@requireScope([EnumAuthScope.CMS])
class Setting {
  public static instance;
  public static settingService: SettingService;
  public static getInstance() {
    if (!Setting.instance) Setting.instance = new Setting();
    return Setting.instance;
  }

  constructor() {
    Setting.settingService = new SettingService();
  }

  async getShopProfileHandler(parent, args, context: IGQLContext): Promise<IGetShopDetail> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Setting.settingService.getShopProfile(pageID);
    return result;
  }

  async getCompanyInfoHandler(parent, args, context: IGQLContext): Promise<ICompanyInfo> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Setting.settingService.getCompanyInfo(pageID);
    return Array.isArray(result) ? result[0] : ({} as unknown as ICompanyInfo);
  }

  @requireOwner
  async setShopFanPageHandler(parent, args, context: IGQLContext): Promise<IPages> {
    const { page, isFromWizard } = args;
    const validatePageValue = validatePageParam(page);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Setting.settingService.setShopFanPage(pageID, validatePageValue, isFromWizard, context.access_token);
    return result;
  }

  @requireOwner
  async saveCompanyInfoHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const {
      pageID,
      page: { uuid: pageUUID },
    } = context.payload;
    return await Setting.settingService.saveCompanyInfo(args.info, pageID, environment.googleCloudUploadBucket, pageUUID);
  }

  @requireOwner
  async updateCompanyInfoHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const {
      pageID,
      page: { uuid: pageUUID },
      subscriptionID,
    } = context.payload;
    return await Setting.settingService.updateCompanyInfo(args.info, pageID, subscriptionID, pageUUID);
  }

  @requireOwner
  async setLineChannelDetailHandler(parent, args, context: IGQLContext): Promise<ILineResponse> {
    const { lineinfor } = args;
    const lineRequest = validateRequestSetLineChannelDetail(lineinfor);
    return await Setting.settingService.setLineChannelDetail(lineRequest, context.payload.pageID);
  }

  @requireOwner
  async getLineChannelSettingByPageIDHandler(parent, args, context: IGQLContext): Promise<ILineSetting> {
    return await Setting.settingService.getLineChannelSettingByPageID(context.payload.pageID);
  }

  async verifyChannelAccesstokenHandler(parent, args): Promise<ILineSetting> {
    return await Setting.settingService.verifyChannelAccesstoken(args.channeltoken, args.channelid);
  }

  async getSubScriptionDetailHandler(parent, args, context: IGQLContext): Promise<ISettingSubscriptionDetail> {
    const { subscriptionID } = validateSubscriptionIDValidate<IPayload>(context.payload);
    const getDetail = await Setting.settingService.getSubscriptionDetail(subscriptionID);
    const createObj: ISettingSubscriptionDetail[] = createObjSubScription(getDetail);
    return createObj[0];
  }

  async getPhoneFromUserHandler(parent, args, context: IGQLContext): Promise<IGetUserPhone> {
    const getuserDetail = await Setting.settingService.getUserPhone(context.payload);
    return getuserDetail[0];
  }

  async getLogisticTrackingByUuidHandler(parent, args, context: IGQLContext): Promise<logisticTrackingDetail> {
    const { uuid: orderUUID } = args;
    const pageUUID = context?.payload?.page?.uuid;
    const trackingType = await Setting.settingService.getLogisticTrackingTypeByUuid(pageUUID, orderUUID);
    return trackingType[0];
  }

  async getPageMemberDetaillHandler(parent, args, context: IGQLContext): Promise<ISettingPageMember> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const getDetail = await Setting.settingService.getPageMemberDetail(pageID);
    const createObj = createObjPage(getDetail);
    return createObj[0];
  }

  async getSocialConnectStatusHandler(parent, args, context: IGQLContext): Promise<ISocialConnect> {
    const { pageID, page, ID, accessToken } = validateRequestSocialConnect<IPayload>(context.payload);
    return await Setting.settingService.getSocialConnectStatus(pageID, page, ID, accessToken);
  }

  async getWebhookPatternListHandler(parent, args, context: IGQLContext): Promise<IPageWebhookPatternSetting[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Setting.settingService.getWebhookPatternList(pageID);
  }

  @requireOwner
  async addWebhookPatternHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const param = validateRequestWebhookPattern<IPageWebhookPatternSetting>(args.webhookPattern);
    return await Setting.settingService.addWebhookPattern(param, pageID);
  }

  @requireOwner
  async updateWebhookPatternHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const param = validateRequestWebhookPattern<IPageWebhookPatternSetting>(args.webhookPattern);
    return await Setting.settingService.updateWebhookPattern(param, pageID);
  }

  @requireOwner
  async removeWebhookPatternHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id } = validateRequestRemoveWebhookPattern<IPageWebhookPatternSetting>({ id: args.webhookId } as IPageWebhookPatternSetting);
    return await Setting.settingService.removeWebhookPattern(id, pageID);
  }

  @requireOwner
  async toggleWebhookPatternStatusHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id } = validateRequestRemoveWebhookPattern<IPageWebhookPatternSetting>({ id: args.webhookId } as IPageWebhookPatternSetting);
    return await Setting.settingService.toggleWebhookPatternStatus(id, pageID);
  }
}

const setting: Setting = Setting.getInstance();
export const settingResolver = {
  Query: {
    getShopProfile: graphQLHandler({
      handler: setting.getShopProfileHandler,
      validator: validateResponseGetShopDetail,
    }),
    getCompanyInfo: graphQLHandler({
      handler: setting.getCompanyInfoHandler,
      validator: validateCompanyInfoResponse,
    }),
    getSubScriptionDetail: graphQLHandler({
      handler: setting.getSubScriptionDetailHandler,
      validator: validateResponseSettingSubScription,
    }),
    getPhoneFromUser: graphQLHandler({
      handler: setting.getPhoneFromUserHandler,
      validator: validateGetPhoneUser,
    }),
    getLogisticTrackingTypeByUuid: graphQLHandler({
      handler: setting.getLogisticTrackingByUuidHandler,
      validator: validateGetLogisticTrackingType,
    }),
    getPageMemberDetail: graphQLHandler({
      handler: setting.getPageMemberDetaillHandler,
      validator: validateResponseSettingPageMember,
    }),
    getSocialConnectStatus: graphQLHandler({
      handler: setting.getSocialConnectStatusHandler,
      validator: validateResponseSocialConnect,
    }),
    getLineChannelSettingByPageID: graphQLHandler({
      handler: setting.getLineChannelSettingByPageIDHandler,
      validator: validateResponseLineChannelSetting,
    }),
    verifyChannelAccesstoken: graphQLHandler({
      handler: setting.verifyChannelAccesstokenHandler,
      validator: validateResponseVerifyLineChannelSetting,
    }),
    getWebhookPatternList: graphQLHandler({
      handler: setting.getWebhookPatternListHandler,
      validator: validateResponseWebhookPattern,
    }),
  },
  Mutation: {
    setShopFanPage: graphQLHandler({
      handler: setting.setShopFanPageHandler,
      validator: validateResponseShopProfile,
    }),
    saveCompanyInfo: graphQLHandler({
      handler: setting.saveCompanyInfoHandler,
      validator: validateResponseHTTPObject,
    }),
    updateCompanyInfo: graphQLHandler({
      handler: setting.updateCompanyInfoHandler,
      validator: validateResponseHTTPObject,
    }),
    setLineChannelDetail: graphQLHandler({
      handler: setting.setLineChannelDetailHandler,
      validator: validateResponseLineResponse,
    }),
    addWebhookPattern: graphQLHandler({
      handler: setting.addWebhookPatternHandler,
      validator: validateResponseHTTPObject,
    }),
    updateWebhookPattern: graphQLHandler({
      handler: setting.updateWebhookPatternHandler,
      validator: validateResponseHTTPObject,
    }),
    removeWebhookPattern: graphQLHandler({
      handler: setting.removeWebhookPatternHandler,
      validator: validateResponseHTTPObject,
    }),
    toggleWebhookPatternStatus: graphQLHandler({
      handler: setting.toggleWebhookPatternStatusHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
