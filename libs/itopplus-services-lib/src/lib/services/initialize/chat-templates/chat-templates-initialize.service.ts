import { Message } from '@reactor-room/itopplus-model-lib';
import { addMessageTemplate } from '../../../data';
import { PagesError } from '../../../errors';
import { PlusmarService } from '../../plusmarservice.class';

export class ChatTemplatesInitializeService {
  async initChatTemplates(pageID: number): Promise<void> {
    try {
      const messages: Message[] = [
        {
          id: null,
          shortcut: 'แนะนำ',
          text: 'ชิ้นนี้เป็นชิ้นที่ทางร้านแนะนำเลยค่ะ',
        },
        {
          id: null,
          shortcut: 'ชิ้นไหน?',
          text: 'คุณลูกค้าอยากได้เป็น.....หรือ.....ดีคะ',
        },
        {
          id: null,
          shortcut: 'ชิ้นสุดท้าย',
          text: 'ชิ้นนี้เหลือเป็นชิ้นสุดท้ายในร้านแล้วค่ะ',
        },
        {
          id: null,
          shortcut: 'พิเศษ',
          text: 'ถ้าลูกค้าสั่งตอนนี้ เดี๋ยวทางร้านให้ราคาพิเศษเลยนะคะ',
        },
        {
          id: null,
          shortcut: 'เหมาะ',
          text: 'เหมาะกับคุณลูกค้ามากๆเลยค่ะ',
        },
        {
          id: null,
          shortcut: 'ชื่อ?',
          text: 'รบกวนขอทราบชื่อคุณลูกค้าค่ะ',
        },
        {
          id: null,
          shortcut: 'ไซส์?',
          text: 'คุณลูกค้าต้องการไซส์ไหนคะ',
        },
        {
          id: null,
          shortcut: 'สี?',
          text: 'คุณลูกค้าต้องการสีไหนคะ',
        },
        {
          id: null,
          shortcut: 'พร้อม',
          text: 'สินค้าชิ้นนี้พร้อมส่งค่ะ',
        },
        {
          id: null,
          shortcut: 'หมด',
          text: 'ขอโทษด้วยนะคะ สินค้าตัวนี้หมดแล้วค่ะ',
        },
        {
          id: null,
          shortcut: 'หมด แต่',
          text: 'ขอโทษด้วยค่ะ สินค้าตัวนี้หมดแล้ว แต่เรายังมี.....พร้อมส่งค่ะ',
        },
        {
          id: null,
          shortcut: 'ราคา',
          text: 'ราคา.....บาทค่ะ',
        },
        {
          id: null,
          shortcut: 'โอน',
          text: 'รบกวนคุณลูกค้าโอนเงินไปที่บัญชี.....ค่ะ',
        },
        {
          id: null,
          shortcut: 'ที่อยู่?',
          text: 'รบกวนขอที่อยู่ในการจัดส่งด้วยค่ะ',
        },
        {
          id: null,
          shortcut: 'เลขพัสดุ',
          text: 'ตัวนี้เป็นหมายเลขติดตามพัสดุนะคะ',
        },
        {
          id: null,
          shortcut: 'รับ',
          text: 'คุณลูกค้าจะได้รับพัสดุภายใน.....วันนะคะ',
        },
      ];
      await Promise.all(
        messages.map(async (msg) => {
          await addMessageTemplate(PlusmarService.writerClient, pageID, msg);
        }),
      );
    } catch (err) {
      throw new PagesError('FAIL_INIT_CHAT_TEMPLATE');
    }
  }
}
