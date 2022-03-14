const { getTopicLine } = require('../../domain/pubsub.domain');
const { isNotEmpty } = require('../../domain/object.domain');
const cryptoHelper = require('../../helpers/crypto.helper');
const lineData = require('../../data/line/line.data');
const { PubSub } = require('@google-cloud/pubsub');
const crypto = require('crypto');
const { publishMessage } = require('../../domain/pubsub.domain');

///<reference path="../../typesdefs.js" />
/**
 * @param {string} uuid
 * @param {string} signature
 * @param {string} body
 * @return {Promise<boolean>}
 */
const lineWebhook = async (uuid, signature, body) => {
  const redisValue = await lineData.getChannelSecret(uuid);
  if (isNotEmpty(redisValue)) {
    const channelSecret = cryptoHelper.cryptoDecode(redisValue, process.env.lineSecretKey);
    if (isNotEmpty(channelSecret)) {
      const signatureLine = crypto.createHmac('SHA256', channelSecret).update(body).digest('base64').toString();
      if (signatureLine === signature) {
        const payload = body;
        await publishMessage(payload, getTopicLine(channelSecret));
      }
    }
    return true;
  } else {
    if (signature && uuid && body) {
      await publishMessage({ UUID: uuid, signature, body }, process.env.lineSecretSubscription);
    }
    return false;
  }
};

const lineSubscriptionMessage = async () => {
  const connection = new PubSub();
  const subscriptionOption = {
    flowControl: {
      maxMessages: 10,
    },
  };
  const subscription = connection.subscription(process.env.lineSecretToppic, subscriptionOption);
  console.log('Subscription lineSecretToppic:', process.env.lineSecretToppic);
  const messageHandler = (message) => {
    const messageData = JSON.parse(message.data);
    if (isNotEmpty(messageData)) {
      setRedisLineSecret(messageData);
      message.ack();
    } else {
      console.log('API Error need to retransmit message.');
    }
  };
  subscription.on('message', messageHandler);
};

const setRedisLineSecret = (payload) => {
  const decoded = cryptoHelper.cryptoDecode(payload, process.env.lineSecretKey);
  if (isNotEmpty(decoded)) {
    const value = decoded;
    const splitToken = value.split('.');
    const uuid = splitToken[1];
    const lineSecret = splitToken[0];
    const secretEncoded = cryptoHelper.cryptoEncode(lineSecret, process.env.lineSecretKey);
    lineData.setLineSecret(uuid, secretEncoded);
  }
};

const lineCheckService = () => {
  return { status: 200, message: 'OK!' };
};

module.exports = {
  lineWebhook,
  lineSubscriptionMessage,
  lineCheckService,
};
