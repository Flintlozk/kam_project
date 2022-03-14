import { Storage } from '@google-cloud/storage';
import { generateImageFileName, isImageByExtension, saveToTempDir, uploadImagesToGC } from '@reactor-room/itopplus-back-end-helpers';
import { IMoreImageUrlResponse, IGQLFileSteam } from '@reactor-room/model-lib';
import fs from 'fs';
import os from 'os';
import path from 'path';
import imageType from 'image-type';
import readChunk from 'read-chunk';

export const googleCloudUpload = async (
  file: IGQLFileSteam,
  pageUUID: string,
  nameID: number,
  bucketName: string,
  maxSide?: number, // max dimension of image
): Promise<IMoreImageUrlResponse> => {
  const maxSize = 2097152; // TODO : move to ENV
  const { filename, createReadStream } = await file;
  const imageFileName = generateImageFileName(filename, pageUUID, nameID);
  const tempDirPath = path.join(os.tmpdir(), imageFileName);
  const storage = new Storage();
  const gcBucket = storage.bucket(bucketName);
  const extension = filename.slice((Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1);
  const isImage = isImageByExtension(extension);

  const savedTempDir = await saveToTempDir(createReadStream, tempDirPath, maxSide, isImage);
  const { size } = fs.statSync(tempDirPath);

  if (maxSize < size) throw Error('FILESIZE_EXCEEDED');
  if (isImage && !isValidImage(tempDirPath)) throw Error('INVALID_IMAGE');

  if (savedTempDir) {
    //TODO: resize before Upload
    const uploadResponse = await uploadImagesToGC(gcBucket, tempDirPath, pageUUID, imageFileName);
    return uploadResponse;
  } else {
    throw Error('TEMP DRIVE: IS EMPTY OR NOT HAVE PERMISSION');
  }
};

function isValidImage(path: string): imageType.ImageTypeResult | null {
  const buffer = readChunk.sync(path, 0, 12);
  return imageType(buffer);
}
