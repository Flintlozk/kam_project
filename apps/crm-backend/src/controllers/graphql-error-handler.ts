import * as Sentry from '@sentry/node';

export function graphQLErrorHandler(err: Error): void {
  const errType = err.name;
  Sentry.captureException(err);
  console.log('======================================================================================================');
  console.log('err: ', err);
  switch (errType) {
    case 'TypeError':
      throw new Error(`[${errType}]Message: ${err.message}`);
    default:
      throw err;
  }
}
