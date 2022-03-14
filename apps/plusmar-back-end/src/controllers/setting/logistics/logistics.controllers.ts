import { IHTTPResult } from '@reactor-room/model-lib';
import type { ICalculatedShipping, IGQLContext, ILogisticArg, ILogisticModel, IPageFeeInfo, IPayload, IPayOffResult } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumLogisticDeliveryProviderType, EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { JAndTExpressService, LogisticsDropOffService, LogisticsService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { requireAdmin, requirePackageValidation } from '../../../domains/plusmar';
import { validateRequestPageID, validateResponseHTTPObject } from '../../../schema/common';
import {
  validateLogisticIDInput,
  validateLogisticInput,
  validateLogisticInputForm,
  validatepdateDeliveryFeeInput,
  validateResponseCalculateShippingPrice,
  validateResponseLogistics,
  validateResponsePageFeeInfo,
  validateResponsePayDropOffBalance,
  validateUpdateLogisticStatusInput,
  validateUpdatePageFlatStatusInput,
} from '../../../schema/setting';
import { graphQLHandler } from '../../graphql-handler';
import { lotNumberResolver } from '../lot-number/lot-number.controller';

@requireScope([EnumAuthScope.SOCIAL])
class Logistics {
  public static instance;
  public static logisticsService: LogisticsService;
  public static JAndTExpressService: JAndTExpressService;
  public static logisticsDropoffService: LogisticsDropOffService;
  public static getInstance() {
    if (!Logistics.instance) Logistics.instance = new Logistics();
    return Logistics.instance;
  }
  constructor() {
    Logistics.logisticsService = new LogisticsService();
    Logistics.logisticsDropoffService = new LogisticsDropOffService();
    Logistics.JAndTExpressService = new JAndTExpressService();
  }
  // Mutation

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async createLogisticHandler(parent, arg: ILogisticArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { logisticInputData } = validateLogisticInput<ILogisticArg>(arg);
    return await Logistics.logisticsService.createLogistic(pageID, logisticInputData);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateLogisticHandler(parent, arg: ILogisticArg, context: IGQLContext): Promise<IHTTPResult> {
    const { id, logisticInputData } = validateLogisticInputForm<ILogisticArg>(arg);
    return await Logistics.logisticsService.updateLogistic(id, logisticInputData, context.payload);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateLogisticStatusHandler(parent, arg: ILogisticArg, context: IGQLContext): Promise<IHTTPResult> {
    const { id, status } = validateUpdateLogisticStatusInput<ILogisticArg>(arg);
    return await Logistics.logisticsService.updateLogisticStatus(id, status);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updatePageFlatStatusHandler(parent, arg: ILogisticArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { status } = validateUpdatePageFlatStatusInput<ILogisticArg>(arg);
    return await Logistics.logisticsService.updatePageFlatStatus(pageID, status);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updatePageDeliveryFeeHandler(parent, arg: ILogisticArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { fee } = validatepdateDeliveryFeeInput<ILogisticArg>(arg);
    return await Logistics.logisticsService.updatePageDeliveryFee(pageID, fee);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async deleteLogisticHandler(parent, arg: ILogisticArg, context: IGQLContext): Promise<IHTTPResult> {
    const { id } = validateLogisticIDInput<ILogisticArg>(arg);
    return await Logistics.logisticsService.deleteLogistic(id);
  }

  // Query

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getLogisticsByPageIDHandler(parent, arg: ILogisticArg, context: IGQLContext): Promise<ILogisticModel[]> {
    const { pageID, page } = context.payload;
    return await Logistics.logisticsService.getLogisticsByPageID(pageID, page);
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getLogisticPageLogisticSettingsHandler(parent, arg: ILogisticArg, context: IGQLContext): Promise<ILogisticModel[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Logistics.logisticsService.getLogisticPageLogisticSettings(pageID);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPageFeeInfoIDHandler(parent, arg: ILogisticArg, context: IGQLContext): Promise<IPageFeeInfo> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Logistics.logisticsService.getPageFeeInfo(pageID);
  }

  async calculateShippingPriceHandler(parent, arg, context: IGQLContext): Promise<ICalculatedShipping> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Logistics.logisticsDropoffService.calculateShippingPrice(pageID, arg.orderIDs, context.payload.subscriptionID);
    return result;
  }
  async paySingleDropOffBalanceHandler(parent, arg, context: IGQLContext): Promise<IPayOffResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Logistics.logisticsDropoffService.paySingleDropOffBalance(pageID, arg.orderID, context.payload.subscriptionID, arg.platform);
    return result;
  }
  async verifyJAndTExpressHandler(parent, arg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Logistics.JAndTExpressService.verifyJAndTExpress(pageID);
  }
}

const logistics: Logistics = Logistics.getInstance();
export const logisticsResolver = {
  ILogisticConfigOption: {
    __resolveType(logistic: { type: EnumLogisticDeliveryProviderType }): string {
      switch (logistic.type) {
        case EnumLogisticDeliveryProviderType.THAILAND_POST:
          return 'ThaiPostConfig';
        case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
          return 'FlashExpressConfig';
        case EnumLogisticDeliveryProviderType.J_AND_T:
          return 'JAndTConfig';
        case EnumLogisticDeliveryProviderType.ALPHA:
          return 'AlphaFastConfig';
        default:
          return 'ThaiPostConfig';
      }
    },
  },
  LogisticJoinLotNumber: {
    logisticLotNumbers(parent, args, context, info) {
      return lotNumberResolver.Query.getLotNumbersByLogisticID(parent, { logisitcId: parent.id }, context);
    },
  },
  Query: {
    getLogisticPageLogisticSettings: graphQLHandler({
      handler: logistics.getLogisticPageLogisticSettingsHandler,
      validator: validateResponseLogistics,
    }),
    getLogisticsByPageID: graphQLHandler({
      handler: logistics.getLogisticsByPageIDHandler,
      validator: validateResponseLogistics,
    }),
    getPageFeeInfo: graphQLHandler({
      handler: logistics.getPageFeeInfoIDHandler,
      validator: validateResponsePageFeeInfo,
    }),
    calculateShippingPrice: graphQLHandler({
      handler: logistics.calculateShippingPriceHandler,
      validator: validateResponseCalculateShippingPrice,
    }),
    paySingleDropOffBalance: graphQLHandler({
      handler: logistics.paySingleDropOffBalanceHandler,
      validator: validateResponsePayDropOffBalance,
    }),
    verifyJAndTExpress: graphQLHandler({
      handler: logistics.verifyJAndTExpressHandler,
      validator: validateResponseHTTPObject,
    }),
  },
  Mutation: {
    createLogistic: graphQLHandler({
      handler: logistics.createLogisticHandler,
      validator: validateResponseHTTPObject,
    }),
    updateLogistic: graphQLHandler({
      handler: logistics.updateLogisticHandler,
      validator: validateResponseHTTPObject,
    }),
    updateLogisticStatus: graphQLHandler({
      handler: logistics.updateLogisticStatusHandler,
      validator: validateResponseHTTPObject,
    }),
    updatePageFlatStatus: graphQLHandler({
      handler: logistics.updatePageFlatStatusHandler,
      validator: validateResponseHTTPObject,
    }),
    updatePageDeliveryFee: graphQLHandler({
      handler: logistics.updatePageDeliveryFeeHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteLogistic: graphQLHandler({
      handler: logistics.deleteLogisticHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
