import { IFile, IFileReturnValue, IFilesInfo, ISystemFilesInfo } from '@reactor-room/itopplus-model-lib';
import { IMoreImageUrlResponse } from '@reactor-room/model-lib';
import { generateKeyPairSync, publicEncrypt } from 'crypto';
import stringify from 'fast-json-stable-stringify';
export const generatePrivatePublicKey = (): [string, string] => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  return [privateKey, publicKey];
};

export const generateEncryptData = <T>(public_key: string, data: T): Buffer => {
  const encryptedData = publicEncrypt(public_key, Buffer.from(stringify(data)));
  return encryptedData;
};

export function getBufferFromStream(stream): Promise<Buffer> {
  return new Promise((resolve) => {
    const bufs = [];
    stream.on('data', function (d) {
      bufs.push(d);
    });
    stream.on('end', function () {
      const buf = Buffer.concat(bufs);
      resolve(buf);
    });
  });
}

export function transFormMoreImageUrlResponse(imageResposne: IFileReturnValue): IMoreImageUrlResponse {
  const file: IMoreImageUrlResponse = {
    selfLink: imageResposne.filePath,
    mediaLink: imageResposne.filePath,
    name: imageResposne.fileName,
    extension: imageResposne.fileExtension,
  };
  return file;
}
export function transFormUpdateFileSchema(imageResposne: IFileReturnValue, folder: string, identifyID: string, pageID: number, subscriptionID: string): IFile {
  const date = new Date().toISOString();
  const updateFile: IFile = {
    pageID,
    subscriptionID,
    path: imageResposne.filePath,
    name: imageResposne.fileName,
    extension: imageResposne.fileExtension,
    description: imageResposne.fileName,
    date: date,
    tags: [],
    isDeleted: false,
    deleteable: false,
    type: `system/${folder}`,
    identifyID: identifyID,
    ref: null,
  };
  return updateFile;
}
export function transformSystemFileSizeToString(fileInfo: ISystemFilesInfo): ISystemFilesInfo {
  fileInfo.messageSize = fileInfo.messageSize.toString();
  fileInfo.productSize = fileInfo.productSize.toString();
  fileInfo.totalSize = fileInfo.totalSize.toString();
  return fileInfo;
}
export function transformFileSizeToString(fileInfo: IFilesInfo): IFilesInfo {
  fileInfo.imageSize = fileInfo.imageSize.toString();
  fileInfo.videoSize = fileInfo.videoSize.toString();
  fileInfo.totalSize = fileInfo.totalSize.toString();
  return fileInfo;
}
