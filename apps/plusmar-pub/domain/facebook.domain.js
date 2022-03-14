/* eslint-disable */
/* prettier-ignore-start */
const { signHmacSha1 } = require('./crypto.domain');

function hashEquals(ahmac, ghmac) {
  if (ahmac == ghmac) return true;
  return false;
}

function checkHashReqeustFacebook(rawPostData, xHubSignature) {
  if (xHubSignature) {
    if (xHubSignature.indexOf('sha1=') !== -1) {
      var { signed, signedTest, signedOld } = signHmacSha1(rawPostData);
      var signature = xHubSignature.replace('sha1=', '');
      return hashEquals(signature, signed) || hashEquals(signature, signedTest) || hashEquals(signature, signedOld);
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function getDeliveryFromMessage(webhook) {
  // return webhook.entry[0].messaging[0].delivery
  if (webhook && webhook.hasOwnProperty('entry')) {
    const { entry: entries } = webhook;
    const entry = Array.isArray(entries) ? entries[0] : undefined;
    if (entry) {
      const messaging = entry.hasOwnProperty('messaging') ? entry.messaging : undefined;
      if (messaging) {
        const message = Array.isArray(messaging) ? messaging[0] : undefined;
        if (message) {
          return message.hasOwnProperty('delivery') ? message.delivery : undefined;
        }
      }
    }
  }

  return undefined;
}

function getMessage(webhook) {
  // return webhook.entry[0].messaging[0].delivery
  if (webhook && webhook.hasOwnProperty('entry')) {
    const { entry: entries } = webhook;
    const entry = Array.isArray(entries) ? entries[0] : undefined;
    if (entry) {
      const messaging = entry.hasOwnProperty('messaging') ? entry.messaging : undefined;
      if (messaging) {
        return Array.isArray(messaging) ? messaging[0] : undefined;
      }
    }
  }

  return undefined;
}

function getEntryFromMessage(webhook) {
  // return webhook.entry[0].messaging[0].delivery
  if (webhook && webhook.hasOwnProperty('entry')) {
    const { entry: entries } = webhook;
    return Array.isArray(entries) ? entries[0] : undefined;
  }

  return undefined;
}

function getReadFromMessage(webhook) {
  // return webhook.entry[0].messaging[0].delivery.watermark;
  if (webhook && webhook.hasOwnProperty('entry')) {
    const { entry: entries } = webhook;
    const entry = Array.isArray(entries) ? entries[0] : undefined;
    if (entry) {
      const messaging = entry.hasOwnProperty('messaging') ? entry.messaging : undefined;
      if (messaging) {
        const message = Array.isArray(messaging) ? messaging[0] : undefined;
        if (message) {
          return message.hasOwnProperty('read') ? message.read : undefined;
          // if (read) {
          //   return read.hasOwnProperty('watermark') ? read.watermark : undefined;
          // } else {
          //   return undefined;
          //   // const delivery = message.hasOwnProperty('delivery') ? message.delivery : undefined;
          //   // if (delivery) return delivery.hasOwnProperty('watermark') ? delivery.watermark : undefined;
          // }
        }
      }
    }
  }

  return undefined;
}

function getEchoFromMessage(webhook) {
  if (webhook && webhook.hasOwnProperty('entry')) {
    const { entry: entries } = webhook;
    const entry = Array.isArray(entries) ? entries[0] : undefined;
    if (entry) {
      const messaging = entry.hasOwnProperty('messaging') ? entry.messaging : undefined;
      if (messaging) {
        const message = Array.isArray(messaging) ? messaging[0] : undefined;
        if (message) {
          const messagecontent = message.hasOwnProperty('message') ? message.message : undefined;
          if (messagecontent) return messagecontent.hasOwnProperty('is_echo') ? messagecontent.is_echo : undefined;
        }
      }
    }
  }
}
function getStandByFromMessage(webhook) {
  if (webhook && webhook.hasOwnProperty('entry')) {
    const { entry: entries } = webhook;
    const entry = Array.isArray(entries) ? entries[0] : undefined;
    if (entry) {
      return entry.hasOwnProperty('standby') ? entry.standby : undefined;
    }
  }

  return undefined;
}

function getMessageIDFromMessage(webhook) {
  //return webhook?.entry?.[0]?.messaging?.[0]?.message?.mid;
  if (webhook && webhook.hasOwnProperty('entry')) {
    const { entry: entries } = webhook;
    const entry = Array.isArray(entries) ? entries[0] : undefined;
    if (entry) {
      const messaging = entry.hasOwnProperty('messaging') ? entry.messaging : undefined;
      if (messaging) {
        const messagingFirst = Array.isArray(messaging) ? messaging[0] : undefined;
        if (messagingFirst) {
          const message = messagingFirst.hasOwnProperty('message') ? messagingFirst.message : undefined;
          if (message) {
            return message.hasOwnProperty('mid') ? message.mid : undefined;
          }
        }
      }
    }
  }
  return undefined;
}

module.exports = {
  hashEquals,
  checkHashReqeustFacebook,
  getDeliveryFromMessage,
  getReadFromMessage,
  getEchoFromMessage,
  getStandByFromMessage,
  getEntryFromMessage,
  getMessage,
  getMessageIDFromMessage,
};
/* prettier-ignore-end */
