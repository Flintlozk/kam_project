import crypto from 'crypto';

export function isNotEmpty(value) {
  if (value !== undefined && value !== null && value !== '') {
    return true;
  } else {
    return false;
  }
}

// this fuction trigger the message to webhook we need to change getTopicLine in plusmar-pub too
// ฟังก์ชั่นนี้ทำงานเกี่ยวกับการส่งข้อความไปที่ตัวรับข้อความ ถ้าแก้ไขกรุณาแก้ไขที่โปรเจค plusmar-pub ด้วย
export function getTopicLine(channelSecret) {
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
    //DEV
    case 'DEV_LINEOA_1':
      TOPIC = 'plusmar-line-staging1';
      break;
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

export function getLineSignature(channelSecret, body) {
  return crypto.createHmac('SHA256', channelSecret).update(body).digest('base64').toString();
}
