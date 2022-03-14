import { PubSub } from '@google-cloud/pubsub';
import { Bucket } from '@google-cloud/storage';
import { UploadOptions } from '@google-cloud/storage/build/src/bucket';
import { ENV_TYPE, IMoreImageUrlResponse } from '@reactor-room/model-lib';

export const uploadImagesToGC = (gcBucket: Bucket, filepath: string, pageUUID: string, filename: string): Promise<IMoreImageUrlResponse> => {
  return new Promise((resolve, reject) => {
    try {
      let folderName = ENV_TYPE.STAGING;
      if (process.env.NODE_ENV === ENV_TYPE.PRODUCTION) folderName = ENV_TYPE.PRODUCTION;
      const folderPath = `${folderName}/${pageUUID}/${filename}`;
      const options: UploadOptions = { gzip: true, resumable: false, destination: folderPath };
      gcBucket.upload(filepath, options, (err, file, apiResponse) => {
        if (err) {
          reject(err);
        } else {
          const { id, selfLink, mediaLink, bucket } = apiResponse;
          resolve({ id, selfLink, mediaLink, bucket });
        }
      });
    } catch (error) {
      console.log(error, 'up error gc');
      reject(error);
    }
  });
};

export const publishMessage = (payload, topicName: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const dataBuffer = Buffer.from(data);
    const connection = new PubSub();
    connection
      .topic(topicName)
      .publish(dataBuffer)
      .then((messageId) => {
        console.log(`Message ${messageId} published.`);
        resolve(true);
      })
      .catch((e) => {
        // Move here because if reaven is gone don't make system failed until this catch.
        console.log(e);
        reject(e);
      });
  });
};
