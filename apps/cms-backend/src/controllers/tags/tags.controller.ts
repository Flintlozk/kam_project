import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { EnumAuthScope, IPayload } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateDefaultRequest, validateRequestPageID } from '../../schema';
import { TagsService } from '@reactor-room/cms-services-lib';

@requireScope([EnumAuthScope.CMS])
class Tags {
  public static instance: Tags;
  public static TagsService: TagsService;

  public static getInstance() {
    if (!Tags.instance) Tags.instance = new Tags();
    return Tags.instance;
  }

  constructor() {}

  async getTagsHandler(parent, args, context: IGQLContext): Promise<string[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await TagsService.getTags(pageID);
    return result;
  }
}

const tags: Tags = Tags.getInstance();
export const tagsResolver = {
  Query: {
    getTags: graphQLHandler({
      handler: tags.getTagsHandler,
      validator: validateDefaultRequest,
    }),
  },
  Mutation: {},
};
