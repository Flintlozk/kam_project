import * as express from 'express';
import { setupAppServerConnection } from './connections/app.connection';
import { registerReadyNode } from './connections/register.connection';
import { setupConnection } from './connections/setup.connection';
import { routeRegister } from './routes/app.route';
import * as SentryConnect from './connections/sentry.connection';
import * as Sentry from '@sentry/node';
import * as morgan from 'morgan';
import { environmentLib } from '@reactor-room/environment-services-backend';
const app = express();

const transaction = Sentry.startTransaction({
  op: 'messageHandler',
  name: 'try catch messageHandler',
});

void setupConnection().then(() => {
  SentryConnect.connect();
  setupAppServerConnection(app)
    .then(() => {
      if (!environmentLib.IS_PRODUCTION) {
        app.use(morgan('tiny'));
      }
      routeRegister(app);
      registerReadyNode();
    })
    .catch((err) => {
      Sentry.captureException(err);
      process.exit();
    })
    .finally(() => transaction.finish());
});
