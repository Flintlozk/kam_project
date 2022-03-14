import { getTimeRange } from '@reactor-room/itopplus-back-end-helpers';
import { EnumAllowedSendMessage, FacebookMessagingType, ICheckMessageActivityByType, IComment, IMessageModel } from '@reactor-room/itopplus-model-lib';

export const checkMessagesTime = (audienceMessages: IMessageModel[]): ICheckMessageActivityByType => {
  if (audienceMessages.length > 0) {
    const day = 1;
    const checkTimeAllow: EnumAllowedSendMessage = checkCreatedTime('INBOX', audienceMessages[0].createdAt, day);
    return returnBy(checkTimeAllow);
  }

  return returnBy(EnumAllowedSendMessage.NOT_ALLOW);
};

export const checkCommentTime = (audienceComment: IComment[]): ICheckMessageActivityByType => {
  if (audienceComment.length > 0) {
    const day = 7;
    const checkTimeAllow: EnumAllowedSendMessage = checkCreatedTime('COMMENT', +new Date(audienceComment[0].createdAt), day);
    if (checkTimeAllow === EnumAllowedSendMessage.ALLOW) return returnBy(EnumAllowedSendMessage.PRIVATE_ONLY);
  }
  return returnBy(EnumAllowedSendMessage.NOT_ALLOW);
};

const checkCreatedTime = (type: string, timestamp: number | string, DAY: number): EnumAllowedSendMessage => {
  const range = getTimeRange(String(timestamp));
  if (range < DAY) {
    return EnumAllowedSendMessage.ALLOW;
  } else {
    if (type === 'INBOX') return EnumAllowedSendMessage.ALLOW_TAG;
    else return EnumAllowedSendMessage.NOT_ALLOW;
  }
};

export const checkMessagesUsage = async (pageMessages: IMessageModel[]): Promise<ICheckMessageActivityByType> => {
  if (pageMessages.length > 0) {
    const day = 1;
    const messagePromises = [];
    for (let index = 0; index < pageMessages.length; index++) {
      const messagesObject = pageMessages[index];
      const isInRange = checkCreatedTime('INBOX', messagesObject.createdAt, day);
      if (messagesObject.messagingType && isInRange === EnumAllowedSendMessage.ALLOW) {
        messagePromises.push(checkMessagesTypes(messagesObject));
      }
    }
    if (messagePromises.length > 0) {
      const checkTypeAllow: EnumAllowedSendMessage[] = await Promise.all(messagePromises);
      const result = allowUsageChecker(checkTypeAllow);
      return result;
    } else {
      return returnBy(EnumAllowedSendMessage.ALLOW_TAG);
    }
  } else {
    return returnBy(EnumAllowedSendMessage.ALLOW_TAG);
  }
};

const checkMessagesTypes = (pageMessage: IMessageModel): EnumAllowedSendMessage => {
  switch (pageMessage.messagingType) {
    case FacebookMessagingType.RESPONSE:
      return EnumAllowedSendMessage.ALLOW;
    case FacebookMessagingType.PRIVATE_MESSAGE:
      return EnumAllowedSendMessage.ALLOW_TAG;
    case FacebookMessagingType.MESSAGE_TAG:
    default:
      // return EnumAllowedSendMessage.NOT_ALLOW;
      return EnumAllowedSendMessage.ALLOW_TAG;
  }
};

export const allowUsageChecker = (value: number[]): ICheckMessageActivityByType => {
  const notAllow = value.find((x) => x === EnumAllowedSendMessage.NOT_ALLOW);
  if (notAllow === 0) {
    return returnBy(EnumAllowedSendMessage.NOT_ALLOW);
  }

  const isAllowTag = value.find((x) => x === EnumAllowedSendMessage.ALLOW_TAG);
  if (isAllowTag) {
    return returnBy(EnumAllowedSendMessage.ALLOW_TAG);
  }

  return returnBy(EnumAllowedSendMessage.ALLOW);
};

const returnBy = (enumCase: EnumAllowedSendMessage): ICheckMessageActivityByType => {
  switch (enumCase) {
    case EnumAllowedSendMessage.PRIVATE_ONLY:
      return { allowOn: EnumAllowedSendMessage.PRIVATE_ONLY, reason: 'PRIVATE_ONLY' };
    case EnumAllowedSendMessage.NOT_ALLOW:
      return { allowOn: EnumAllowedSendMessage.NOT_ALLOW, reason: 'NOT_ALLOW' };
    case EnumAllowedSendMessage.ALLOW_TAG:
      return { allowOn: EnumAllowedSendMessage.ALLOW_TAG, reason: 'ALLOW_TAG' };
    case EnumAllowedSendMessage.ALLOW:
      return { allowOn: EnumAllowedSendMessage.ALLOW, reason: 'ALLOW' };
  }
};
