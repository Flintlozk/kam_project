import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';

if (environment.IS_PRODUCTION || environment.IS_STAGING) {
  Sentry.init({
    dsn: 'https://ae6698dcc0a34b00806e7346cb498b3d@sentry.itopplus.com/4',
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ['https://admin.more-commerce.com', 'https://plusmaradmin.more-commerce.com', 'https://plusmarapi.more-commerce.com', 'https://api.more-commerce.com'],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    tracesSampleRate: 0.01,
  });
  enableProdMode();
}
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
