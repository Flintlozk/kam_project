import { IProductCatalogSession } from '@reactor-room/itopplus-model-lib';
import { RedisClient } from 'redis';

export const getCatalogStorage = async (redisKey: string, redisClient: RedisClient): Promise<IProductCatalogSession> => {
  return (await new Promise((resolve, reject) => {
    redisClient.get(redisKey, (err, catalogLS) => {
      if (err) reject('TRY_LATER');
      const catalogSession = JSON.parse(catalogLS) as IProductCatalogSession;
      resolve(catalogSession);
    });
  })) as IProductCatalogSession;
};

export const getCatalogStorageByMatchedKeys = async (redisKey: string, redisClient: RedisClient): Promise<string[]> => {
  return (await new Promise((resolve, reject) => {
    redisClient.KEYS(redisKey, (err, redisData) => {
      if (err) reject(err);
      resolve(redisData);
    });
  })) as string[];
};

export const setCatalogStorage = async (redisKey: string, redisValue: string, redisClient: RedisClient): Promise<void> => {
  await redisClient.set(redisKey, redisValue);
};

export const deleteCatalogStorage = async (redisKey: string, redisClient: RedisClient): Promise<void> => {
  await redisClient.del(redisKey);
};
