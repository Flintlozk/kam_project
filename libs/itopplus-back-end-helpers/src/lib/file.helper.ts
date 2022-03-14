/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFBMessengerAttachmentAssetType } from '@reactor-room/itopplus-model-lib';
import { createWriteStream } from 'fs';
import sharp from 'sharp';
import { getUTCDayjs } from './utc.helper';

export const generateImageFileName = (name: string, pageUUID: string, productID: number): string => {
  const currentTimeStamp = +getUTCDayjs().toDate();
  const indexOfDot = name.lastIndexOf('.');
  const fileName = name.substr(0, indexOfDot);
  const ext = name.substr(indexOfDot + 1);
  return `${fileName}_${pageUUID}_${productID}_${currentTimeStamp}.${ext}`;
};

const resizingImages = (stream, maxSide: number) => {
  return stream.pipe(
    sharp().resize(maxSide, maxSide, {
      withoutEnlargement: true,
      fit: sharp.fit.inside,
    }),
  );
};

export const saveToTempDir = (createReadStream: any, tempDirPath: string, maxSide = 1000, isImage: boolean): Promise<boolean> => {
  return new Promise((resolve) => {
    const readSteam = createReadStream();
    if (isImage) resizingImages(readSteam, maxSide);

    readSteam
      .pipe(createWriteStream(tempDirPath))
      .on('close', () => {
        resolve(true);
      })
      .on('error', () => {
        resolve(false);
      });
  });
};

export const getFileTypeFromMimeType = (mimeType: string): IFBMessengerAttachmentAssetType => {
  switch (mimeType.toLowerCase()) {
    case 'png':
    case 'jpeg':
    case 'jpg':
    case 'gif':
    case 'image/png':
    case 'image/jpeg':
    case 'image/jpg':
    case 'image/gif':
      return IFBMessengerAttachmentAssetType.IMAGE;
    default:
      return IFBMessengerAttachmentAssetType.FILE;
  }
};
