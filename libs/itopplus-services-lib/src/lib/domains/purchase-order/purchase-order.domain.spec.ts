import { createAliasPOID } from './purchase-order.domain';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import * as dayjs from 'dayjs';
import { mock } from '../../test/mock';

jest.mock('@reactor-room/itopplus-back-end-helpers');
describe('createAliasPOID', () => {
  const day = dayjs('03-09-2021', 'MM-DD-YYYY');
  test('create alias po id form given day', () => {
    mock(helpers, 'getUTCDayjs', jest.fn().mockReturnValue(day));

    const result = createAliasPOID(1);
    expect(result).toEqual('OR-21030900002');
  });
});
