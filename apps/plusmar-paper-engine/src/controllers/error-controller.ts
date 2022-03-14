import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { Response } from 'express';

export function errorHandler(err: Error, response: Response): void {
  const errType = err.name;
  if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
  switch (errType) {
    case 'GetSourceFileError':
      response.status(404).json({ err: 'File not found', message: err.message });
      break;
    case 'GetSourceFileRetryAttemptReach':
      response.status(500).json({ err: 'Rerry Attempt Reached', message: err.message });
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

export function errorPubsubHandler(err: Error): void {
  const errType = err.name;
  switch (errType) {
    default:
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException({ err: 'Internal Exception:', message: err.message });
      break;
  }
}
