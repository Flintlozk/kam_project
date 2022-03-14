import * as data from '../../data';
import { defaultEnglishTextPageMessage, defaultThaiTextPageMessage } from '../../domains/pages/page-message-default.domain';
import { mock } from '../../test/mock';
import { PagesService } from './pages.service';
const pages = new PagesService();
jest.mock('../../data');
describe('Advance Message', () => {
  test('get Default Message and Thai language', async () => {
    const defaultResult = defaultThaiTextPageMessage();
    mock(data, 'getPageMessage', jest.fn().mockResolvedValueOnce(defaultResult));
    mock(data, 'savePageMessage', jest.fn().mockResolvedValueOnce([defaultResult]));
    const getMessage = await pages.getPageMessage(1, '');

    expect(getMessage.message1).toEqual('กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการการสั่งซื้อ');
    expect(getMessage.message2).toEqual('ยืนยัน');
    expect(getMessage.message3).toEqual('กรุณากดปุ่ม "ชำระเงิน" เพื่อไปยังหน้าต่างการชำระเงิน');
    expect(getMessage.message4).toEqual('ชำระเงิน');
    expect(getMessage.message5).toEqual('กรุณากดปุ่ม "ยืนยัน" เพื่อดำเนินการการสั่งซื้อ');
    expect(getMessage.message6).toEqual('ยืนยัน');
    expect(getMessage.message7).toEqual('กรุณากดปุ่ม "ชำระเงิน" เพื่อไปยังหน้าต่างการชำระเงิน');
    expect(getMessage.message8).toEqual('กรุณาดำเนินการชำระค่าสินค้าผ่านหมายเลขบัญชีด้านล่าง\nและแนบหลักฐานการจ่ายผ่านทางช่องทางนี้เท่านั้น');
    expect(getMessage.message9).toEqual('หมายเลขติดตามสินค้า');
  });
  test('get Default Message and English language', async () => {
    const defaultResult = defaultEnglishTextPageMessage();
    mock(data, 'getPageMessage', jest.fn().mockResolvedValueOnce(defaultResult));
    mock(data, 'savePageMessage', jest.fn().mockResolvedValueOnce([defaultResult]));
    const getMessage = await pages.getPageMessage(1, '');

    expect(getMessage.message1).toEqual('-');
    expect(getMessage.message2).toEqual('-');
    expect(getMessage.message3).toEqual('-');
    expect(getMessage.message4).toEqual('-');
    expect(getMessage.message5).toEqual('-');
    expect(getMessage.message6).toEqual('-');
    expect(getMessage.message7).toEqual('-');
    expect(getMessage.message8).toEqual('-');
    expect(getMessage.message9).toEqual('-');
  });
});
