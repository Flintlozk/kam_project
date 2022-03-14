import {
  EnumLeadPayloadType,
  EnumPurchasingPayloadType,
  ILineFlexMessage,
  ILineMessage,
  ILineMessageType,
  IMessageModelInput,
  IMessageType,
} from '@reactor-room/itopplus-model-lib';
import { isArray } from 'lodash';
import {
  bubbleTemplateMessageCustomerForm,
  bubbleTemplateMessageProduct,
  bubbleTemplateMessageRecomendSingleProduct,
  bubbleTemplateMessageSummary,
} from '../line-template/bubble-template-message';
import { carouselTemplateMessageReceipt } from '../line-template/carousel-template-message';

export const getRedisExpiredTime = (): number => {
  const seconds = 60,
    minutes = 60,
    hours = 24,
    days = 3;
  const expiredTime = seconds * minutes * hours * days;

  return expiredTime;
};

export function getMessageFormatByType(messagetype: IMessageType, message: IMessageModelInput): ILineMessage[] | string {
  let messageObj: ILineMessage;
  switch (messagetype) {
    case IMessageType.IMAGE:
      messageObj = {
        originalContentUrl: String(message.attachments[0].payload.url),
        previewImageUrl: String(message.attachments[0].payload.url),
        type: IMessageType.IMAGE,
      };
      break;
    case IMessageType.AUDIO:
      messageObj = { originalContentUrl: String(message.attachments[0].payload.url), duration: 1000, type: IMessageType.AUDIO };
      break;
    case IMessageType.VIDEO:
      messageObj = {
        originalContentUrl: String(message.attachments[0].payload.url),
        previewImageUrl: String(message.attachments[0].payload.url),
        trackingId: '111',
        type: IMessageType.VIDEO,
      };
      break;
    default:
      messageObj = { id: '0', text: message.text, type: IMessageType.TEXT };
      break;
  }

  const lineMessage: ILineMessage[] | string = isArray(message.text) ? message.text : [messageObj];
  return lineMessage;
}

export const getLineCustomerFromTemplateMessage = (messageType: ILineMessageType, message: string, option: ILineFlexMessage): string => {
  let summaryCard = {};
  const productlistCard = [];
  switch (messageType) {
    case ILineMessageType.FLEX_MESSAGE_BUTTON_WEBAPP:
      return JSON.stringify([
        bubbleTemplateMessageCustomerForm(option.button_webapp.template.title, option.button_webapp.template.text, message, option.button_webapp.template.actions[0].label),
      ]);
      break;
    case ILineMessageType.FLEX_MESSAGE_BUBBLE_MESSAGE_RECEIPT:
      summaryCard = bubbleTemplateMessageSummary(option.bubble_receipt);
      productlistCard.push(summaryCard);
      option.bubble_receipt.products.map((item) => {
        productlistCard.push(bubbleTemplateMessageProduct(item, option.bubble_receipt.updateDatetime));
      });
      return JSON.stringify([carouselTemplateMessageReceipt(productlistCard)]);
      break;
    case ILineMessageType.FLEX_MESSAGE_BUBBLE_MESSAGE_SINGLE_PRODUCT:
      return JSON.stringify([
        bubbleTemplateMessageRecomendSingleProduct(
          option.bubble_recommend_singleproduct.image,
          option.bubble_recommend_singleproduct.nameproduct,
          option.bubble_recommend_singleproduct.price,
          option.bubble_recommend_singleproduct.button,
          message,
        ),
      ]);
      break;
    default:
      return message;
      break;
  }
};

export const checkConvertMessage = (viewtype: EnumLeadPayloadType | EnumPurchasingPayloadType, messageText = null): string => {
  switch (viewtype) {
    case EnumLeadPayloadType.CUSTOM_FORM:
      return messageText;
    // case EnumPurchasingPayloadType.CONFIRM_ORDER:
    //   return 'กดปุ่ม "ยืนยัน" เพื่อดำเนินการสั่งซื้อ';
    case EnumPurchasingPayloadType.QUICK_PAY_PAYMENT_PREVIEW:
      return messageText;
    case EnumPurchasingPayloadType.SEND_TRACKING_NUMBER:
      return ''; // return empty string
    default:
      return messageText;
  }
};
