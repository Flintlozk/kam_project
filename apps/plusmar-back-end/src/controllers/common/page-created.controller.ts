import { EnumAuthScope, IGQLContext } from '@reactor-room/itopplus-model-lib';
import { PageCreatedService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateResponsePageCreated } from '../../schema/common';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class PageCreated {
  public static instance;
  public static pageCreatedService: PageCreatedService;
  public static getInstance() {
    if (!PageCreated.instance) PageCreated.instance = new PageCreated();
    return PageCreated.instance;
  }

  constructor() {
    PageCreated.pageCreatedService = new PageCreatedService();
  }

  async getDateOfPageCreatedHandler(parent, args, context: IGQLContext): Promise<string> {
    const data = await PageCreated.pageCreatedService.getDateOfPageCreation(context.payload.pageID);
    return data;
  }
}
const pageCreatedObj: PageCreated = PageCreated.getInstance();

export const pageCreatedResolver = {
  Query: {
    getDateOfPageCreation: graphQLHandler({
      handler: pageCreatedObj.getDateOfPageCreatedHandler,
      validator: validateResponsePageCreated,
    }),
  },
};
