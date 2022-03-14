import {
  axiosGetWithParams,
  axiosPostWithHeader,
  cryptoEncode,
  getKeysFromSession,
  getLazadaDefaultAccessTokenParams,
  getLazadaSignCodeAndParams,
  getShopeeAccessTokenUrl,
  getUTCUnixLazadaTimestamps,
  isEmpty,
  isEmptyValue,
  PostgresHelper,
  publishMessage,
  setSessionValue,
} from '@reactor-room/itopplus-back-end-helpers';
import { ICount, IHTTPResult, ILazadaDefaultAccessRequest, IUrlParams } from '@reactor-room/model-lib';
import {
  EnumAuthError,
  EnumWizardStepType,
  IAddNewShopProfile,
  IAddPagesThirdPartyParams,
  ICompanyInfo,
  IGetShopDetail,
  IGetUserPhone,
  ILazadaConnectResponse,
  ILazadaEnv,
  ILazadaSellerDetails,
  ILazadaSellerResponse,
  ILineResponse,
  ILineSetting,
  IPages,
  IPageWebhookPatternSetting,
  IPayload,
  IPlanName,
  IShopeeConnectResponse,
  IShopeeEnv,
  ISocialConnect,
  ISocialConnectResponse,
  ISubscriptionPeriod,
  logisticTrackingDetail,
  ShopeeShopStatusTypes,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { addUpdatePageThirdParty, getTaxByPageID, updateSellerDetails, updateTaxByPageID, verifyToken } from '../../data';
import { getPagesFromSubscriptionID, subscribePageToApp, updatePageWizardStep, uploadMessageAttachments } from '../../data/pages/pages.data';
import { getLogisticTrackingTypeByUuid } from '../../data/reports/get-logistic-tracking-type';
import {
  checkDuplicateLineChannel,
  checkLiffRegistered,
  checkNewChannelToken,
  getChannelInfo,
  getLineChannelInforByPageID,
  getLineChannelSettingByPageID,
  registerLineLiff,
  setLineChannelDetailByPageID,
  setLineLiffByPageID,
} from '../../data/settings/line/line.data';
import {
  getCompanyInfo,
  getPageMemberDetail,
  getPageMembermapping,
  getShopFanPageByUserID,
  getSubscriptionPeriodDetail,
  getUserPageMapping,
  getUserPhone,
  saveCompanyInfo,
  setShopFanPageByUserID,
  updateCompanyInfo,
} from '../../data/settings/settings.data';
import {
  getWebhookPatternList,
  addWebhookPattern,
  updateWebhookPattern,
  removeWebhookPattern,
  getWebhookPatternById,
  toggleWebhookPatternStatus,
} from '../../data/settings/openapi/webhook-pattern.data';
import { SettingError, SubscriptionError } from '../../errors';
import { ChatTemplatesInitializeService, LeadsInitializeService, LogisticsInitializeService, TaxInitializeService } from '../initialize';
import { PageSettingsService } from '../page-settings';
import { PagesThirdPartyService } from '../pages/pages-third-party.service';
import { PagesService } from '../pages/pages.service';
import { PaymentCashOnDeliveryService } from '../payment';
import { PlusmarService } from '../plusmarservice.class';
import { getShopeeSellerDetailsFromShopeeApi } from '../product/product-marketplace-shopee-api.service';
import { ProductService } from '../product/product.service';
import { FileService } from '../file/file.service';
import { getPagesThirdPartySellerURL, LAZADA_API_SUCCESS_CODE } from '@reactor-room/itopplus-back-end-helpers';

export class SettingService {
  public initLogisticService: LogisticsInitializeService;
  public initTaxService: TaxInitializeService;
  public codPaymentService: PaymentCashOnDeliveryService;
  public initLeadService: LeadsInitializeService;
  public pagesService: PagesService;
  public pageSettingService: PageSettingsService;
  public productService: ProductService;
  public chatTemplatesService: ChatTemplatesInitializeService;
  public pagesThirdPartyService: PagesThirdPartyService;
  public fileService: FileService;

  constructor() {
    this.initLogisticService = new LogisticsInitializeService();
    this.initTaxService = new TaxInitializeService();
    this.codPaymentService = new PaymentCashOnDeliveryService();
    this.initLeadService = new LeadsInitializeService();
    this.chatTemplatesService = new ChatTemplatesInitializeService();
    this.pagesService = new PagesService();
    this.pageSettingService = new PageSettingsService();
    this.productService = new ProductService();
    this.pagesThirdPartyService = new PagesThirdPartyService();
    this.fileService = new FileService();
  }

  async createLineChannel(pageInput: IAddNewShopProfile, shopOwnerID: number): Promise<void> {
    if (pageInput.channeltoken !== null) {
      const lineSetting = {
        basicid: pageInput.basicid,
        channelid: pageInput.channelid,
        channelsecret: pageInput.channelsecret,
        channeltoken: pageInput.channeltoken,
        is_type_edit: true,
      } as ILineSetting;
      await this.setLineChannelDetail(lineSetting, shopOwnerID);
    }
  }

  setShopFanPage = async (pageID: number, pageInput: IAddNewShopProfile, isFromWizard: boolean, access_token: string): Promise<IPages> => {
    try {
      const userAccessToken = access_token;
      const pageAccessToken = pageInput.access_token;
      pageInput.access_token = cryptoEncode(pageInput.access_token, PlusmarService.environment.pageKey);
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const setshop = await setShopFanPageByUserID(client, pageID, pageInput);
      if (isFromWizard) {
        await updatePageWizardStep(client, pageID, EnumWizardStepType.STEP_SET_LOGISTIC);
      } else {
        await subscribePageToApp(pageInput.facebookid, pageAccessToken);
        await this.pageSettingService.setPageWhitelist(Number(pageInput.facebookid), pageAccessToken);
      }
      await PostgresHelper.execBatchCommitTransaction(client);
      const { value: redisSessionKey } = await verifyToken(userAccessToken, PlusmarService.environment);
      if (redisSessionKey) {
        const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
        const session = { ...userKey, pageID: setshop.id, page: setshop };

        // Update shop info on edit setting
        setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
      }

      return setshop;
    } catch (err) {
      throw new SettingError(err);
    }
  };

  getCompanyInfo = async (pageID: number): Promise<ICompanyInfo[]> => {
    try {
      const result = await getCompanyInfo(PlusmarService.readerClient, pageID);
      const tax = await getTaxByPageID(PlusmarService.readerClient, pageID);

      return [{ ...result[0], ...{ tax_identification_number: tax.tax_id, tax_id: tax.id } }];
    } catch (error) {
      console.log('error', error);
      return [];
    }
  };

  saveCompanyInfo = async (info: ICompanyInfo, pageID: number, subscriptionID: string, pageUUID: string): Promise<IHTTPResult> => {
    try {
      const link = info.company_logo_file ? await this.fileService.uploadToGoogle(pageID, info.company_logo_file, pageUUID, subscriptionID) : null;
      await saveCompanyInfo(PlusmarService.readerClient, { ...info, ...(link && { company_logo: link }) }, pageID);
      await updateTaxByPageID(PlusmarService.readerClient, pageID, info);

      return {
        status: 200,
        value: true,
      };
    } catch (error) {
      console.log('error', error);
      return {
        status: 403,
        value: error,
      };
    }
  };

  updateCompanyInfo = async (info: ICompanyInfo, pageID: number, subscriptionID: string, pageUUID: string): Promise<IHTTPResult> => {
    try {
      const link = info.company_logo_file ? await this.fileService.uploadToGoogle(pageID, info.company_logo_file, pageUUID, subscriptionID) : null;
      await updateCompanyInfo(PlusmarService.readerClient, { ...info, ...(link && { company_logo: link }) }, pageID);
      await updateTaxByPageID(PlusmarService.readerClient, pageID, info);

      return {
        status: 200,
        value: true,
      };
    } catch (error) {
      return {
        status: 403,
        value: error,
      };
    }
  };

  setLineChannelDetail = async (lineinfor: ILineSetting, pageID: number): Promise<ILineResponse> => {
    const checkDuplicateChannel = await checkDuplicateLineChannel(PlusmarService.readerClient, lineinfor.channelid);
    if (checkDuplicateChannel > 0 && !lineinfor.is_type_edit) {
      throw new SettingError('DUPPLICATE_LINE_CHANNEL');
    }
    const channelInfor = await getChannelInfo(lineinfor.channeltoken, 'SETTING');
    const lineResponse = {
      id: channelInfor.premiumId === undefined ? channelInfor.basicId : channelInfor.premiumId,
      picture: channelInfor.pictureUrl === undefined ? 'assets/img/icon-lineoa.svg' : channelInfor.pictureUrl,
      name: channelInfor.displayName,
    } as ILineResponse;
    lineinfor.pictureurl = channelInfor.pictureUrl === undefined ? null : channelInfor.pictureUrl;
    lineinfor.premiumid = channelInfor.premiumId === undefined ? null : channelInfor.premiumId;
    lineinfor.userid = channelInfor.userId;
    lineinfor.displayname = channelInfor.displayName;
    const isChangedChannelToken = await checkNewChannelToken(PlusmarService.readerClient, pageID, lineinfor.channeltoken);
    const resultSetline = await setLineChannelDetailByPageID(PlusmarService.readerClient, lineinfor, pageID);
    const isLiffRegistered = await checkLiffRegistered(PlusmarService.readerClient, pageID);
    if (!isLiffRegistered || isChangedChannelToken) {
      const liffId = await registerLineLiff(lineinfor.channeltoken, PlusmarService.environment.backendUrl);
      await setLineLiffByPageID(PlusmarService.writerClient, liffId.liffId, pageID);
    }
    await this.lineSecretPubToRedis(lineinfor.channelsecret, resultSetline.uuid);
    return lineResponse;
  };

  async lineSecretPubToRedis(linesecret: string, uuid: string): Promise<void> {
    if (linesecret) {
      const token = cryptoEncode(`${linesecret}.${uuid}`, PlusmarService.environment.lineSecretKey);
      await publishMessage(token, PlusmarService.environment.lineSecretToppic);
    }
  }

  uploadMessageAttachments = async (accessToken: string): Promise<void> => {
    const path = `${PlusmarService.environment.backendUrl}/image?path`;
    const attachments = ['/assets/img/setting/order.png', '/assets/img/setting/address.png'];

    const promises = attachments.map((url) => uploadMessageAttachments(accessToken, `${path}=${url}`));
    await Promise.all(promises);
  };

  getShopProfile = async (pageID: number): Promise<IGetShopDetail> => {
    return await getShopFanPageByUserID(PlusmarService.readerClient, pageID);
  };

  getSubscriptionDetail = async (subscriptionID: string): Promise<[ISubscriptionPeriod]> => {
    const pages: ICount = await getPagesFromSubscriptionID(PlusmarService.readerClient, subscriptionID);
    if (!pages || pages.count === 0) throw new SubscriptionError(EnumAuthError.NO_PAGES);
    const result = await getSubscriptionPeriodDetail(PlusmarService.readerClient, subscriptionID);
    if (isEmpty(result)) throw new Error('NO_SUBSCRIPTION_DETAIL_OF_PAGE');
    return result;
  };

  getUserPageMapping = async (userID: number, subscriptionID: string): Promise<ICount> => {
    return await getUserPageMapping(PlusmarService.readerClient, userID, subscriptionID);
  };

  getPageMemberDetail = async (pageID: number): Promise<IPlanName> => {
    return await getPageMemberDetail(PlusmarService.readerClient, pageID);
  };

  getPageMembermapping = async (pageID: number): Promise<ICount> => {
    return await getPageMembermapping(PlusmarService.readerClient, pageID);
  };

  getSocialConnectStatus = async (pageID: number, page: IPages, sid: string, accessToken: string): Promise<ISocialConnect> => {
    const result = {
      facebook: await this.pagesService.getPageFromFacebookByFbPageID(sid, accessToken, page.fb_page_id),
      line: await getLineChannelInforByPageID(PlusmarService.readerClient, pageID),
      lazada: await this.pagesThirdPartyService.getPageThirdPartyByPageType({ pageID: pageID, pageType: [SocialTypes.LAZADA] }),
      shopee: await this.pagesThirdPartyService.getPageThirdPartyByPageType({ pageID: pageID, pageType: [SocialTypes.SHOPEE] }),
    } as ISocialConnect;
    result.facebook.username = result.facebook.username === undefined ? null : result.facebook.username;
    result.line.picture = result.line.picture === null ? 'assets/img/icon-lineoa.svg' : result.line.picture;
    result.line.id = result.line.id === null ? result.line.line_basic_id : result.line.id;
    return result;
  };

  getLineChannelSettingByPageID = async (pageID: number): Promise<ILineSetting> => {
    let result = { basicid: null, channelid: null, channelsecret: null, channeltoken: null, uuid: null, id: null } as ILineSetting;
    if (pageID) {
      result = await getLineChannelSettingByPageID(PlusmarService.readerClient, pageID);
    }
    return result;
  };
  getLogisticTrackingTypeByUuid = async (pageUUID: string, orderUUID: string): Promise<logisticTrackingDetail> => {
    let result = { delivery_type: null, tracking_type: null, cod_status: null } as logisticTrackingDetail;
    const reponse = await getLogisticTrackingTypeByUuid(PlusmarService.readerClient, orderUUID);

    if (!isEmpty(reponse)) {
      result = reponse;
    }

    return result;
  };

  verifyChannelAccesstoken = async (channeltoken: string, channelid: number): Promise<ILineSetting> => {
    const checkDuplicateChannel = await checkDuplicateLineChannel(PlusmarService.readerClient, channelid);
    if (checkDuplicateChannel > 0) {
      throw new SettingError('DUPPLICATE_LINE_CHANNEL');
    }
    const channelInfor = await getChannelInfo(channeltoken, 'SETTING');
    const result = {
      displayname: channelInfor.displayName,
      pictureurl: channelInfor.pictureUrl,
      premiumid: channelInfor.premiumId === undefined ? null : channelInfor.premiumId,
      userid: channelInfor.userId,
    } as ILineSetting;
    return result;
  };

  getUserPhone = async (payload: IPayload): Promise<IGetUserPhone> => {
    return await getUserPhone(PlusmarService.readerClient, payload.userID);
  };

  async handleLazadaConnect(code: string, pageUUID: string, lazadaEnv: ILazadaEnv): Promise<ISocialConnectResponse> {
    try {
      let isConnected: boolean;
      let message = '';
      const { url, urlParams } = this.getLazadaAccessTokenUrl(code, lazadaEnv);
      const response = await axiosGetWithParams(url, urlParams);
      const accessTokenResponse: ILazadaConnectResponse = response.data;
      const data = await this.pagesService.getPageByUUID(pageUUID);
      const pageID = data.id;
      const addPageParams: IAddPagesThirdPartyParams = this.getAddPageThirdPartyLazadaParams(pageID, accessTokenResponse);
      if (accessTokenResponse.code === LAZADA_API_SUCCESS_CODE) {
        const pageThirdParty = await addUpdatePageThirdParty(PlusmarService.readerClient, addPageParams);
        const sellerDetails = await this.getLazadaSellerDetails({ pageID, lazadaEnv });
        const { name, logo_url: picture } = sellerDetails || {};
        const sellerURL = getPagesThirdPartySellerURL(name, lazadaEnv.lazadaWebUrl, SocialTypes.LAZADA);
        await updateSellerDetails({ id: pageThirdParty.id, pageID, url: sellerURL, name, picture, sellerPayload: JSON.stringify(sellerDetails) }, PlusmarService.readerClient);
        isConnected = true;
        message = 'SUCCESS';
      } else {
        isConnected = false;
        message = 'ERROR';
      }
      return this.getSocialConnectResult({ result: isConnected, source: SocialTypes.LAZADA, message });
    } catch (error) {
      console.log('Lazada connect error :>> ', error.message);
      const message = error.message.includes('SELLER_DETAIL_ERROR') ? 'SELLER_DETAIL_ERROR' : 'ERROR';
      return this.getSocialConnectResult({ result: false, source: SocialTypes.LAZADA, message });
    }
  }

  async getLazadaSellerDetails({ pageID, lazadaEnv }: { pageID: number; lazadaEnv: ILazadaEnv }): Promise<ILazadaSellerDetails> {
    try {
      const { lazadaGetSeller, lazadaApiUrlTH } = lazadaEnv;
      const { accessToken } = await this.pagesThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [SocialTypes.LAZADA] });
      const accessParams = getLazadaDefaultAccessTokenParams(accessToken, lazadaEnv);
      const sellerUrl = `${lazadaApiUrlTH}${lazadaGetSeller}`;
      const getSellerRequestSign = getLazadaSignCodeAndParams<ILazadaDefaultAccessRequest>(accessParams, lazadaGetSeller, lazadaEnv);
      const response = await axiosGetWithParams(sellerUrl, getSellerRequestSign);
      const responseData: ILazadaSellerResponse = response.data;
      if (responseData.code === LAZADA_API_SUCCESS_CODE) {
        return response?.data?.data as ILazadaSellerDetails;
      } else {
        throw new Error('SELLER_DETAIL_ERROR');
      }
    } catch (error) {
      console.log('error in getting lazada seller details :>> ', error);
      throw new Error('SELLER_DETAIL_ERROR');
    }
  }

  async handleShopeeConnect(code: string, pageUUID: string, shopID: string, shopeeEnv: IShopeeEnv): Promise<ISocialConnectResponse> {
    try {
      let isConnected: boolean;
      let message = '';
      const { url, urlParams } = getShopeeAccessTokenUrl(code, shopID, shopeeEnv);
      const accessTokenResponse = await axiosPostWithHeader(url, urlParams, { 'Content-Type': 'application/json' });
      if (accessTokenResponse?.data?.access_token) {
        const accessTokenData: IShopeeConnectResponse = accessTokenResponse.data;
        const { id: pageID } = await this.pagesService.getPageByUUID(pageUUID);
        const addPageParams = this.getAddPageThirdPartyShopeeParams(pageID, shopID, accessTokenData);
        await addUpdatePageThirdParty(PlusmarService.readerClient, addPageParams);
        const { sellerID: shop_id, accessToken: access_token, id } = await this.pagesThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [SocialTypes.SHOPEE] });
        const sellerDetails = await getShopeeSellerDetailsFromShopeeApi(+shop_id, access_token, shopeeEnv);
        const { shop_name, status } = sellerDetails;
        if (status !== ShopeeShopStatusTypes.Normal) throw new Error('SHOP_NOT_VALID');
        const sellerURL = getPagesThirdPartySellerURL(sellerDetails.shop_name, shopeeEnv.shopeeWebUrl, SocialTypes.SHOPEE);
        await updateSellerDetails({ id, pageID, url: sellerURL, name: shop_name, picture: null, sellerPayload: JSON.stringify(sellerDetails) }, PlusmarService.readerClient);
        isConnected = true;
        message = 'SUCCESS';
      } else {
        isConnected = false;
        message = 'ERROR';
      }
      return this.getSocialConnectResult({ result: isConnected, source: SocialTypes.SHOPEE, message });
    } catch (error) {
      let message = 'ERROR';
      if (error.message.includes('SELLER_DETAIL_ERROR')) {
        message = 'SELLER_DETAIL_ERROR';
      } else if (error.message.includes('SHOP_NOT_VALID')) {
        message = 'SHOP_NOT_VALID';
      }
      return this.getSocialConnectResult({ result: false, source: SocialTypes.SHOPEE, message });
    }
  }

  getAddPageThirdPartyLazadaParams(pageID: number, accessResponse: ILazadaConnectResponse): IAddPagesThirdPartyParams {
    accessResponse = this.pagesThirdPartyService.getEncyptAccessResponse(accessResponse) as ILazadaConnectResponse;
    return {
      pageID,
      sellerID: accessResponse.country_user_info[0].seller_id,
      accessToken: accessResponse.access_token,
      pageType: SocialTypes.LAZADA,
      payload: JSON.stringify(accessResponse),
    };
  }

  getAddPageThirdPartyShopeeParams(pageID: number, sellerID: string, accessResponse: IShopeeConnectResponse): IAddPagesThirdPartyParams {
    accessResponse = this.pagesThirdPartyService.getEncyptAccessResponse(accessResponse) as IShopeeConnectResponse;
    return {
      pageID,
      sellerID,
      accessToken: accessResponse.access_token,
      pageType: SocialTypes.SHOPEE,
      payload: JSON.stringify(accessResponse),
    };
  }

  getLazadaAccessTokenUrl(code: string, lazadaEnv: ILazadaEnv): IUrlParams {
    const { lazadaRestUrl, lazadaTokenCreateUrl, lazadaAppID: app_key, lazadaSignInMethod: sign_method } = lazadaEnv;
    const timestamp = getUTCUnixLazadaTimestamps();
    const params = {
      app_key,
      code,
      sign_method,
      timestamp,
    };

    const urlParams = getLazadaSignCodeAndParams(params, lazadaTokenCreateUrl, lazadaEnv);
    const url = `${lazadaRestUrl}${lazadaTokenCreateUrl}`;
    return {
      url,
      urlParams,
    };
  }

  getSocialConnectResult({ result, source, message }: ISocialConnectResponse): ISocialConnectResponse {
    return {
      result,
      source,
      message,
    };
  }

  async getWebhookPatternList(page_id: number): Promise<IPageWebhookPatternSetting[]> {
    return await getWebhookPatternList(PlusmarService.readerClient, page_id);
  }

  async addWebhookPattern(param: IPageWebhookPatternSetting, page_id: number): Promise<IHTTPResult> {
    await addWebhookPattern(PlusmarService.writerClient, param, page_id);
    return {
      status: 200,
      value: 'Data have been saved successfully',
    } as IHTTPResult;
  }

  async updateWebhookPattern(param: IPageWebhookPatternSetting, page_id: number): Promise<IHTTPResult> {
    await updateWebhookPattern(PlusmarService.writerClient, param, page_id);
    return {
      status: 200,
      value: 'Data have been saved successfully',
    } as IHTTPResult;
  }

  async removeWebhookPattern(webhookId: number, page_id: number): Promise<IHTTPResult> {
    return await removeWebhookPattern(PlusmarService.writerClient, webhookId, page_id);
  }

  async toggleWebhookPatternStatus(webhookId: number, page_id: number): Promise<IHTTPResult> {
    const response = {
      status: 500,
      value: 'Webhook Id is not match !!',
    } as IHTTPResult;
    const responseGetWebhook = await getWebhookPatternById(PlusmarService.readerClient, webhookId, page_id);
    if (!isEmptyValue(responseGetWebhook)) {
      const responseUpdateStatus = await toggleWebhookPatternStatus(PlusmarService.writerClient, webhookId, page_id, !responseGetWebhook.status);
      if (!isEmptyValue(responseUpdateStatus)) {
        response.status = 200;
        response.value = 'Data has been saved successfully';
      }
    }
    return response;
  }
}
