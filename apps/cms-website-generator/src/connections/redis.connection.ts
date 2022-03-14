import Redis, { RedisClient } from 'redis';

let _connected = false;
let redisClient: RedisClient;
let _connectedStore = false;
let redisClientStore: RedisClient;

export function getRedisClient(redisHost: string, redisPort: string): RedisClient {
  if (_connected) {
    return redisClient;
  } else {
    redisClient = Redis.createClient(`${redisHost}:${redisPort}`);
    _connected = true;
    return redisClient;
  }
}

export function getRedisStoreClient(redisStoreHost: string, redisPort: string): RedisClient {
  if (_connectedStore) {
    return redisClientStore;
  } else {
    redisClientStore = Redis.createClient(`${redisStoreHost}:${redisPort}`);
    _connectedStore = true;
    return redisClientStore;
  }
}
