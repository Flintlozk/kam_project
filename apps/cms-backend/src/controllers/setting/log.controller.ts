import { EnumAuthScope, IGQLContext, ILogFilterInput, ILogReturn, ILogUser } from '@reactor-room/itopplus-model-lib';
import { LogService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateLog, validateUsersList } from '../../schema/log/log.schema';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.CMS])
class SettingLog {
  public static instance: SettingLog;
  public static logService: LogService;
  public static getInstance(): SettingLog {
    if (!SettingLog.instance) SettingLog.instance = new SettingLog();
    return SettingLog.instance;
  }

  constructor() {
    SettingLog.logService = new LogService();
  }
  async getLogHandler(parent, args: { logFilter: ILogFilterInput }, context: IGQLContext): Promise<ILogReturn> {
    const { logFilter } = args;
    const { pageID } = context.payload;
    const result = await SettingLog.logService.getLog(logFilter, pageID);
    return result;
  }
  async getUsersListHandler(parent, args, context: IGQLContext): Promise<ILogUser[]> {
    const { pageID } = context.payload;
    return await SettingLog.logService.getUsersList(pageID);
  }
}

const log: SettingLog = new SettingLog();
export const settingLogResolver = {
  Query: {
    getLog: graphQLHandler({
      handler: log.getLogHandler,
      validator: validateLog,
    }),
    getUsersList: graphQLHandler({
      handler: log.getUsersListHandler,
      validator: validateUsersList,
    }),
  },
};
