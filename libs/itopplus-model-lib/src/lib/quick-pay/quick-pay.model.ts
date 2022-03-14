import * as Joi from 'joi';
import { EnumPurchaseOrderStatus, IArgsTableCommonFilter } from '@reactor-room/itopplus-model-lib';
import gql from 'graphql-tag';

export enum QuickPayPaymenteStatusTypes {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
  EXPIRED = 'Expired',
  CANCELED = 'Canceled',
}

export enum QuickPayMessageTypes {
  NO_PAYMENT_METHOD = 'NO_PAYMENT_METHOD',
  QUICK_PAY_ALREADY_CANCEL = 'QUICK_PAY_ALREADY_CANCEL',
  QUICK_PAY_PAYMENT_SUCCESS = 'QUICK_PAY_PAYMENT_SUCCESS',
  QUICK_PAY_PAYMENT_ERROR = 'QUICK_PAY_PAYMENT_ERROR',
  QUICK_PAY_ALREADY_PAID = 'QUICK_PAY_ALREADY_PAID',
  QUICK_PAY_CANCEL_SUCCESS = 'QUICK_PAY_CANCEL_SUCCESS',
  QUICK_PAY_CANCEL_ERROR = 'QUICK_PAY_CANCEL_ERROR',
}

export enum QuickPayComponentTypes {
  TRANSACTION = 'TRANSACTION',
  NEW = 'NEW',
  DETAIL = 'DETAIL',
}
export interface IQuickPayList {
  id: number;
  totalPrice: number;
  tax: number;
  status: string;
  audienceID: number;
  discount: number;
  paymentMode: string;
  is_paid: boolean;
  is_cancel: boolean;
  createdAt: string;
  expiredAt: string;
  expired_at?: Date;
  isExpired: boolean;
  totalrows: number;
  description?: string;
  isWithHoldingTax?: boolean;
  withHoldingTax?: number;
}

export interface IQuickPayCancelDetails {
  id: number;
  isCancel: boolean;
  cancelReason: string;
  userName: string;
  updatedAt: Date;
}

export interface IQuickPayPaymentDetails {
  id: number;
  isPaid: boolean;
  paymentMethod: string;
  paidAmount: number;
  paidDate: string;
  paidTime: string;
  paidProof: string;
  isWithHoldingTax: boolean;
  withHoldingTax: number;
}
export interface IQuickPaySaveArgs {
  audienceID: number;
  vat: number;
  quickPayBillInput: IQuickPaySave;
}

export interface IQuickPayPaymentCancelArgs {
  id: number;
  description: string;
}

export interface IQuickPayListArgs extends IArgsTableCommonFilter {
  audienceID: number;
  customerID: number;
}

export interface IQuickPaySave {
  billItems: IQuickPayBillItem[];
  linkExpireValue: string;
  linkExpireDate: Date | string;
  isWithHoldingTax: boolean;
  withHoldingTax: number;
  total?: IQuickPayBillTotals;
}

export interface IQuickPayPaymentSaveArgs {
  id: number;
  quickPayPaymentInput: IQuickPayPaymentSave;
}

export interface ISendQuickPayToChatBoxArgs {
  quickPayID: number;
  audienceID: number;
  PSID: string;
}

export interface IQuickPayPaymentSave {
  method: string;
  bankAccountID: number;
  date: string;
  time: string;
  amount: string;
  slip: {
    file: File;
    url?: string;
    isURL: boolean;
  };
}

export interface IQuickPayPaymentSaveError {
  methodErrorMessage?: string;
  dateErrorMessage?: string;
  timeErrorMessage?: string;
  bankAccountIDErrorMessage?: string;
  amountErrorMessage?: string;
  fileErrorMessage?: string;
}

export interface IQuickPayBillItem {
  item: string;
  amount: number;
  discount: number;
  isVAT: boolean;
}

export interface IQuickPayBillTotals {
  discountTotal: number | string;
  amountTotal: number | string;
  vatTotal: number | string;
  grandTotal: number | string;
  withHoldingTaxTotal?: number | string;
}

export interface IPurchasingOrderQuickPayParams {
  total_price: number;
  tax: number;
  status: EnumPurchaseOrderStatus;
  page_id: number;
  audience_id: number;
  user_id: number;
  expired_at: Date | string;
  is_quickpay: boolean;
  discount: number;
  is_withholding_tax: boolean;
  withholding_tax: number;
  amount_total: number;
}

export interface IQuickPayOrderItems {
  id: number;
  purchaseOrderID: number;
  name: string;
  audienceID: number;
  itemPrice: number | string;
  discount: number | string;
  isVat: boolean;
}

export interface IPurchasingOrderItemsQuickPayParams {
  purchase_order_id: number;
  page_id: number;
  audience_id: number;
  item_price: number;
  item_quantity: number;
  is_vat: boolean;
  description: string;
  discount: number;
}

export interface QuickPayChatPreviewPayload {
  title: string;
  subTitle: string;
  quickPayID: number;
  audienceID: number;
  expiredAt: string;
  currency: string;
}

export interface IQuickPayOrderAndOrderItems {
  order: IQuickPayList;
  orderItems: IQuickPayOrderItems[];
  totals: IQuickPayBillTotals;
  isCancel: boolean;
  isPaid: boolean;
}

export const QuickPayTypeDefs = gql`
  "Quick Pay"
  type QuickPayListModel {
    id: Int
    totalPrice: Float
    tax: Float
    status: String
    audienceID: Int
    discount: Float
    is_paid: Boolean
    is_cancel: Boolean
    paymentMode: String
    createdAt: Date
    expiredAt: Date
    isExpired: Boolean
    totalrows: Int
    description: String
  }

  type QuickPayOrderItemsModel {
    id: Int
    purchaseOrderID: Int
    name: String
    audienceID: Int
    itemPrice: Float
    discount: Float
    isVat: Boolean
  }

  type QuickPayCancelModel {
    id: Int
    isCancel: Boolean
    cancelReason: String
    userName: String
    updatedAt: Date
  }

  type QuickPayPaymentModel {
    id: Int
    isPaid: Boolean
    paymentMethod: String
    paidAmount: Float
    paidDate: String
    paidTime: String
    paidProof: String
    isWithHoldingTax: Boolean
    withHoldingTax: Float
  }

  input QuickPayTotalsInput {
    discountTotal: Float
    amountTotal: Float
    vatTotal: Float
    grandTotal: Float
    withHoldingTaxTotal: Float
  }

  input QuickPayBillItemsInput {
    item: String
    amount: Float
    discount: Float
    isVAT: Boolean
  }

  input QuickPayBillSaveInput {
    billItems: [QuickPayBillItemsInput]
    total: QuickPayTotalsInput
    linkExpireValue: String
    linkExpireDate: String
    isWithHoldingTax: Boolean
    withHoldingTax: Float
  }

  input QuickPayPaymentInput {
    method: String
    bankAccountID: Int
    date: String
    time: String
    amount: String
    slip: QuickPayPaymentFileInput
  }

  input QuickPayPaymentFileInput {
    file: Upload
    url: String
    isURL: Boolean
  }

  extend type Query {
    getQuickPayList(audienceID: Int, customerID: Int, filters: TableFilterInput): [QuickPayListModel]
    getQuickPayOrderItemsByOrderID(id: Int): [QuickPayOrderItemsModel]
    getQuickPayCancelDetails(id: Int): QuickPayCancelModel
    getQuickPayPaymentDetails(id: Int): QuickPayPaymentModel
  }

  extend type Mutation {
    saveQuickPay(audienceID: Int, vat: Float, quickPayBillInput: QuickPayBillSaveInput): HTTPResult
    saveQuickPayPayment(id: Int, quickPayPaymentInput: QuickPayPaymentInput): HTTPResult
    sendQuickPayToChatBox(quickPayID: Int, audienceID: Int, PSID: String): HTTPResult
    quickPayPaymentCancel(id: Int, description: String): HTTPResult
  }
`;

export const quickPayBillItemsValidate = {
  item: Joi.string().required(),
  amount: Joi.number().required(),
  discount: Joi.number().required(),
  isVAT: Joi.boolean().required(),
};

export const quickPayListValidate = {
  id: Joi.number().required(),
  totalPrice: Joi.number().required(),
  tax: Joi.number().required(),
  status: Joi.string().required(),
  audienceID: Joi.number().required(),
  discount: Joi.number().required(),
  is_paid: Joi.boolean().required(),
  is_cancel: Joi.boolean().required(),
  paymentMode: Joi.string().allow(null),
  createdAt: Joi.string().required(),
  expiredAt: Joi.string().required(),
  isExpired: Joi.boolean().required(),
  totalrows: Joi.number().required(),
  description: Joi.string().allow(null),
};

export const quickPayPaymentCancelValidate = {
  id: Joi.number().required(),
  description: Joi.string().allow(null).allow(''),
};

export const sendQuickPayToChatBoxValidate = {
  quickPayID: Joi.number().required(),
  audienceID: Joi.number().required(),
  PSID: Joi.string().required(),
};

export const saveQuickPayValidate = {
  audienceID: Joi.number().required(),
  vat: Joi.number().required(),
  quickPayBillInput: {
    billItems: Joi.array().items(quickPayBillItemsValidate),
    total: Joi.object()
      .keys({
        discountTotal: Joi.number().required(),
        amountTotal: Joi.number().required(),
        vatTotal: Joi.number().required(),
        grandTotal: Joi.number().required(),
        withHoldingTaxTotal: Joi.number().required(),
      })
      .required(),
    linkExpireValue: Joi.string().required(),
    linkExpireDate: Joi.string().required(),
    isWithHoldingTax: Joi.boolean().required(),
    withHoldingTax: Joi.number().required(),
  },
};

export const saveQuickPayPaymentValidate = {
  id: Joi.number().required(),
  quickPayPaymentInput: {
    method: Joi.string().required(),
    bankAccountID: Joi.number().required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    amount: Joi.number().required(),
    slip: {
      file: Joi.any(),
      url: Joi.string().allow(null).allow(''),
      isURL: Joi.boolean().required(),
    },
  },
};

export const quickPayOrderItemsByOrderIDValidate = {
  id: Joi.number().required(),
  purchaseOrderID: Joi.number().required(),
  name: Joi.string().required().allow(null),
  audienceID: Joi.number().required(),
  itemPrice: Joi.number().required(),
  discount: Joi.number().required(),
  isVat: Joi.boolean().required(),
};

export const quickPayCancelDetailsValidate = {
  id: Joi.number().required(),
  isCancel: Joi.boolean().required(),
  cancelReason: Joi.string().allow('').allow(null),
  userName: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const quickPayPaymentDetailsValidate = {
  id: Joi.number().required(),
  isPaid: Joi.boolean().required(),
  paymentMethod: Joi.string().allow('').allow(null),
  paidAmount: Joi.string().allow('').allow(null),
  paidDate: Joi.string().allow('').allow(null),
  paidTime: Joi.string().allow('').allow(null),
  paidProof: Joi.string().allow('').allow(null),
  isWithHoldingTax: Joi.boolean().allow('').allow(null),
  withHoldingTax: Joi.number().allow('').allow(null),
};
