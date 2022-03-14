import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { EnumAuthScope, IFile, IFilesInfo, IFileUpload, IPayload, ISystemFilesInfo } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { FileService, requireScope } from '@reactor-room/itopplus-services-lib';
import { validateRequestPageID } from '../../schema/common';
import { validateDefaultRequest } from '../../schema/default';
import { environmentLib } from '@reactor-room/environment-services-backend';
import { transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import { GraphQLUpload } from 'graphql-upload';

@requireScope([EnumAuthScope.SOCIAL])
class Files {
  public static instance: Files;
  public static filesService: FileService;

  public static getInstance() {
    if (!Files.instance) Files.instance = new Files();
    return Files.instance;
  }

  constructor() {}

  async getFilesHandler(parent, args: { skip: number; limit: number }, context: IGQLContext): Promise<IFile[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { subscriptionID } = validateDefaultRequest<IPayload>(context.payload);
    const { skip, limit } = validateDefaultRequest<{ skip: number; limit: number }>(args);
    const result = await FileService.getFiles(pageID, subscriptionID, skip, limit);
    const upload_folder = context.payload.subscriptionID;
    return result?.length
      ? result.map((file) => {
          const defaultPath = file.path;
          file.path = transformMediaLinkString(defaultPath, environmentLib.filesServer, upload_folder);
          file.thumbnail = transformMediaLinkString(defaultPath, environmentLib.filesServer, upload_folder);
          return file;
        })
      : result;
  }

  async getDeletedFilesHandler(parent, args: { skip: number; limit: number }, context: IGQLContext): Promise<IFile[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { subscriptionID } = validateDefaultRequest<IPayload>(context.payload);
    const { skip, limit } = validateDefaultRequest<{ skip: number; limit: number }>(args);
    const result = await FileService.getDeletedFiles(pageID, subscriptionID, skip, limit);
    const upload_folder = context.payload.subscriptionID;
    return result?.length
      ? result.map((file) => {
          const defaultPath = file.path;
          file.path = transformMediaLinkString(defaultPath.replace('assets', 'trash'), environmentLib.filesServer, upload_folder);
          file.thumbnail = transformMediaLinkString(defaultPath.replace('assets', 'trash'), environmentLib.filesServer, upload_folder);
          return file;
        })
      : result;
  }

  async getFilesInfoHandler(parent, args, context: IGQLContext): Promise<IFilesInfo> {
    const { subscriptionID, page } = context.payload;
    const result = await FileService.getFilesInfo(subscriptionID, page.uuid);
    return result;
  }

  async getSystemFilesInfoHandler(parent, args, context: IGQLContext): Promise<ISystemFilesInfo> {
    const { subscriptionID, page } = context.payload;
    return await FileService.getSystemFilesInfo(subscriptionID, page.uuid, environmentLib.cms.backendUrl);
  }

  async uploadFilesHandler(parent, args: { files: IFileUpload[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { subscriptionID, page } = validateDefaultRequest<IPayload>(context.payload);
    const { files } = validateDefaultRequest<{ files: IFileUpload[] }>(args);
    const result = await FileService.uploadFiles(pageID, subscriptionID, files, page.uuid);
    return result;
  }

  async trashFilesHandler(parent, args: { filePaths: string[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { subscriptionID, page } = validateDefaultRequest<IPayload>(context.payload);
    const { filePaths } = validateDefaultRequest<{ filePaths: string[] }>(args);
    const result = await FileService.trashFiles(pageID, subscriptionID, filePaths, page.uuid);
    return result;
  }

  async recoverFilesHandler(parent, args: { filePaths: string[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { subscriptionID, page } = validateDefaultRequest<IPayload>(context.payload);
    const { filePaths } = validateDefaultRequest<{ filePaths: string[] }>(args);
    const result = await FileService.recoverFiles(pageID, subscriptionID, filePaths, page.uuid);
    return result;
  }

  async deleteFilesHandler(parent, args: { filePaths: string[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { subscriptionID, page } = validateDefaultRequest<IPayload>(context.payload);
    const { filePaths } = validateDefaultRequest<{ filePaths: string[] }>(args);
    const result = await FileService.deleteFiles(pageID, subscriptionID, filePaths, page.uuid);
    return result;
  }

  async emptyFilesHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { subscriptionID, page } = validateDefaultRequest<IPayload>(context.payload);
    const result = await FileService.emptyFiles(pageID, subscriptionID, page.uuid);
    return result;
  }
}

const files: Files = Files.getInstance();
export const filesResolver = {
  Upload: GraphQLUpload,
  Query: {
    getFiles: graphQLHandler({
      handler: files.getFilesHandler,
      validator: validateDefaultRequest,
    }),
    getDeletedFiles: graphQLHandler({
      handler: files.getDeletedFilesHandler,
      validator: validateDefaultRequest,
    }),
    getFilesInfo: graphQLHandler({
      handler: files.getFilesInfoHandler,
      validator: validateDefaultRequest,
    }),
    getSystemFilesInfo: graphQLHandler({
      handler: files.getSystemFilesInfoHandler,
      validator: validateDefaultRequest,
    }),
  },
  Mutation: {
    uploadFiles: graphQLHandler({
      handler: files.uploadFilesHandler,
      validator: validateDefaultRequest,
    }),
    trashFiles: graphQLHandler({
      handler: files.trashFilesHandler,
      validator: validateDefaultRequest,
    }),
    recoverFiles: graphQLHandler({
      handler: files.recoverFilesHandler,
      validator: validateDefaultRequest,
    }),
    deleteFiles: graphQLHandler({
      handler: files.deleteFilesHandler,
      validator: validateDefaultRequest,
    }),
    emptyFiles: graphQLHandler({
      handler: files.emptyFilesHandler,
      validator: validateDefaultRequest,
    }),
  },
};
