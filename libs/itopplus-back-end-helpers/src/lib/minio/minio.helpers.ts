import * as Minio from 'minio';
import * as Sentry from '@sentry/node';
import { ItemBucketMetadata } from 'minio';
import { IGQLFileSteam, IHTTPResult } from '@reactor-room/model-lib';
import { createReadStream } from 'fs';

//#region Setup
export const createClientConnection = (connection: Minio.ClientOptions): Minio.Client => {
  return new Minio.Client(connection);
};

export const createBucket = (client: Minio.Client, bucketName: string, region = 'ap-southeast-1'): Promise<boolean> => {
  return new Promise((resolve) => {
    client.makeBucket(bucketName, region, function (err) {
      if (err) {
        console.log('Error creating bucket.', err);
        resolve(false);
      } else {
        console.log('Bucket created successfully in "us-east-1".');
        resolve(true);
      }
    });
  });
};

//TODO: SET QUOTA must call to REACTOR INFRA
// export const setBucketQouta = (client: Minio.Client) => {};
//#endregion

//#region Download file
export async function getURLFromBucket(client: Minio.Client, bucketName: string, filename: string): Promise<string> {
  try {
    const result = await client.presignedUrl('GET', bucketName, filename);
    return result;
  } catch (err) {
    Sentry.captureException(err);
    return null;
  }
}

export async function getObjectStatFromBucket(client: Minio.Client, bucketName: string, filename: string): Promise<ItemBucketMetadata> {
  try {
    const result = await client.statObject(bucketName, filename);
    return result.metaData;
  } catch (err) {
    console.log('getS3ObjectStatFromBucket err ::::::::::>>> ', err);
    Sentry.captureException(err);
    return null;
  }
}

export function getBufferFromBucket(s3BucketClient: Minio.Client, bucketName: string, filename: string): Promise<Buffer> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const chunks = [];
      const readable = await s3BucketClient.getObject(bucketName, filename);
      readable
        .on('data', (chunk) => {
          chunks.push(chunk);
        })
        .once('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        })
        .on('error', () => {
          resolve(null);
        });
      return;
    } catch (err) {
      if (err.message.indexOf('The specified key does not exist') !== '-1') {
        resolve(null);
      } else {
        Sentry.captureException(err);
        reject(err);
      }
    }
  });
}
//#endregion

//#region Upload Path
export async function putFileToBucket(client: Minio.Client, bucketName: string, filename: string, buf: Buffer): Promise<boolean> {
  try {
    await client.putObject(bucketName, filename, buf);
    return true;
  } catch (err) {
    Sentry.captureException(err);
    return false;
  }
}
//#endregion

//#region Remove File
export async function removeFileFromS3Bucket(client: Minio.Client, bucketName: string, filename: string): Promise<boolean> {
  try {
    await client.removeObject(bucketName, filename);
    return true;
  } catch (err) {
    Sentry.captureException(err);
    return false;
  }
}
//#endregion

//save file to miniostorage
export async function saveFileToMinoStorage(client: Minio.Client, uploadfile: IGQLFileSteam, bucketName: string, folderName = ''): Promise<IHTTPResult> {
  const { createReadStream, mimetype, filename } = await uploadfile;
  return new Promise((resolve) => {
    if (folderName !== undefined) {
      const imageStream = createReadStream();
      const bufs = [];
      imageStream.on('data', (chunks) => {
        bufs.push(chunks);
      });
      imageStream.on('end', async () => {
        const httpResult = { status: 500, value: '' } as IHTTPResult;
        const buf = Buffer.concat(bufs);
        const time = new Date();
        let newFileName = `${time.getTime()}_${filename.replace(/\s/g, '_')}`;
        if (folderName !== '') {
          newFileName = `${folderName}/${time.getTime()}_${filename.replace(/\s/g, '_')}`;
        }
        const resultSetFile = await putFileToBucket(client, bucketName, newFileName, buf);
        if (resultSetFile) {
          const resultUrl = await getURLFromBucket(client, bucketName, newFileName);
          httpResult.status = 200;
          httpResult.value = resultUrl;
        }
        resolve(httpResult);
      });
    }
  });
}

//save file to minostorage with Storage name
export function saveFileToSpecifyMinioStorage(client: Minio.Client, storageAccount: string, file: IGQLFileSteam, newFilename: string): Promise<IHTTPResult> {
  return new Promise((resolve) => {
    const { createReadStream } = file;

    const imageStream = createReadStream();
    const bufs = [];
    imageStream.on('data', (chunks) => {
      bufs.push(chunks);
    });
    imageStream.on('end', async () => {
      const httpResult = { status: 500, value: '' } as IHTTPResult;
      const buf = Buffer.concat(bufs);

      // SharpJs ext jpg,png,gif, images / 10mb
      const resultSetFile = await putFileToBucket(client, storageAccount, newFilename, buf);

      if (resultSetFile) {
        const resultUrl = await getURLFromBucket(client, storageAccount, newFilename);
        httpResult.status = 200;
        httpResult.value = { filename: newFilename, url: resultUrl };
      }
      resolve(httpResult);
    });
  });
}
