import { environmentLib } from '@reactor-room/environment-services-backend';
import { EnumNatsSupportFeature, getNatsSubscription, getStreamNameByFeature } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { getPageIDWhereVariantsMoreThanOne } from '../data/get-pages.data';

export class ProductInventorySubscriptionService {
  async getPageIDWhereVariantsMoreThanOne(): Promise<number[]> {
    switch (true) {
      case environmentLib.IS_STAGING === true: {
        console.log('productInventoryNatsSubscription Staging');
        const { pageIDs } = await getPageIDWhereVariantsMoreThanOne(PlusmarService.readerClient);
        return pageIDs;
      }
      case environmentLib.IS_PRODUCTION === true: {
        console.log('productInventoryNatsSubscription Production');
        const { pageIDs } = await getPageIDWhereVariantsMoreThanOne(PlusmarService.readerClient);
        return pageIDs;
      }
      default: {
        console.log('productInventoryNatsSubscription Dev');
        return await Promise.resolve([Number(process.env.PAGE_ID)]);
      }
    }
  }

  async productInventoryNatsSubscription(): Promise<void> {
    const acknowledgeTimeout = 60;
    const pageIDs = await this.getPageIDWhereVariantsMoreThanOne();
    const natsConnection = PlusmarService.natsConnection;
    for (let index = 0; index < pageIDs.length; index++) {
      const pageID = pageIDs[index];
      const stream = getStreamNameByFeature(EnumNatsSupportFeature.PRODUCT_INVENTORY, pageID);
      await getNatsSubscription(natsConnection, stream, acknowledgeTimeout);
    }
  }
}
