const crypto = require('crypto');
const algorithm = 'des-ecb';

const getKey = (key) => Buffer.from(key, 'hex');
const cryptoEncode = (message, key) => {
  const cipher = crypto.createCipheriv(algorithm, getKey(key), null);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const cryptoDecode = (encoded, key) => {
  const decipher = crypto.createDecipheriv(algorithm, getKey(key), null);
  let decrypted = decipher.update(encoded, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = {
  cryptoEncode,
  cryptoDecode,
};
