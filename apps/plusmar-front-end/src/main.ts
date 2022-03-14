import { enableProdMode, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';

if (environment.IS_PRODUCTION || environment.IS_STAGING) {
  Sentry.init({
    dsn: 'https://aa82fa506a444d3990186a7fa0c99b10@sentry.itopplus.com/10',
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ['https://app.more-commerce.com', 'https://plusmarweb.more-commerce.com', 'https://plusmarapi.more-commerce.com', 'https://api.more-commerce.com'],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    tracesSampleRate: 0.01,
  });

  enableProdMode();
} else {
  console.log('[UNDER DEVELOPMENT MODE]');
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    providers: [{ provide: LOCALE_ID, useValue: 'th-TH' }],
  })
  .catch((err) => console.error(err));
