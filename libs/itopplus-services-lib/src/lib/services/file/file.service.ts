import { axiosGetWithHeaderResponseBinary, getFileTypeFromMimeType, isAllowCaptureException, transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import { EnumFileFolder, IMoreImageUrlResponse, IGQLFileSteam, IHTTPResult } from '@reactor-room/model-lib';
import {
  FileType,
  IFacebookUploadAttachmentResponse,
  IFile,
  IFileReturnValue,
  IFilesInfo,
  IFileUpload,
  ImageSetSaved,
  ImageSetTemplateInput,
  IMessageModel,
  IMessageType,
  ISystemFilesInfo,
} from '@reactor-room/itopplus-model-lib';
import { getMessage } from '../../data/message/get-message.data';
import { googleCloudUpload } from '../../domains/google-cloud';

import * as Sentry from '@sentry/node';
import { transformImageUrlArray } from '@reactor-room/itopplus-back-end-helpers';
import { tmpdir } from 'os';
import { writeFileSync } from 'fs';
import path from 'path';
import { createFormDataFromBuffer, getFBMessengerAttachmentPayload } from '../../domains/message';
import { uploadFacebookAttachmentByFile, uploadFacebookAttachmentByURL } from '../../data';
import { PlusmarService } from '../plusmarservice.class';
import { generateEncryptData, transformFileSizeToString, transFormMoreImageUrlResponse, transformSystemFileSizeToString, transFormUpdateFileSchema } from '../../domains';
import { environmentLib } from '@reactor-room/environment-services-backend';
import {
  deleteFilesFromFileServer,
  emptyFilesFromFileServer,
  getFilesInfoFromFileSever,
  getSystemFilesInfoFromFileSever,
  recoverFilesFromFileServer,
  singleUploadBufferToFileServer,
  trashFilesFromFileServer,
  uploadFilesToFileServer,
  uploadFileToFileServer,
  uploadSystemFilesToFileServer,
} from '../../data/files-server/files-server.data';
import { addFiles, deleteFile, emptyFiles, getDeletedFiles, getFiles, updateFileIsDeletedStatus } from '../../data/files/files.data';
import axios from 'axios';
import * as mime from 'mime-types';
import { transformResizeImageURLToNormalUrl } from '@reactor-room/itopplus-helpers';
export class FileService {
  async getFile(params: { audienceID: string; messageID: string; filename: string }): Promise<string> {
    const { messageID, audienceID, filename } = params;
    const message = await getMessage(messageID, Number(audienceID));
    switch (message.messagetype) {
      case IMessageType.FILE: {
        return this.onMessageTypeAsFile(message);
      }
    }
  }

  onMessageTypeAsFile(message: IMessageModel): string {
    try {
      if (message.object === 'line') {
        const payload = JSON.parse(message.attachments as string);
        return payload[0].payload.url;
      } else {
        throw new Error('FILE_NOT_FOUND');
      }
    } catch (err) {
      console.log('getFile onMessageTypeAsFile ', err);
      throw new Error('FILE_NOT_FOUND');
    }
  }

  sendSingleImageToGoogleCloudHelper = async (file: IGQLFileSteam, pageUUID: string, nameID: number, bucketName: string): Promise<IMoreImageUrlResponse> => {
    try {
      return await googleCloudUpload(file, pageUUID, nameID, bucketName);
    } catch (err) {
      throw new Error('Error sending image to google cloud ' + err);
    }
  };

  sendImagesToGoogleCloudHelper = async (
    imagesArray: IGQLFileSteam[],
    nameID: number,
    bucketName: string,
    pageUUID: string,
    // maxSize?: number,
  ): Promise<IMoreImageUrlResponse[]> => {
    const googleCloudUploadResponse = [] as IMoreImageUrlResponse[];
    try {
      for (let i = 0; i < imagesArray.length; i++) {
        const file = imagesArray[i];
        googleCloudUploadResponse.push(await googleCloudUpload(file, pageUUID, nameID, bucketName));
      }
      return googleCloudUploadResponse;
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in uploadProductImageAndUpdate', err);
      throw new Error('Error sending image to google cloud ' + err);
    }
  };

  uploadToGoogle = async (pageID: number, file: IGQLFileSteam, pageUUID: string, folderName: string): Promise<string> => {
    const uniqueID = Date.now();
    const result = await this.uploadSystemFiles(pageID, [file], folderName, pageUUID, EnumFileFolder.COMPANY, uniqueID.toString());
    const [{ mediaLink }] = transformImageUrlArray(result, environmentLib.filesServer, folderName);
    return encodeURI(mediaLink);
  };

  readFileStream = async (file: IGQLFileSteam): Promise<Buffer> => {
    const { createReadStream } = await file;
    return new Promise((resolve) => {
      const stream = createReadStream();
      const buffers = [];

      stream.on('data', (chunck) => {
        buffers.push(chunck);
      });

      stream.on('end', () => {
        const buffer = Buffer.concat(buffers);
        resolve(buffer);
      });
    });
  };

  createTemporaryFile = (pageUUID: string, filename: string, file: Buffer): string => {
    const tempPath = tmpdir();
    const filePath = path.join(tempPath, filename);
    writeFileSync(filePath, file);

    return filePath;
  };

  saveImageSetToStorage = async (
    pageID: number,
    imagesSet: ImageSetTemplateInput,
    folderName: string,
    pageUUID: string,
    folder: EnumFileFolder,
    identifyID: string,
  ): Promise<ImageSetSaved[]> => {
    const savedSet = [];
    for (let index = 0; index < imagesSet.images.length; index++) {
      const image = imagesSet.images[index];
      let imageUrl = '';
      if (image.file) {
        const result = await this.uploadSystemFiles(pageID, [image.file], folderName, pageUUID, folder, identifyID);
        imageUrl = result[0].mediaLink;
      } else {
        imageUrl = image.url;
      }
      const sourceUrl = imageUrl;

      savedSet.push({
        origin: imageUrl,
        url: sourceUrl,
        attachment_id: image.attachment_id,
        extension: image.extension,
        filename: image.filename,
      });
    }

    return savedSet;
  };

  uploadAttachmentSets = async (
    savedSet: ImageSetSaved[],
    facebookPageToken: string,
    folderName: string,
  ): Promise<{
    failedList: any[];
    list: any[];
  }> => {
    const failedList = [];
    const list = [];

    for (let index = 0; index < savedSet.length; index++) {
      const image_set = savedSet[index];
      try {
        const imgUrl = transformMediaLinkString(image_set.url, environmentLib.filesServer, folderName);
        const payload = getFBMessengerAttachmentPayload(getFileTypeFromMimeType(image_set.extension), imgUrl);
        const result = await uploadFacebookAttachmentByURL(payload, facebookPageToken);
        list.push({
          url: image_set.url,
          attachment_id: image_set.attachment_id || result?.attachment_id,
          extension: image_set.extension,
          filename: image_set.filename,
        });
      } catch (err) {
        console.log('uploadAttachmentSets err [LOG]:--> ', err);
        if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in uploadAttachmentSets', err);
        failedList.push(image_set.filename);
      }
    }
    return { failedList, list };
  };
  static uploadFiles = async (pageID: number, folderName: string, files: IFileUpload[], pageUUID: string): Promise<IHTTPResult> => {
    try {
      const encryptedData = generateEncryptData<string>(environmentLib.publicKey, folderName);
      const result = await uploadFilesToFileServer(files, encryptedData, pageUUID, environmentLib.filesServer);
      if (result.status === 200 && result.value.length) {
        const service = [];
        const returnValue: IFileReturnValue[] = result.value;
        for (let index = 0; index < returnValue.length; index++) {
          const value = returnValue[index];
          const date = new Date().toISOString();
          const isSingleFile = returnValue.length === 1 && files.length === 1;
          const file: IFile = {
            pageID,
            subscriptionID: folderName,
            path: value.filePath,
            name: isSingleFile ? files[index].name : value.fileName,
            extension: value.fileExtension,
            description: isSingleFile ? files[index].description : '',
            date: date,
            tags: isSingleFile ? files[index].tags : [],
            isDeleted: false,
            deleteable: true,
            type: 'assets',
            identifyID: 'assets',
            ref: null,
          };
          service.push(addFiles(file));
        }
        await Promise.all(service);
        return { status: 200, value: true };
      } else {
        return result;
      }
    } catch (error) {
      throw Error(error);
    }
  };

  static trashFiles = async (pageID: number, folderName: string, filePaths: string[], pageUUID: string): Promise<IHTTPResult> => {
    try {
      const encryptedData = generateEncryptData<string>(environmentLib.publicKey, folderName);
      const result = await trashFilesFromFileServer(filePaths, encryptedData, pageUUID, environmentLib.filesServer);
      if (result.status === 200 && result.value.length) {
        const fileNames = result.value;
        for (let index = 0; index < fileNames.length; index++) {
          const fileName = fileNames[index];
          await updateFileIsDeletedStatus(pageID, folderName, fileName, true);
        }
        return { status: 200, value: true };
      } else {
        throw Error(result.value);
      }
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };

  static recoverFiles = async (pageID: number, folderName: string, filePaths: string[], pageUUID: string): Promise<IHTTPResult> => {
    try {
      const encryptedData = generateEncryptData<string>(environmentLib.publicKey, folderName);
      const result = await recoverFilesFromFileServer(filePaths, encryptedData, pageUUID, environmentLib.filesServer);
      if (result.status === 200 && result.value.length) {
        const fileNames = result.value;
        for (let index = 0; index < fileNames.length; index++) {
          const fileName = fileNames[index];
          await updateFileIsDeletedStatus(pageID, folderName, fileName, false);
        }
        return { status: 200, value: true };
      }
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };

  static deleteFiles = async (pageID: number, folderName: string, filePaths: string[], pageUUID: string): Promise<IHTTPResult> => {
    try {
      const encryptedData = generateEncryptData<string>(environmentLib.publicKey, folderName);
      const result = await deleteFilesFromFileServer(filePaths, encryptedData, pageUUID, environmentLib.filesServer);
      if (result.status === 200 && result.value.length) {
        const fileNames = result.value;
        for (let index = 0; index < fileNames.length; index++) {
          const fileName = fileNames[index];
          await deleteFile(pageID, folderName, fileName);
        }
        return { status: 200, value: true };
      }
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };

  static emptyFiles = async (pageID: number, folderName: string, pageUUID: string): Promise<IHTTPResult> => {
    try {
      const encryptedData = generateEncryptData<string>(environmentLib.publicKey, folderName);
      const result = await emptyFilesFromFileServer(encryptedData, pageUUID, environmentLib.filesServer);
      if (result.status === 200) {
        await emptyFiles(pageID, folderName);
        return { status: 200, value: true };
      } else {
        return { status: 403, value: 'Could not empty folder' };
      }
    } catch (error) {
      return { status: 403, value: error?.message?.toString() };
    }
  };

  static getFiles = async (pageID: number, folderName: string, skip: number, limit: number): Promise<IFile[]> => {
    try {
      const files = await getFiles(pageID, folderName, skip, limit);
      return files;
    } catch (error) {
      return null;
    }
  };

  static getDeletedFiles = async (pageID: number, folderName: string, skip: number, limit: number): Promise<IFile[]> => {
    try {
      const files = await getDeletedFiles(pageID, folderName, skip, limit);
      return files;
    } catch (error) {
      return null;
    }
  };

  static getFilesInfo = async (uploadFolder: string, pageUUID: string): Promise<IFilesInfo> => {
    try {
      const result = await getFilesInfoFromFileSever(uploadFolder, environmentLib.filesServer, pageUUID);
      if (result.status === 200) {
        return transformFileSizeToString(result.value);
      } else return null;
    } catch (error) {
      return null;
    }
  };
  static getSystemFilesInfo = async (uploadFolder: string, pageUUID: string, origin: string): Promise<ISystemFilesInfo> => {
    try {
      const result = await getSystemFilesInfoFromFileSever(uploadFolder, environmentLib.filesServer, pageUUID, origin);
      if (result.status === 200) {
        return transformSystemFileSizeToString(result.value);
      } else return null;
    } catch (error) {
      console.log('getSystemFilesInfo err [LOG]:--> ', error);
      if (isAllowCaptureException(environmentLib)) Sentry.captureException('err in uploadAttachmentSets', error);
      return null;
    }
  };
  static uploadFileToCMSFileServer = async (file: any, filename: string, folderName: string, CMSFilesServer: string, mode: FileType, contentType: string): Promise<string> => {
    try {
      return await uploadFileToFileServer(file, filename, folderName, CMSFilesServer, mode, contentType);
    } catch (error) {
      return null;
    }
  };
  uploadSystemFiles = async (
    pageID: number,
    imagesArray: IGQLFileSteam[],
    folderName: string,
    pageUUID: string,
    folder: EnumFileFolder,
    identifyID: string,
  ): Promise<IMoreImageUrlResponse[]> => {
    try {
      const encryptedData = generateEncryptData<string>(environmentLib.publicKey, folderName);
      const result = await uploadSystemFilesToFileServer(imagesArray, encryptedData, pageUUID, folder, identifyID.toString(), environmentLib.filesServerUpload);
      if (result.status === 200 && result.value.length) {
        const fileArray: IMoreImageUrlResponse[] = [];
        const service = [];
        const returnValue: IFileReturnValue[] = result.value;
        for (let index = 0; index < returnValue.length; index++) {
          const value = returnValue[index];
          const file = transFormMoreImageUrlResponse(value);
          const updateFileSchema = transFormUpdateFileSchema(value, folder, identifyID, pageID, folderName);
          fileArray.push(file);
          service.push(addFiles(updateFileSchema));
        }
        await Promise.all(service);
        return fileArray;
      }
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in uploadProductImageAndUpdate', err);
      throw new Error('Error sending image to uploadSystemFiles cloud ' + err);
    }
  };
  singleUploadBufferToFileServer = async (
    pageID: number,
    source: Buffer,
    folderName: string,
    pageUUID: string,
    folder: EnumFileFolder,
    identifyID: string,
    filename: string,
    bypass = false,
  ): Promise<IMoreImageUrlResponse[]> => {
    try {
      const encryptedData = generateEncryptData<string>(environmentLib.publicKey, folderName);
      const result = await singleUploadBufferToFileServer(source, encryptedData, pageUUID, folder, identifyID, environmentLib.filesServer, filename, bypass);
      if (result.status === 200 && result.value.length) {
        const fileArray: IMoreImageUrlResponse[] = [];
        const service = [];
        const returnValue: IFileReturnValue[] = result.value;
        for (let index = 0; index < returnValue.length; index++) {
          const value = returnValue[index];
          const file = transFormMoreImageUrlResponse(value);
          const updateFileSchema = transFormUpdateFileSchema(value, folder, identifyID, pageID, folderName);
          fileArray.push(file);
          service.push(addFiles(updateFileSchema));
        }
        await Promise.all(service);
        return fileArray;
      }
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in uploadProductImageAndUpdate', err);
      throw new Error('Error sending image to uploadSystemFiles cloud ' + err);
    }
  };
  uploadFileToFilServerWithLink = async (
    url: string,
    filename: string,
    pageID: string,
    folderName: string,
    pageUUID: string,
    folder: EnumFileFolder,
    identifyID: string,
    bypass: boolean,
    extension?: string,
  ): Promise<IMoreImageUrlResponse[]> => {
    try {
      const result = await axios.get(url, { responseType: 'stream' });
      //TODO: HENG I CHANGE THIS LOGIC ONLY COVERED extension;
      if (filename.search('.') === 0) {
        if (extension) {
          filename = filename + '.' + extension;
        } else {
          filename = filename + '.' + mime.extension(result.headers['content-type']);
        }
      }
      const image = result.data;
      return await this.singleUploadBufferToFileServer(+pageID, image, folderName, pageUUID, folder, identifyID, filename, bypass);
    } catch (e) {
      Sentry.captureException(e);
      return [] as IMoreImageUrlResponse[];
    }
  };

  getBufferFormFileServer = async (imageUrl: string): Promise<Buffer> => {
    const normalUrl = transformResizeImageURLToNormalUrl(imageUrl);
    const response = await axiosGetWithHeaderResponseBinary(normalUrl, {});
    const buffer = Buffer.from(response.data);
    return buffer;
  };

  uploadAttachmentFacebookFromBuffer = async (filename: string, mimetype: string, bufferFile: Buffer, token: string): Promise<IFacebookUploadAttachmentResponse> => {
    const fileData = createFormDataFromBuffer(bufferFile, filename, getFileTypeFromMimeType(mimetype));
    const result = await uploadFacebookAttachmentByFile(fileData, token, environmentLib.maximumFileSizeFacebook);
    return { attachmentID: result.attachment_id };
  };
}
