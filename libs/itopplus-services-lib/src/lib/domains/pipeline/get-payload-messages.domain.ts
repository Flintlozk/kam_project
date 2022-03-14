import { isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import { LanguageTypes } from '@reactor-room/model-lib';
import { BankAccountDetail, EnumHandleResponseMessageType, EnumPurchasingPayloadType, IMessageSetting, PayloadMessages } from '@reactor-room/itopplus-model-lib';
import { EnumToBankName } from '../payment/map-payment.domain';

export function getAdvanceMessage(pageID: number, type: EnumPurchasingPayloadType | EnumHandleResponseMessageType, messages?: IMessageSetting): PayloadMessages {
  let textList = {
    message1: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการการสั่งซื้อ',
    message2: 'ยืนยัน',
    message3: 'กรุณากดปุ่ม "ชำระเงิน" เพื่อไปยังหน้าต่างการชำระเงิน',
    message4: 'ชำระเงิน',
    message5: 'ทางร้านได้รับการชำระเงินเรียบร้อยแล้ว',
    message6: 'ยืนยันการสั่งซื้อแล้ว',
    message7: 'ทางร้านจะดำเนินการจัดส่งสินค้าของท่านโดยเร็วที่สุดนะคะ และจะส่งหมายเลข Tracking No. ให้ลูกค้านะคะ',
    message8: 'กรุณาดำเนินการชำระค่าสินค้าผ่านหมายเลขบัญชีด้านล่าง\nและแนบหลักฐานการจ่ายผ่านทางช่องทางนี้เท่านั้น',
    message9: 'หมายเลขติดตามสินค้า',
  };
  if (!isEmpty(messages)) textList = messages;

  switch (type) {
    case EnumPurchasingPayloadType.CONFIRM_ORDER:
    case EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT: {
      return {
        title: textList.message1,
        subtitle: textList.message2,
      };
    }
    case EnumPurchasingPayloadType.REPEAT_SEND_CHECKOUT:
    case EnumPurchasingPayloadType.CHECKOUT_PAYPAL:
    case EnumPurchasingPayloadType.CHECKOUT_2C2P:
    case EnumPurchasingPayloadType.CHECKOUT_OMISE: {
      return {
        title: textList.message3,
        subtitle: textList.message4,
      };
    }

    case EnumHandleResponseMessageType.SUBMIT_PAYMENT:
    case EnumHandleResponseMessageType.SUBMIT_2C2P_PAYMENT:
    case EnumHandleResponseMessageType.SUBMIT_PAYPAL_PAYMENT: {
      return {
        title: textList.message5,
        subtitle: textList.message7,
      };
    }

    case EnumPurchasingPayloadType.SEND_BANK_ACCOUNT: {
      return {
        title: textList.message8,
        subtitle: '-',
      };
    }
    case EnumHandleResponseMessageType.CORRECT_ADDRESS:
    case EnumHandleResponseMessageType.CORRECT_ADDRESS_COD: {
      return {
        title: textList.message7,
        subtitle: textList.message6,
      };
    }
    case EnumPurchasingPayloadType.SEND_TRACKING_NUMBER:
    case EnumPurchasingPayloadType.SEND_TRACKING_NUMBER_COD: {
      return {
        title: textList.message9,
        subtitle: '-',
      };
    }
  }
}

export function getMessageForBankMethod(account: BankAccountDetail[], locale = LanguageTypes.THAI): string {
  let message = '' as string;
  message += `\n${locale === LanguageTypes.THAI ? 'หมายเลขบัญชี' : 'Accounts'}\n\n`;

  for (let i = 0; i < account.length; i++) {
    const item = account[i];
    const bankdetail = EnumToBankName(item.bank_type);
    message += `${locale === LanguageTypes.THAI ? 'ธนาคาร' : 'Bank'} ${bankdetail.name}\n`;
    message += `${locale === LanguageTypes.THAI ? 'เลขบัญชี' : 'Acc. Number:'} ${item.account_id}\n`;
    message += `${locale === LanguageTypes.THAI ? 'ชื่อบัญชี' : 'Acc. Name'} ${item.account_name}\n\n`;
  }
  return message;
}
