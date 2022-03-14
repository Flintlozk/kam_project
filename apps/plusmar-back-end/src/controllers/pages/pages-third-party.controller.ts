import { IHTTPResult, ITextString } from '@reactor-room/model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import {
  EnumAuthScope,
  IGQLContext,
  IPagesThirdParty,
  IPagesThirdPartyActive,
  IPagesThirdPartyPageType,
  IPayload,
  IRefreshPageThirdPartyTokenParams,
} from '@reactor-room/itopplus-model-lib';
import { PagesThirdPartyService } from '@reactor-room/itopplus-services-lib';
import { validateRequestPageID, validateResponseHTTPObject, validateTextStringObject } from '../../schema/common';
import { validateRequestPageThirdPartyPageType } from '../../schema/pages';
import { validatePageThirdPartyInactiveResponse, validatePageThirdPartyPageResponse, validateRefreshPageThirdPartyTokenRequest } from '../../schema/pages/pages-third-party.schema';
import { graphQLHandler } from '../graphql-handler';
import { environment } from '../../environments/environment';

@requireScope([EnumAuthScope.SOCIAL])
class PagesThirdParty {
  public static instance: PagesThirdParty;
  public static pagesThirdPartyService: PagesThirdPartyService;
  public static getInstance(): PagesThirdParty {
    if (!PagesThirdParty.instance) PagesThirdParty.instance = new PagesThirdParty();
    return PagesThirdParty.instance;
  }

  constructor() {
    PagesThirdParty.pagesThirdPartyService = new PagesThirdPartyService();
  }

  async getPageThirdPartyByPageTypeHandler(parent, args: IPagesThirdPartyPageType, context: IGQLContext): Promise<IPagesThirdParty> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { pageType } = validateRequestPageThirdPartyPageType(args);
    const result = await PagesThirdParty.pagesThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [pageType] });
    return result;
  }

  async getPageThirdPartyInactiveHandler(parent, args, context: IGQLContext): Promise<IPagesThirdPartyActive[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await PagesThirdParty.pagesThirdPartyService.getPageThirdPartyInactive(pageID);
    return result;
  }

  getShopeeConnectURLHandler(parent, args, context: IGQLContext): ITextString {
    const {
      page: { uuid: pageUUID },
    } = context.payload;
    const { shopee } = environment;
    return PagesThirdParty.pagesThirdPartyService.getShopeeConnectURL(pageUUID, shopee);
  }

  getLazadaConnectURLHandler(parent, args, context: IGQLContext): ITextString {
    const {
      page: { uuid: pageUUID },
    } = context.payload;
    const { lazada } = environment;
    return PagesThirdParty.pagesThirdPartyService.getlazadaConnectURL(pageUUID, lazada);
  }

  async refreshPageThirdPartyToken(parent, args: IRefreshPageThirdPartyTokenParams, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { pageType, tokenType } = validateRefreshPageThirdPartyTokenRequest(args);
    const { lazada, shopee } = environment;
    return await PagesThirdParty.pagesThirdPartyService.refreshPageThirdPartyToken(pageID, { lazadaEnv: lazada, shopeeEnv: shopee }, { pageType, tokenType });
  }
}

const pagesThirdParty: PagesThirdParty = PagesThirdParty.getInstance();
export const pagesThirdPartyResolver = {
  Query: {
    getPageThirdPartyByPageType: graphQLHandler({
      handler: pagesThirdParty.getPageThirdPartyByPageTypeHandler,
      validator: validatePageThirdPartyPageResponse,
    }),
    getShopeeConnectURL: graphQLHandler({
      handler: pagesThirdParty.getShopeeConnectURLHandler,
      validator: validateTextStringObject,
    }),
    getLazadaConnectURL: graphQLHandler({
      handler: pagesThirdParty.getLazadaConnectURLHandler,
      validator: validateTextStringObject,
    }),
    getPageThirdPartyInactive: graphQLHandler({
      handler: pagesThirdParty.getPageThirdPartyInactiveHandler,
      validator: validatePageThirdPartyInactiveResponse,
    }),
  },
  Mutation: {
    refreshPageThirdPartyToken: graphQLHandler({
      handler: pagesThirdParty.refreshPageThirdPartyToken,
      validator: validateResponseHTTPObject,
    }),
  },
};
