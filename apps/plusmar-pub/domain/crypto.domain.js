var crypto = require('crypto');

function signHmacSha1(rawPostData) {
  const key = '402eaa905f993ae8e5d3b08cccdc2ec5';
  const keyTest = 'dfed3ed6fc36eaebc40de5f2be67902f';
  const oldKey = '9eac3fdf5feab64024d0b32fe3ad1606';
  let hmac = crypto.createHmac('sha1', key);
  let signed = hmac.update(Buffer.from(rawPostData, 'utf-8')).digest('hex');
  let hmacTest = crypto.createHmac('sha1', keyTest);
  let signedTest = hmacTest.update(Buffer.from(rawPostData, 'utf-8')).digest('hex');
  let hmacOld = crypto.createHmac('sha1', oldKey);
  let signedOld = hmacOld.update(Buffer.from(rawPostData, 'utf-8')).digest('hex');
  return {
    signed,
    signedTest,
    signedOld,
  };
}

module.exports = {
  signHmacSha1,
};
