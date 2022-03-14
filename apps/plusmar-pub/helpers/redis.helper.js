const redisConnection = require('../connections/redis.connection');

const setRedis = (key, payload) => {
  const redisClient = redisConnection.getRedisClient(process.env.redisHost, process.env.redisPort);
  redisClient.set(key, JSON.stringify(payload));
  return true;
};

const getRedis = (key) => {
  return new Promise((resolve, reject) => {
    const redisClient = redisConnection.getRedisClient(process.env.redisHost, process.env.redisPort);
    redisClient.get(key, (err, value) => {
      if (err) reject(err);
      resolve(JSON.parse(value));
    });
  });
};

module.exports = {
  setRedis,
  getRedis,
};
