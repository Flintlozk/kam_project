import { getUTCDayjs } from '@reactor-room/itopplus-back-end-helpers';
import { FacebookErrorCode } from '@reactor-room/model-lib';
import {
  IAttachmentsModel,
  ICustomerTemp,
  IFacebookAttachmentResponse,
  IFacebookMessagePayloadTypeEnum,
  IFacebookMessageResponse,
  IFBMessengerAttachment,
  IFormPayloadData,
  IMessageModel,
  IMessageModelInput,
  ITraceMessageModel,
} from '@reactor-room/itopplus-model-lib';
import {
  messageSchemaModel as FacebookMessage,
  messageSchemaModel as LineMessageModel,
  tempMessageSchemaModel as TempMessage,
  tempMessageStagingSchemaModel as TempMessageStaging,
  TraceMessageSchemaModel,
} from '@reactor-room/plusmar-model-mongo-lib';

import { IEnvironment } from '@reactor-room/environment-services-backend';
import axios from 'axios';
import { isEmpty, merge } from 'lodash';
import { sendAttachmentMessagePayload } from '../../domains';
import { AudienceUnavailableError } from '../../errors';
import FormData from 'form-data';
import { UpdateWriteOpResult } from 'mongoose';

export async function updateUrlImageMore(mid: string, storageUrl: string): Promise<IMessageModel> {
  const message = await LineMessageModel.findOne({ mid: mid }).lean().exec();
  if (message) {
    const attachment: IAttachmentsModel[] = JSON.parse(message.attachments as string);
    attachment[0].payload.urlMore = storageUrl;
    const attachmentString = JSON.stringify(attachment);
    await LineMessageModel.updateOne({ mid: mid }, { $set: { attachments: attachmentString } }).exec();
  }
  return message;
}

export async function aggregrateCountMessagesByRange(startDate: Date, endDate: Date) {
  const query = {
    pageID: 91,
    timestamp: {
      $gte: startDate,
      $lt: endDate,
    },
  };
  const subtract = { $subtract: ['$timestamp', new Date('1970-01-01')] };
  const gap = 1000 * 60 * 60 * 24 * 30 * 6; // 1 year
  const result = await FacebookMessage.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: {
          $toDate: {
            $add: [{ $subtract: [subtract, { $mod: [subtract, gap] }] }],
          },
        },
        messages: { $sum: 1 },
        startRange: { $min: '$timestamp' },
        endRange: { $max: '$timestamp' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return result;
}

export function addNewMessage(input: IMessageModelInput, messagingType: string = null): Promise<IMessageModel> {
  return new Promise<IMessageModel>((resolve, reject) => {
    let attachments = null;
    if (input.attachments !== null) {
      attachments = JSON.stringify(input.attachments);
    }
    const params = merge(input, { messagingType }, { attachments: attachments });
    const facebookMessage = new FacebookMessage(params);
    facebookMessage.save((err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(response)));
      }
    });
  });
}
export function addTempMessage(input: IMessageModelInput, messagingType: string = null, env: IEnvironment): Promise<IMessageModel> {
  return new Promise<IMessageModel>((resolve, reject) => {
    const cloneInput: IMessageModelInput = JSON.parse(JSON.stringify(input));
    const { IS_STAGING } = env;
    let tempMessageSchema = TempMessage;
    if (IS_STAGING) tempMessageSchema = TempMessageStaging;

    let attachments = null;
    if (cloneInput.attachments !== null) {
      attachments = JSON.stringify(cloneInput.attachments);
    }
    const params = merge(cloneInput, { messagingType }, { attachments: attachments });
    const tempMessage = new tempMessageSchema(params);
    tempMessage.save((err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(response)));
      }
    });
  });
}

export async function removeTempMessageByIDs(messageIDs: string[], env: IEnvironment): Promise<void> {
  const { IS_STAGING } = env;
  let tempMessageSchema = TempMessage;
  if (IS_STAGING) tempMessageSchema = TempMessageStaging;

  await tempMessageSchema.deleteMany({ _id: { $in: messageIDs } });
}

export function addNewPayloadMessage(input: IMessageModelInput, messagingType: string = null): Promise<IMessageModel> {
  return new Promise<IMessageModel>((resolve, reject) => {
    const params = merge(input, { messagingType }, { createdAt: getUTCDayjs() });
    const facebookMessage = new FacebookMessage(params);
    facebookMessage.save((err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(response)));
      }
    });
  });
}

export async function updateMessageByMessageID(mid: string, messageData: IMessageModel): Promise<UpdateWriteOpResult> {
  const result = await FacebookMessage.updateMany({ mid }, { $set: { attachments: messageData.attachments } })
    .lean()
    .exec();
  return result;
}

export async function updateMessage(messageData: IMessageModel, pageID: number): Promise<IMessageModel> {
  const result = await FacebookMessage.findOneAndUpdate({ _id: messageData._id, pageID: pageID }, { $set: { mid: messageData.mid } }, { new: true })
    .lean()
    .exec();
  return result;
}

export async function updateMessageFromHook(messageFromHook: IMessageModelInput): Promise<IMessageModel> {
  let attachments = null;
  if (messageFromHook.attachments !== null) {
    attachments = JSON.stringify(messageFromHook.attachments);
  }
  const message = merge(messageFromHook, { attachments: attachments });

  const result = await FacebookMessage.findOneAndUpdate({ mid: messageFromHook.mid, pageID: messageFromHook.pageID }, { $set: { ...message } }, { new: true })
    .lean()
    .exec();
  return result;
}

export async function sendMessage(accessToken: string, message: IMessageModelInput, payload: IFormPayloadData, version = 'v9.0'): Promise<IMessageModelInput> {
  try {
    const url = `https://graph.facebook.com/${version}/me/messages?access_token=${accessToken}`;
    const response = await axios.post(url, payload);
    return { ...message, mid: response.data.message_id };
  } catch (err) {
    //AXIOS Error
    let error = err?.response?.data?.error;
    //If TS Error
    if (isEmpty(error)) error = { code: 500, type: 'GENERIC', message: err.message } as FacebookErrorCode;

    if (error.message.indexOf('Error validating access token') !== -1) {
      error.message = 'Please reauthorize Facebook page token at "Settings" > "Shop Owner" > "Edit" > Facebook Page "Update Token" (required Owner role)';
    } else {
      error.message = 'According to Facebook standard policy, Businesses will have up to 24 hours to respond to a user.';
    }
    throw new AudienceUnavailableError(error);
  }
}

export async function sendPrivateMessage(accessToken: string, message: IMessageModelInput, payload: IFormPayloadData, version = 'v9.0'): Promise<IMessageModelInput> {
  try {
    const url = `https://graph.facebook.com/${version}/me/messages?access_token=${accessToken}`;
    // const payload = sendPrivateMessagePayload(commentID, message.text);

    const response = await axios.post(url, payload);
    return { ...message, mid: response.data.message_id };
  } catch (err) {
    let error = err?.response?.data?.error;
    // throw new ActivityAlreadyRepliedTo(error.message);
    if (isEmpty(error)) error = { code: 500, type: 'GENERIC', message: err.message } as FacebookErrorCode;
    if (error.message.indexOf('Error validating access token') !== -1) {
      error.message = 'Please reauthorize Facebook page token at "Settings" > "Shop Owner" > "Edit" > Facebook Page "Update Token" (required Owner role)';
    }
    throw new AudienceUnavailableError(error);
  }
}

// call it when you got attachment ID
export async function sendAttachment(
  accessToken: string,
  attachmentID: string,
  customer: ICustomerTemp,
  type: IFacebookMessagePayloadTypeEnum,
  file_url?: string,
  filename?: string,
  version = 'v9.0',
): Promise<IFacebookMessageResponse> {
  try {
    const url = `https://graph.facebook.com/${version}/me/messages?access_token=${accessToken}`;
    const payload = sendAttachmentMessagePayload(customer.psid, type, attachmentID, file_url, filename);
    const { data } = await axios.post(url, payload);
    return data;
  } catch (err) {
    const error = err?.response?.data?.error;
    throw new Error(error?.message);
  }
}

// upload file to facebook and get attachmentId back
export async function uploadFacebookAttachmentByURL(payload: IFBMessengerAttachment, accessToken: string, version = 'v9.0'): Promise<IFacebookAttachmentResponse> {
  try {
    const url = `https://graph.facebook.com/${version}/me/message_attachments?access_token=${accessToken}`;
    const { data } = await axios.post(url, payload);

    return data;
  } catch (err) {
    const error = err?.response?.data?.error;
    throw new Error(error?.message);
  }
}
// upload file to facebook and get attachmentId back
export async function uploadFacebookAttachmentByFile(formData: FormData, accessToken: string, maximumFileSize: number, version = 'v9.0'): Promise<IFacebookAttachmentResponse> {
  try {
    const url = `https://graph.facebook.com/${version}/me/message_attachments?access_token=${accessToken}`;
    const { data } = await axios.post(url, formData, { headers: formData.getHeaders(), maxContentLength: maximumFileSize, maxBodyLength: maximumFileSize });

    return data;
  } catch (err) {
    console.log('ERROR', err);
    const error = err?.response?.data?.error;
    throw new Error(error?.message);
  }
}

export function upsertTraceMessage(
  query: { mid?: string; commentID?: string },
  webhook: string,
  stage: {
    latestIncoming?: Date;
    traceStage1?: number;
    traceStage2?: number;
    traceStage3?: number;
    traceStage4?: number;
    traceStage5?: number;
  },
): Promise<ITraceMessageModel> {
  return new Promise((resolve, reject) => {
    const set: ITraceMessageModel = {
      // ...query,
      webhook,
      ...stage,
    };
    TraceMessageSchemaModel.findOneAndUpdate(query, set, { new: true, upsert: true, setDefaultsOnInsert: true }).exec((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
