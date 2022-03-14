import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.IS_PRODUCTION || environment.IS_STAGING) {
  Sentry.init({
    dsn: 'https://0fde9acb204f4ecfbd9eb889218d1b60@sentry.itopplus.com/5',
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ['https://cms-admin.more-commerce.com', 'https://cms-admin.itopplus.com', 'https://cms-api.more-commerce.com', 'https://cms-api.itopplus.com'],
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
