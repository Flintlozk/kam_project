import { NumberSymbol } from '@angular/common';
import { findObjectByProp, isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumLogisticDeliveryProviderType,
  EnumLogisticSystemType,
  ILogisticModel,
  ILogisticSystemTempMapping,
  IPageLogisticSystemOptionFixedRate,
  IPageLogisticSystemOptionFlatRate,
  IPageLogisticSystemOptionPricingTable,
  IPageLogisticSystemOptions,
  PageLogisitcSystem,
  PageSettingType,
  PurchaseOrderModel,
} from '@reactor-room/itopplus-model-lib';
import { getLogisticByID, getPageByID } from '../../data';
import { LogisticsInitializeService } from '../initialize/logistics/logistics-initialize.service';
import { PageSettingsService } from '../page-settings/page-settings.service';
import { PlusmarService } from '../plusmarservice.class';
import { ThaiPostService } from '../thai-post/thai-post.service';
export class LogisticSystemService {
  public pageSettingService: PageSettingsService;
  public logisticsInitializeService: LogisticsInitializeService;
  public thaiPostService: ThaiPostService;

  settingType = PageSettingType.LOGISTIC_SYSTEM;
  constructor() {
    this.pageSettingService = new PageSettingsService();
    this.logisticsInitializeService = new LogisticsInitializeService();
    this.thaiPostService = new ThaiPostService();
  }

  async getLogisticSystemByDefaultConfig(pageID: number): Promise<IPageLogisticSystemOptions> {
    const setting = await this.pageSettingService.getPageSetting(pageID, this.settingType);
    const options = <IPageLogisticSystemOptions>setting.options;
    return options;
  }

  async getLogisticSystemByLogisiticID(pageID: number, logisticID: NumberSymbol, logistic?: ILogisticModel): Promise<IPageLogisticSystemOptions> {
    if (isEmpty(logistic)) logistic = await getLogisticByID(PlusmarService.readerClient, logisticID, pageID);

    if (logistic.sub_system) {
      return logistic.sub_system;
    } else {
      switch (logistic.delivery_type) {
        case EnumLogisticDeliveryProviderType.THAILAND_POST:
        case EnumLogisticDeliveryProviderType.EMS_THAILAND: {
          await this.logisticsInitializeService.initThaiPostLogsitics(PlusmarService.writerClient, pageID);
          const subSystem = this.logisticsInitializeService.getSubSystemByType(logistic.delivery_type);
          return subSystem;
        }
        case EnumLogisticDeliveryProviderType.FLASH_EXPRESS: {
          await this.logisticsInitializeService.initFlashExpressLogsitics(PlusmarService.writerClient, pageID);
          const subSystem = this.logisticsInitializeService.getSubSystemByType(logistic.delivery_type);
          return subSystem;
        }
        case EnumLogisticDeliveryProviderType.J_AND_T: {
          const page = await getPageByID(PlusmarService.readerClient, pageID);
          await this.logisticsInitializeService.initJAndTExpressLogsitics(PlusmarService.writerClient, pageID, page);
          const subSystem = this.logisticsInitializeService.getSubSystemByType(logistic.delivery_type);
          return subSystem;
        }
        default:
          throw new Error('logistic not defined');
      }
    }
  }

  async toggleLogisticSystemSetting(pageID: number, status: boolean): Promise<boolean> {
    return await this.pageSettingService.togglePageSetting(pageID, { status, type: this.settingType });
  }

  async saveLogisticSystemSetting(pageID: number, options: IPageLogisticSystemOptions): Promise<IPageLogisticSystemOptions> {
    await this.pageSettingService.savePageSettingOption(pageID, this.settingType, options);
    const setting = await this.pageSettingService.getPageSetting(pageID, this.settingType);

    return <IPageLogisticSystemOptions>setting.options;
  }

  /*-------- Calculation ----------*/

  async calculateShippingPriceByType(options: IPageLogisticSystemOptions, purchaseOrder: PurchaseOrderModel, logisticID?: number): Promise<ILogisticSystemTempMapping> {
    const tempMappingData = {
      logisticID: logisticID ? logisticID : null,
      logisticSystem: logisticID ? true : false,
      method: null, // EnumLogisticSystemType
      fallBackMethod: null, //EnumLogisticSystemType
      isFallback: false,
      shippingFee: 0,
    };

    const activeSubSystem = true;
    const system = findObjectByProp<IPageLogisticSystemOptions, PageLogisitcSystem>(options, 'isActive', activeSubSystem);
    tempMappingData.method = system.type;

    switch (system.type) {
      case EnumLogisticSystemType.FLAT_RATE:
        this.onCalculateByFlatRate(system as IPageLogisticSystemOptionFlatRate, tempMappingData);
        break;
      case EnumLogisticSystemType.FIXED_RATE:
        await this.onCalculateByFixedRate(system as IPageLogisticSystemOptionFixedRate, purchaseOrder, options, tempMappingData);
        break;
      case EnumLogisticSystemType.PRICING_TABLE:
        await this.onCalculateByPricingTable(system as IPageLogisticSystemOptionPricingTable, purchaseOrder, tempMappingData);
        break;
    }
    return tempMappingData;
  }

  async calculateShippingPriceByTypeWithFallBackState(
    fallbackType: EnumLogisticSystemType,
    system: IPageLogisticSystemOptions,
    purchaseOrder: PurchaseOrderModel,
    temp: ILogisticSystemTempMapping,
  ): Promise<number> {
    temp.isFallback = true;
    temp.fallBackMethod = fallbackType;
    switch (fallbackType) {
      case EnumLogisticSystemType.FLAT_RATE:
        return this.onCalculateByFlatRate(system.flatRate as IPageLogisticSystemOptionFlatRate, temp);
      case EnumLogisticSystemType.PRICING_TABLE:
        return await this.onCalculateByPricingTable(system.pricingTable as IPageLogisticSystemOptionPricingTable, purchaseOrder, temp);
    }
  }

  onCalculateByFlatRate(option: IPageLogisticSystemOptionFlatRate, temp: ILogisticSystemTempMapping): number {
    temp.shippingFee = option.deliveryFee;
    return option.deliveryFee;
  }

  async onCalculateByFixedRate(
    option: IPageLogisticSystemOptionFixedRate,
    purchaseOrder: PurchaseOrderModel,
    options: IPageLogisticSystemOptions,
    temp: ILogisticSystemTempMapping,
  ): Promise<number> {
    const method = option.useMin ? purchaseOrder.total_price < option.amount : purchaseOrder.total_price > option.amount;
    if (method) {
      const shippingFee = 0; // free delivery
      temp.shippingFee = shippingFee;
      return shippingFee;
    } else {
      return await this.calculateShippingPriceByTypeWithFallBackState(option.fallbackType, options, purchaseOrder, temp);
    }
  }

  async onCalculateByPricingTable(option: IPageLogisticSystemOptionPricingTable, purchaseOrder: PurchaseOrderModel, temp: ILogisticSystemTempMapping): Promise<number> {
    switch (option.provider) {
      case EnumLogisticDeliveryProviderType.THAILAND_POST:
      case EnumLogisticDeliveryProviderType.EMS_THAILAND: {
        const { price } = await this.thaiPostService.getThaipostShippingFee(purchaseOrder);
        temp.shippingFee = price;
        return price;
      }
      case EnumLogisticDeliveryProviderType.J_AND_T:
      case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
        // TODO: ATOM GET Pricing Table From Mongo
        temp.shippingFee = 0;
        return 0;
    }
  }

  getLogisticSystemOption = async (
    pageID: number,
    pruchaseORder: PurchaseOrderModel,
    useLogisticSystemBuiltIn: boolean,
    logisticID?: number,
  ): Promise<ILogisticSystemTempMapping> => {
    if (useLogisticSystemBuiltIn === false) {
      if (logisticID) {
        const logisticSysConfig = await this.getLogisticSystemByLogisiticID(pageID, logisticID);
        return await this.calculateShippingPriceByType(logisticSysConfig, pruchaseORder, logisticID);
      }
    } else {
      const logisticSysConfig = await this.getLogisticSystemByDefaultConfig(pageID);
      return await this.calculateShippingPriceByType(logisticSysConfig, pruchaseORder);
    }
  };
  getLogisticSystemOptionyProvidedLogistics = async (
    pageID: number,
    pruchaseORder: PurchaseOrderModel,
    useLogisiticSystem: boolean,
    logisticID?: number,
  ): Promise<ILogisticSystemTempMapping> => {
    const logisticSysConfig = await this.getLogisticSystemByLogisiticID(pageID, logisticID);
    return await this.calculateShippingPriceByType(logisticSysConfig, pruchaseORder, logisticID);
  };
}
