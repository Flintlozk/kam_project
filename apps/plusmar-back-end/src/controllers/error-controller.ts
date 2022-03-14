import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { Response } from 'express';

export function errorHandler(err: Error, response: Response): void {
  console.log('-< err >- ', err);
  const errType = err.name;
  if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
  switch (errType) {
    case 'PipelineOnHandlePostbackMessagesError':
      response.render('pages/error.ejs');
      break;
    case 'PipelineOnHandlePostbackButtonError':
      response.status(500).json({ err: 'Purchase Pipeline Error', message: err.message });
      break;
    case 'API_PERMISSION_DENIED':
      response.status(401).json({ err: 'API_PERMISSION_DENIED', message: err.message });
      break;
    case 'API_STATUS_DISABLED':
      response.status(401).json({ err: 'API_STATUS_DISABLED', message: err.message });
      break;
    case 'API_CLIENT_ID_OR_SECRET_INVALID':
      response.status(401).json({ err: 'API_CLIENT_ID_OR_SECRET_INVALID', message: err.message });
      break;
    case 'TokenExpired':
      response.status(401).json({ err: 'Token Expired', message: err.message });
      break;
    case 'TokenUnauthorized':
      response.status(401).json({ err: 'Unauthorized', message: err.message });
      break;
    case 'TokenInvalid':
      response.status(400).json({ err: 'Invalid Token', message: err.message });
      break;
    default:
      response.status(500).json({ err: 'internal', message: err.message });
  }
}
export function errorRenderHandler(err: Error, response: Response): void {
  const errType = err.name;
  if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
  switch (errType) {
    default:
      response.render('pages/error.ejs');
  }
}
