import {
  EnumLeadPayloadType,
  EnumPurchasingPayloadType,
  IFacebookPipelineStepElementButtons,
  IFacebookPipelineStepTemplateType,
  IFormPayloadData,
  ILineLiffResponse,
  ILineMessageType,
  IPayloadContainer,
  ISendCatalogChatBoxOptions,
  LeadPayloadOption,
  LeadPayloadParams,
  PayloadParams,
  ProductMessagePayload,
  QuickPayChatPreviewPayload,
  ViewRenderType,
} from '@reactor-room/itopplus-model-lib';
import { FacebookPayloadError } from '../../errors';
import { sendProductCatalog } from './catalog/send-product-catalog';
import {
  checkOut2C2PPaymentTemplate,
  checkOutOmisePaymentTemplate,
  checkOutPaypalPaymentTemplate,
  combineLogisticPaymentSelector,
  leadCustomForm,
  orderSendMultipleProduct,
  orderSendSingleProduct,
  sendMessagePayload,
  sendMessagePostPurchaseUpdatePayload,
  sendQuickPayPreview,
} from './facebook-steps/';

export function getPayloadByStep(step: EnumPurchasingPayloadType, payload: PayloadParams, viewType: ViewRenderType, option?): IPayloadContainer[] {
  try {
    switch (step) {
      case EnumPurchasingPayloadType.CONFIRM_ORDER: {
        return [
          // {
          //   name: 'receiptMessagePayload',
          //   json: receiptMessagePayload(payload, option.receipt as ReceiptDetail),
          // },
          {
            name: 'combineLogisticPaymentSelector',
            json: combineLogisticPaymentSelector(payload, option.combineLogisticPaymentMessages, viewType),
          },
        ];
      }

      case EnumPurchasingPayloadType.UPDATE_CART: {
        return [
          {
            name: 'sendMessagePayload',
            json: sendMessagePayload(payload, 'Shipping ฿0'),
          },
          // {
          //   name: 'receiptMessagePayload',
          //   json: receiptMessagePayload(payload, option.receipt as ReceiptDetail),
          // },
          {
            name: 'combineLogisticPaymentSelector',
            json: combineLogisticPaymentSelector(payload, option.combineLogisticPaymentMessages, viewType),
          },
        ];
      }

      case EnumPurchasingPayloadType.SEND_BANK_ACCOUNT: {
        return [
          {
            name: 'sendMessagePayload',
            json: option.receipt.flatRate ? sendMessagePayload(payload, 'Shipping ฿' + option.receipt.flatPrice) : ({} as IFormPayloadData),
          },
          // {
          //   name: 'receiptMessagePayload',
          //   json: receiptMessagePayload(payload, option.receipt as ReceiptDetail),
          // },
        ];
      }

      case EnumPurchasingPayloadType.SEND_RECEIPT: {
        return [
          {
            name: 'sendMessagePayload',
            json: option.receipt.flatRate ? sendMessagePayload(payload, 'Shipping ฿' + option.receipt.flatPrice) : ({} as IFormPayloadData),
          },
          // {
          //   name: 'receiptMessagePayload',
          //   json: receiptMessagePayload(payload, option.receipt as ReceiptDetail),
          // },
        ];
      }

      case EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT: {
        return [
          {
            name: 'combineLogisticPaymentSelector',
            json: combineLogisticPaymentSelector(payload, option.combineLogisticPaymentMessages, viewType),
          },
        ];
      }
      case EnumPurchasingPayloadType.REPEAT_SEND_CHECKOUT: {
        switch (option.repeatOn) {
          case EnumPurchasingPayloadType.SEND_BANK_ACCOUNT:
            return [{ name: 'sendMessagePayload', json: sendMessagePayload(payload, option.message.title) }];
          case EnumPurchasingPayloadType.CHECKOUT_PAYPAL:
            return [{ name: 'checkOutPaypalPaymentTemplate', json: checkOutPaypalPaymentTemplate(payload, option.checkoutMessage, viewType) }];
          case EnumPurchasingPayloadType.CHECKOUT_2C2P:
            return [{ name: 'checkOut2C2PPaymentTemplate', json: checkOut2C2PPaymentTemplate(payload, option.checkoutMessage, viewType) }];
          case EnumPurchasingPayloadType.CHECKOUT_OMISE:
            return [{ name: 'checkOutOmisePaymentTemplate', json: checkOutOmisePaymentTemplate(payload, option.checkoutMessage, viewType) }];
        }
        break;
      }
      case EnumPurchasingPayloadType.CHECKOUT_PAYPAL:
        return [{ name: 'checkOutPaypalPaymentTemplate', json: checkOutPaypalPaymentTemplate(payload, option.checkoutMessage, viewType) }];
      case EnumPurchasingPayloadType.CHECKOUT_2C2P:
        return [{ name: 'checkOut2C2PPaymentTemplate', json: checkOut2C2PPaymentTemplate(payload, option.checkoutMessage, viewType) }];
      case EnumPurchasingPayloadType.CHECKOUT_OMISE:
        return [{ name: 'checkOutOmisePaymentTemplate', json: checkOutOmisePaymentTemplate(payload, option.checkoutMessage, viewType) }];
      case EnumPurchasingPayloadType.SEND_TRACKING_NUMBER:
      case EnumPurchasingPayloadType.SEND_TRACKING_NUMBER_COD: {
        const track = option as string;
        return [
          {
            name: 'sendMessagePostPurchaseUpdatePayload',
            json: sendMessagePostPurchaseUpdatePayload(payload, track),
          },
        ];
      }
      case EnumPurchasingPayloadType.SELECT_SINGLE_PRODUCT: {
        return [
          {
            name: 'orderSendSingleProduct',
            json: orderSendSingleProduct(payload, option as ProductMessagePayload, viewType),
          },
        ];
      }
      case EnumPurchasingPayloadType.SELECT_MULTIPLE_PRODUCT: {
        return [
          {
            name: 'orderSendMultipleProduct',
            json: orderSendMultipleProduct(payload, option as ProductMessagePayload, viewType),
          },
        ];
      }
      case EnumPurchasingPayloadType.QUICK_PAY_PAYMENT_PREVIEW: {
        return [
          {
            name: 'sendQuickPayPreview',
            json: sendQuickPayPreview(payload, option as QuickPayChatPreviewPayload, viewType),
          },
        ];
      }
      case EnumPurchasingPayloadType.SEND_PRODUCT_CATALOG: {
        return [
          {
            name: 'sendProductCatalog',
            json: sendProductCatalog(payload, option as ISendCatalogChatBoxOptions, viewType),
          },
        ];
      }

      default: {
        console.log('!!!!!!!! !!!!!!!!! Unexpected Payload Request Unexpected Payload Request Unexpected Payload Request !!!!!!!! !!!!!!!!!');
        // TODO : Unexpected Payload Request --> Sentry
        throw new Error('Unexpected Payload Request');
      }
    }
  } catch (err) {
    console.log('FacebookPayloadError Error On Step: ', step);
    throw new FacebookPayloadError(err, step);
  }
}

export function getLeadsPayload(type: EnumLeadPayloadType, payload: LeadPayloadParams, viewType: ViewRenderType, option?: LeadPayloadOption): IPayloadContainer[] {
  try {
    switch (type) {
      case EnumLeadPayloadType.CUSTOM_FORM:
      default: {
        return [{ name: 'leadCustomForm', json: leadCustomForm(payload, option, viewType) }];
      }
    }
  } catch (err) {
    throw new FacebookPayloadError(err, type);
  }
}

export function getConvertedFacebookPayloadToLineFlexTemplate(
  payload: IPayloadContainer,
  template_type: IFacebookPipelineStepTemplateType,
  viewType: EnumLeadPayloadType | EnumPurchasingPayloadType,
  lineLiff: ILineLiffResponse,
  lineLiffKey: string,
): {
  textMessage: string;
  lineMessageType: ILineMessageType;
  attachmentPayload: any;
} {
  let textMessage = '';
  let lineMessageType = ILineMessageType.TEXT_MESSAGE;
  let attachmentPayload = {};
  switch (template_type) {
    case IFacebookPipelineStepTemplateType.BUTTON:
      {
        if (viewType === EnumPurchasingPayloadType.QUICK_PAY_PAYMENT_PREVIEW) {
          attachmentPayload = {
            template_type: payload.json.message.attachment.payload.template_type,
            buttons: payload.json.message.attachment.payload.elements[0].buttons,
          };
          lineMessageType = ILineMessageType.FLEX_MESSAGE_BUTTON_WEBAPP;
          textMessage = `${lineLiffKey}/${lineLiff.liffId}?${payload.json.message.attachment.payload.elements[0].buttons[0].url.split('?')[1]}`;
        } else {
          attachmentPayload = {
            template_type: payload.json.message.attachment.payload.template_type,
            buttons: payload.json.message.attachment.payload.buttons as IFacebookPipelineStepElementButtons[],
          };
          lineMessageType =
            viewType === EnumPurchasingPayloadType.SELECT_SINGLE_PRODUCT
              ? ILineMessageType.FLEX_MESSAGE_BUBBLE_MESSAGE_SINGLE_PRODUCT
              : ILineMessageType.FLEX_MESSAGE_BUTTON_WEBAPP;
          textMessage = `${lineLiffKey}/${lineLiff.liffId}?${payload.json.message.attachment.payload.buttons[0].url.split('?')[1]}`;
        }
      }
      break;
    case IFacebookPipelineStepTemplateType.GENERIC:
      lineMessageType = ILineMessageType.TEXT_MESSAGE;
      textMessage = JSON.stringify(payload.json.message.text);
      break;
    case IFacebookPipelineStepTemplateType.MEDIA:
      break;
    case IFacebookPipelineStepTemplateType.RECEIPT:
      lineMessageType = ILineMessageType.FLEX_MESSAGE_BUBBLE_MESSAGE_RECEIPT;
      attachmentPayload = payload.json.message.attachment.payload;
      break;
    default:
      lineMessageType = ILineMessageType.TEXT_MESSAGE;
      textMessage = payload.json.message.text;
      break;
  }

  return {
    textMessage,
    lineMessageType,
    attachmentPayload,
  };
}
