import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { IContentManagementLandingPattern } from '@reactor-room/cms-models-lib';
import { validateDefaultRequest } from '../../schema';
import { validateGetContentPatternsRequest } from '../../schema/content-patterns/content-patterns.schema';
import { ContentPatternsLandingService } from '@reactor-room/cms-services-lib';
import { validateContentsIdRequest } from '../../schema/contents/contents.schema';

class ContentPatternsLanding {
  public static instance: ContentPatternsLanding;
  public static contentPatternsService: ContentPatternsLandingService;

  public static getInstance() {
    if (!ContentPatternsLanding.instance) ContentPatternsLanding.instance = new ContentPatternsLanding();
    return ContentPatternsLanding.instance;
  }

  constructor() {}

  @requireLogin([EnumAuthScope.CMS, EnumAuthScope.ADMIN_CMS])
  async getContentPatternsLandingsHandler(parent, args: { skip: number; limit: number }, context: IGQLContext): Promise<IContentManagementLandingPattern[]> {
    const { skip, limit } = validateGetContentPatternsRequest<{ skip: number; limit: number }>(args);
    const result = await ContentPatternsLandingService.getContentPatternLandings(skip, limit);
    return result;
  }

  @requireLogin([EnumAuthScope.CMS, EnumAuthScope.ADMIN_CMS])
  async getContentPatternLandingHandler(parent, args: { _id: string }, context: IGQLContext): Promise<IContentManagementLandingPattern> {
    const { _id } = validateContentsIdRequest<{ _id: string }>(args);
    const result = await ContentPatternsLandingService.getContentPatternLanding(_id);
    return result;
  }
}

const contentPatternsLanding: ContentPatternsLanding = ContentPatternsLanding.getInstance();
export const contentPatternsLandingResolver = {
  Query: {
    getContentPatternsLandings: graphQLHandler({
      handler: contentPatternsLanding.getContentPatternsLandingsHandler,
      validator: validateDefaultRequest,
    }),
    getContentPatternsLanding: graphQLHandler({
      handler: contentPatternsLanding.getContentPatternLandingHandler,
      validator: validateDefaultRequest,
    }),
  },
};
