import type { IGQLContext, IPayload, ITaxArg, ITaxModel } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { requireLogin, TaxService } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';
import { validateRequestPageID, validateTaxResponse } from '../../schema';

class Tax {
  constructor() {
    Tax.taxService = new TaxService();
  }
  public static instance;
  public static taxService: TaxService;
  public static getInstance() {
    if (!Tax.instance) Tax.instance = new Tax();
    return Tax.instance;
  }

  //Query
  @requireLogin([EnumAuthScope.CMS])
  async getTaxByPageIDHandler(parent, arg: ITaxArg, context: IGQLContext): Promise<ITaxModel> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Tax.taxService.getTaxByPageID(pageID);
  }
}

const tax: Tax = Tax.getInstance();
export const taxResolver = {
  Query: {
    getTaxByPageID: graphQLHandler({
      handler: tax.getTaxByPageIDHandler,
      validator: validateTaxResponse,
    }),
  },
};
