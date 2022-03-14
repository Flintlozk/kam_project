import { LanguageTypes } from '@reactor-room/model-lib';
import { AudienceDomainType, IMessageSetting } from '@reactor-room/itopplus-model-lib';

export const defaultThaiTextPageMessage = (): IMessageSetting => {
  const defaultText = {
    message1: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการการสั่งซื้อ',
    message2: 'ยืนยัน',
    message3: 'กรุณากดปุ่ม "ชำระเงิน" เพื่อไปยังหน้าต่างการชำระเงิน',
    message4: 'ชำระเงิน',
    message5: 'กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการการสั่งซื้อ',
    message6: 'ยืนยัน',
    message7: 'กรุณากดปุ่ม "ชำระเงิน" เพื่อไปยังหน้าต่างการชำระเงิน',
    message8: 'กรุณาดำเนินการชำระค่าสินค้าผ่านหมายเลขบัญชีด้านล่าง\nและแนบหลักฐานการจ่ายผ่านทางช่องทางนี้เท่านั้น',
    message9: 'หมายเลขติดตามสินค้า',
    message10: '-',
    message11: '-',
    message12: '-',
    message13: '-',
    message14: '-',
    message15: '-',
    message16: '-',
    message17: '-',
    message18: '-',
    message19: '-',
    terms_condition: '',
    type: AudienceDomainType.CUSTOMER,
    locale: LanguageTypes.THAI,
  };
  return defaultText;
};
export const defaultEnglishTextPageMessage = (): IMessageSetting => {
  const defaultText = {
    message1: '-',
    message2: '-',
    message3: '-',
    message4: '-',
    message5: '-',
    message6: '-',
    message7: '-',
    message8: '-',
    message9: '-',
    message10: '-',
    message11: '-',
    message12: '-',
    message13: '-',
    message14: '-',
    message15: '-',
    message16: '-',
    message17: '-',
    message18: '-',
    message19: '-',
    terms_condition: '',
    type: AudienceDomainType.CUSTOMER,
    locale: LanguageTypes.ENGLISH,
  };
  return defaultText;
};
