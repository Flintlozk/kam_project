import { ExpressJSDynamicHandlerType } from '@reactor-room/model-lib';
import { NextFunction, Request, Response } from 'express';
import { environment } from '../environments/environment';
import { errorHandler } from './error-controller';

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
      response.end();
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

export function expressDynamicHandler({ validator, handler }) {
  return async (request: Request, response: Response): Promise<void> => {
    try {
      const responseValue = await handler(request, response);
      const validValue = validator(responseValue);
      const handlerAs = <ExpressJSDynamicHandlerType>response.locals.handlerType;
      switch (handlerAs) {
        case ExpressJSDynamicHandlerType.REDIRECT:
          response.redirect(validValue);
          response.end();
          break;
        case ExpressJSDynamicHandlerType.RENDER:
          response.render('pages/download-file.ejs', { payload: { fileName: request.params.filename, fileUrl: `${validValue}` } });
          break;
      }
    } catch (err) {
      if (!environment.production) {
        console.log('[expressHandlerRedirect error]:', err);
      }
      errorHandler(err, response);
    }
  };
}
