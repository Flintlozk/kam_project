import { EnumAuthScope, IArgsProductFilter, IGQLContext, IProductLowInventoryList, IProductLowStockTotal } from '@reactor-room/itopplus-model-lib';
import { ProductLowInventoryService, requireScope } from '@reactor-room/itopplus-services-lib';
import { validateResponseProductList, validateResponseProductLowStock } from '../../schema/product/product-low-inventory.schema';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.CMS])
class ProductLowInventory {
  public static instance: ProductLowInventory;
  public static productLowInventoryService: ProductLowInventoryService;

  public static getInstance() {
    if (!ProductLowInventory.instance) ProductLowInventory.instance = new ProductLowInventory();
    return ProductLowInventory.instance;
  }

  constructor() {
    ProductLowInventory.productLowInventoryService = new ProductLowInventoryService();
  }

  async getProductsLowInventoryHandler(parent, args: IArgsProductFilter, context: IGQLContext): Promise<IProductLowInventoryList[]> {
    const { filters } = args;
    // const { pageID } = context.payload;
    const pageID = 91;
    const data = await ProductLowInventory.productLowInventoryService.getProductLowInventory(pageID, filters);
    return data;
  }

  async getProductsLowStockHandler(parent, args, context: IGQLContext): Promise<IProductLowStockTotal[]> {
    const { pageID } = context.payload;
    // const pageID = 91;
    const data = await ProductLowInventory.productLowInventoryService.getProductLowStockTotal(pageID);
    return data;
  }
}

const productLowInventory: ProductLowInventory = ProductLowInventory.getInstance();

export const productLowInventoryResolver = {
  Query: {
    getProductsLowInventory: graphQLHandler({
      handler: productLowInventory.getProductsLowInventoryHandler,
      validator: validateResponseProductList,
    }),
    getProductLowStockTotal: graphQLHandler({
      handler: productLowInventory.getProductsLowStockHandler,
      validator: validateResponseProductLowStock,
    }),
  },
};
