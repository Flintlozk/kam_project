import { IPaperFileStatus, PaperFileStatus } from '@reactor-room/itopplus-model-lib';
import { RedisClient } from 'redis';

export function getImagesStatusFromRedis(client: RedisClient, key: string): Promise<IPaperFileStatus> {
  return new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      if (err) reject(err);
      resolve(JSON.parse(value));
    });
  });
}

export function setImagesStatusToRedis(redisClient: RedisClient, key: string, status: PaperFileStatus, subscriptionID: string, orderUUID: string): boolean {
  return redisClient.set(key, JSON.stringify({ status, latestUpdate: new Date(), subscriptionID, orderUUID }));
}
export function deleteImagesStatusToRedis(redisClient: RedisClient, key: string): boolean {
  return redisClient.del(key);
}
