import { RedisClient } from 'redis';

export function getKeysFromSession<T>(redisClient: RedisClient, key: string): Promise<T> {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, value) => {
      if (err) reject(err);
      resolve(JSON.parse(value));
    });
  });
}

export function getKeysFromSessionByPass<T>(redisClient: RedisClient, key: string): Promise<{ bypass: boolean; data: T }> {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, value) => {
      if (err) resolve({ bypass: true, data: null });
      resolve({ bypass: false, data: JSON.parse(value) });
    });
  });
}

export function setSessionValue<T>(redisClient: RedisClient, key: string, value: T): boolean {
  return redisClient.set(key, JSON.stringify(value));
}
export function deleteSessionValue(redisClient: RedisClient, key: string): boolean {
  return redisClient.del(key);
}

// eslint-disable-next-line
export function redisWrapperFunction<T, U>(redisClient: RedisClient, redisKey: string, functionParams: Function, args: U, expireIn?: number): Promise<T> {
  // eslint-disable-next-line
  const _this = this;
  return new Promise((resolve) => {
    redisClient.get(redisKey, async (err, value) => {
      if (err) {
        const result = await functionParams.apply(_this, args);
        redisClient.set(redisKey, JSON.stringify(result));
        if (expireIn) redisClient.expire(redisKey, expireIn);
        resolve(result);
      } else {
        if (value === null) {
          const result = await functionParams.apply(_this, args);
          redisClient.set(redisKey, JSON.stringify(result));
          if (expireIn) redisClient.expire(redisKey, expireIn);
          resolve(result);
        } else {
          resolve(JSON.parse(value));
        }
      }
    });
  });
}
