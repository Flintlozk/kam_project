import * as Sentry from '@sentry/node';
import { environment } from '../environments/environment';

export function connect(): void {
  try {
    if (environment.IS_PRODUCTION || environment.IS_STAGING) {
      Sentry.init({
        dsn: 'https://7b31bc8ef1804b9f9a3e8a3c97845100@sentry.itopplus.com/12',
        tracesSampleRate: 0.01,
      });
    }
  } catch (e) {
    console.log('Sentry:', e);
  }
}
