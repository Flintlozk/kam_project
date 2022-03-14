import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { environment } from '../environments/environment';

export function errorHandler(err: Error): void {
  if (!environment.IS_PRODUCTION) console.log('error: ', err);
  const errType = err.name;
  switch (errType) {
    case 'FacebookCreateAudienceError':
    case 'FacebookMessageHandlerError':
    case 'FacebookPostHandlerError':
    case 'FacebookOnPostEdittedHandlerError':
    case 'FacebookOnCreatePostException':
    case 'FacebookCommentHandlerError':
    case 'FacebookOnCreateCommentException':
    case 'FacebookOnAddCommentException':
    case 'FacebookOnEdittedCommentException':
    case 'FacebookOnDeleteCommentException':
    case 'FacebookOnHideCommentException':
    case 'FacebookOnUnHideCommentException':
    case 'FacebookListenerHandlerError':
    case 'FacebookPostbackHandlerError':
    case 'FacebookReferralHandlerError':
    case 'FacebookReferralProductHandlerError':
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      break;
    default:
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException({ err: 'Internal Exception:', message: err?.message });
      break;
  }
}
