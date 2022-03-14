const { getTopicFacebook } = require('../../domain/pubsub.domain');
const { isNotEmpty } = require('../../domain/object.domain');
const { checkHashReqeustFacebook, getDeliveryFromMessage, getReadFromMessage, getStandByFromMessage, getMessage, getMessageIDFromMessage } = require('../../domain/facebook.domain');
const { publishMessage } = require('../../domain/pubsub.domain');
const redisConnection = require('../../connections/redis.connection');

const facebookPOSTWebhook = async (signature, payload) => {
  let xHubSignature = null;
  let status = 200;
  let message = 'SUCCESS';
  if (signature) {
    xHubSignature = signature;
    try {
      const content = payload;
      const result = await facebookPublish(content, signature);
      status = result.status;
      message = result.message;
    } catch (e) {
      console.log('Error:', e);
      status = 500;
      message = e;
    }
  }
  return { status, message };
};

const facebookGETValidation = (mode, token, challenge) => {
  const VERIFY_TOKEN = 'COMPLETE';
  let status = 403;
  let message = 'WEBHOOK_VERIFIED';
  if (mode != undefined && token != undefined && challenge !== undefined) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      status = 200;
      message = challenge;
    } else {
      console.log('WEBHOOK_VERIFIED');
    }
  } else {
    console.log('WEBHOOK_VERIFIED');
  }
  return { status, message };
};

async function facebookPublish(content, signature) {
  const response = { status: 200, message: 'SUCCESS' };
  if (checkHashReqeustFacebook(content, signature)) {
    const pubObject = JSON.parse(content.toString());
    if (isNotEmpty(pubObject.entry)) {
      if (pubObject.entry.length > 0) {
        const delivery = getDeliveryFromMessage(pubObject);
        const read = getReadFromMessage(pubObject);
        const standby = getStandByFromMessage(pubObject);

        if (delivery) keepDelivery(pubObject, delivery);
        if (read) keepRead(pubObject, read);
        if (delivery || read || standby) return response;

        const TOPIC = getTopicFacebook(pubObject);
        const mid = getMessageIDFromMessage(pubObject);
        if (mid) {
          const status = await getRedisStorage(mid);
          if (!isNotEmpty(status)) {
            await publishMessage(pubObject, TOPIC);
            setRedisStorage(mid, 'DONE');
          }
        } else {
          await publishMessage(pubObject, TOPIC);
        }
        console.log('INCOMMING_MESSAGE', TOPIC);
        console.log('OBJECT:', JSON.stringify(pubObject));

        return response;
      } else {
        console.log('NOT_VALID_MESSAGE');
        response.status = 403;
        response.message = 'NOT_VALID_MESSAGE';
        return response;
      }
    } else {
      response.message = 'DATA_IS_EMPTY';
      return response;
    }
  } else {
    console.log('NOT_VALID_REQUEST');
    response.status = 403;
    response.message = 'NOT_VALID_REQUEST';
    return response;
  }
}

const redisStorageClient = redisConnection.getRedisStoreClient(process.env.redisStorage, process.env.redisPort);
const getRedisStorage = (key) => {
  return new Promise((resolve, reject) => {
    redisStorageClient.get(key, (err, value) => {
      if (err) reject(err);
      resolve(JSON.parse(value));
    });
  });
};
const setRedisStorage = (key, payload) => {
  redisStorageClient.set(key, JSON.stringify(payload));
  return true;
};

const keepDelivery = (pubObject, message_delivery) => {
  if (message_delivery) {
    const message = getMessage(pubObject);
    if (message) {
      if (message.sender && message.recipient) {
        const key = `DELIVERY:${message.sender.id}:${message.recipient.id}`;
        const mid = message_delivery ? (message_delivery.mids !== undefined ? (message_delivery.mids.length ? message_delivery.mids[0] : undefined) : undefined) : undefined;
        setRedisStorage(key, { delivery: message_delivery, mid });
      }
    }
  }
};

const keepRead = (pubObject, message_read) => {
  if (message_read) {
    const message = getMessage(pubObject);
    if (message) {
      if (message.sender && message.recipient) {
        const key = `READ:${message.sender.id}:${message.recipient.id}`;
        console.log('key: ', key);
        setRedisStorage(key, { read: message_read });
      }
    }
  }
};

const facebookCheckService = () => {
  return { status: 200, message: 'OK!' };
};

module.exports = {
  facebookPOSTWebhook,
  facebookGETValidation,
  facebookCheckService,
};
