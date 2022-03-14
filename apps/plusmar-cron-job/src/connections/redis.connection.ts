import Redis, { RedisClient } from 'redis';
let _connected = false;
let redisClient: RedisClient;

export function getRedisClient(redisHost: string, redisPort: string): RedisClient {
  if (_connected) {
    return redisClient;
  } else {
    redisClient = Redis.createClient(`${redisHost}:${redisPort}`);
    _connected = true;
    return redisClient;
  }
}
