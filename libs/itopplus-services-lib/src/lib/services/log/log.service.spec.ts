import { getUTCMongo } from '@reactor-room/itopplus-back-end-helpers';
import { ILog, ILogInput } from '@reactor-room/itopplus-model-lib';
import * as data from '../../data/settings';
import { LogService } from './log.service';

jest.mock('../../data/settings');

describe('Log Service : addLogEntry()', () => {
  test('addLogEntry() should not return null', async () => {
    const log = new LogService();
    const _mockNewLogEntry = {
      user_id: 1,
      type: 'Read new message',
      action: 'Update',
      description: 'ANY_TO_FOLLOW',
      subject: 'Subject Name',
      user_name: 'Admin Name',
      created_at: getUTCMongo(),
    } as ILogInput;

    const expected: ILog = {
      pageID: 1,
      user_id: 1,
      type: 'Read new message',
      action: 'Update',
      description: 'ANY_TO_FOLLOW',
      user_name: 'Admin Name',
      created_at: getUTCMongo(),
      total_rows: 1,
    };

    const addLogEntrySpy = jest.spyOn(data, 'addLog');
    const promise: Promise<ILog> = new Promise((resolve, reject) => resolve(expected));
    addLogEntrySpy.mockResolvedValueOnce(promise);
    const result: ILog = await log.addLog(_mockNewLogEntry, 1);
    expect(result).not.toBeNull();
    expect(result).toEqual(expected);
  });
});
