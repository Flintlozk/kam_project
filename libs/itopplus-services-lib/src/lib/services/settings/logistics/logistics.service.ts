import { IHTTPResult } from '@reactor-room/model-lib';
import {
  EnumLogisticDeliveryProviderType,
  EnumTrackingType,
  IFacebookPipelineModel,
  ILogisticModel,
  ILogisticModelInput,
  ILogisticSelectorTemplate,
  IPageFeeInfo,
  IPages,
  IPayload,
  PageSettingType,
  PurchaseOrderModel,
} from '@reactor-room/itopplus-model-lib';
import { createTemporaryCourierTracking } from '../../../data';
import {
  createLogistic,
  deleteLogistic,
  getLogisticByPageID,
  getLogisticDetail,
  getLogisticPageLogisticSettings,
  getPageFeeInfo,
  updateLogistic,
  updateLogisticStatus,
  updatePageDeliveryFee,
  updatePageFlatStatus,
} from '../../../data/settings';
import { PageSettingsService } from '../../page-settings/page-settings.service';
import { LogisticSystemService } from '../../logistic/logistic-system.service';
import { LogisticsInitializeService } from '../../initialize/logistics/logistics-initialize.service';
import { PlusmarService } from '../../plusmarservice.class';
import { getHashLogisitcSystemTempMapping } from '../../../domains/logistic-system/logistic-system.domain';

export class LogisticsService {
  logisticsInitializeService: LogisticsInitializeService;
  pageSettingsService: PageSettingsService;
  logisticSystemService: LogisticSystemService;
  constructor() {
    this.logisticSystemService = new LogisticSystemService();
    this.logisticsInitializeService = new LogisticsInitializeService();
    this.pageSettingsService = new PageSettingsService();
  }

  async getLogisticPageLogisticSettings(pageID: number): Promise<ILogisticModel[]> {
    const logistics = await getLogisticPageLogisticSettings(PlusmarService.readerClient, pageID);

    return logistics.filter((logistic) => {
      if (logistic.delivery_type === EnumLogisticDeliveryProviderType.J_AND_T) {
        if (!logistic.option.registered) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    });
  }

  getLogisticDetail = async (pageID: number, logisticID: number): Promise<ILogisticModel[]> => {
    return await getLogisticDetail(PlusmarService.readerClient, pageID, logisticID);
  };

  createLogistic = async (pageID: number, logisticInputData: ILogisticModelInput): Promise<IHTTPResult> => {
    return await createLogistic(PlusmarService.writerClient, pageID, logisticInputData);
  };

  updateLogistic = async (id: number, logisticInputData: ILogisticModelInput, { pageID }: IPayload): Promise<IHTTPResult> => {
    return await updateLogistic(PlusmarService.writerClient, id, logisticInputData, pageID);
  };

  updateLogisticStatus = async (id: number, status: boolean): Promise<IHTTPResult> => {
    return await updateLogisticStatus(PlusmarService.writerClient, id, status);
  };

  updatePageFlatStatus = async (pageID: number, status: boolean): Promise<IHTTPResult> => {
    await this.logisticSystemService.toggleLogisticSystemSetting(pageID, status);
    return await updatePageFlatStatus(PlusmarService.writerClient, pageID, status);
  };

  updatePageDeliveryFee = async (pageID: number, fee: number): Promise<IHTTPResult> => {
    return await updatePageDeliveryFee(PlusmarService.writerClient, pageID, fee);
  };

  getLogisticsByPageID = async (pageID: number, page: IPages): Promise<ILogisticModel[]> => {
    const result = await getLogisticByPageID(PlusmarService.readerClient, pageID);

    let isGetUpdated = false;
    if (!result) {
      await this.pageSettingsService.getPageSetting(pageID, PageSettingType.LOGISTIC_SYSTEM);
      await this.logisticsInitializeService.initLogsitics(PlusmarService.writerClient, pageID, page);
      isGetUpdated = true;
    } else {
      const listToCreate = {
        THAILAND_POST: false,
        FLASH_EXPRESS: false,
        J_AND_T: false,
      };

      result.map((logistic) => {
        if (logistic.delivery_type === EnumLogisticDeliveryProviderType.THAILAND_POST) listToCreate[EnumLogisticDeliveryProviderType.THAILAND_POST] = true;
        if (logistic.delivery_type === EnumLogisticDeliveryProviderType.FLASH_EXPRESS) listToCreate[EnumLogisticDeliveryProviderType.FLASH_EXPRESS] = true;
        if (logistic.delivery_type === EnumLogisticDeliveryProviderType.J_AND_T) listToCreate[EnumLogisticDeliveryProviderType.J_AND_T] = true;
      });

      if (!listToCreate[EnumLogisticDeliveryProviderType.THAILAND_POST]) {
        isGetUpdated = true;
        await this.logisticsInitializeService.initThaiPostLogsitics(PlusmarService.writerClient, pageID);
      }

      if (!listToCreate[EnumLogisticDeliveryProviderType.FLASH_EXPRESS]) {
        isGetUpdated = true;
        await this.logisticsInitializeService.initFlashExpressLogsitics(PlusmarService.writerClient, pageID);
      }

      if (!listToCreate[EnumLogisticDeliveryProviderType.J_AND_T]) {
        isGetUpdated = true;
        await this.logisticsInitializeService.initJAndTExpressLogsitics(PlusmarService.writerClient, pageID, page);
      }
    }

    if (isGetUpdated) {
      const logistics = await getLogisticByPageID(PlusmarService.readerClient, pageID);
      return logistics;
    } else {
      return result;
    }
  };

  getPageFeeInfo = async (pageID: number): Promise<IPageFeeInfo> => {
    return await getPageFeeInfo(PlusmarService.readerClient, pageID);
  };

  deleteLogistic = async (id: number): Promise<IHTTPResult> => {
    return await deleteLogistic(PlusmarService.readerClient, id);
  };

  async checkLogisticDetail(pipeline: IFacebookPipelineModel, isFlatRate: boolean): Promise<void> {
    if (!isFlatRate) {
      const logisticDetail = await getLogisticDetail(PlusmarService.readerClient, pipeline.page_id, pipeline.logistic_id);
      if (logisticDetail === null) {
        throw new Error('LOGISTIC NOT AVALIABLE');
      }
    }
    await createTemporaryCourierTracking(PlusmarService.writerClient, pipeline.order_id);
  }

  async logisticSelectorTemplateOption(pageID: number, order: PurchaseOrderModel): Promise<ILogisticSelectorTemplate[]> {
    const logisticSettings = await this.getLogisticPageLogisticSettings(pageID);
    const logistics: ILogisticSelectorTemplate[] = [];

    for (let index = 0; index < logisticSettings.length; index++) {
      const logistic = logisticSettings[index];

      if (logistic.delivery_type === EnumLogisticDeliveryProviderType.J_AND_T) {
        const options = logistic.option;
        if (!options.registered) continue; // Skip to next index
      }

      const tempShippingMapping = await this.logisticSystemService.calculateShippingPriceByType(logistic.sub_system, order, logistic.id);
      const { shippingFee } = tempShippingMapping;

      const transfromObj: ILogisticSelectorTemplate = {
        id: Number(logistic.id),
        name: logistic.name,
        type: logistic.delivery_type,
        trackingType: logistic.tracking_type,
        flatRate: true,
        deliveryFee: shippingFee,
        isCOD: logistic.tracking_type === EnumTrackingType.DROP_OFF ? logistic.cod_status : false,
        hash: getHashLogisitcSystemTempMapping(tempShippingMapping, order.id),
      };

      logistics.push(transfromObj);
    }
    return logistics;
  }
}
