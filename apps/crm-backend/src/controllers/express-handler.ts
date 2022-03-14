import { environment } from '../environments/environment';
import { Request, Response } from 'express';

export function expressHandler({ validator, handler }) {
  return async (request: Request, response: Response): Promise<void> => {
    try {
      const responseJson = await handler(request, response);
      response.json(validator(responseJson));
    } catch (err) {
      if (!environment.production) {
        console.log('[expressHandler error]:', err);
      }
      console.log('error');
    }
  };
}
