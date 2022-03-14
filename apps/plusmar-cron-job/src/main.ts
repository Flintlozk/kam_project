import { setupConnection } from './connections/setup.connection';
import { offTimeRoute } from './routes/offtime.route';
import { scheduleRoute } from './routes/schedule.route';
import { subscriptionRoute } from './routes/subscription.route';

import * as express from 'express';
import * as SentryConnect from './connections/sentry.connection';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';

const app = express();
app.use(express.json());

void setupConnection().then(() => {
  SentryConnect.connect();

  offTimeRoute();
  scheduleRoute();
  subscriptionRoute();
  console.log('INITIATED SUBSCRIPTION MODE');
});

app.listen(process.env.INIT_CRON === 'true' ? 8741 : 8742);

process.on('exit', async () => {
  const done = PlusmarService.natsConnection.closed();
  await PlusmarService.natsConnection.close();
  const err = await done;
  if (err) {
    console.log(`NATS Error closing:`, err);
  } else {
    console.log('NATS Connection close');
  }
});
