import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Express } from 'express';

import { environment } from '../environments/environment';

export function connect(app: Express): void {
  try {
    if (environment.IS_PRODUCTION || environment.IS_STAGING) {
      Sentry.init({
        dsn: 'https://bde8c1f335a240e3aac182f1f62015fa@sentry.itopplus.com/6',
        integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
        tracesSampleRate: 0.01,
      });
      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
    }
  } catch (e) {
    console.log('Sentry:', e);
  }
}
