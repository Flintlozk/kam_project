import { IGQLFileSteam } from '@reactor-room/model-lib';
import {
  IFacebookMessageAttachmentResponse,
  IFBMessengerAttachment,
  IFBMessengerAttachmentAssetType,
  IMessageModel,
  IMessageModelInput,
  IMessageSender,
  IPageMemberModel,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import FormData from 'form-data';

export const mapMessageSenderDomain = (messages: IMessageModel[], userList: IPageMemberModel[]): IMessageModel[] => {
  const newMessages = [];
  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];
    if (message?.sender) {
      const matchUser = userList.find((user) => user.user_id === message?.sender.user_id);
      if (matchUser) {
        message.sender.user_name = !isEmpty(matchUser.alias) ? matchUser.alias : message.sender.user_name;
      }
    }

    mapSender(message);
    newMessages.push(message);
  }

  return newMessages;
};

export const mapPageMessageSender = (messages: IMessageModel[]): IMessageModel[] => {
  return messages.map((message) => {
    mapSender(message);
    return message;
  });
};

export const mapSender = (message: IMessageModel): void => {
  if (message.sentBy === MessageSentByEnum.PAGE) {
    if (!message.sender) {
      message.sender = {
        user_id: -1,
        user_name: message.object === 'line' ? 'Line' : 'Facebook',
      } as IMessageSender;
    }
  }
};

export const getFBMessengerAttachmentPayload = (type: IFBMessengerAttachmentAssetType, fileUrl: string): IFBMessengerAttachment => {
  return {
    message: {
      attachment: {
        type,
        payload: {
          is_reusable: true,
          url: fileUrl,
        },
      },
    },
  } as IFBMessengerAttachment;
};

export const createFormDataFromFileStream = (file: IGQLFileSteam, type: IFBMessengerAttachmentAssetType): FormData => {
  const { createReadStream, filename } = file.file;
  const stream = createReadStream();
  const formData = new FormData();
  formData.append('source', stream, filename);
  const message = {
    attachment: {
      type: type,
      payload: { is_reusable: false },
    },
  };

  formData.append('message', JSON.stringify(message));
  return formData;
};

export const createFormDataFromBuffer = (file: Buffer, fileName: string, type: IFBMessengerAttachmentAssetType): FormData => {
  const formData = new FormData();

  const message = {
    attachment: {
      type: type,
      payload: { is_reusable: false },
    },
  };

  formData.append('message', JSON.stringify(message));
  formData.append('data', file, { filename: fileName });

  return formData;
};

export const getMessagePayloadTemplate = (text: string, audienceID: number, pageID: number): IMessageModelInput => {
  return {
    mid: null,
    text: text,
    object: 'line',
    audienceID: audienceID,
    pageID: pageID,
    createdAt: String(new Date().valueOf()),
    sentBy: MessageSentByEnum.PAGE,
    sender: null,
    attachments: null,
  };
};

export const facebookAttachmentResponseMappingUrl = (faccebookResponse: IFacebookMessageAttachmentResponse): { url: string }[] => {
  const newUrl = [];
  faccebookResponse.attachments.data.forEach((attachment) => {
    newUrl.push({ url: attachment.image_data.url });
  });
  return newUrl;
};
export const replaceExpiredUrlWithNewUrl = (message: IMessageModel, oldUrls: { url: string }[], newUrls: { url: string }[]): IMessageModel => {
  for (const index in oldUrls) {
    let attachments = message.attachments as string;
    attachments = attachments.replace(oldUrls[index].url, newUrls[index].url);
    message.attachments = attachments;
  }
  return message;
};
