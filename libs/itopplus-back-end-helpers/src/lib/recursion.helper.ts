import { EnumGenericRecursiveStatus, IGenericRecursiveMessage, IGenericRecursiveMessageDetail, IRecursiveParams } from '@reactor-room/model-lib';
import * as Sentry from '@sentry/node';
import { RedisClient } from 'redis';
import { isEmpty } from './object.helper';
import { onWaitFor } from './sleep.helper';

export const dynamicRetryFunction = <T, D>(targetFunction: (params: D) => Promise<T>, params: D, timer: number, maxRetry = 5, retries = 1): Promise<T> => {
  return new Promise((resolve, reject) => {
    targetFunction(params)
      .then(resolve)
      .catch((err) => {
        console.log('Caught Error inside dynamicRetryFunction => ', targetFunction.name, err);
        setTimeout(() => {
          if (retries < maxRetry) {
            void dynamicRetryFunction(targetFunction, params, timer, maxRetry, retries + 1).then(resolve);
          } else {
            return reject('retires exceed');
          }
        }, timer * 1000);
      });
  });
};

export const setRedisOnRecursive = (CLIENT: RedisClient, key: string | number, value: IGenericRecursiveMessage): boolean => {
  return CLIENT.set(String(key), JSON.stringify(value));
};
export const deleteRedisOnRecursive = (CLIENT: RedisClient, key: string): boolean => {
  return CLIENT.del(key);
};

export const getRedisOnRecursive = (CLIENT: RedisClient, key: string | number): Promise<IGenericRecursiveMessage> => {
  return new Promise((resolve, reject) => {
    try {
      CLIENT.get(String(key), (err, reply) => {
        if (err) {
          reject(err);
        } else {
          try {
            const result = JSON.parse(reply) as IGenericRecursiveMessage;
            resolve(result);
          } catch (err) {
            reject(err);
          }
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const genericRecursive = async (redisClient: RedisClient, redisKey: string, timerSec: number, maxRetry: number): Promise<EnumGenericRecursiveStatus> => {
  const retry = 0;
  return await new Promise((resolve: (params: EnumGenericRecursiveStatus) => void, reject) => {
    const tools = { redisKey, timerSec, maxRetry } as IRecursiveParams;
    void recursiveRetry(redisClient, resolve, reject, tools, retry);
  }).catch((err) => {
    Sentry.captureException(err);
    throw err;
  });
};

const recursiveRetry = async (
  redisClient: RedisClient,
  resolve: (params: EnumGenericRecursiveStatus) => void,
  reject: (errors: Error) => void,
  tools: IRecursiveParams,
  retry: number,
) => {
  retry++;
  const { redisKey, timerSec, maxRetry } = tools;
  const storage = await getRedisOnRecursive(redisClient, redisKey);

  if (retry > maxRetry) {
    const errorMessage = IGenericRecursiveMessageDetail.MAX_RETRY_REACH;
    setRedisOnRecursive(redisClient, redisKey, {
      ...storage,
      messageStatus: EnumGenericRecursiveStatus.FAILED,
      messageDetail: errorMessage,
    });
    reject(new Error(errorMessage));
    return;
  } else {
    const { messageStatus } = storage;

    if (messageStatus === EnumGenericRecursiveStatus.FAILED) {
      resolve(EnumGenericRecursiveStatus.FAILED);
      return;
    }

    if (messageStatus === EnumGenericRecursiveStatus.SUCCESS) {
      resolve(EnumGenericRecursiveStatus.SUCCESS);
      return;
    }

    await onWaitFor(timerSec);
    await recursiveRetry(redisClient, resolve, reject, tools, retry);
  }
};

export async function genericRetryFunction<C, T, U>(classInstance: C, functionName: string, params: T, retryAttempt = 3, redisKey = '', redisClient?: RedisClient): Promise<U> {
  for (let attempt = 0; attempt < retryAttempt; attempt++) {
    try {
      if (!isEmpty(redisClient)) {
        const redisMessage = await getRedisOnRecursive(redisClient, redisKey);
        if (redisMessage.messageStatus === EnumGenericRecursiveStatus.FAILED) {
          throw new RetryAttemptReached();
        }
      }
      return await classInstance[functionName](params);
    } catch (err) {
      if (!(err instanceof RecursionRetry)) throw err;
      await onWaitFor(3);
    }
  }
  throw new RetryAttemptReached();
}

export class RecursionRetry extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RecursionRetry);

      this.name = 'RecursionRetry';
    }
  }
}
export class RetryAttemptReached extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RetryAttemptReached);

      this.name = 'RetryAttemptReached';
    }
  }
}
