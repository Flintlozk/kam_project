import { setupConnection } from './connections/setup.connection';
import { registerSubscription } from './routes/website-generator.route';
import * as SentryConnect from './connections/sentry.connection';
void setupConnection().then(() => {
  SentryConnect.connect();
  void registerSubscription();
});
