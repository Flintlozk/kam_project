import * as Sentry from '@sentry/node';

import { environment } from '../environments/environment';

export function connect(): void {
  try {
    if (environment.production) {
      Sentry.init({
        dsn: 'https://662a762fdb264a08ba1a6ea00cd9cd0e@sentry.itopplus.com/2',
        tracesSampleRate: 0.01,
      });
    }
  } catch (e) {
    console.log('Sentry:', e);
  }
}
