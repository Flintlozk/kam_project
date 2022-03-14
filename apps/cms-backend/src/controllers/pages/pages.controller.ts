import type { IGQLContext, IPages, IPagesArg, IPayload } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumAppScopeType } from '@reactor-room/itopplus-model-lib';
import { PagesService, requireLogin } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { validateRequestPageID, validateRequestUserID, validateSIDAccessTokenObjectValidate } from '../../schema';
import { validateDefaultRequest, validateDefaultResponse } from '../../schema/default/default.schema';
import { validateResponsePages } from '../../schema/pages';
import { graphQLHandler } from '../graphql-handler';

class Pages {
  public static instance: Pages;
  public static pagesService: PagesService;
  public static getInstance(): Pages {
    if (!Pages.instance) Pages.instance = new Pages();
    return Pages.instance;
  }

  constructor() {
    Pages.pagesService = new PagesService();
  }

  @requireLogin([EnumAuthScope.CMS])
  async changingPageHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IPages[] | null> {
    return await Pages.pagesService.changingPage(context.access_token, context.payload.userID, context.payload.subscriptionID, args.pageIndex, EnumAppScopeType.CMS);
  }

  @requireLogin([EnumAuthScope.CMS])
  async getPageByIDHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IPages> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Pages.pagesService.getPageByID(pageID);
    return result;
  }
  @requireLogin([EnumAuthScope.CMS])
  async checkMaxPagesHandler(parent, args: IPagesArg, context: IGQLContext) {
    const { userID } = validateRequestUserID<IPayload>(context.payload);
    const isCreatePageable = await Pages.pagesService.checkMaxPages(userID);
    return isCreatePageable;
  }
  @requireLogin([EnumAuthScope.CMS])
  async updateFacebookPageTokenHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { ID, accessToken } = validateSIDAccessTokenObjectValidate<IPayload>(context.payload);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Pages.pagesService.updateFacebookPageToken(pageID, ID, accessToken);
  }
}

const pages: Pages = Pages.getInstance();
export const pagesResolver = {
  Query: {
    changingPage: graphQLHandler({
      handler: pages.changingPageHandler,
      validator: validateDefaultResponse,
    }),
    getPageByID: graphQLHandler({
      handler: pages.getPageByIDHandler,
      validator: validateDefaultRequest,
    }),
    checkMaxPages: graphQLHandler({
      handler: pages.checkMaxPagesHandler,
      validator: validateResponsePages,
    }),
    updateFacebookPageToken: graphQLHandler({
      handler: pages.updateFacebookPageTokenHandler,
      validator: validateResponsePages,
    }),
  },
};
