import { FacebookMessageTagEvent, FacebookMessagingType, IFacebookMessagePayloadTypeEnum, IFormPayloadData } from '@reactor-room/itopplus-model-lib';

// * FacebookMessagingType.RESPONSE
export function sendMessagePayload({ PSID }: { PSID: string }, text: string): IFormPayloadData {
  return {
    recipient: { id: PSID },
    message: {
      text: text,
    },
    messaging_type: FacebookMessagingType.RESPONSE,
  };
}
export function sendPrivateMessagePayload(commentID: string, text: string): IFormPayloadData {
  return {
    recipient: { comment_id: commentID },
    message: {
      text: text,
    },
    messaging_type: FacebookMessagingType.RESPONSE,
  };
}
export function sendAttachmentMessagePayload(PSID: string, type: IFacebookMessagePayloadTypeEnum, attachment_id: string, url: string, filename: string): IFormPayloadData {
  // const payload = type === 'image' ? { attachment_id } : { attachment_id };
  return {
    messaging_type: FacebookMessagingType.RESPONSE,
    recipient: {
      id: PSID,
    },
    message: {
      attachment: {
        type: type,
        payload: { attachment_id },
      },
      metadata: filename?.substring(0, 1000),
    },
  };
}

// * FacebookMessagingType.MESSAGE_TAG
export function sendMessageTagPayload({ PSID }: { PSID: string }, text: string): IFormPayloadData {
  return {
    recipient: { id: PSID },
    message: {
      text: text,
    },
    messaging_type: FacebookMessagingType.RESPONSE,
    // tag: FacebookMessageTagEvent.ACCOUNT_UPDATE,
  };
}
export function sendMessagePostPurchaseUpdatePayload({ PSID }: { PSID: string }, text: string): IFormPayloadData {
  return {
    recipient: { id: PSID },
    message: {
      text: text,
    },
    messaging_type: FacebookMessagingType.MESSAGE_TAG,
    tag: FacebookMessageTagEvent.POST_PURCHASE_UPDATE,
  };
}
export function sendMessageConfirmEventUpdatePayload({ PSID }: { PSID: string }, text: string): IFormPayloadData {
  return {
    recipient: { id: PSID },
    message: {
      text: text,
    },
    messaging_type: FacebookMessagingType.MESSAGE_TAG,
    tag: FacebookMessageTagEvent.CONFIRMED_EVENT_UPDATE,
  };
}
