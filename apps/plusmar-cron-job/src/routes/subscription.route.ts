import { subscriptionController } from '../controllers/subscriptions.controller';

export const subscriptionRoute = (): void => {
  console.log('SUBSCRIBER READY');
  subscriptionController.thaipostDropoffSubscription();
  // subscriptionController.productInventorySubscription();
  subscriptionController.productInventoryNatsSubscription();
  // subscriptionController.messageQueueingSubscription(0 /* instanceID */);
};
