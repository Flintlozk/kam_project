import * as Sentry from '@sentry/node';
import { environment } from '../environments/environment';

// eslint-disable-next-line
export function connect() {
  try {
    if (environment.IS_PRODUCTION || environment.IS_STAGING) {
      Sentry.init({
        dsn: 'https://b0bd8d9b8dd8416f8c4fefb251cd79f8@sentry.itopplus.com/9',
        tracesSampleRate: 0.01,
      });
    }
  } catch (e) {
    console.log('Sentry:', e);
  }
  return Sentry;
}
