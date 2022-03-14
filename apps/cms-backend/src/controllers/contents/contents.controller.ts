import { EContentEditorComponentType, IContentEditor, IContentEditorComponent, IContentEditorWithLength } from '@reactor-room/cms-models-lib';
import { ContentsService } from '@reactor-room/cms-services-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, IPayload } from '@reactor-room/itopplus-model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { validateDefaultRequest, validateRequestPageID, validateResponseHTTPObject } from '../../schema';
import {
  validateContentsCategoriesRequest,
  validateContentsContentsRequest,
  validateContentsIdRequest,
  validateContentsUpdateRequest,
} from '../../schema/contents/contents.schema';

@requireScope([EnumAuthScope.CMS])
class Contents {
  public static instance: Contents;
  public static contentsService: ContentsService;

  public static getInstance() {
    if (!Contents.instance) Contents.instance = new Contents();
    return Contents.instance;
  }

  constructor() {}

  async getContentsByCategoriesHandler(parent, args: { categories: string[]; limit: number }, context: IGQLContext): Promise<IContentEditor[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { categories, limit } = validateContentsCategoriesRequest<{ categories: string[]; limit: number }>(args);
    const result = await ContentsService.getContentsByCategories(pageID, categories, limit);
    return result;
  }

  async getContentsListHandler(parent, args: { tableFilter: ITableFilter }, context: IGQLContext): Promise<IContentEditorWithLength> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await ContentsService.getContentsList(pageID, args.tableFilter);
    return result;
  }

  async getContentsHandler(parent, args: { _id: string }, context: IGQLContext): Promise<IContentEditor> {
    const { _id } = validateContentsIdRequest<{ _id: string }>(args);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await ContentsService.getContents(pageID, _id);
    return result;
  }

  async getContentsHTMLHandler(parent, args: { _id: string }, context: IGQLContext): Promise<string> {
    const { _id } = validateContentsIdRequest<{ _id: string }>(args);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await ContentsService.getContentsHTML(pageID, _id);
    return result;
  }

  async addContentsHandler(parent, args: { contents: IContentEditor }, context: IGQLContext): Promise<IHTTPResult> {
    const { contents } = validateContentsContentsRequest<{ contents: IContentEditor }>(args);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await ContentsService.addContents(pageID, contents);
  }

  async updateContentsHandler(parent, args: { contents: IContentEditor; _id: string; isSaveAsDraft: boolean }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { contents, _id, isSaveAsDraft } = validateContentsUpdateRequest<{ contents: IContentEditor; _id: string; isSaveAsDraft: boolean }>(args);
    const result = await ContentsService.updateContents(pageID, _id, contents, isSaveAsDraft);
    return result;
  }
}

const contents: Contents = Contents.getInstance();
export const contentsResolver = {
  ContentsComponentModel: {
    __resolveType(root: IContentEditorComponent): string {
      switch (root.type) {
        case EContentEditorComponentType.TEXT:
          return 'ContentsComponentTextModel';
        case EContentEditorComponentType.EMBEDED:
          return 'ContentsComponentEmbededModel';
        case EContentEditorComponentType.IMAGE:
          return 'ContentsComponentImageModel';
        default:
          return 'ContentsComponentTextModel';
      }
    },
  },
  Query: {
    getContentsByCategories: graphQLHandler({
      handler: contents.getContentsByCategoriesHandler,
      validator: validateDefaultRequest,
    }),
    getContentsList: graphQLHandler({
      handler: contents.getContentsListHandler,
      validator: validateDefaultRequest,
    }),
    getContents: graphQLHandler({
      handler: contents.getContentsHandler,
      validator: validateDefaultRequest,
    }),
    getContentsHTML: graphQLHandler({
      handler: contents.getContentsHTMLHandler,
      validator: validateDefaultRequest,
    }),
  },
  Mutation: {
    addContents: graphQLHandler({
      handler: contents.addContentsHandler,
      validator: validateResponseHTTPObject,
    }),
    updateContents: graphQLHandler({
      handler: contents.updateContentsHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
