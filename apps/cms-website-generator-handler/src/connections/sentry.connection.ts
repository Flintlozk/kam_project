import * as Sentry from '@sentry/node';

import { environment } from '../environments/environment';

export function connect(): void {
  try {
    if (environment.production) {
      Sentry.init({
        dsn: 'https://7bc89d98ddbf4320add4c254ea937531@sentry.itopplus.com/3',
        tracesSampleRate: 0.01,
      });
    }
  } catch (e) {
    console.log('Sentry:', e);
  }
}
