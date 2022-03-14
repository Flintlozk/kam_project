import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { validateHTTPResponse } from '../../schema/theme/theme.schema';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { EnumAuthScope, IPayload } from '@reactor-room/itopplus-model-lib';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { validateRequestPageID } from '../../schema';
import { PublishService } from '@reactor-room/cms-services-lib';
class PublishController {
  public static instance;

  constructor() {}
  public static getInstance() {
    if (!PublishController.instance) PublishController.instance = new PublishController();
    return PublishController.instance;
  }

  @requireLogin([EnumAuthScope.CMS])
  async publishAllPagesHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await PublishService.publishAllPages(pageID, context.payload.subscriptionID, context.payload.page.uuid);
    return result;
  }
}

const publishContoller: PublishController = PublishController.getInstance();

export const publishResolver = {
  Query: {
    publishAllPages: graphQLHandler({
      handler: publishContoller.publishAllPagesHandler,
      validator: validateHTTPResponse,
    }),
  },
};
