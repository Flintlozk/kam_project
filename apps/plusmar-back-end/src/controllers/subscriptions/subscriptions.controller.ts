import { CustomerClosedReasonService } from '@reactor-room/itopplus-services-lib';

class SubscriptionController {
  public static instance;
  public static getInstance(): SubscriptionController {
    if (!SubscriptionController.instance) SubscriptionController.instance = new SubscriptionController();
    return SubscriptionController.instance;
  }

  public static customerClosedReasonService: CustomerClosedReasonService;
  constructor() {
    SubscriptionController.customerClosedReasonService = new CustomerClosedReasonService();
  }

  sendCloseReasonMessageHandler(): void {
    return SubscriptionController.customerClosedReasonService.sendCloseReasonMessageSubscription();
  }
}

const Instance: SubscriptionController = SubscriptionController.getInstance();
export const subscriptionController = {
  sendCloseReasonMessageSubscription: Instance.sendCloseReasonMessageHandler,
};
