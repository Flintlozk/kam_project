import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';

export function graphQLErrorHandler(err: Error): void {
  const errType = err.name;
  console.log(`================================================ ${errType} ======================================================`);
  console.log('err: ', err);
  switch (errType) {
    case 'LastMessageRecord':
      throw err;
    case 'AudienceUnavailableError':
    case 'ActivityAlreadyRepliedTo':
    case 'PurchasingOrderNotFound':
    case 'PurchasingOrderUpdateDisabled':
    case 'PagesError': // start: errors / pages.error.ts
    case 'PagesNotExistError':
    case 'RegisterError': // start: errors / auth.error.ts
    case 'UserNotFoundError':
    case 'InvalidTokenError':
    case 'AuthError':
    case 'FBSendPayloadError': // start: errors / message.error.ts
    case 'SubscriptionError':
    case 'UserContextError':
    case 'PageMemberError':
    case 'PageMemberDuplicateError':
    case 'ValidatePageMemberTokenError':
    case 'OrderHistoryError':
    case 'ResourceValidationError':
    case 'SettingError':
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    // start: generic error
    case 'TypeError':
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw new Error(`[${errType}]Message: ${err.message}`);
    default:
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
  }
}
