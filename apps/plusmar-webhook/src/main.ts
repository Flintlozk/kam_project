import { setupConnection } from './connections/setup.connection';
import { facebookRegisterRoutes } from './routes/facebook.subscription.route';
import { lineSecretUpdateSubScription, lineRegisterSubscription } from './routes/line.subscription.route';
import { openApiRegisterRoutes } from './routes/openapi.subscription.route';
import { loadTestRoute } from './routes/loadtest.route';
import * as Sentry from './connections/sentry.connection';

import * as express from 'express';
import { monitorRouteRegister } from './routes/app.route';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';

// process.env.GOOGLE_APPLICATION_CREDENTIALS = './apps/plusmar-webhook/src/assets/AUTH.json'; // ! Hardcode
// process.env.SUBSCRIPTION = 'plusmar-staging-page3'; // ! Hardcode
console.log('ENV_GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const app = express();
app.use(express.json());

/* tslint:disable */
void setupConnection().then(() => {
  Sentry.connect();
  facebookRegisterRoutes();
  lineRegisterSubscription();
  lineSecretUpdateSubScription();
  loadTestRoute(app);
  openApiRegisterRoutes();
  monitorRouteRegister(app);
});

app.listen(8740);

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
