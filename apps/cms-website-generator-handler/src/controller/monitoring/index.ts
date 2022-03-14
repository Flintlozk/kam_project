import { IHTTPResult } from '@reactor-room/model-lib';
import { MonitoringService } from '@reactor-room/itopplus-services-lib';

class Monitoring {
  public static instance: Monitoring;
  public static monitoringService: MonitoringService;

  public static getInstance(): Monitoring {
    if (!Monitoring.instance) Monitoring.instance = new Monitoring();
    return Monitoring.instance;
  }
  constructor() {
    Monitoring.monitoringService = new MonitoringService();
  }

  async monitoringMongoHandler(): Promise<IHTTPResult> {
    return await Monitoring.monitoringService.monitoringMongo();
  }
}

const monitoring = Monitoring.getInstance();
export const monitoringController = {
  monitoringMongo: monitoring.monitoringMongoHandler,
};
