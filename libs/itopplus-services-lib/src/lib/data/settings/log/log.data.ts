import { ILog, ILogInput, ILogUser, LogFilters, ILogReturn } from '@reactor-room/itopplus-model-lib';
import { logSchemaModel as Log } from '@reactor-room/plusmar-model-mongo-lib';

import { timestampToId, parseTimestampToDayjs } from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';

export async function addLog(logInput: ILogInput, pageID: number): Promise<ILog> {
  const params = { ...logInput, pageID };
  params.created_at = parseTimestampToDayjs(params.created_at).toDate();
  const log = new Log(params);
  return await log.save();
}

export async function getLog({ pageSize, currentPage, startDate, endDate, modifiedBy, orderBy, orderMethod }: LogFilters, pageID: number): Promise<ILogReturn> {
  const findScope: ILog = {
    pageID,
    _id: { $gte: timestampToId(startDate), $lte: timestampToId(endDate, '23:59') },
    ...(modifiedBy && { user_id: Number(modifiedBy) }),
  };

  const logsPromise = await Log.find(findScope)
    .limit(pageSize)
    .skip(pageSize * (currentPage - 1))
    .sort({ [orderBy]: orderMethod })
    .exec();
  const logCount = await Log.find(findScope).countDocuments();
  return {
    logs: logsPromise,
    total_rows: logCount,
  };
}

export async function getUsersList(client: Pool, pageID: number): Promise<ILogUser[]> {
  const query = 'SELECT users.name as user_name, users.id as user_id FROM user_page_mapping upm JOIN users ON upm.user_id = users.id WHERE upm.page_id = :pageID';
  const { sql, bindings } = PostgresHelper.convertParameterizedQuery(query, { pageID });
  return await PostgresHelper.execQuery<ILogUser[]>(client, sql, bindings);
}
