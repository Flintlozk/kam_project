import { errorHandler } from './error-controller';

export function pubsubHandler({ handler }) {
  return async (messageData: any): Promise<boolean> => {
    try {
      const result: boolean = await handler(messageData);
      return result;
    } catch (err) {
      errorHandler(err);
      return null;
    }
  };
}
