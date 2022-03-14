import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumLogisticDeliveryProviderType, EnumTrackingType } from '@reactor-room/itopplus-model-lib';
import { deleteLogisticFromDeliveryType, activeLogisticFromDeliveryType } from '../../data';
import { migrateUserSocialScope } from '../../data/migration/migration.data';
import { PlusmarService } from '../plusmarservice.class';

export class MigrationService {
  constructor() {}
  async migrateUserSocialScope(): Promise<void> {
    await migrateUserSocialScope(PlusmarService.writerClient);
  }

  async migrationLogistic(): Promise<void> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    await deleteLogisticFromDeliveryType(client, EnumLogisticDeliveryProviderType.EMS_THAILAND);
    await deleteLogisticFromDeliveryType(client, EnumLogisticDeliveryProviderType.CUSTOM);
    await activeLogisticFromDeliveryType(client, EnumLogisticDeliveryProviderType.THAILAND_POST, EnumTrackingType.MANUAL);
    await PostgresHelper.execBatchCommitTransaction(client);
  }
}
