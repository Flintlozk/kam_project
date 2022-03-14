import { IHTTPResult } from '@reactor-room/model-lib';
import { EnumAuthScope, IGQLContext, IPayload, ISendCatalogToChatBoxArgs } from '@reactor-room/itopplus-model-lib';
import { ProductCatalogService, requireScope } from '@reactor-room/itopplus-services-lib';
import { validateRequestPageID, validateResponseHTTPObject } from '../../schema/common';
import { validateRequestSendCatalogToChatBox } from '../../schema/product/product-catalog.schema';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
export class ProductCatalog {
  public static instance;
  public static productCatalogService: ProductCatalogService;

  public static getInstance() {
    if (!ProductCatalog.instance) ProductCatalog.instance = new ProductCatalog();
    return ProductCatalog.instance;
  }

  constructor() {
    ProductCatalog.productCatalogService = new ProductCatalogService();
  }

  async sendProductCatalogToChatBoxHandler(parents, args: ISendCatalogToChatBoxArgs, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const sendArgs = validateRequestSendCatalogToChatBox<ISendCatalogToChatBoxArgs>(args);
    const result = await ProductCatalog.productCatalogService.sendProductCatalogToChatBox(pageID, sendArgs, context.payload.subscriptionID);
    return result;
  }
}

const productCatalog: ProductCatalog = ProductCatalog.getInstance();

export const productCatalogResolver = {
  Mutation: {
    sendProductCatalogToChatBox: graphQLHandler({
      handler: productCatalog.sendProductCatalogToChatBoxHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
