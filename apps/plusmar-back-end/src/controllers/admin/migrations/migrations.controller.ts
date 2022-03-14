import { EnumAuthScope, ICustoemrListFilter, IGQLContext } from '@reactor-room/itopplus-model-lib';
import { AdminMigrationService, requireScope } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { graphQLHandler } from '../../graphql-handler';

@requireScope([EnumAuthScope.ADMIN])
class AdminMigrations {
  public static instance: AdminMigrations;
  public static AdminMigrationService: AdminMigrationService;
  public static getInstance(): AdminMigrations {
    if (!AdminMigrations.instance) AdminMigrations.instance = new AdminMigrations();
    return AdminMigrations.instance;
  }

  constructor() {
    AdminMigrations.AdminMigrationService = new AdminMigrationService();
  }
  async doMigratePageApplicationScopeHandler(parent, args: { filters: ICustoemrListFilter }, context: IGQLContext): Promise<IHTTPResult> {
    const result = await AdminMigrations.AdminMigrationService.doMigratePageApplicationScope();
    return result;
  }
}

const adminMigrations: AdminMigrations = AdminMigrations.getInstance();
export const adminMigrationsResolver = {
  Mutation: {
    doMigratePageApplicationScope: graphQLHandler({
      handler: adminMigrations.doMigratePageApplicationScopeHandler,
      validator: (x) => x,
    }),
  },
};
