import {
  DateUnit,
  IAggregateMessageModel,
  IAttachmentModelPhysical,
  IDashboardAudience,
  IDateGap,
  IDeliveryMessageWatermark,
  IFacebookMessageAttachmentResponse,
  IFacebookUserRef,
  IMessageModel,
  IMessageSearchModel,
  IMessageUsers,
  IReadMessageWatermark,
} from '@reactor-room/itopplus-model-lib';
import {
  messageSchemaModel as MessageModel,
  tempMessageSchemaModel as TempMessage,
  tempMessageStagingSchemaModel as TempMessageStaging,
} from '@reactor-room/plusmar-model-mongo-lib';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { Pool } from 'pg';
import { PlusmarService } from '../../services/plusmarservice.class';
import { getPageByFacebookPageID } from '../pages';

export async function getMessageByPageID(pageID: number, { startDate, endDate }: { startDate: string; endDate: string }, dateGap: IDateGap): Promise<IDashboardAudience[]> {
  const toDateStart = new Date(startDate);
  const toDateEnd = new Date(endDate);
  let dateAddition = '';

  if (dateGap.unit === DateUnit.HOUR) dateAddition = 'T%H:00:00Z';
  else dateAddition = '';
  const result = await MessageModel.aggregate([
    {
      $project: {
        pageID: 1,
        timestamp: 1,
      },
    },
    {
      $match: {
        pageID: pageID,
        timestamp: {
          $gte: toDateStart,
          $lt: toDateEnd,
        },
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d' + dateAddition,
            date: '$timestamp',
          },
        },
        audience_per_day: { $sum: 1 },
      },
    },
    {
      $project: {
        date: '$_id',
        audience_per_day: '$audience_per_day',
      },
    },
    { $sort: { _id: -1 } },
    {
      $unset: ['_id'],
    },
  ]);

  return result;
}

export async function getLastMessagesSentByIDs(audienceIds: number[], pageID: number, sentBy: string, limit = 3): Promise<IMessageModel[]> {
  const result = await MessageModel.find({
    audienceID: {
      $in: audienceIds,
    },
    pageID,
    sentBy,
  })
    .sort({ _id: -1 })
    .limit(limit);
  return result.length > 0 ? result : [];
}

export async function getMessageExistenceById(mid: string, pageID: number): Promise<boolean> {
  const result = await MessageModel.find({ mid, pageID });
  return result.length > 0;
}
export async function searchMessage(client: Pool, messageData: IMessageSearchModel): Promise<IMessageModel> {
  const page = await getPageByFacebookPageID(client, messageData?.pageID);

  const message = await MessageModel.findOneAndUpdate(
    { mid: null, text: messageData.text, pageID: page.id, sentBy: messageData.sentBy },
    {
      $set: {
        mid: messageData.mid,
      },
    },
    { new: true },
  )
    .lean()
    .exec();

  return message;
}

export async function getMessageAttachments(audienceID: number, pageID: number, limit: number): Promise<IMessageModel[]> {
  const messages = await MessageModel.find({ audienceID: audienceID, pageID: pageID, attachments: { $exists: true, $ne: null } })
    .limit(limit)
    .sort({ createdAt: -1 })
    .collation({ locale: 'en_US', numericOrdering: true })
    .lean()
    .exec();
  return messages;
}

export async function getMessages(users: IMessageUsers): Promise<IMessageModel[]> {
  const { audienceID, pageID } = users;
  const messages = await MessageModel.find({ audienceID: audienceID, pageID: pageID }).sort({ createdAt: 1 }).collation({ locale: 'en_US', numericOrdering: true }).lean().exec();
  return messages;
}

export async function countTotalMessages(audienceID: number, pageID: number): Promise<number> {
  const messages = await MessageModel.find({ audienceID: audienceID, pageID: pageID }).countDocuments().exec();
  return messages;
}
export async function getMessage(messageID: string, audienceID: number): Promise<IMessageModel> {
  const message = await MessageModel.findOne({ audienceID: audienceID, id: messageID }).lean().exec();
  return message;
}
export async function getMessagesOnScroll(audienceIDs: number[], pageID: number, index: number, limit = 15): Promise<IMessageModel[]> {
  const messages = await MessageModel.find({ audienceID: { $in: audienceIDs }, pageID: pageID })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(index * limit)
    .lean()
    .exec();
  return messages;
}
export async function getLatestMessage(users: IMessageUsers): Promise<IMessageModel> {
  const latestMessage = await MessageModel.findOne({ audienceID: users.audienceID, pageID: users.pageID }).sort({ createdAt: -1 }).lean().exec();
  return latestMessage;
}

export async function getLatestMessageExceptSentByPage(users: IMessageUsers): Promise<IMessageModel> {
  const latestMessage = await MessageModel.findOne({ audienceID: users.audienceID, pageID: users.pageID, sentBy: { $ne: 'PAGE' } })
    .sort({ createdAt: -1 })
    .collation({ locale: 'en_US', numericOrdering: true })
    .lean()
    .exec();

  return latestMessage;
}
export async function getLatestMessageIncludePageTemplate(users: IMessageUsers): Promise<IMessageModel> {
  const latestMessage = await MessageModel.findOne({ audienceID: users.audienceID, pageID: users.pageID })
    .sort({ createdAt: -1 })
    .collation({ locale: 'en_US', numericOrdering: true })
    .lean()
    .exec();

  return latestMessage;
}
export async function getAttactment(accessToken: string, messageID: string): Promise<IAttachmentModelPhysical> {
  try {
    const url = `https://graph.facebook.com/v8.0/${messageID}/attachments?access_token=${accessToken}`;
    const { data } = await axios.get(url);
    if (data?.data?.length > 0) return data?.data[0];
    else return null;
  } catch (err) {
    const error = err?.response?.data?.error;
    throw new Error(error?.message);
  }
}
export async function getPSIDFromUserRefData(accessToken: string, userRef: string): Promise<IFacebookUserRef> {
  try {
    const url = `https://graph.facebook.com/v8.0/${userRef}?fields=id,psid&access_token=${accessToken}`;
    const { data } = await axios.get(url);
    if (!isEmpty(data)) return data;
    else return null;
  } catch (err) {
    const error = err?.response?.data?.error;
    throw new Error(error?.message);
  }
}
export async function getAttachmentUrlExpired(mid: string, accessToken: string, version = 'v9.0'): Promise<IFacebookMessageAttachmentResponse> {
  try {
    const url = `https://graph.facebook.com/${version}/${mid}?fields=attachments&access_token=${accessToken}`;
    const { data } = await axios.get(url);
    if (!isEmpty(data)) return data;
    else return null;
  } catch (err) {
    console.log('ERROR', err);
    const error = err?.response?.data?.error;
    throw new Error(error?.message);
  }
}

export async function getMessagesByMIDAudienceAndPageID(pageID: number, audienceID: number, messageID: string): Promise<IMessageModel> {
  const messages = await MessageModel.findOne({ audienceID: audienceID, pageID: pageID, mid: messageID }).sort({ createdAt: 1 }).lean().exec();
  return messages;
}

export const getDeliveryMessageWatermark = (customerPSID: string, pagePSID: string): Promise<IDeliveryMessageWatermark> => {
  return new Promise((resolve, reject) => {
    const CLIENT = PlusmarService.redisStoreClient;
    const KEY = `DELIVERY:${customerPSID}:${pagePSID}`;
    CLIENT.get(KEY, (err, watermark: string) => {
      if (err) reject(err);
      else {
        resolve(JSON.parse(watermark));
      }
    });
  });
};
export const getReadMessageWatermark = (customerPSID: string, pagePSID: string): Promise<IReadMessageWatermark> => {
  return new Promise((resolve, reject) => {
    const CLIENT = PlusmarService.redisStoreClient;
    const KEY = `READ:${customerPSID}:${pagePSID}`;
    CLIENT.get(KEY, (err, watermark: string) => {
      if (err) reject(err);
      else {
        resolve(JSON.parse(watermark));
      }
    });
  });
};

export const getTempMessages = async (): Promise<IAggregateMessageModel[]> => {
  const { IS_STAGING } = PlusmarService.environment;
  let tempMessageSchema = TempMessage;
  if (IS_STAGING) tempMessageSchema = TempMessageStaging;
  return await tempMessageSchema
    .aggregate([
      {
        $sort: {
          timestamp: 1,
        },
      },
      {
        $group: {
          _id: { pageID: '$pageID' },
          data: {
            $push: {
              _id: '$_id',
              object: '$object',
              pageID: '$pageID',
              audienceID: '$audienceID',
              createdAt: '$createdAt',
              mid: '$mid',
              text: '$text',
              attachments: '$attachments',
              sentBy: '$sentBy',
              payload: '$payload',
              source: '$source',
              messagingType: '$messagingType',
              timestamp: '$timestamp',
            },
          },
        },
      },
      {
        $sort: {
          'data.timestamp': 1,
        },
      },
    ])
    .exec();
};

export async function findMessageByMessageID(mid: string): Promise<IMessageModel> {
  const result = await MessageModel.findOne({ mid }).lean().exec();
  return result;
}
