import { RedisClient } from 'redis';

export const getAudienceWorkhourRedis = (client: RedisClient, key: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      if (err) {
        reject(err);
      } else {
        if (value) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
};

export const setAudienceWorkhourRedis = <T>(client: RedisClient, key: string, value: T): void => {
  client.set(key, JSON.stringify(value));
};
export const deleteAudienceWorkhourRedis = (client: RedisClient, key: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    client.del(key, (err, value) => {
      if (err) {
        reject(err);
      } else {
        if (value) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
};
