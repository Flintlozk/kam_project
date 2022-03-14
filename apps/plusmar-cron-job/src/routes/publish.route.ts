import { publishController } from '../controllers/publishes.controller';

export const publishRoute = (): void => {
  publishController.updateMarketPlaceInventory();
};
