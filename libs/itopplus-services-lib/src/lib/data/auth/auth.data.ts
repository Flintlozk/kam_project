import { WebviewToken } from '@reactor-room/itopplus-model-lib';
import { Dayjs } from 'dayjs';
import { RedisClient } from 'redis';
import { TokenUnauthorized } from '../../errors';

export const setRedisForWebViewToken = (CLIENT: RedisClient, key: string, value: { token: string; expiredIn: Dayjs }): void => {
  CLIENT.set(key, JSON.stringify(value));
};
export const getRedisForWebViewToken = (CLIENT: RedisClient, key: string): Promise<WebviewToken> => {
  return new Promise((resolve, reject) => {
    CLIENT.get(key, (err, reply) => {
      if (err) {
        reject(new TokenUnauthorized());
      } else {
        resolve(JSON.parse(reply) as WebviewToken);
      }
    });
  });
};
