import { ProductInventorySubscriptionService, ThaiPostDropOffService } from '../services';

class SubscriptionController {
  public static instance;
  public static thaiPostDropOffService: ThaiPostDropOffService;
  public static ProductInventorySubscriptionService: ProductInventorySubscriptionService;
  public static getInstance(): SubscriptionController {
    if (!SubscriptionController.instance) SubscriptionController.instance = new SubscriptionController();
    return SubscriptionController.instance;
  }
  constructor() {
    SubscriptionController.thaiPostDropOffService = new ThaiPostDropOffService();
    SubscriptionController.ProductInventorySubscriptionService = new ProductInventorySubscriptionService();
  }

  thaipostDropoffSubscriptionHandler(): void {
    return SubscriptionController.thaiPostDropOffService.thaipostDropoffSubscription();
  }

  //  NATS Server
  productInventoryNatsSubscriptionHandler(): void {
    void SubscriptionController.ProductInventorySubscriptionService.productInventoryNatsSubscription();
  }
}

const Instance: SubscriptionController = SubscriptionController.getInstance();
export const subscriptionController = {
  thaipostDropoffSubscription: Instance.thaipostDropoffSubscriptionHandler,
  productInventoryNatsSubscription: Instance.productInventoryNatsSubscriptionHandler,
};
