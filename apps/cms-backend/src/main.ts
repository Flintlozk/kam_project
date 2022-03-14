import * as express from 'express';
import { setupAppServerConnection } from './connections/app.connection';
import { middleware } from './connections/middleware.connection';
import { setupConnection } from './connections/setup.connection';
import { routeRegister } from './routes/app.route';
import { graphQLRouteRegister } from './routes/graphql.route';
import * as Sentry from '@sentry/node';
import * as SentryConnect from './connections/sentry.connection';

const app = express();
app.use(express.json());
void setupConnection().then(() => {
  SentryConnect.connect(app);
  setupAppServerConnection(app);
  graphQLRouteRegister(app);
  middleware(app);
  routeRegister(app);

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
});
