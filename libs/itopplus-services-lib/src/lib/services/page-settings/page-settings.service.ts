import { cryptoDecode, onWaitFor } from '@reactor-room/itopplus-back-end-helpers';
import {
  IAddNewShopProfile,
  IPageCloseCustomerOptions,
  IPageMessageTrackMode,
  IPageSettings,
  IPageSubscriptionMapping,
  PageSettingOptionType,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import Axios from 'axios';
import { isEmpty } from 'lodash';
import { addPageSubscriptionsMappings, getPagesUsername, getWhitelistedDomains, subscribeDomainWhitelistToPage, updatePageName } from '../../data';
import {
  getAllPageSetting,
  getPageSetting,
  getPageSettingRedis,
  getPageSettingUnderGivenSubscription,
  savePageSettingOption,
  setPageSettingRedis,
  updatePageSettingByType,
} from '../../data/page-settings/page-settings.data';
import { getPageSettingDefaultOption } from '../../domains/page-settings/page-settings.domain';
import { PlusmarService } from '../plusmarservice.class';

export class PageSettingsService {
  constructor() {}

  async togglePageSetting(pageID: number, { status, type }: { status: boolean; type: PageSettingType }): Promise<boolean> {
    const options = getPageSettingDefaultOption(type);
    await updatePageSettingByType(PlusmarService.readerClient, pageID, status, type, options);

    const redisKey = `${pageID}+${type}`;
    const settingConfig = await getPageSetting(PlusmarService.readerClient, pageID, type);

    setPageSettingRedis(PlusmarService.redisClient, redisKey, settingConfig);

    return true;
  }

  getPageDefaultSetting(settingType: PageSettingType): string {
    return JSON.stringify(getPageSettingDefaultOption(settingType) as PageSettingOptionType);
  }
  async getPageSettings(pageID: number): Promise<IPageSettings[]> {
    const configs = await getAllPageSetting(PlusmarService.readerClient, pageID);
    if (!isEmpty(configs)) {
      await this.createDefaultConfig(pageID, configs);
      return configs;
    } else {
      return [];
    }
  }
  async getPageSettingUnderGivenSubscription(subscriptionID: string, settingType: PageSettingType): Promise<IPageSettings[]> {
    const pageSettings = await getPageSettingUnderGivenSubscription(PlusmarService.readerClient, { subscriptionID, settingType });
    if (pageSettings.length > 0) return pageSettings;
    else return [];
  }

  async createDefaultConfig(pageID: number, configs: IPageSettings[]): Promise<IPageSettings[]> {
    if (configs) {
      let triggerNewConfig = false;

      if (!configs.find((x) => x.setting_type === PageSettingType.TERMS_AND_CONDITION)) {
        const type = PageSettingType.TERMS_AND_CONDITION;
        const params = getPageSettingDefaultOption(type);
        await updatePageSettingByType(PlusmarService.writerClient, pageID, true, type, params);
        triggerNewConfig = true;
      }

      if (!configs.find((x) => x.setting_type === PageSettingType.CUSTOMER_SLA_TIME)) {
        const type = PageSettingType.CUSTOMER_SLA_TIME;
        const params = getPageSettingDefaultOption(type);
        await updatePageSettingByType(PlusmarService.writerClient, pageID, false, type, params);
        triggerNewConfig = true;
      }

      if (!configs.find((x) => x.setting_type === PageSettingType.CUSTOMER_CLOSED_REASON)) {
        const type = PageSettingType.CUSTOMER_CLOSED_REASON;
        const params = getPageSettingDefaultOption(type);
        await updatePageSettingByType(PlusmarService.writerClient, pageID, false, type, params);
        triggerNewConfig = true;
      }

      if (!configs.find((x) => x.setting_type === PageSettingType.QUICKPAY_WEBHOOK)) {
        const type = PageSettingType.QUICKPAY_WEBHOOK;
        const params = getPageSettingDefaultOption(type);
        await updatePageSettingByType(PlusmarService.writerClient, pageID, false, type, params);
        triggerNewConfig = true;
      }

      if (!configs.find((x) => x.setting_type === PageSettingType.WORKING_HOURS)) {
        const type = PageSettingType.WORKING_HOURS;
        const params = getPageSettingDefaultOption(type);
        await updatePageSettingByType(PlusmarService.writerClient, pageID, false, type, params);
        triggerNewConfig = true;
      }
      if (!configs.find((x) => x.setting_type === PageSettingType.MESSAGE_TRACK)) {
        const type = PageSettingType.MESSAGE_TRACK;
        const params = getPageSettingDefaultOption(type);
        await updatePageSettingByType(PlusmarService.writerClient, pageID, true, type, params);
        triggerNewConfig = true;
      }
      if (!configs.find((x) => x.setting_type === PageSettingType.LOGISTIC_SYSTEM)) {
        const type = PageSettingType.LOGISTIC_SYSTEM;
        const params = getPageSettingDefaultOption(type);
        await updatePageSettingByType(PlusmarService.writerClient, pageID, true, type, params);
        triggerNewConfig = true;
      }

      if (triggerNewConfig) {
        return await getAllPageSetting(PlusmarService.readerClient, pageID);
      } else {
        return configs;
      }
    }
  }

  async getPageSetting(pageID: number, settingType: PageSettingType): Promise<IPageSettings> {
    let settingConfig: IPageSettings;
    const redisKey = `${pageID}+${settingType}`;
    const redisResult = await getPageSettingRedis<IPageSettings>(PlusmarService.redisClient, redisKey);
    if (redisResult !== null) {
      return redisResult;
    } else {
      settingConfig = await getPageSetting(PlusmarService.readerClient, pageID, settingType);
    }
    if (isEmpty(settingConfig)) {
      const params = getPageSettingDefaultOption(settingType);
      const forceEnableOn = [PageSettingType.LOGISTIC_SYSTEM, PageSettingType.TERMS_AND_CONDITION, PageSettingType.MESSAGE_TRACK].includes(settingType);
      await updatePageSettingByType(PlusmarService.writerClient, pageID, forceEnableOn, settingType, params);
      settingConfig = await getPageSetting(PlusmarService.readerClient, pageID, settingType);
    }
    setPageSettingRedis(PlusmarService.redisClient, redisKey, settingConfig);
    return settingConfig;
  }

  async getPageSettingConfig(pageID: number, settingType: PageSettingType): Promise<IPageSettings> {
    let settingConfig;
    const redisKey = `${pageID}+${settingType}`;
    const redisResult = await getPageSettingRedis<IPageSettings>(PlusmarService.redisClient, redisKey);
    if (redisResult !== null) {
      return redisResult;
    } else {
      settingConfig = await getPageSetting(PlusmarService.readerClient, pageID, settingType);
    }

    return settingConfig;
  }

  async verifyClosedCustomerWebhookURL(pageID: number): Promise<boolean> {
    await onWaitFor(0.1);

    return true;
  }

  async savePageSettingOption(pageID: number, settingType: PageSettingType, params: PageSettingOptionType): Promise<void> {
    await savePageSettingOption(PlusmarService.writerClient, pageID, settingType, params);

    const redisKey = `${pageID}+${settingType}`;
    const settingConfig = await getPageSetting(PlusmarService.readerClient, pageID, settingType);
    setPageSettingRedis(PlusmarService.redisClient, redisKey, settingConfig);
  }

  async saveClosedCustomerWebhookURL(pageID: number, url: string, type: PageSettingType): Promise<boolean> {
    const params = { url: url };
    const config = await this.getPageSetting(pageID, type);
    if (!isEmpty(config)) {
      await this.savePageSettingOption(pageID, type, params as IPageCloseCustomerOptions);
    } else {
      await updatePageSettingByType(PlusmarService.readerClient, pageID, false, type, params as IPageCloseCustomerOptions);
    }

    return true;
  }
  async testUrlConnection(url: string): Promise<boolean> {
    try {
      const response = await Axios.post(url, {}, { headers: { 'x-more-commerce-signature': '123' }, timeout: 3000 });
      if (response.status !== 200) throw new Error('CONNECTION_FAILED');
      return true;
    } catch (err) {
      console.log('testUrlConnection error :', err);
      throw new Error('CONNECTION_FAILED');
    }
  }

  addPageUsername = async (pageInput: IAddNewShopProfile, pageID: number): Promise<void> => {
    try {
      const pageInfo = await getPagesUsername(pageInput.facebookid, cryptoDecode(pageInput.access_token, PlusmarService.environment.pageKey));

      if (pageInfo.hasOwnProperty('username')) {
        await updatePageName(PlusmarService.writerClient, pageInfo.username, pageID);
      }
      return;
    } catch (err) {
      return;
    }
  };

  setPageWhitelist = async (pageID: number, accessToken: string): Promise<boolean> => {
    const whitelist = await getWhitelistedDomains(pageID, accessToken);
    const domains = [PlusmarService.environment.backendUrl];

    if (whitelist) {
      domains.map((url: string) => {
        const found = whitelist.whitelisted_domains.find((item) => item === url);
        if (!found) whitelist.whitelisted_domains.push(url);
      });

      const { whitelisted_domains } = whitelist;

      if (whitelisted_domains?.length > 0) {
        return await subscribeDomainWhitelistToPage(pageID, accessToken, whitelisted_domains);
      }
    }

    return await subscribeDomainWhitelistToPage(pageID, accessToken, domains);
  };

  addPageSubScription = async (subscriptionID: string, pageID: number): Promise<IPageSubscriptionMapping> => {
    const result = await addPageSubscriptionsMappings(PlusmarService.readerClient, subscriptionID, pageID);
    return result;
  };

  async setMessageTrackMode(pageID: number, config: IPageMessageTrackMode): Promise<boolean> {
    const settingType = PageSettingType.MESSAGE_TRACK;
    await this.savePageSettingOption(pageID, settingType, config);
    return true;
  }
}
