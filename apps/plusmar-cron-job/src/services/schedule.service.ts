import { IPageThirdPartyEnv } from '@reactor-room/itopplus-model-lib';
import { ProductMarketPlaceService, PurchaseOrderService } from '@reactor-room/itopplus-services-lib';
import * as nodeSchedule from 'node-schedule';

export class ScheduleService {
  private marketPlaceService: ProductMarketPlaceService;
  private purchaseOrderService: PurchaseOrderService;

  constructor() {
    this.purchaseOrderService = new PurchaseOrderService();
    this.marketPlaceService = new ProductMarketPlaceService();
  }

  //every 10 mins
  scheduleMarketPlaceOrderAndInventroyUpdate({ lazadaEnv, shopeeEnv }: IPageThirdPartyEnv): void {
    const everyTenMinutes = '*/10 * * * *';
    nodeSchedule.scheduleJob(everyTenMinutes, async () => {
      await this.marketPlaceService.updateCronMarketPlaceOrders({ lazadaEnv, shopeeEnv });
    });
  }

  //every month day 1 on 1A.M
  scheduleMarketPlaceProductBrands({ lazadaEnv, shopeeEnv }: IPageThirdPartyEnv): void {
    const everyMonthAtMidNight = new nodeSchedule.RecurrenceRule();
    everyMonthAtMidNight.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    everyMonthAtMidNight.date = 1;
    everyMonthAtMidNight.hour = 18;
    everyMonthAtMidNight.minute = 0;
    everyMonthAtMidNight.tz = 'Etc/UTC';
    nodeSchedule.scheduleJob(everyMonthAtMidNight, async () => {
      await this.marketPlaceService.updateCronMarketPlaceBrand({ lazadaEnv, shopeeEnv });
    });
  }

  //every month day 1 on 2A.M
  scheduleMarketPlaceCategoryTree({ lazadaEnv, shopeeEnv }: IPageThirdPartyEnv): void {
    const everyMonthAt1AM = new nodeSchedule.RecurrenceRule();
    everyMonthAt1AM.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    everyMonthAt1AM.date = 1;
    everyMonthAt1AM.hour = 19;
    everyMonthAt1AM.minute = 0;
    everyMonthAt1AM.tz = 'Etc/UTC';
    nodeSchedule.scheduleJob(everyMonthAt1AM, async () => {
      await this.marketPlaceService.updateCronMarketPlaceCategoryTree({ lazadaEnv, shopeeEnv });
    });
  }

  checkExpiryPurchaseOrdersAndReleaseReservedItem(): void {
    let start = false;
    nodeSchedule.scheduleJob('*/5 * * * *', async () => {
      if (!start) {
        start = true;
        await this.purchaseOrderService.checkAndReleasePurchaseOrderItemsExpiries();
        /* process finish-ed*/
        start = false;
      }
    });
  }
}
