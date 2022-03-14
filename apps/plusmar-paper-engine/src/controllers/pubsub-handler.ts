import { errorPubsubHandler } from './error-controller';

export function pubsubHandler({ handler }) {
  return async (messageData): Promise<void> => {
    try {
      await handler(messageData);
      return;
    } catch (err) {
      errorPubsubHandler(err);
    }
  };
}
