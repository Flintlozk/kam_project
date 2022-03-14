import * as Joi from 'joi';
import gql from 'graphql-tag';
import { IPipelineBankAccountDetail, IPipelinePaymentDetail } from '../pipeline/pipeline.model';
import { EnumHandleResponseMessageType } from '../purchase-order/purchase-order.enum';
import { EnumBankAccountType, EnumOmiseChargeWatchType, EnumPaymentType } from './payment.enum';

// export interface IPaymentRedisMessage {
//   unqiueKey: number;
//   createAt: Date;
//   messageStatus: EnumPaymentMessageStatus;
//   messageType: EnumPaymentType;
//   messageDetail?: string;
// }
export interface IBankAccount {
  id?: number;
  branchName?: string;
  bankStatus?: boolean;
  accountName?: string;
  accountId?: string;
  bankType?: string;
  bankCreatedAt?: Date;
  bankUpdatedAt?: Date;
}

export interface IPaymentOption {
  BANK_ACCOUNT: [IBankAccount];
  CASH_ON_DELIVERY: CashOnDeliveryDetail;
  PAYPAL: PaypalDetail;
  PAYMENT_2C2P: I2C2PPaymentModel;
  OMISE: IOmiseDetail;
}
export interface IPayment {
  id: number;
  name: string;
  logo?: string;
  account?: IPaymentAccount;
  status: boolean;
  type: EnumPaymentType;
  createdAt: Date;
  updatedAt: Date;
  option?: IPaymentOption;
}

export interface PaymentDetail extends IPipelinePaymentDetail {
  // id: number;
  // type: EnumPaymentType;
  // page_id: number;
  // name: string;
  // status: boolean;
  // created_at: Date;
  // updated_at: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option?: any;
}
export interface BankAccountDetail extends IPipelineBankAccountDetail {
  // bank_id: number;
  // branch_name: string;
  // account_name: string;
  // account_id: string;
  // bank_type: string;
  // bank_status: boolean;
  // bank_created_at: Date;
  // bank_updated_at: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option?: any;
}

export interface IPaymentAccount {
  holder: number;
  number: string;
}

export interface SettingPaymentResponse {
  status: number;
  message: string;
}

export interface BankAccount {
  bankType: string;
  branchName: string;
  accountId: string;
  accountName: string;
}
export interface CashOnDeliveryDetail {
  feePercent: string;
  feeValue: string;
  minimumValue: string;
  createMode?: boolean;
}
export interface ThemeWithCodDetail {
  cod: CashOnDeliveryDetail;
  theme?: string;
}
export interface PaypalDetail {
  clientId: string;
  clientSecret: string;
  feePercent: string;
  feeValue: string;
  minimumValue: string;
  createMode?: boolean;
}
export interface ThemeWithPaypalDetail {
  paypal: PaypalDetail;
  theme?: string;
}

export interface IPaypalAmount {
  currency_code: string;
  value: string;
}

export interface IPaypalPayee {
  email_address: string;
  merchant_id: string;
}

export interface IPaypalName {
  full_name?: string;
  given_name?: string;
  surname?: string;
}

export interface IPaypalAddress {
  address_line_1: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}

export interface IPaypalShipping {
  name: IPaypalName;
  address: IPaypalName;
}

export interface IPaypalStatusDetails {
  reason: string;
}

export interface IPaypalSellerProtection {
  status: string;
  dispute_categories: string[];
}

export interface IPaypalLink {
  href: string;
  rel: string;
  method: string;
}

export interface IPaypalCapture {
  id: string;
  status: string;
  status_details: IPaypalStatusDetails;
  amount: IPaypalAmount;
  final_capture: boolean;
  seller_protection: IPaypalSellerProtection;
  custom_id: string;
  links: IPaypalLink[];
  create_time: Date;
  update_time: Date;
}

export interface IPaypalPayments {
  captures: IPaypalCapture[];
}

export interface IPaypalPurchaseUnit {
  reference_id: string;
  amount: IPaypalAmount;
  payee: IPaypalPayee;
  description: string;
  custom_id: string;
  soft_descriptor: string;
  shipping: IPaypalShipping;
  payments: IPaypalPayments;
}
export interface IPaypalPayer {
  name: IPaypalName;
  email_address: string;
  payer_id: string;
  address: IPaypalAddress;
}

export interface IPaypalPaymentResponse {
  id: string;
  intent: string;
  status: string;
  purchase_units: IPaypalPurchaseUnit[];
  payer: IPaypalPayer;
  create_time: Date;
  update_time: Date;
  links: IPaypalLink[];
}

export interface IOmiseDetail {
  publicKey: string;
  secretKey: string;
  option: IPaymentOmiseOption;
  createMode?: boolean;
}
export interface ThemeWithIOmiseDetail {
  omise: IOmiseDetail;
  theme: string;
}

export interface IOmisePaymentMetaData {
  source: EnumOmiseSourceType;
  poID: number;
  audienceID: string;
  psid: string;
  responseType: EnumHandleResponseMessageType;
  amount: number;
  currency: string;
}

export enum EnumOmiseSourceType {
  PROMPTPAY = 'promptpay',
  INTERNET_BANKING_SCB = 'internet_banking_scb',
  INTERNET_BANKING_BAY = 'internet_banking_bay',
  INTERNET_BANKING_BBL = 'internet_banking_bbl',
  INTERNET_BANKING_KBT = 'internet_banking_ktb',
  CREDIT_CARD = 'credit_card',
}
export interface I2C2PPaymentModel {
  merchantID: string;
  createMode?: boolean;
  secretKey: string;
}

export interface ReturnAddBankAccount {
  id: number;
  branch_name: string;
  account_name: string;
  account_id: string;
  status: boolean;
  type: EnumBankAccountType;
  image?: string;
}

export interface IPaymentOmiseResponse {
  data: IPaymentOmiseData;
  key: string;
}

export interface IPaymentOmiseSource {
  object: string;
  id: string;
  charge_status: string;
}

export interface IPaymentOmiseData {
  id: string;
  status: string;
}

export enum IOmiseChargeStatus {
  CHARGE_FAILED = 'failed',
  CHARGE_PENDING = 'pending',
}

export interface IOmiseChargeDetail {
  object: string;
  id: string;
  amount: number;
  status: string;
  paid: boolean;
  expired: boolean;
  failure_code: string;
  failure_message: string;
  expires_at: Date;
  source: {
    scannable_code: {
      image: string;
    };
    charge_status: string;
  };
  card?: {
    object: string;
  };
  authorize_uri?: string;
  metadata: IOmisePaymentMetaData;
  watchType: EnumOmiseChargeWatchType;
}

export interface IOmiseSourceDetail {
  object: string;
  id: string;
  amount: number;
  type: string;
}

export interface IOmisePaymentMethod {
  object: string;
  name: string;
  currency: string[];
  card_brands?: string[];
  installment_terms?: number[];
}

export interface IOmiseCapability {
  object: string;
  banks: string[];
  payment_methods: IOmisePaymentMethod[];
}

export interface IPaymentOmiseOption {
  creditCard: boolean;
  qrCode: boolean;
}

export const PaymentTypeDefs = gql`
  type ReturnAddBankAccount {
    id: Int
    branch_name: String
    account_name: String
    account_id: String
    status: Boolean
    type: EnumBankAccountType
  }

  type PaymentModelBankAccount {
    id: Int
    branchName: String
    accountName: String
    bankStatus: Boolean
    accountId: String
    bankType: EnumBankAccountType
    bankCreatedAt: Date
    bankUpdatedAt: Date
  }

  type PaymentModelCOD {
    feePercent: String
    feeValue: String
    minimumValue: String
  }

  type PaymentModelPaypal {
    clientId: String
    clientSecret: String
    feePercent: String
    feeValue: String
    minimumValue: String
  }

  type PaymentModel2C2P {
    merchantID: String
    secretKey: String
  }

  type PaymentModelOmise {
    publicKey: String
    secretKey: String
    option: PaymentOmiseOption
  }

  type PaymentModelOption {
    BANK_ACCOUNT: [PaymentModelBankAccount]
    CASH_ON_DELIVERY: PaymentModelCOD
    PAYPAL: PaymentModelPaypal
    PAYMENT_2C2P: PaymentModel2C2P
    OMISE: PaymentModelOmise
  }

  "Payment Schema"
  type PaymentModel {
    _id: String
    id: Int
    status: Boolean
    type: EnumPaymentType
    account: PaymentAccount
    createdAt: Date
    updatedAt: Date
    option: PaymentModelOption
  }

  type PaymentAccount {
    holder: String
    number: String
  }

  type OmisePaymentMethod {
    object: String
    name: String
    currency: [String]
  }

  type OmiseCapability {
    object: String
    banks: [String]
    payment_methods: [OmisePaymentMethod]
  }

  type PaymentOmiseOption {
    creditCard: Boolean
    qrCode: Boolean
  }

  enum EnumPaymentType {
    BANK_ACCOUNT
    CASH_ON_DELIVERY
    QR_PAYMENT_KBANK
    PAYPAL
    PAY_SOLUTION
    PAYMENT_2C2P
    OMISE
  }

  enum EnumBankAccountType {
    KBANK
    SCB
    KTB
    BBL
    TMB
    GSB
    BAY
  }

  type SettingPaymentResponse {
    status: Int
    message: String
  }

  input PaymentInput {
    name: String
    logo: String
    account: PaymentAccountInput
  }

  input PaymentAccountInput {
    holder: ID
    number: String
  }

  input PaymentDetail {
    option1: String
    option2: String
    option3: String
    additionalFee: PaymentDetailAdditionalFee
    mininumPaymentAccpeted: Float
  }

  input PaymentDetailAdditionalFee {
    fee1: Float
    fee2: Float
  }

  input BankAccountInput {
    bankType: String
    branchName: String
    accountId: String
    accountName: String
    status: Boolean
  }

  input CODInput {
    feePercent: String
    feeValue: String
    minimumValue: String
  }
  input PaypalInput {
    clientId: String
    clientSecret: String
    feePercent: String
    feeValue: String
    minimumValue: String
  }

  input Payment2C2PInput {
    merchantID: String
    secretKey: String
  }

  input OmiseInput {
    publicKey: String
    secretKey: String
    option: String
  }

  extend type Query {
    getPaymentList: [PaymentModel]
    getPaymentListByLogistic(audienceID: Int, logisticID: Int): [PaymentModel]
    getBankAccountList: [ReturnAddBankAccount]
    getOmisePaymentCapability: PaymentOmiseOption
    validateOmiseAccountAndGetCapability(omiseDetail: OmiseInput): PaymentOmiseOption
  }

  extend type Mutation {
    add(payment: PaymentInput): PaymentModel
    addBankAccount(bankAccount: BankAccountInput): ReturnAddBankAccount
    updateBankAccount(bankAccountId: Int, bankAccount: BankAccountInput): ReturnAddBankAccount
    updateCOD(codDetail: CODInput): SettingPaymentResponse
    updatePaypal(paypalDetail: PaypalInput): SettingPaymentResponse
    update2C2P(payment2c2pDetail: Payment2C2PInput): SettingPaymentResponse
    updateOmise(omiseDetail: OmiseInput): SettingPaymentResponse

    togglePaymentByType(type: EnumPaymentType): SettingPaymentResponse
    toggleBankAccountStatus(bankAccountId: Int): SettingPaymentResponse
    updatePaymentDetail(form: PaymentDetail, type: String): SettingPaymentResponse

    removeBankAccount(bankAccountId: Int): SettingPaymentResponse
  }
`;

export const PaymentSettingUpdateBankAccountValidate = {
  bankAccountId: Joi.number().required(),
  bankAccount: Joi.object().keys({
    bankType: Joi.string().required(),
    branchName: Joi.string().required(),
    accountId: Joi.string().required(),
    accountName: Joi.string().required(),
  }),
};

export const PaymentSettingBankAccountValidate = {
  bankType: Joi.string().required(),
  branchName: Joi.string().required(),
  accountId: Joi.string().required(),
  accountName: Joi.string().required(),
};

export const PaymentSettingBankAccountStatusValidate = {
  bankAccountId: Joi.number().required(),
};

export const PaymentSettingCODValidate = {
  feePercent: Joi.string().optional().allow(null),
  feeValue: Joi.string().optional().allow(null),
  minimumValue: Joi.string().required(),
};
export const PaymentSettingPaypalValidate = {
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
  feePercent: Joi.string().required(),
  feeValue: Joi.string().required(),
  minimumValue: Joi.string().required(),
};

export const PaymentSetting2C2PValidate = {
  merchantID: Joi.string().required(),
  secretKey: Joi.string().required(),
};

export const PaymentSettingOmiseValidate = {
  publicKey: Joi.string().required(),
  secretKey: Joi.string().required(),
  option: Joi.string().allow(null),
};

export const RetuenAddBankAccountValidate = {
  id: Joi.number().required(),
  branch_name: Joi.string().required(),
  account_name: Joi.string().required(),
  account_id: Joi.string().required(),
  type: Joi.string().required(),
  status: Joi.boolean().required(),
};

export const OmisePaymentMethodValidate = {
  creditCard: Joi.boolean().required(),
  qrCode: Joi.boolean().required(),
};

export const SettingPaymentResponseValidate = {
  status: Joi.number().required(),
  message: Joi.string().required(),
};
