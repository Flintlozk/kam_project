import { environment } from '../environments/environment';
import { ScheduleService } from '../services';

class ScheduleController {
  public static instance;
  public static scheduleService: ScheduleService;

  public static getInstance(): ScheduleController {
    if (!ScheduleController.instance) ScheduleController.instance = new ScheduleController();
    return ScheduleController.instance;
  }

  constructor() {
    ScheduleController.scheduleService = new ScheduleService();
  }

  checkExpiryPurchaseOrdersAndReleaseReservedItemHandler(): void {
    ScheduleController.scheduleService.checkExpiryPurchaseOrdersAndReleaseReservedItem();
  }

  scheduleMarketPlaceCategoryTreeHandler(): void {
    const lazadaEnv = environment.lazada;
    const shopeeEnv = environment.shopee;
    ScheduleController.scheduleService.scheduleMarketPlaceCategoryTree({ lazadaEnv, shopeeEnv });
  }

  scheduleMarketPlaceProductBrandsHandler(): void {
    const lazadaEnv = environment.lazada;
    const shopeeEnv = environment.shopee;
    ScheduleController.scheduleService.scheduleMarketPlaceProductBrands({ lazadaEnv, shopeeEnv });
  }

  scheduleMarketPlaceProductOrdersHandler(): void {
    const lazadaEnv = environment.lazada;
    const shopeeEnv = environment.shopee;
    ScheduleController.scheduleService.scheduleMarketPlaceOrderAndInventroyUpdate({ lazadaEnv, shopeeEnv });
  }
}

const Instance: ScheduleController = ScheduleController.getInstance();
export const scheduleController = {
  checkExpiryPurchaseOrdersAndReleaseReservedItem: Instance.checkExpiryPurchaseOrdersAndReleaseReservedItemHandler,
  scheduleMarketPlaceCategoryTree: Instance.scheduleMarketPlaceCategoryTreeHandler,
  scheduleMarketPlaceProductBrands: Instance.scheduleMarketPlaceProductBrandsHandler,
  scheduleMarketPlaceOrderAndInventoryUpdate: Instance.scheduleMarketPlaceProductOrdersHandler,
};
