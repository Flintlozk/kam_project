import { createDefaultLogistic, updateLogisticOption } from '../../../data/settings';
import {
  ILogisticModelInput,
  EnumLogisticFeeType,
  EnumLogisticDeliveryProviderType,
  EnumLogisticType,
  EnumTrackingType,
  PageSettingType,
  IPageLogisticSystemOptions,
  IPages,
  JAndTExpressConfig,
} from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Pool } from 'pg';
import { getPageSettingDefaultOption } from '../../../domains/page-settings/page-settings.domain';

const getSubSystem = (provider: EnumLogisticDeliveryProviderType) => {
  const payload = <IPageLogisticSystemOptions>getPageSettingDefaultOption(PageSettingType.LOGISTIC_SYSTEM);
  payload.pricingTable.provider = provider;
  return payload as IPageLogisticSystemOptions;
};

export const thaiPost: ILogisticModelInput = {
  name: 'Thailand Post',
  type: EnumLogisticType.DOMESTIC,
  feeType: EnumLogisticFeeType.FREE,
  deliveryType: EnumLogisticDeliveryProviderType.THAILAND_POST,
  codStatus: false,
  deliveryFee: 0,
  image: 'assets/img/logistic/round/ThailandPost_logo.png',
  trackingUrl: 'https://track.thailandpost.co.th/?lang=en',
  deliveryDays: '',
  status: true,
  trackingType: EnumTrackingType.MANUAL,
  walletId: '',
  option: JSON.stringify({
    type: EnumLogisticDeliveryProviderType.THAILAND_POST,
  }),
  subSystem: getSubSystem(EnumLogisticDeliveryProviderType.THAILAND_POST),
};

export const flashExpress: ILogisticModelInput = {
  name: 'Flash Express',
  type: EnumLogisticType.DOMESTIC,
  feeType: EnumLogisticFeeType.FREE,
  deliveryType: EnumLogisticDeliveryProviderType.FLASH_EXPRESS,
  codStatus: false,
  deliveryFee: 0,
  image: 'assets/img/logistic/round/flashexpress_logo.png',
  trackingUrl: 'https://www.flashexpress.co.th/th/tracking',
  deliveryDays: '',
  status: false,
  trackingType: EnumTrackingType.MANUAL,
  walletId: '',
  option: JSON.stringify({
    type: EnumLogisticDeliveryProviderType.FLASH_EXPRESS,
    insured: false,
    merchant_id: '',
  }),
  subSystem: getSubSystem(EnumLogisticDeliveryProviderType.FLASH_EXPRESS),
};

const jAndTExpress: ILogisticModelInput = {
  name: 'J&T Express',
  type: EnumLogisticType.DOMESTIC,
  feeType: EnumLogisticFeeType.FREE,
  deliveryType: EnumLogisticDeliveryProviderType.J_AND_T,
  codStatus: false,
  deliveryFee: 0,
  image: 'assets/img/logistic/round/jt_logo.png',
  trackingUrl: 'https://www.jtexpress.co.th/index/query/gzquery.html',
  deliveryDays: '',
  status: false,
  trackingType: EnumTrackingType.MANUAL,
  walletId: '',
  option: JSON.stringify({
    type: EnumLogisticDeliveryProviderType.J_AND_T,
    shop_id: '',
    shop_name: '',
    insured: false,
    registered: false,
  }),
  subSystem: getSubSystem(EnumLogisticDeliveryProviderType.J_AND_T),
};
export class LogisticsInitializeService {
  async initLogsitics(client: Pool, pageID: number, page: IPages): Promise<void> {
    await Promise.all([this.initJAndTExpressLogsitics(client, pageID, page), this.initFlashExpressLogsitics(client, pageID), this.initThaiPostLogsitics(client, pageID)]);
  }

  async initThaiPostLogsitics(client: Pool, pageID: number): Promise<IHTTPResult> {
    await createDefaultLogistic(client, pageID, thaiPost);
    return this.getReturnResult();
  }
  async initFlashExpressLogsitics(client: Pool, pageID: number): Promise<IHTTPResult> {
    await createDefaultLogistic(client, pageID, flashExpress);
    return this.getReturnResult();
  }

  async initJAndTExpressLogsitics(client: Pool, pageID: number, page: IPages): Promise<IHTTPResult> {
    const { page_name: pageName } = page;
    const logistic = await createDefaultLogistic(client, pageID, jAndTExpress);
    const JTOption = <JAndTExpressConfig>logistic.option;
    JTOption.shop_name = pageName;
    JTOption.shop_id = `MC` + String(logistic.id).padStart(7, '0');

    await updateLogisticOption(client, logistic.id, JTOption, pageID);

    return this.getReturnResult();
  }

  getSubSystemByType(provider: EnumLogisticDeliveryProviderType): IPageLogisticSystemOptions {
    return getSubSystem(provider);
  }

  getReturnResult = (): IHTTPResult => {
    return {
      status: 201,
      value: 'Create logistic successfully!',
    };
  };
}
