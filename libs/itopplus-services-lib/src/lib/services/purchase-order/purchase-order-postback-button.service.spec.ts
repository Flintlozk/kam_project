import { PurchaseOrderPostbackButtonService } from './purchase-order-postback-button.service';
import { mock } from '../../test/mock';
import { EnumHandleResponseMessageType } from '@reactor-room/itopplus-model-lib';

describe('PurchaseOrderPostbackButtonService | handlePostbackButton()', () => {
  const PSID = 'PSIDPSIDPSIDPSID';
  const pageID = 91;
  const audienceID = '1230129';

  test('case RESPONSE_CONFIRM_ORDER should call expected function', async () => {
    const func = new PurchaseOrderPostbackButtonService();
    mock(func, 'onConfirmOrder', jest.fn());
    const responseType = EnumHandleResponseMessageType.RESPONSE_CONFIRM_ORDER;
    await func.handlePostbackButton(responseType, PSID, audienceID, pageID);
    expect(func.onConfirmOrder).toHaveBeenCalled();
  });
});
