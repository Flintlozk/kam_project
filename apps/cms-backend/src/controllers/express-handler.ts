import { errorHandler, errorRenderHandler } from './error-controller';
import { environment } from '../environments/environment';
import { Request, Response, NextFunction } from 'express';

export function expressHandler({ validator, handler }) {
  return async (request: Request, response: Response): Promise<void> => {
    try {
      const responseJson = await handler(request, response);
      response.json(validator(responseJson));
    } catch (err) {
      if (!environment.production) {
        console.log('[expressHandler error]:', err);
      }
      errorHandler(err, response);
    }
  };
}

export function expressHandlerValue({ validator, handler }) {
  return async (request: Request, response: Response): Promise<void> => {
    try {
      const responseValue = await handler(request, response);
      response.send(validator(responseValue));
    } catch (err) {
      if (!environment.production) {
        console.log('[expressHandlerValue error]:', err);
      }
      errorHandler(err, response);
    }
  };
}

export function expressHandlerRedirect({ validator, handler }) {
  return async (request: Request, response: Response): Promise<void> => {
    try {
      const responseValue = await handler(request, response);
      response.redirect(validator(responseValue));
    } catch (err) {
      if (!environment.production) {
        console.log('[expressHandlerRedirect error]:', err);
      }
      errorHandler(err, response);
    }
  };
}
export function expressHandlerRender({ validator, handler }) {
  return async (request: Request, response: Response): Promise<void> => {
    try {
      await handler(request, response);
      // response.redirect(validator(responseValue).url);
    } catch (err) {
      if (!environment.production) {
        console.log('[expressHandlerRender error]:', err);
      }
      errorHandler(err, response);
    }
  };
}
export function expressHandlerMiddleware({ handler }) {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(request, next);
    } catch (err) {
      if (!environment.production) {
        console.log('[expressHandlerMiddleware error]:', err);
      }
      errorHandler(err, response);
    }
  };
}
export function expressHandlerStatus({ handler }) {
  return async (request: Request, response: Response): Promise<void> => {
    try {
      const value = await handler(request);
      response.sendStatus(value);
    } catch (err) {
      if (!environment.production) {
        console.log('[expressHandlerStatus error]:', err);
      }
      errorHandler(err, response);
    }
  };
}

export function expressHandlerContentWithoutCache({ validator, handler }) {
  return async (request: Request, response: Response): Promise<void> => {
    try {
      const responseValue = await handler(request, response);
      response.setHeader('Cache-Control', 'no-cache');
      response.send(validator(responseValue).value);
    } catch (err) {
      if (!environment.production) {
        console.log('[expressHandlerValue error]:', err);
      }
      errorHandler(err, response);
    }
  };
}
