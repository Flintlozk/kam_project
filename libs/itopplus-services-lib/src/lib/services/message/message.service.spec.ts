import { environmentLib } from '@reactor-room/environment-services-backend';
import * as messageData from '../../data/message';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { MessageService } from './message.service';

const messageService = new MessageService();

jest.mock('../../data/message');
jest.mock('../plusmarservice.class');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../data/audience');
jest.mock('../../data/customer');

describe('Message Service', () => {
  test('searchMessage', async () => {
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };
    const messageSearchModel = {
      mid: 'string',
      text: 'string',
      pageID: 'string',
      sentBy: 'string',
    };
    mock(messageData, 'searchMessage', jest.fn().mockResolvedValueOnce(messageSearchModel));
    const result = await messageService.searchMessage(messageSearchModel);
    expect(result).toEqual(messageSearchModel);
  });

  test('getMessageExistenceById', async () => {
    PlusmarService.environment = { ...environmentLib, pageKey: 'WAKAKA' };

    mock(messageData, 'getMessageExistenceById', jest.fn().mockResolvedValueOnce(true));
    const result = await messageService.getMessageExistenceById('0000_0000', 1);
    expect(result).toEqual(true);
  });
});
