import { getLogsForTestConnectionMongo, getSubscriptionPlansForTestConnectionPG } from '../../data/monitoring/monitoring.data';
import { IHTTPResult } from '@reactor-room/model-lib';
import { PlusmarService } from '../plusmarservice.class';

export class MonitoringService {
  constructor() {}
  async monitoringMongo(): Promise<IHTTPResult> {
    try {
      await getLogsForTestConnectionMongo();
      return { status: 200, value: 'SUCCESS' } as IHTTPResult;
    } catch (error) {
      return { status: 500, value: 'ERROR' } as IHTTPResult;
    }
  }
  async monitoringPG(): Promise<IHTTPResult> {
    try {
      await getSubscriptionPlansForTestConnectionPG(PlusmarService.readerClient);
      return { status: 200, value: 'SUCCESS' } as IHTTPResult;
    } catch (error) {
      return { status: 500, value: 'ERROR' } as IHTTPResult;
    }
  }
}
