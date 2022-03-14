import { EnumAuthScope, IGQLContext, ILog, ILogFilterInput, ILogInput, ILogReturn, ILogUser } from '@reactor-room/itopplus-model-lib';
import { LogService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateLog, validateLogEntity, validateUsersList } from '../../../schema/setting/';
import { graphQLHandler } from '../../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class Log {
  public static instance: Log;
  public static logService: LogService;
  public static getInstance(): Log {
    if (!Log.instance) Log.instance = new Log();
    return Log.instance;
  }

  constructor() {
    Log.logService = new LogService();
  }

  async addLogHandler(parent, args: { logInput: ILogInput }, context: IGQLContext): Promise<ILog> {
    const { logInput } = args;
    const { pageID } = context.payload;
    return await Log.logService.addLog(logInput, pageID);
  }

  async getLogHandler(parent, args: { logFilter: ILogFilterInput }, context: IGQLContext): Promise<ILogReturn> {
    const { logFilter } = args;
    const { pageID } = context.payload;
    const result = await Log.logService.getLog(logFilter, pageID);
    return result;
  }

  async getUsersListHandler(parent, args, context: IGQLContext): Promise<ILogUser[]> {
    const { pageID } = context.payload;
    return await Log.logService.getUsersList(pageID);
  }
}

const log: Log = new Log();
export const logResolver = {
  Mutation: {
    addLogEntry: graphQLHandler({
      handler: log.addLogHandler,
      validator: validateLogEntity,
    }),
  },
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
