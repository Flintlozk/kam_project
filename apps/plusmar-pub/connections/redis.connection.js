const Redis = require('redis');

let _connected = false;
let redisClient;
let _connectedStore = false;
let redisClientStore;

function getRedisClient(redisHost, redisPort) {
  if (_connected) {
    return redisClient;
  } else {
    redisClient = Redis.createClient(`${redisHost}:${redisPort}`);
    _connected = true;
    return redisClient;
  }
}

function getRedisStoreClient(redisStoreHost, redisPort) {
  if (_connectedStore) {
    return redisClientStore;
  } else {
    redisClientStore = Redis.createClient(`${redisStoreHost}:${redisPort}`);
    _connectedStore = true;
    return redisClientStore;
  }
}

module.exports = {
  getRedisClient,
  getRedisStoreClient,
};
