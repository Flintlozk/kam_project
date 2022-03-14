import type { IGQLContext, IPayload, IPaymentOmiseOption, ReturnAddBankAccount, SettingPaymentResponse } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import {
  Payment2C2PService,
  PaymentBankAccountService,
  PaymentCashOnDeliveryService,
  PaymentOmiseService,
  PaymentPaypalService,
  PaymentService,
  PlusmarService,
} from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { requireAdmin, requirePackageValidation } from '../../domains/plusmar';
import { validateRequestPageID } from '../../schema/common';
import {
  validateRequestPaymentSetting2C2P,
  validateRequestPaymentSettingBankAccount,
  validateRequestPaymentSettingBankAccountStatus,
  validateRequestPaymentSettingCOD,
  validateRequestPaymentSettingOmise,
  validateRequestPaymentSettingPaypal,
  validateRequestPaymentSettingUpdateBankAccount,
  validateResponseOmisePaymentOptions,
  validateResponsePayment,
  validateResponsePaymentSetting,
  validateResponsGetBankAccountList,
} from '../../schema/payment/payment.schema';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.CMS])
class Payment {
  public static instance;
  public static paymentService: PaymentService;
  public static paymentPaypalService: PaymentPaypalService;
  public static payment2C2PService: Payment2C2PService;
  public static paymentOmiseService: PaymentOmiseService;
  public static paymentCashOnDeliveryService: PaymentCashOnDeliveryService;
  public static paymentBankAccountService: PaymentBankAccountService;
  public static getInstance() {
    if (!Payment.instance) Payment.instance = new Payment();
    return Payment.instance;
  }

  constructor() {
    Payment.paymentService = new PaymentService();
    Payment.paymentPaypalService = new PaymentPaypalService();
    Payment.payment2C2PService = new Payment2C2PService();
    Payment.paymentOmiseService = new PaymentOmiseService();
    Payment.paymentCashOnDeliveryService = new PaymentCashOnDeliveryService();
    Payment.paymentBankAccountService = new PaymentBankAccountService();
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async togglePaymentByTypeHandler(parent, args, context: IGQLContext): Promise<SettingPaymentResponse> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Payment.paymentService.togglePaymentByType(pageID, args.type);
  }
  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  updateCODHandler(parent, args, context: IGQLContext) {
    const codDetail = validateRequestPaymentSettingCOD(args.codDetail);
    return Payment.paymentCashOnDeliveryService.updateCOD(context.payload, codDetail);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  updatePaypalHandler(parent, args, context: IGQLContext) {
    const paypalDetail = validateRequestPaymentSettingPaypal(args.paypalDetail);
    return Payment.paymentPaypalService.updatePaypal(context.payload, paypalDetail, PlusmarService.environment.paypalOauthApi);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async update2C2PHandler(parent, args, context: IGQLContext): Promise<SettingPaymentResponse> {
    const payment2c2pDetail = validateRequestPaymentSetting2C2P(args.payment2c2pDetail);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Payment.payment2C2PService.updatePayment2C2P(pageID, payment2c2pDetail);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateOmiseHandler(parent, args, context: IGQLContext): Promise<SettingPaymentResponse> {
    const omiseDetail = validateRequestPaymentSettingOmise(args.omiseDetail);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Payment.paymentOmiseService.updateOmise(pageID, omiseDetail);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  addBankAccountHandler(parent, args, context: IGQLContext) {
    const bankAccount = validateRequestPaymentSettingBankAccount(args.bankAccount);
    return Payment.paymentBankAccountService.addBankAccount(context.payload, bankAccount);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  updateBankAccountHandler(parent, args, context: IGQLContext) {
    const validArgs = validateRequestPaymentSettingUpdateBankAccount(args);
    return Payment.paymentBankAccountService.updateBankAccount(context.payload, validArgs.bankAccountId, validArgs.bankAccount);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async toggleBankAccountStatusHandler(parent, args, context: IGQLContext) {
    const data = await validateRequestPaymentSettingBankAccountStatus(args);
    return Payment.paymentBankAccountService.toggleBankAccountStatus(context.payload, data.bankAccountId);
  }

  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async removeBankAccountHandler(parent, args, context: IGQLContext) {
    const data = await validateRequestPaymentSettingBankAccountStatus(args);
    return Payment.paymentBankAccountService.removeBankAccount(context.payload, data.bankAccountId);
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  getBankAccountListHandler(parent, args, context: IGQLContext): Promise<ReturnAddBankAccount[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = Payment.paymentBankAccountService.getBankAccountList(pageID);
    return result;
  }
  // Query

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPaymentListHandler(parent, args, context: IGQLContext) {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Payment.paymentService.getPaymentList(pageID);
    return result;
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPaymentListByLogisticHandler(parent, args: { audienceID: number; logisticID: number }, context: IGQLContext) {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Payment.paymentService.getPaymentListByLogistic(pageID, args.audienceID, args.logisticID);
  }

  async getOmisePaymentCapabilityHandler(parent, args, context: IGQLContext): Promise<IPaymentOmiseOption> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Payment.paymentOmiseService.getOmisePaymentCapability(pageID);
    return result;
  }

  async validateOmiseAccountAndGetCapabilityHandler(parent, args, context: IGQLContext): Promise<IPaymentOmiseOption> {
    const omiseDetail = validateRequestPaymentSettingOmise(args.omiseDetail);
    const result = await Payment.paymentOmiseService.validateOmiseAccountAndGetCapability(omiseDetail);
    return result;
  }
}

const payment: Payment = Payment.getInstance();
export const paymentResolver = {
  Mutation: {
    togglePaymentByType: graphQLHandler({
      handler: payment.togglePaymentByTypeHandler,
      validator: validateResponsePaymentSetting,
    }),

    updateCOD: graphQLHandler({
      handler: payment.updateCODHandler,
      validator: validateResponsePayment,
    }),
    updatePaypal: graphQLHandler({
      handler: payment.updatePaypalHandler,
      validator: validateResponsePayment,
    }),
    update2C2P: graphQLHandler({
      handler: payment.update2C2PHandler,
      validator: validateResponsePaymentSetting,
    }),
    updateOmise: graphQLHandler({
      handler: payment.updateOmiseHandler,
      validator: validateResponsePaymentSetting,
    }),
    addBankAccount: graphQLHandler({
      handler: payment.addBankAccountHandler,
      validator: validateResponsePayment,
    }),
    updateBankAccount: graphQLHandler({
      handler: payment.updateBankAccountHandler,
      validator: validateResponsePayment,
    }),
    toggleBankAccountStatus: graphQLHandler({
      handler: payment.toggleBankAccountStatusHandler,
      validator: validateResponsePayment,
    }),
    removeBankAccount: graphQLHandler({
      handler: payment.removeBankAccountHandler,
      validator: validateResponsePayment,
    }),
  },
  Query: {
    getPaymentList: graphQLHandler({
      handler: payment.getPaymentListHandler,
      validator: validateResponsePayment,
    }),
    getPaymentListByLogistic: graphQLHandler({
      handler: payment.getPaymentListByLogisticHandler,
      validator: validateResponsePayment,
    }),
    getBankAccountList: graphQLHandler({
      handler: payment.getBankAccountListHandler,
      validator: validateResponsGetBankAccountList,
    }),
    getOmisePaymentCapability: graphQLHandler({
      handler: payment.getOmisePaymentCapabilityHandler,
      validator: validateResponseOmisePaymentOptions,
    }),
    validateOmiseAccountAndGetCapability: graphQLHandler({
      handler: payment.validateOmiseAccountAndGetCapabilityHandler,
      validator: validateResponseOmisePaymentOptions,
    }),
  },
};
