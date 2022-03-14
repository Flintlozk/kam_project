import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { IContentManagementGeneralPattern } from '@reactor-room/cms-models-lib';
import { validateDefaultRequest, validateResponseHTTPObject } from '../../schema';
import { validateAddContentPatternRequest, validateGetContentPatternsRequest, validateUpdateContentPatternRequest } from '../../schema/content-patterns/content-patterns.schema';
import { ContentPatternsService } from '@reactor-room/cms-services-lib';
import { validateContentsIdRequest } from '../../schema/contents/contents.schema';

class ContentPatterns {
  public static instance: ContentPatterns;
  public static contentPatternsService: ContentPatternsService;

  public static getInstance() {
    if (!ContentPatterns.instance) ContentPatterns.instance = new ContentPatterns();
    return ContentPatterns.instance;
  }

  constructor() {}

  @requireLogin([EnumAuthScope.CMS, EnumAuthScope.ADMIN_CMS])
  async getTotalPatternHandler(parent, args, context: IGQLContext): Promise<number> {
    const result = await ContentPatternsService.getTotalPattern();
    return result;
  }

  @requireLogin([EnumAuthScope.CMS, EnumAuthScope.ADMIN_CMS])
  async getContentPatternsHandler(parent, args: { skip: number; limit: number }, context: IGQLContext): Promise<IContentManagementGeneralPattern[]> {
    const { skip, limit } = validateGetContentPatternsRequest<{ skip: number; limit: number }>(args);
    const result = await ContentPatternsService.getContentPatterns(skip, limit);
    return result;
  }

  @requireLogin([EnumAuthScope.CMS, EnumAuthScope.ADMIN_CMS])
  async getContentPatternHandler(parent, args: { _id: string }, context: IGQLContext): Promise<IContentManagementGeneralPattern> {
    const { _id } = validateContentsIdRequest<{ _id: string }>(args);
    const result = await ContentPatternsService.getContentPattern(_id);
    return result;
  }

  @requireLogin([EnumAuthScope.ADMIN_CMS])
  async addContentPatternHandler(parent, args: { pattern: IContentManagementGeneralPattern }, context: IGQLContext): Promise<IHTTPResult> {
    const { pattern } = validateAddContentPatternRequest<{ pattern: IContentManagementGeneralPattern }>(args);
    const result = await ContentPatternsService.addContentPattern(pattern);
    return result;
  }

  @requireLogin([EnumAuthScope.ADMIN_CMS])
  async updateContentPatternHandler(parent, args: { pattern: IContentManagementGeneralPattern }, context: IGQLContext): Promise<IHTTPResult> {
    const { pattern } = validateUpdateContentPatternRequest<{ pattern: IContentManagementGeneralPattern }>(args);
    const result = await ContentPatternsService.updateContentPattern(pattern);
    return result;
  }
}

const contentPatterns: ContentPatterns = ContentPatterns.getInstance();
export const contentPatternsResolver = {
  Query: {
    getTotalPattern: graphQLHandler({
      handler: contentPatterns.getTotalPatternHandler,
      validator: validateDefaultRequest,
    }),
    getContentPatterns: graphQLHandler({
      handler: contentPatterns.getContentPatternsHandler,
      validator: validateDefaultRequest,
    }),
    getContentPattern: graphQLHandler({
      handler: contentPatterns.getContentPatternHandler,
      validator: validateDefaultRequest,
    }),
  },
  Mutation: {
    addContentPattern: graphQLHandler({
      handler: contentPatterns.addContentPatternHandler,
      validator: validateResponseHTTPObject,
    }),
    updateContentPattern: graphQLHandler({
      handler: contentPatterns.updateContentPatternHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
