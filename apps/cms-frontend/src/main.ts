import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import '@angular/compiler';

if (environment.IS_PRODUCTION || environment.IS_STAGING) {
  Sentry.init({
    dsn: 'https://ae6698dcc0a34b00806e7346cb498b3d@sentry.itopplus.com/4',
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ['https://cms.more-commerce.com', 'https://cms.itopplus.com', 'https://cms-api.more-commerce.com', 'https://cms-api.itopplus.com'],
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
