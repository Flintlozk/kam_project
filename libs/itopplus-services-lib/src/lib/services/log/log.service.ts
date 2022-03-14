import { ILog, ILogReturn, LogFilters } from '@reactor-room/itopplus-model-lib';
import { addLog, getLog, getUsersList } from '../../data/settings';
import { ILogInput, ILogUser } from '@reactor-room/itopplus-model-lib';
import { PlusmarService } from '../plusmarservice.class';

export class LogService {
  addLog = async (logInput: ILogInput, pageID: number): Promise<ILog> => {
    return await addLog(logInput, pageID);
  };

  getLog = async (filters: LogFilters, pageID: number): Promise<ILogReturn> => await getLog(filters, pageID);

  getUsersList = async (pageID: number): Promise<ILogUser[]> => await getUsersList(PlusmarService.readerClient, pageID);
}
