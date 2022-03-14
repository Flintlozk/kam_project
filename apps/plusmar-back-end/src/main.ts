import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import * as express from 'express';
import { setupAppServerConnection } from './connections/app.connection';
import { middleware } from './connections/middleware.connection';
import * as SentryConnect from './connections/sentry.connection';
import { setupConnection } from './connections/setup.connection';
import {
  cssRoute,
  fileRouteRegister,
  graphQLRouteRegister,
  imageRoute,
  jsLoaderRoute,
  leadFormRoutes,
  lineRoutes,
  marketPlaceRouteRegister,
  migrateRouteLogistic,
  migrateRouteRegister,
  openAPI,
  paymentRoute,
  purchasingOrderRoutes,
  reportRouteRegister,
  routeRegister,
  subscriptionRoute,
  topUpRoute,
  viewRenderRoutes,
} from './routes';

const app = express();
app.use(express.json());

void setupConnection().then(() => {
  SentryConnect.connect(app);
  fileRouteRegister(app);
  setupAppServerConnection(app);
  viewRenderRoutes(app);
  middleware(app);
  routeRegister(app);
  lineRoutes(app);
  topUpRoute(app);
  paymentRoute(app);
  reportRouteRegister(app, '/report');
  migrateRouteRegister(app, '/migration');
  migrateRouteLogistic(app);
  marketPlaceRouteRegister(app, '/marketplace');
  imageRoute(app);
  jsLoaderRoute(app);
  cssRoute(app);
  graphQLRouteRegister(app);
  purchasingOrderRoutes(app);
  leadFormRoutes(app);
  openAPI(app);
  subscriptionRoute();

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
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
