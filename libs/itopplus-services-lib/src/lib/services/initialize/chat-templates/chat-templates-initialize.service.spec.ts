import * as data from '../../../data';
import { mock } from '../../../test/mock';
import { ChatTemplatesInitializeService } from './chat-templates-initialize.service';

jest.mock('../../data');
jest.mock('../plusmarservice.class');

describe('LeadInitializeService', () => {
  test('should be created', async () => {
    const service = new ChatTemplatesInitializeService();
    const pageID = 344;
    mock(data, 'addMessageTemplate', jest.fn());

    await service.initChatTemplates(pageID);
    expect(data.addMessageTemplate).toBeCalledTimes(16);
  });
});
