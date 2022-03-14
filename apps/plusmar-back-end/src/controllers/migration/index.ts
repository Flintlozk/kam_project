import { expressHandler } from '../express-handler';
import { MigrationService } from '@reactor-room/itopplus-services-lib';

class Migration {
  public static instance: Migration;
  public static migrationsService: MigrationService;

  public static getInstance(): Migration {
    if (!Migration.instance) Migration.instance = new Migration();
    return Migration.instance;
  }
  constructor() {
    Migration.migrationsService = new MigrationService();
  }

  async migrateUserSocialScopeHandler(): Promise<void> {
    await Migration.migrationsService.migrateUserSocialScope();
  }

  async migrateLogisticHandler(): Promise<void> {
    await Migration.migrationsService.migrationLogistic();
  }
}

const migrationsController = Migration.getInstance();
export const MigrationController = {
  migrateUserSocialScope: expressHandler({
    handler: migrationsController.migrateUserSocialScopeHandler,
    validator: (data) => data,
  }),
  migrateLogisticScope: expressHandler({
    handler: migrationsController.migrateLogisticHandler,
    validator: (data) => data,
  }),
};
