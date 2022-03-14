import { MarketplaceService } from '../services';

class PublishController {
  public static instance;
  public static marketplaceService: MarketplaceService;

  public static getInstance(): PublishController {
    if (!PublishController.instance) PublishController.instance = new PublishController();
    return PublishController.instance;
  }

  constructor() {
    PublishController.marketplaceService = new MarketplaceService();
  }

  updateMarketPlaceInventoryHandler() {
    PublishController.marketplaceService.updateMarketPlaceInventory();
  }
}

const Instance: PublishController = PublishController.getInstance();
export const publishController = {
  updateMarketPlaceInventory: Instance.updateMarketPlaceInventoryHandler,
};
