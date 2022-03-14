import { scheduleController } from '../controllers/schedule.controller';

export const scheduleRoute = (): void => {
  console.log('SCHEDULE READY');
  void scheduleController.checkExpiryPurchaseOrdersAndReleaseReservedItem();
  // void scheduleController.scheduleMarketPlaceCategoryTree();
  // void scheduleController.scheduleMarketPlaceProductBrands();
  // void scheduleController.scheduleMarketPlaceOrderAndInventoryUpdate();

  //void scheduleController.checkExpiryPurchaseOrdersAndReleaseReservedItem();
};
