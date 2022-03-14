import { ILineFileMessage, WEBHOOK_FILE, WEBHOOK_MESSAGE_TYPE } from '@reactor-room/itopplus-model-lib';

export const getFileExtension = (message: ILineFileMessage): string => {
  const fileNameSplit = message.fileName.split('.');
  const extension = fileNameSplit[fileNameSplit.length - 1];
  return extension;
};

export const lineAttachmentTypeIsFileOrOther = (message: ILineFileMessage): WEBHOOK_FILE => {
  switch (message.type) {
    case WEBHOOK_MESSAGE_TYPE.IMAGE:
      return WEBHOOK_FILE.OTHER;
    case WEBHOOK_MESSAGE_TYPE.VIDEO:
      return WEBHOOK_FILE.OTHER;
    case WEBHOOK_MESSAGE_TYPE.AUDIO:
      return WEBHOOK_FILE.OTHER;
    case WEBHOOK_MESSAGE_TYPE.FILE:
      return WEBHOOK_FILE.FILE;
    case WEBHOOK_MESSAGE_TYPE.STICKER:
      return WEBHOOK_FILE.OTHER;
    case WEBHOOK_MESSAGE_TYPE.LOCATION:
      return WEBHOOK_FILE.OTHER;
    default:
      return WEBHOOK_FILE.OTHER;
  }
};
