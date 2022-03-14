import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumAppScopeType } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { PlusmarService } from '..';
import { setPageAppScopeByPageID } from '../../data';
import { getAllPageIDWithoutAppScope } from '../../data/admin/migrations/set-migrations.data';

export class AdminMigrationService {
  constructor() {}

  async doMigratePageApplicationScope(): Promise<IHTTPResult> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    const values = await getAllPageIDWithoutAppScope(client);

    if (values.length < 1) {
      return {
        status: 200,
        value: 'ok',
      };
    }

    for (let index = 0; index < values.length; index++) {
      const { pageID } = values[index];
      await setPageAppScopeByPageID(client, pageID, EnumAppScopeType.MORE_COMMERCE);
    }
    await PostgresHelper.execBatchCommitTransaction(client);

    return {
      status: 200,
      value: 'ok',
    };
  }
}
