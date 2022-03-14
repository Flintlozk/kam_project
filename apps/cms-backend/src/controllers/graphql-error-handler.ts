import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';

export function graphQLErrorHandler(err: Error): void {
  const errType = err.name;
  if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
  console.log('======================================================================================================');
  console.log('err: ', err);
  switch (errType) {
    case 'PagesError': // start: errors / pages.error.ts
    case 'PagesNotExistError':
    case 'InvalidTokenError':
    case 'AuthError':
    case 'FBSendPayloadError': // start: errors / message.error.ts
    case 'SubscriptionError':
    case 'UserContextError':
    case 'PageMemberError':
      throw err;
    // start: generic error
    case 'TypeError':
      throw new Error(`[${errType}]Message: ${err.message}`);
    default:
      throw err;
    // throw new Error(`[Unexpected Internal Error]Message: ${err.message ? err.message : ''}`);
    // end: generic error
  }
}
