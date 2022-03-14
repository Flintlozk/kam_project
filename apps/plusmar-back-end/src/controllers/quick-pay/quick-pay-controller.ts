import { IDObject, IHTTPResult } from '@reactor-room/model-lib';
import {
  EnumAuthScope,
  IGQLContext,
  IPayload,
  IQuickPayCancelDetails,
  IQuickPayList,
  IQuickPayListArgs,
  IQuickPayOrderItems,
  IQuickPayPaymentCancelArgs,
  IQuickPayPaymentDetails,
  IQuickPayPaymentSaveArgs,
  IQuickPaySaveArgs,
  ISendQuickPayToChatBoxArgs,
} from '@reactor-room/itopplus-model-lib';
import { QuickPayService, requireScope } from '@reactor-room/itopplus-services-lib';
import { validateIDNumberObject, validateRequestPageID, validateResponseHTTPObject } from '../../schema/common';
import {
  validateRequestQuickPayPaymentCancel,
  validateRequestSaveQuickPay,
  validateRequestSaveQuickPayPayment,
  validateRequestSendQuickPayToChatBox,
  validateResponseQuickPayCancelDetails,
  validateResponseQuickPayList,
  validateResponseQuickPayOrderItemsByOrderID,
  validateResponseQuickPayPaymentDetails,
} from '../../schema/quick-pay';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class QuickPay {
  public static instance;
  public static quickPayService: QuickPayService;

  public static getInstance() {
    if (!QuickPay.instance) QuickPay.instance = new QuickPay();
    return QuickPay.instance;
  }

  constructor() {
    QuickPay.quickPayService = new QuickPayService();
  }

  async getQuickPayListHandler(parent, args: IQuickPayListArgs, context: IGQLContext): Promise<IQuickPayList[]> {
    const { filters, customerID } = args;
    const { pageID } = context.payload;
    const data = await QuickPay.quickPayService.getQuickPayList(pageID, customerID, filters);
    return data;
  }

  async getQuickPayOrderItemsByOrderIDHandler(parent, args: IDObject, context: IGQLContext): Promise<IQuickPayOrderItems[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id } = validateIDNumberObject(args);
    const data = await QuickPay.quickPayService.getQuickPayOrderItemsByOrderID(pageID, id);
    return data;
  }

  async getQuickPayCancelDetailsHandler(parent, args: IDObject, context: IGQLContext): Promise<IQuickPayCancelDetails> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id } = validateIDNumberObject(args);
    const data = await QuickPay.quickPayService.getQuickPayCancelDetails(pageID, id);
    return data;
  }

  async getQuickPayPaymentDetailsHandler(parent, args: IDObject, context: IGQLContext): Promise<IQuickPayPaymentDetails> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id } = validateIDNumberObject(args);
    const data = await QuickPay.quickPayService.getQuickPayPaymentDetails(pageID, id);
    return data;
  }

  async saveQuickPayHandler(parents, args: IQuickPaySaveArgs, context: IGQLContext): Promise<IHTTPResult> {
    const userID = +context.payload.userID;
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { audienceID, vat, quickPayBillInput } = validateRequestSaveQuickPay<IQuickPaySaveArgs>(args);
    const result = await QuickPay.quickPayService.saveQuickPay(pageID, audienceID, userID, vat, quickPayBillInput);
    return result;
  }

  async sendQuickPayToChatBoxHandler(parents, args: ISendQuickPayToChatBoxArgs, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const userID = +context.payload.userID;
    const sendArgs = validateRequestSendQuickPayToChatBox<ISendQuickPayToChatBoxArgs>(args);
    const result = await QuickPay.quickPayService.sendQuickPayToChatBox(pageID, userID, sendArgs, context.payload.subscriptionID);
    return result;
  }

  async saveQuickPayPaymentHandler(parents, args: IQuickPayPaymentSaveArgs, context: IGQLContext): Promise<IHTTPResult> {
    const userID = +context.payload.userID;
    const subscriptionID = context.payload.subscriptionID;
    const pageUUID = context.payload.page.uuid;
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const {
      slip: { file },
    } = args.quickPayPaymentInput;
    const { id, quickPayPaymentInput } = validateRequestSaveQuickPayPayment<IQuickPayPaymentSaveArgs>(args);
    const result = await QuickPay.quickPayService.saveQuickPayPayment(pageID, userID, id, file, quickPayPaymentInput, pageUUID, subscriptionID);
    return result;
  }

  async quickPayPaymentCancelHandler(parents, args: IQuickPayPaymentCancelArgs, context: IGQLContext): Promise<IHTTPResult> {
    const userID = +context.payload.userID;
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id, description } = validateRequestQuickPayPaymentCancel<IQuickPayPaymentCancelArgs>(args);
    const result = await QuickPay.quickPayService.quickPayPaymentCancel(pageID, userID, id, description);
    return result;
  }
}

const quickPay: QuickPay = QuickPay.getInstance();

export const quickPayResolver = {
  Query: {
    getQuickPayList: graphQLHandler({
      handler: quickPay.getQuickPayListHandler,
      validator: validateResponseQuickPayList,
    }),
    getQuickPayOrderItemsByOrderID: graphQLHandler({
      handler: quickPay.getQuickPayOrderItemsByOrderIDHandler,
      validator: validateResponseQuickPayOrderItemsByOrderID,
    }),
    getQuickPayCancelDetails: graphQLHandler({
      handler: quickPay.getQuickPayCancelDetailsHandler,
      validator: validateResponseQuickPayCancelDetails,
    }),
    getQuickPayPaymentDetails: graphQLHandler({
      handler: quickPay.getQuickPayPaymentDetailsHandler,
      validator: validateResponseQuickPayPaymentDetails,
    }),
  },
  Mutation: {
    saveQuickPay: graphQLHandler({
      handler: quickPay.saveQuickPayHandler,
      validator: validateResponseHTTPObject,
    }),
    saveQuickPayPayment: graphQLHandler({
      handler: quickPay.saveQuickPayPaymentHandler,
      validator: validateResponseHTTPObject,
    }),
    sendQuickPayToChatBox: graphQLHandler({
      handler: quickPay.sendQuickPayToChatBoxHandler,
      validator: validateResponseHTTPObject,
    }),
    quickPayPaymentCancel: graphQLHandler({
      handler: quickPay.quickPayPaymentCancelHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
