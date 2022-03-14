import { IGQLFileSteam, IMetatData, INoteId, IUploadFileResponse } from '@reactor-room/crm-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Client, ItemBucketMetadata } from 'minio';
import { CrmService } from '../../services/crmservice.class';
import { insertAttachementByNoteId } from '../task/task.data';

export async function setFileToS3Bucket(s3BucketClient: Client, s3BucketName: string, filename: string, buf: Buffer, metadata: IMetatData): Promise<boolean> {
  try {
    await s3BucketClient.putObject(s3BucketName, filename, buf, metadata);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
export async function getMetaDataFromObject(s3BucketClient: Client, s3BucketName: string, filename: string): Promise<ItemBucketMetadata> {
  try {
    const stateobject = await s3BucketClient.statObject(s3BucketName, filename);
    return stateobject.metaData;
  } catch (err) {
    console.log(err);
  }
}
export async function deleteFileOfS3Bucket(s3BucketClient: Client, s3BucketName: string, filePath: string): Promise<boolean> {
  try {
    await s3BucketClient.removeObject(s3BucketName, filePath, function (err) {
      if (err) {
        return console.log('Unable to remove object', err);
      }
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
export async function getS3FileFromBucket(s3BucketClient: Client, s3BucketName: string, filename: string): Promise<string> {
  try {
    const result = await s3BucketClient.presignedUrl('GET', s3BucketName, filename);
    return result;
  } catch (err) {
    console.log('ERROR ::', err);
    return null;
  }
}
export async function uploadFileToMinio(
  file: IGQLFileSteam,
  id: number | string,
  uuid: string,
  production: boolean,
  ownerId: number,
  userId: number,
  bucketName: string,
): Promise<IUploadFileResponse> {
  const { createReadStream, mimetype, filename } = await file;
  return new Promise((resolve) => {
    if (id !== undefined) {
      const imageStream = createReadStream();
      const bufs = [];
      imageStream.on('data', (chunks) => {
        bufs.push(chunks);
      });
      imageStream.on('end', async () => {
        const buf = Buffer.concat(bufs);
        const time = new Date();
        let newFileName = `staging/${uuid}/${id}_${time.getTime()}_${filename.replace(/\s/g, '_')}`;
        if (production) {
          newFileName = `production/${uuid}/${id}_${time.getTime()}_${filename.replace(/\s/g, '_')}`;
        }
        const resultSetFile = await setFileToS3Bucket(CrmService.s3Bucket, bucketName, newFileName, buf, { ownerId: ownerId, userId: userId });
        if (resultSetFile) {
          const resultUrl = await getS3FileFromBucket(CrmService.s3Bucket, bucketName, newFileName);
          const uploadResponse = { status: 500, values: { fileName: '', fileUrl: '', filePath: '' } };
          uploadResponse.status = 200;
          uploadResponse.values = { fileUrl: resultUrl, fileName: filename, filePath: newFileName };
          resolve(uploadResponse);
        }
      });
    }
  });
}
