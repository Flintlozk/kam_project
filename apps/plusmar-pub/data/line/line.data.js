const redisHelper = require('../../helpers/redis.helper');

const setLineSecret = (key, payload) => {
  const result = redisHelper.setRedis(key, payload);
  return result;
};

const getChannelSecret = (key) => {
  const result = redisHelper.getRedis(key);
  return result;
};

module.exports = {
  setLineSecret,
  getChannelSecret,
};
