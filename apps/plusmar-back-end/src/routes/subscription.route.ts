import { subscriptionController } from '../controllers/subscriptions/subscriptions.controller';

export const subscriptionRoute = (): void => {
  console.log('SUBSCRIBER READY');
  void subscriptionController.sendCloseReasonMessageSubscription();
};
