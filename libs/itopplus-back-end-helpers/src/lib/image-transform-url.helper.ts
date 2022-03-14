import { IMoreImageUrlResponse } from '@reactor-room/model-lib';
import { IAttachmentsModel, ILineMessage, IMessageModel, IVariantsOfProduct } from '@reactor-room/itopplus-model-lib';
import { cryptoEncode } from './crypto.helper';
import { isEmpty } from './object.helper';
const DEFAULT_RESIZE_PARAM = '?width=2d46c73dbcf23e99&height=74b122297b29d963';
export const transformMediaLink = (imageData: IMoreImageUrlResponse, fileServer: string, subscriptionID: string): string => {
  return transformMediaLinkString(imageData.mediaLink, fileServer, subscriptionID);
};

export const transformImageUrlArray = (imageDataArray: IMoreImageUrlResponse[], fileServer: string, subscriptionID: string): IMoreImageUrlResponse[] => {
  if (imageDataArray?.length > 0) {
    return imageDataArray.map((imageData) => ({
      id: imageData.id,
      mediaLink: transformMediaLink(imageData, fileServer, subscriptionID),
    }));
  } else {
    return [];
  }
};

export const tranformProductVariantData = (variants: IVariantsOfProduct[], imageKey: string, fileServer: string, subscriptionID: string): IVariantsOfProduct[] => {
  return variants.map((variant) => ({
    ...variant,
    [imageKey]: transformImageUrlArray(variant[imageKey], fileServer, subscriptionID),
  }));
};

export const transformLineAttachmentUrl = (url: string): string => {
  const params = url?.split('?');
  const filePath = params[0]?.split('/');
  const fileName = filePath[filePath.length - 1];
  return decodeURI(fileName);
};

export const transformMediaLinkString = (imagePath: string, fileServer: string, subscriptionID: string, resize = true, stream = false): string => {
  if (imagePath?.indexOf('https://') === -1) {
    return genearteGetUrlFileServer(imagePath, fileServer, subscriptionID, resize, stream);
  } else {
    if (imagePath) {
      return imagePath;
    }
    return null;
  }
};

export const genearteGetUrlFileServer = (imagePath: string, fileServer: string, subscriptionID: string, resize = true, stream = false): string => {
  const isPNG = imagePath.search('.png') !== -1;
  const isJPEG = imagePath.search('.jpeg') !== -1;
  const isJPG = imagePath.search('.jpg') !== -1;
  const isPDF = imagePath.search('.pdf') !== -1;
  if (isPDF) {
    stream = true;
  }
  if (resize && (isPNG || isJPEG || isJPG)) {
    // fix hard code size 300px and height 0
    return `${fileServer}resize/${subscriptionID}/${imagePath}${DEFAULT_RESIZE_PARAM}`;
  } else {
    if (stream) {
      return `${fileServer}stream/${subscriptionID}/${imagePath}`;
    } else {
      return `${fileServer}${subscriptionID}/${imagePath}`;
    }
  }
};

export const transformImageURlFormat = (imagePath: string): string => {
  if (imagePath?.search('/system/') !== -1) {
    if (imagePath?.indexOf('?') !== -1) {
      return imagePath?.substring(imagePath?.search('system'), imagePath.indexOf('?'));
    } else {
      return imagePath?.substring(imagePath?.search('system'), imagePath.length);
    }
  } else if (imagePath?.search('/assets/') !== -1) {
    if (imagePath?.indexOf('?') !== -1) {
      return imagePath?.substring(imagePath?.search('assets'), imagePath.indexOf('?'));
    } else {
      return imagePath?.substring(imagePath?.search('assets'), imagePath.length);
    }
  } else {
    return imagePath;
  }
};

export const transformMessageImageURl = (message: IMessageModel, fileServer: string, subscriptionID: string): IMessageModel => {
  if (message?.attachments) {
    const attachments = message.attachments as string;
    const attachmentsJSON = JSON.parse(attachments) as IAttachmentsModel[];
    if (!isEmpty(attachmentsJSON)) {
      const transformAttachment = transformMessageAttachmentImageURl(attachmentsJSON, fileServer, subscriptionID);
      message.attachments = transformAttachment;
    } else {
      message.attachments = null;
    }
  }
  return message;
};
export const transformMessageAttachmentImageURl = (attachments: IAttachmentsModel[], fileServer: string, subscriptionID: string): string => {
  const result = [];
  for (const attachment of attachments) {
    const url = attachment.payload?.url as string;
    const urlMore = attachment.payload?.urlMore as string;
    if (url) {
      attachment.payload.url = transformMediaLinkString(url, fileServer, subscriptionID);
    }
    if (urlMore) {
      attachment.payload.url = transformMediaLinkString(urlMore, fileServer, subscriptionID);
    }
    result.push(attachment);
  }
  return JSON.stringify(result);
};

export function decodeFileName(messageObj: ILineMessage): ILineMessage {
  const url = new URL(messageObj.originalContentUrl);
  url.search = '';
  messageObj.originalContentUrl = url.href;
  messageObj.previewImageUrl = url.href;
  return messageObj;
}

export function getDecodeWidth(width: number, key: string): string {
  const decodewidth = cryptoEncode(width.toString(), key);
  const decodeheight = cryptoEncode('0', key);
  return `?width=${decodewidth}&height=${decodeheight}`;
}
