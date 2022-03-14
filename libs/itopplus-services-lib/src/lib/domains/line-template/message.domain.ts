import { environmentLib } from '@reactor-room/environment-services-backend';
import { decodeFileName, transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumLeadPayloadType,
  EnumPurchasingPayloadType,
  IAttachmentsModel,
  IFacebookMessagePayloadTypeEnum,
  IFormPayloadData,
  ILineFlexMessage,
  ILineFlexMessageButtonWebAppTemplate,
  ILineMessage,
  ILineReplyMessage,
  IMessageModelInput,
  IMessageType,
  IPayloadContainer,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { isArray } from 'lodash';

export const getPayload = (replyToken: string, message: IMessageModelInput, subscriptionID: string): ILineReplyMessage => {
  message.text = message.text !== null ? JSON.parse(message.text) : message.text;
  return {
    replyToken: replyToken,
    messages: getMessageFormatByType(message.messagetype, message, subscriptionID),
  } as ILineReplyMessage;
};

export const getMessageFormatByType = (messagetype: IMessageType, message: IMessageModelInput, subscriptionID: string): ILineMessage[] | string => {
  let lineMessage: ILineMessage[] | string = [];
  let messageObj: ILineMessage;
  switch (messagetype) {
    case IMessageType.IMAGE:
      messageObj = {
        originalContentUrl: transformMediaLinkString(String(message.attachments[0].payload.url), environmentLib.filesServer, subscriptionID).replace('/resize/', '/'),
        previewImageUrl: transformMediaLinkString(String(message.attachments[0].payload.url), environmentLib.filesServer, subscriptionID).replace('/resize/', '/'),
        type: IMessageType.IMAGE,
      };
      messageObj = decodeFileName(messageObj);
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
  lineMessage = isArray(message.text) ? message.text : [messageObj];
  return lineMessage;
};

export const setLineFormFlexMessage = (payload: IPayloadContainer, viewType: EnumLeadPayloadType | EnumPurchasingPayloadType): ILineFlexMessage => {
  const paramFlex = {
    bubble_receipt: null,
    button_webapp: null,
    bubble_recommend_singleproduct: null,
  } as ILineFlexMessage;
  switch (viewType) {
    case EnumLeadPayloadType.CUSTOM_FORM: {
      const options = payload.json as IFormPayloadData;
      const buttonTextTitle = options.message.attachment.payload.text;
      const buttonSubTitles = options.message.attachment.payload.buttons;

      paramFlex.button_webapp = {
        template: {
          title: 'Customer Info',
          text: buttonTextTitle,
          actions: buttonSubTitles.map((item) => {
            return { label: item.title };
          }),
        },
      } as ILineFlexMessageButtonWebAppTemplate;
      break;
    }
  }
  return paramFlex;
};

export const setLineQuickPayMessage = (payload: IPayloadContainer): ILineFlexMessage => {
  const paramFlex = {
    bubble_receipt: null,
    button_webapp: null,
    bubble_recommend_singleproduct: null,
  } as ILineFlexMessage;

  const options = payload.json as IFormPayloadData;
  const title = options.message.attachment.payload.elements[0].title;
  const text = options.message.attachment.payload.elements[0].subtitle;
  const buttonSubTitles = options.message.attachment.payload.elements[0].buttons;

  paramFlex.button_webapp = {
    template: {
      title,
      text,
      actions: buttonSubTitles.map((item) => {
        return { label: item.title };
      }),
    },
  } as ILineFlexMessageButtonWebAppTemplate;

  return paramFlex;
};

export const setLineFlexMessagePurchase = (payload: IPayloadContainer, payloadType: EnumPurchasingPayloadType): ILineFlexMessage => {
  const paramFlex = {
    bubble_receipt: null,
    button_webapp: null,
    bubble_recommend_singleproduct: null,
  } as ILineFlexMessage;

  switch (payloadType) {
    // TODO : case EnumPurchasingPayloadType.SELECT_MULTIPLE_PRODUCT | SELECT_SINGLE_PRODUCT: Handle this
    case EnumPurchasingPayloadType.REPEAT_SEND_CHECKOUT:
      paramFlex.button_webapp = {
        template: {
          title: '',
          text: payload.json.message.text,
          actions: null,
        },
      } as ILineFlexMessageButtonWebAppTemplate;

      break;
    case EnumPurchasingPayloadType.SELECT_SINGLE_PRODUCT:
      paramFlex.bubble_recommend_singleproduct = {
        nameproduct: payload.json.message.attachment.payload.elements[0].title,
        price: payload.json.message.attachment.payload.elements[0].subtitle,
        image: payload.json.message.attachment.payload.elements[0].image_url,
        button: 'Order',
        url: '',
      };
      break;
    case EnumPurchasingPayloadType.CHECKOUT_PAYPAL:
    case EnumPurchasingPayloadType.CHECKOUT_OMISE:
    case EnumPurchasingPayloadType.CHECKOUT_2C2P: {
      const options = payload.json;
      const buttonTextTitle = options.message.attachment.payload.text;
      const buttonSubTitles = options.message.attachment.payload.buttons;
      paramFlex.button_webapp = {
        template: {
          title: buttonTextTitle,
          text: buttonTextTitle,
          actions: buttonSubTitles.map((item) => {
            return { label: item.title };
          }),
        },
      } as ILineFlexMessageButtonWebAppTemplate;
      break;
    } // Order step 2
    case EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT: // Order step 2
    case EnumPurchasingPayloadType.CONFIRM_ORDER: {
      // Order step 1
      const options = payload.json;
      const buttonTextTitle = options.message.attachment.payload.text;
      const buttonSubTitles = options.message.attachment.payload.buttons;
      paramFlex.button_webapp = {
        template: {
          title: 'ยืนยันการสั่งซื้อ',
          text: buttonTextTitle,
          actions: buttonSubTitles.map((item) => {
            return { label: item.title };
          }),
        },
      } as ILineFlexMessageButtonWebAppTemplate;
      break;
    }
    case EnumPurchasingPayloadType.SEND_TRACKING_NUMBER: {
      // display as text
      break;
    }
    default: {
      break;
    }
  }
  return paramFlex;
};

export const setAttachments = (payload: string): IAttachmentsModel[] => {
  return [
    {
      type: IFacebookMessagePayloadTypeEnum.TEMPLATE,
      payload: payload,
    },
  ] as IAttachmentsModel[];
};

export const getMessageLineFormat = (message: string, payload: string, audienceID: number): IMessageModelInput => {
  return {
    object: 'line',
    text: message,
    audienceID,
    sentBy: MessageSentByEnum.PAGE,
    attachments: setAttachments(payload),
    createdAt: null,
    sender: {},
  } as IMessageModelInput;
};
