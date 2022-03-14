const { PubSub } = require('@google-cloud/pubsub');
let connection = new PubSub();

function getTopicFacebook(pubObject) {
  const STAGING_ENTRY =
    pubObject.object == 'page' && pubObject.entry[0].id == '304943246310414'
      ? 'GREAN_APP'
      : pubObject.object == 'page' && pubObject.entry[0].id == '104971717895360'
      ? 'KUB_PHOM'
      : pubObject.object == 'page' && pubObject.entry[0].id == '1637973742954423'
      ? 'GELD_TONER'
      : pubObject.object == 'page' && pubObject.entry[0].id == '106821459400821'
      ? 'NDSL'
      : pubObject.object == 'page' && pubObject.entry[0].id == '180850905258728'
      ? 'THEICONWEB'
      : pubObject.object == 'page' && pubObject.entry[0].id == '227391254046211'
      ? 'THAILAND_ONLINE_MARKETING'
      : pubObject.object == 'page' && pubObject.entry[0].id == '2029719227341562'
      ? 'TRAFIK_THAILAND'
      : pubObject.object == 'page' && pubObject.entry[0].id == '100739105790930'
      ? 'MC_TEST_11'
      : pubObject.object == 'page' && pubObject.entry[0].id == '108889831628860'
      ? 'MC_TEST_12'
      : 'PRODUCTION';

  let TOPIC = 'plusmar-production';
  switch (STAGING_ENTRY) {
    // DEV
    case 'GREAN_APP':
      TOPIC = 'plusmar-staging-page1';
      break;
    case 'GELD_TONER':
      TOPIC = 'plusmar-staging-page2';
      break;
    case 'NDSL':
      TOPIC = 'plusmar-staging-page3';
      break;
    case 'THEICONWEB':
      TOPIC = 'plusmar-staging-page4';
      break;
    case 'THAILAND_ONLINE_MARKETING':
      TOPIC = 'plusmar-staging-page5';
      break;
    case 'KUB_PHOM':
      TOPIC = 'plusmar-staging-page7';
      break;
    case 'MC_TEST_12':
      TOPIC = 'plusmar-staging-page12';
      break;
    // Staging
    case 'TRAFIK_THAILAND':
      TOPIC = 'plusmar-staging-page6';
      break;
    case 'MC_TEST_11':
      TOPIC = 'plusmar-staging-page6';
      break;
    // Production
    default:
      TOPIC = 'plusmar-production';
  }
  return TOPIC;
}

// this fuction trigger the message to webhook we need to change getTopicLine in plusmar-webhook too
// ฟังก์ชั่นนี้ทำงานเกี่ยวกับการส่งข้อความไปที่ตัวรับข้อความ ถ้าแก้ไขกรุณาแก้ไขที่โปรเจค plusmar-webhook ด้วย
function getTopicLine(channelSecret) {
  // channelSecret === '6ca5e4058a6f2c1c33bf109e111993a7'
  // ? 'DEV_LINEOA_3'
  // : channelSecret === 'a9f53238892511c6c3a0bd8bcf45b5d7'
  // ? 'DEV_LINEOA_5'
  // : channelSecret === 'b1da754e2bbabe13aa938cc33660c9aa'
  // ? 'DEV_LINEOA_4'
  // : channelSecret === '8cd2b6be11086d516c4ee4e11d42fd29'
  // ? 'DEV_LINEOA_6'
  // : channelSecret === '8cd2b6be11086d516c4ee4e11d42fd29'
  // ? 'DEV_LINEOA_7'
  // : channelSecret === '82c3ade02734e0962c9e701674d1eaa1'
  // ? 'DEV_LINEOA_1'
  // : '';

  let STAGING_ENTRY = '';
  switch (channelSecret) {
    //DEV
    case '82c3ade02734e0962c9e701674d1eaa1':
      STAGING_ENTRY = 'DEV_LINEOA_1';
      break;
    case '6ca5e4058a6f2c1c33bf109e111993a7':
      STAGING_ENTRY = 'DEV_LINEOA_3';
      break;
    case 'a9f53238892511c6c3a0bd8bcf45b5d7':
      STAGING_ENTRY = 'DEV_LINEOA_5';
      break;
    case 'b1da754e2bbabe13aa938cc33660c9aa':
      STAGING_ENTRY = 'DEV_LINEOA_4';
      break;
    // case '8cd2b6be11086d516c4ee4e11d42fd29':
    //   STAGING_ENTRY = 'DEV_LINEOA_7';
    //   break;
    // STAGING
    case '8cd2b6be11086d516c4ee4e11d42fd29':
      STAGING_ENTRY = 'DEV_LINEOA_6';
      break;
    case '4ad144f0dd073152113206eb136e6ea1':
      STAGING_ENTRY = 'DEV_LINEOA_6';
      break;
    //PRODUCTION
    default:
      STAGING_ENTRY = '';
      break;
  }

  let TOPIC = 'plusmar-line-production';
  switch (STAGING_ENTRY) {
    // DEV
    case 'DEV_LINEOA_3':
      TOPIC = 'plusmar-line-staging3';
      break;
    case 'DEV_LINEOA_4':
      TOPIC = 'plusmar-line-staging4';
      break;
    case 'DEV_LINEOA_5':
      TOPIC = 'plusmar-line-staging5';
      break;
    case 'DEV_LINEOA_7':
      TOPIC = 'plusmar-line-staging7';
      break;
    case 'DEV_LINEOA_1':
      TOPIC = 'plusmar-line-staging1';
      break;
    // STAGING
    case 'DEV_LINEOA_6':
      TOPIC = 'plusmar-line-staging6';
      break;
    // PRODUCTION
    default:
      TOPIC = 'plusmar-line-production';
  }
  return TOPIC;
}

async function publishMessage(payload, topicName) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const dataBuffer = Buffer.from(data);
    connection
      .topic(topicName)
      .publish(dataBuffer)
      .then((messageId) => {
        console.log(`Message ${messageId} published.`);
        resolve();
      })
      .catch((e) => {
        // Move here because if reaven is gone don't make system failed until this catch.
        console.log(e);
        connection = new PubSub();
        resolve();
      });
  });
}

module.exports = {
  publishMessage,
  getTopicFacebook,
  getTopicLine,
};
