import * as Minio from 'minio';

let _connected = false;
let minio;

export function getAWSS3Bucket(accessKeyId: string, secretAccessKey: string): Minio.Client {
  if (_connected) {
    return minio;
  } else {
    minio = new Minio.Client({
      endPoint: 'linestorage.more-commerce.com',
      port: 443,
      useSSL: true,
      accessKey: accessKeyId,
      secretKey: secretAccessKey,
    });
    _connected = true;
    return minio;
  }
}
