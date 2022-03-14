import {
  IAttachmentComment,
  ILineSourceType,
  IMessageModelInput,
  MessageReferral,
  MessageReferralSource,
  MessageReferralType,
  MessageSentByEnum,
  PostbackPayload,
  ReferralProductType,
  ReferralTypes,
} from '@reactor-room/itopplus-model-lib';
import { parseUTCTimestamp } from '@reactor-room/itopplus-back-end-helpers';

export class WebHookHelpers {
  getSentByMessageEnum = (webhook): MessageSentByEnum => {
    const customerPSID = this.getCustomerPSIDByComment(webhook);
    const pagePSID = this.getPageID(webhook);
    const sentBy = customerPSID === pagePSID ? MessageSentByEnum.PAGE : MessageSentByEnum.AUDIENCE;
    return sentBy;
  };

  getPostbackResponseType = (payload: PostbackPayload) => {
    return payload?.response_type;
  };
  getPostbackAudienceID = (payload: PostbackPayload) => {
    return payload?.audience_id;
  };

  geteEntryMessage = (webhook) => {
    if (webhook?.entry?.[0]) return true;
    else return false;
  };

  getChangesFromMessage = (webhook) => {
    return webhook?.entry?.[0]?.changes;
  };

  getPostbackFromMessage = (webhook) => {
    return webhook?.entry?.[0]?.messaging?.[0]?.postback;
  };

  getTextFromPostbackMessage = (webhook): string => {
    return webhook?.entry?.[0]?.messaging?.[0]?.postback?.title;
  };

  getReferralTimestampFromMessage = (webhook): number => {
    return webhook?.entry?.[0]?.messaging?.[0]?.timestamp;
  };
  getReferralFromMessage = (webhook): MessageReferral => {
    return webhook?.entry?.[0]?.messaging?.[0]?.referral;
  };
  getReferralSourceFromMessage = (webhook): MessageReferralSource => {
    return webhook?.entry?.[0]?.messaging?.[0]?.referral?.source;
  };
  getReferralTypeFromMessage = (webhook): MessageReferralType => {
    return webhook?.entry?.[0]?.messaging?.[0]?.referral?.type;
  };

  getDeliveryFromMessage = (webhook) => {
    return webhook?.entry?.[0]?.messaging?.[0]?.delivery;
  };

  getReadFromMessage = (webhook) => {
    return webhook?.entry?.[0]?.messaging?.[0]?.read;
  };

  getDelivery = (webhook) => {
    return webhook?.entry?.[0]?.messaging?.[0]?.delivery;
  };

  getAttachmentFromMessage = (webhook) => {
    return webhook?.entry?.[0]?.messaging?.[0]?.message?.attachments;
  };
  getMetaDataFromMessage = (webhook) => {
    return webhook?.entry?.[0]?.messaging?.[0]?.message?.metadata;
  };

  getAttachmentFromMessageFirstButtonText = (webhook) => {
    return webhook?.entry?.[0]?.messaging?.[0]?.message?.attachments?.payload?.buttons?.[0].title;
  };

  getMIDSFromDelivery = (webhook) => {
    return this.getDelivery(webhook)?.mids;
  };

  getWatermarkFromDelivery = (webhook) => {
    return this.getDelivery(webhook)?.watermark;
  };

  getWatermarkFromRead = (webhook) => {
    return this.getReadFromMessage(webhook)?.watermark;
  };
  // getImageAttachment(item) {
  //   return { attachmentsType: item.type, url: item.payload.url };
  // }

  // selectAttachmentByTemplateType(item) {
  //   if (item.payload.template_type === 'button') return this.getButtonsAttachment(item);
  //   else return this.getGenericAttachment(item);
  // }

  // getButtonsAttachment(item) {
  //   const buttons = item.payload.buttons.map((button) => ({ ...button, buttonType: button.type }));
  //   return { attachmentsType: item.payload.template_type, buttons: buttons.length > 0 ? buttons : null };
  // }

  // getGenericAttachment(item) {
  //   if (item.payload.template_type === 'generic') {
  //     return { attachmentsType: item.type, template: { templateType: item.payload.template_type } };
  //   }

  //   return { attachmentsType: item.type };
  // }

  getTextFromMessage = (webhook): string => {
    return webhook?.entry?.[0]?.messaging?.[0]?.message?.text;
  };

  getMessageIDFromMessage = (webhook): string => {
    return webhook?.entry?.[0]?.messaging?.[0]?.message?.mid;
  };
  getMessageIDFromReaction = (webhook): string => {
    return webhook?.entry?.[0]?.messaging?.[0]?.reaction?.mid;
  };

  getIsEchoFromMessage = (webhook): boolean => {
    return webhook?.entry?.[0]?.messaging?.[0]?.message?.is_echo;
  };

  getCreatedTimeFromComment = (webhook): number => {
    return Number(webhook?.entry?.[0]?.changes?.[0]?.value?.created_time) * 1000;
  };

  getCommentIDFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.comment_id;
  };

  getItemFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.item;
  };

  getVerbFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.verb;
  };

  getParentIDFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.parent_id;
  };

  getTextFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.message;
  };

  getAttachmentFromComment = (webhookAttachment: IAttachmentComment): string => {
    return webhookAttachment?.attachment?.media?.image?.src;
  };

  getCustomerByPSID = (webhook): string => {
    return webhook?.entry?.[0]?.messaging?.[0]?.sender?.id;
  };

  getSenderByPSID = (webhook): string => {
    return webhook?.entry?.[0]?.messaging?.[0]?.sender?.id;
  };
  getRecipientByPSID = (webhook): string => {
    return webhook?.entry?.[0]?.messaging?.[0]?.recipient?.id;
  };

  getTimestampFromMessage = (webhook): number => {
    return webhook?.entry?.[0]?.messaging?.[0]?.timestamp;
  };

  getTimeFromMessage = (webhook): number => {
    return webhook?.entry?.[0]?.time;
  };

  getPageID = (webhook): string => {
    return webhook?.entry?.[0]?.id;
  };

  getCustomerPSIDByComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.from?.id;
  };

  getCustomerUserRefID = (webhook): string => {
    return webhook?.entry?.[0]?.messaging?.[0]?.sender?.user_ref;
  };

  getStatusTypeFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.post?.status_type;
  };

  getPermalinkUrlFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.post?.permalink_url;
  };

  getPostIDFromComment = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.post_id;
  };

  getNameFromWebHook = (webhook): string => {
    return webhook?.entry?.[0]?.changes?.[0]?.value?.from?.name;
  };

  setMessagePayloadWithoutMID = (webhook, attachments = null, payload, sentBy: MessageSentByEnum, text: string, audienceID, pageID): IMessageModelInput => {
    return {
      payload: payload,
      audienceID: audienceID,
      mid: '',
      attachments: attachments,
      createdAt: parseUTCTimestamp(this.getTimestampFromMessage(webhook)),
      sentBy: sentBy,
      text: text,
      pageID: pageID,
      object: 'page',
    };
  };

  getReferralTypeFromRef(ref: string): ReferralTypes {
    const { OTHER, FORM, PRODUCTS } = ReferralTypes;

    if (ref.includes('__l')) {
      return FORM;
    } else if (ref.includes('__p') || ref.includes('__v')) {
      return PRODUCTS;
    } else {
      return OTHER;
      // throw new Error('Error: Not a valid Referral');
    }
  }

  getReferralProductType(ref: string): ReferralProductType {
    const { PRODUCT, PRODUCT_VARIANT } = ReferralProductType;
    if (ref.includes('__p')) {
      return PRODUCT;
    } else if (ref.includes('__v')) {
      return PRODUCT_VARIANT;
    } else {
      throw new Error('Error: Not a valid Product Referral');
    }
  }

  getFacebookPsID = (webhook): string => {
    const facebookPageID = this.getPageID(webhook);
    let psid: string = this.getCustomerByPSID(webhook) || this.getCustomerPSIDByComment(webhook);
    if (psid === facebookPageID) psid = this.getRecipientByPSID(webhook);
    return psid;
  };

  getLineEventID = (webhook): string => {
    const userID =
      webhook?.events?.[0]?.source?.type === ILineSourceType.USER
        ? webhook?.events?.[0]?.source?.userId
        : webhook?.events?.[0]?.source?.type === ILineSourceType.ROOM
        ? webhook?.events?.[0]?.source?.roomId
        : webhook?.events?.[0]?.source?.groupId;

    return userID;
  };

  getLineEventSource = (webhook): { sourceType: ILineSourceType; groupID?: string; roomID?: string; userID: string } => {
    switch (webhook?.events?.[0]?.source?.type) {
      case ILineSourceType.USER:
        return {
          sourceType: ILineSourceType.USER,
          userID: webhook?.events?.[0]?.source?.userId,
        };
      case ILineSourceType.GROUP:
        return {
          sourceType: ILineSourceType.GROUP,
          userID: webhook?.events?.[0]?.source?.userId,
          groupID: webhook?.events?.[0]?.source?.groupId,
        };
      case ILineSourceType.ROOM:
        return {
          sourceType: ILineSourceType.ROOM,
          userID: webhook?.events?.[0]?.source?.userId,
          roomID: webhook?.events?.[0]?.source?.roomId,
        };
    }
  };
  getLineUserID = (webhook): string => {
    return webhook?.events?.[0]?.source?.userId;
  };
  getLineGroupID = (webhook): string => {
    return webhook?.events?.[0]?.source?.groupId;
  };
  getLineRoomID = (webhook): string => {
    return webhook?.events?.[0]?.source?.roomId;
  };
}
