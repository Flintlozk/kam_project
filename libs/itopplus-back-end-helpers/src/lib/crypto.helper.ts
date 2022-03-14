import * as crypto from 'crypto';
import stringify from 'fast-json-stable-stringify';
const algorithm = 'des-ecb';

const getKey = (key) => Buffer.from(key, 'hex');

/* hex key encode/decode */
export const cryptoEncode = (message: string, key: string): string => {
  const cipher = crypto.createCipheriv(algorithm, getKey(key), null);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
export const cryptoDecode = (encoded: string, key: string): string => {
  const decipher = crypto.createDecipheriv(algorithm, getKey(key), null);
  let decrypted = decipher.update(encoded, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/* public encode / private decode */
export const cryptoPublicEncode = <T>(publicKey: string, data: T): string => {
  const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(stringify(data), 'utf8'));
  return encryptedData.toString('hex');
};

/* data Buffer as hex */
export const cryptoPrivateDecode = (privateKey: string, data: Buffer): string => {
  const decryptedData = crypto.privateDecrypt(privateKey, data);
  return decryptedData.toString('utf8');
};

/* public decode / private encode */
export const cryptoPrivateEncode = <T>(privateKey: string, data: T): string => {
  // ! not being used
  const encryptedData = crypto.privateEncrypt(privateKey, Buffer.from(stringify(data), 'utf8'));
  return encryptedData.toString('hex');
};
export const cryptoPublicDecode = (publicKey: string, data: Buffer): string => {
  // ! not being used
  const decryptedData = crypto.publicDecrypt(publicKey, data);
  return decryptedData.toString('utf8');
};
