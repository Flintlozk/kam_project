import * as express from 'express';
import { setupConnection } from './connections/setup.connection';
import { setupAppServerConnection } from './connections/app.connection';
import { routeRegister } from './routes/app.route';
import * as Sentry from '@sentry/node';
import * as SentryConnect from './connections/sentry.connection';
import { puppetMessagePaperResponseRoute } from './routes/puppet-paper-response.subscription.route';
import { imageRoute } from './routes/image.routes';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
const app = express();

void setupConnection().then(() => {
  SentryConnect.connect(app);
  setupAppServerConnection(app);

  imageRoute(app);
  routeRegister(app);
  puppetMessagePaperResponseRoute();

  app.use(Sentry.Handlers.errorHandler());

  const port = process.env.port || 3214;
  const server = app.listen(port, () => {
    console.log(`READY:${port}`);
  });
  server.on('error', console.error);
});

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
