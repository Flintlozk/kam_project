import type {
  IArgsAddProduct,
  IArgsAddProductAttribute,
  IArgsAddProductVariant,
  IArgsCatSubCatHolder,
  IArgsProductAttributeList,
  IArgsProductCategoryList,
  IArgsProductFilter,
  IArgsProductID,
  IArgsUpdateProductMain,
  ICommonName,
  IGQLContext,
  INameIDPair,
  IPayload,
  IProductAttributeList,
  IProductByID,
  IProductCategoryList,
  IProductList,
  IProductRemoveByID,
  IProductStatus,
  IProductTag,
  IProductVariantParams,
  IVariantsOfProduct,
} from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumResourceValidation, EnumSubscriptionFeatureType, IProductAllList } from '@reactor-room/itopplus-model-lib';
import {
  ProductAttributeService,
  ProductCatergoryService,
  ProductService,
  ProductStatusService,
  ProductTagService,
  ProductWebhookCommunicationService,
  requireScope,
} from '@reactor-room/itopplus-services-lib';
import type { IDObject, IHTTPResult } from '@reactor-room/model-lib';
import { requirePackageValidation, requireResourceValidation } from '../../domains/plusmar';
import {
  validateIDNumberObject,
  validateNameIDObjectRequest,
  validateProductNameArrayRequest,
  validateRequestName,
  validateRequestPageID,
  validateResponseHTTPArray,
  validateResponseHTTPObject,
} from '../../schema';
import { validateDefaultRequest } from '../../schema/default/default.schema';
import {
  validateAddVariantRequest,
  validateProductAddRequest,
  validateProductCategoryHolderRequest,
  validateProductMainUpdateRequest,
  validateProductOnlyIDRequest,
  validateProductRemoveRequest,
  validateProductVariantParamsRequest,
  validateRequestProductAttributeList,
  validateRequestProductCategoryList,
  validateRequestProductSubAttributeAdd,
  validateResponseAddTag,
  validateResponseProductAttributeList,
  validateResponseProductByID,
  validateResponseProductCategoryList,
  validateResponseProductList,
  validateResponseProductListVariants,
  validateResponseProductStatus,
  validateResponseProductTag,
  validateResponseProductTagSearch,
  validateResponseshopsProductVariantList,
} from '../../schema/product';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.CMS])
class Product {
  public static instance;
  public static productService: ProductService;
  public static productTagService: ProductTagService;
  public static productStatusService: ProductStatusService;
  public static productCatergoryService: ProductCatergoryService;
  public static productAttributeService: ProductAttributeService;
  public static productCommService: ProductWebhookCommunicationService;

  public static getInstance() {
    if (!Product.instance) Product.instance = new Product();
    return Product.instance;
  }

  constructor() {
    Product.productService = new ProductService();
    Product.productTagService = new ProductTagService();
    Product.productStatusService = new ProductStatusService();
    Product.productCatergoryService = new ProductCatergoryService();
    Product.productAttributeService = new ProductAttributeService();
    Product.productCommService = new ProductWebhookCommunicationService();
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductStatusHandler(parent, args, context: IGQLContext): Promise<IProductStatus[]> {
    const data = await Product.productStatusService.getProductStatus();
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductTagHandler(parent, args, context: IGQLContext): Promise<IProductTag[]> {
    const { pageID } = context.payload;
    const data = await Product.productTagService.getProductTag(pageID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async addProductTagHandler(parent, args: ICommonName, context: IGQLContext): Promise<IProductTag> {
    const { name } = validateRequestName(args);
    const { pageID } = context.payload;
    const data = await Product.productTagService.addProductTag(pageID, name);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductTagSearchHandler(parent, args: ICommonName, context: IGQLContext): Promise<IProductTag[]> {
    const { name } = validateRequestName(args);
    const { pageID } = context.payload;
    const data = await Product.productTagService.getProductTagSearch(pageID, name);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductAllListHandler(parent, args: IArgsProductFilter, context: IGQLContext): Promise<IProductAllList[]> {
    const { filters } = args;
    const { pageID, subscriptionID } = context.payload;
    const data = await Product.productService.getProductAllList(pageID, filters, subscriptionID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductListHandler(parent, args: IArgsProductFilter, context: IGQLContext): Promise<IProductList[]> {
    const { filters } = args;
    const { pageID, subscriptionID } = context.payload;
    const data = await Product.productService.getProductList(pageID, filters, subscriptionID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductCategoryListHandler(parent, args, context: IGQLContext): Promise<IProductCategoryList[]> {
    const data = await Product.productCatergoryService.getProductCategoryList(context);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductAttributeListHandler(parent, args, context: IGQLContext): Promise<IProductAttributeList[]> {
    const { pageID } = context.payload;
    const data = await Product.productAttributeService.getProductAttributeList(pageID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async addProductCategoryHandler(parent, args: IArgsProductCategoryList, context: IGQLContext): Promise<IHTTPResult> {
    const { categoryData } = args;
    validateRequestProductCategoryList(categoryData);
    const data = await Product.productCatergoryService.addProductCategory(context, categoryData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async addProductAttributeHandler(parent, args: ICommonName, context: IGQLContext): Promise<IHTTPResult> {
    const { name } = validateRequestName(args);
    const data = await Product.productAttributeService.addProductAttribute(context, name);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async addProductSubAttributeHandler(parent, args: IArgsAddProductAttribute, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    const { attributeID, subAttributeName } = validateRequestProductSubAttributeAdd(args.subAttributeData);
    const data = await Product.productAttributeService.addProductSubAttribute(pageID, attributeID, subAttributeName);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async searchSKUAttributeHandler(parent, args: ICommonName, context: IGQLContext): Promise<IHTTPResult> {
    const { name } = validateRequestName(args);
    const data = await Product.productAttributeService.searchProductSKU(context, name);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async searchProductCodeExistsHandler(parent, args: ICommonName, context: IGQLContext): Promise<IHTTPResult> {
    const { name } = validateRequestName(args);
    const data = await Product.productService.searchProductCodeExists(context, name);
    return data;
  }

  @requireResourceValidation([EnumResourceValidation.VALIDATE_MAX_PRODUCTS])
  async addProductHandler(parent, args: IArgsAddProduct, context: IGQLContext): Promise<IHTTPResult[]> {
    const { images, variants } = args.productData;
    const storedVariantImages = variants?.map((variant) => variant.variantImages);
    const { productData } = validateProductAddRequest(args);
    productData.images = images;
    productData.variants.map((variant, index) => {
      const storedImage = storedVariantImages[index];
      variant.variantImages = storedImage;
    });
    const data = await Product.productService.addProduct(context, productData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async removeProductHandler(parent, args: IProductRemoveByID, context: IGQLContext): Promise<IHTTPResult> {
    const { productData, marketPlaceIDs, marketPlaceVariantIDs } = validateProductRemoveRequest(args);
    const data = await Product.productService.removeProduct(context, productData, marketPlaceIDs, marketPlaceVariantIDs);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getVariantsOfProductHandler(parent, args: IProductVariantParams, context: IGQLContext): Promise<IVariantsOfProduct[]> {
    const { productData, marketProductIDs } = validateProductVariantParamsRequest<IProductVariantParams>(args);
    const { id } = productData;
    const { pageID } = context.payload;
    const data = await Product.productService.getVariantsOfProduct(pageID, id, marketProductIDs);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getShopsProductVariantsHandler(parent, args: IArgsProductFilter, context: IGQLContext): Promise<IProductList[]> {
    const { pageID, subscriptionID } = context.payload;
    const { filters } = args;
    const data = await Product.productService.getShopProductVariants(pageID, filters, subscriptionID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductByIDHandler(parent, args: IArgsProductID, context: IGQLContext): Promise<IProductByID[]> {
    const { productData } = validateProductOnlyIDRequest(args);
    const { id } = productData;
    const { pageID, subscriptionID } = context.payload;
    const data = await Product.productService.getProductByID(pageID, id, subscriptionID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateProductMainHandler(parent, args: IArgsUpdateProductMain, context: IGQLContext) {
    const { productData, id } = validateProductMainUpdateRequest(args);
    const { pageID } = context.payload;
    const data = await Product.productService.updateProductMain(pageID, id, productData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateProductTagsHandler(parent, args, context: IGQLContext) {
    const { productData, id } = args;
    const { pageID } = context.payload;
    const data = await Product.productService.updateProductTags(pageID, id, productData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateProductVariantsHandler(parent, args, context: IGQLContext) {
    const { productData, id } = args;
    const { pageID, subscriptionID } = context.payload;
    const data = await Product.productService.updateProductVariants(pageID, id, productData, subscriptionID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateProductCategoriesHandler(parent, args, context: IGQLContext) {
    const { productData, id } = args;
    const { pageID } = context.payload;
    const data = await Product.productService.updateProductCategories(pageID, id, productData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateProductMainImagesHandler(parent, args, context: IGQLContext) {
    const { productData, id, storedImages } = args;
    const {
      pageID,
      page: { uuid: pageUUID },
      subscriptionID,
    } = context.payload;
    const data = await Product.productService.updateProductMainImages(pageID, id, storedImages, productData, subscriptionID, pageUUID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateProductVariantImagesHandler(parent, args, context: IGQLContext) {
    const { productData, id, storedVariantImages } = args;
    const {
      pageID,
      page: { uuid: pageUUID },
      subscriptionID,
    } = context.payload;
    const data = await Product.productService.updateProductVariantImages(pageID, id, storedVariantImages, productData, subscriptionID, pageUUID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async removeProductTagsHandler(parent, args: IProductRemoveByID, context: IGQLContext): Promise<IHTTPResult> {
    const { productData } = validateProductRemoveRequest(args);
    const data = await Product.productTagService.removeProductTags(context, productData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async editProductTagHandler(parent, args: INameIDPair, context: IGQLContext): Promise<IHTTPResult> {
    const { id, name } = validateNameIDObjectRequest(args);
    const { pageID } = context.payload;
    const data = await Product.productTagService.editProductTag(id, name, pageID);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async addProductMultipleTagHandler(parent, args: { name: string[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { name } = validateProductNameArrayRequest(args);
    const { pageID } = context.payload;
    const data = await Product.productTagService.addProductMultipleTag(pageID, name);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductTagManagementHandler(parent, args: IArgsProductFilter, context: IGQLContext): Promise<IProductTag[]> {
    const { filters } = args;
    const { pageID } = context.payload;
    const data = await Product.productTagService.getProductTagManagement(pageID, filters);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductCategoryManagementHandler(parent, args: IArgsProductFilter, context: IGQLContext): Promise<IProductCategoryList[]> {
    const { filters } = args;
    const { pageID } = context.payload;
    const data = await Product.productCatergoryService.getProductCategoryManagement(pageID, filters);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async removeProductCategoryHandler(parent, args: IArgsCatSubCatHolder, context: IGQLContext): Promise<IHTTPResult> {
    const { productData } = validateProductCategoryHolderRequest(args);
    const { pageID } = context.payload;
    const data = await Product.productCatergoryService.removeProductCategory(pageID, productData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async removeProductAttributeHandler(parent, args: IArgsCatSubCatHolder, context: IGQLContext): Promise<IHTTPResult[]> {
    const { productData } = validateProductCategoryHolderRequest(args);
    const { pageID } = context.payload;
    const data = await Product.productAttributeService.removeProductAttribute(pageID, productData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async crudProductCategoryHandler(parent, args: IArgsCatSubCatHolder, context: IGQLContext): Promise<IHTTPResult[]> {
    const { productData } = validateProductCategoryHolderRequest(args);
    const { pageID } = context.payload;
    const data = await Product.productCatergoryService.crudProductCategory(pageID, productData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getProductAttributeManagementHandler(parent, args: IArgsProductFilter, context: IGQLContext): Promise<IProductAttributeList[]> {
    const { filters } = args;
    const { pageID } = context.payload;
    const data = await Product.productAttributeService.getProductAttributeManagement(pageID, filters);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async addProductAttributeManageHandler(parent, args: IArgsProductAttributeList, context: IGQLContext): Promise<IHTTPResult> {
    const { attributeData } = validateRequestProductAttributeList(args);
    const data = await Product.productAttributeService.addProductAttributeManage(context, attributeData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async crudProductAttributeHandler(parent, args: IArgsCatSubCatHolder, context: IGQLContext): Promise<IHTTPResult[]> {
    const { productData } = validateProductCategoryHolderRequest(args);
    const { pageID } = context.payload;
    const data = await Product.productAttributeService.crudProductAttribute(pageID, productData);
    return data;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async sendProductToChatBoxHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { audienceID, PSID, ref } = args;
    await Product.productCommService.handleProductVariantRichMenu(context.payload, PSID, ref, audienceID);
    return { status: 200, value: true };
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async addProductVariantsHandler(parent, args: IArgsAddProductVariant, context: IGQLContext): Promise<IHTTPResult> {
    const storedVariantImages = args.addVariant.variants?.map((variant) => variant.variantImages);
    const {
      pageID,
      page: { uuid: pageUUID },
      subscriptionID,
    } = context.payload;
    const { addVariant } = validateAddVariantRequest<IArgsAddProductVariant>(args);
    addVariant.variants.map((variant, index) => {
      const storedImage = storedVariantImages[index];
      variant.variantImages = storedImage;
    });
    const result = await Product.productService.addProductVariants(pageID, addVariant, subscriptionID, pageUUID);
    return result;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getAttributesByProductIDHandler(parent, args: IDObject, context: IGQLContext): Promise<IProductAttributeList[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id } = validateIDNumberObject(args);
    const result = await Product.productAttributeService.getAttributesByProductID(pageID, id);
    return result;
  }
}

const product: Product = Product.getInstance();

export const productResolver = {
  Query: {
    getProductStatus: graphQLHandler({
      handler: product.getProductStatusHandler,
      validator: validateResponseProductStatus,
    }),
    getProductTag: graphQLHandler({
      handler: product.getProductTagHandler,
      validator: validateResponseProductTag,
    }),
    getProductTagManagement: graphQLHandler({
      handler: product.getProductTagManagementHandler,
      validator: validateResponseProductTag,
    }),
    getProductTagSearch: graphQLHandler({
      handler: product.getProductTagSearchHandler,
      validator: validateResponseProductTagSearch,
    }),
    getProductList: graphQLHandler({
      handler: product.getProductListHandler,
      validator: validateResponseProductList,
    }),
    getProductAllList: graphQLHandler({
      handler: product.getProductAllListHandler,
      validator: validateDefaultRequest,
    }),
    getProductCategoryList: graphQLHandler({
      handler: product.getProductCategoryListHandler,
      validator: validateResponseProductCategoryList,
    }),
    getProductCategoryManagement: graphQLHandler({
      handler: product.getProductCategoryManagementHandler,
      validator: validateResponseProductCategoryList,
    }),
    getProductAttributeManagement: graphQLHandler({
      handler: product.getProductAttributeManagementHandler,
      validator: validateResponseProductAttributeList,
    }),
    getProductAttributeList: graphQLHandler({
      handler: product.getProductAttributeListHandler,
      validator: validateResponseProductAttributeList,
    }),
    searchProductSKU: graphQLHandler({
      handler: product.searchSKUAttributeHandler,
      validator: validateResponseHTTPObject,
    }),
    getVariantsOfProduct: graphQLHandler({
      handler: product.getVariantsOfProductHandler,
      validator: validateResponseProductListVariants,
    }),
    getShopsProductVariants: graphQLHandler({
      handler: product.getShopsProductVariantsHandler,
      validator: validateResponseshopsProductVariantList,
    }),
    getProductByID: graphQLHandler({
      handler: product.getProductByIDHandler,
      validator: validateResponseProductByID,
    }),
    searchProductCodeExists: graphQLHandler({
      handler: product.searchProductCodeExistsHandler,
      validator: validateResponseHTTPObject,
    }),
    sendProductToChatBox: graphQLHandler({
      handler: product.sendProductToChatBoxHandler,
      validator: validateResponseHTTPObject,
    }),
    getAttributesByProductID: graphQLHandler({
      handler: product.getAttributesByProductIDHandler,
      validator: validateResponseProductAttributeList,
    }),
  },
  Mutation: {
    addProductTag: graphQLHandler({
      handler: product.addProductTagHandler,
      validator: validateResponseAddTag,
    }),
    addProductCategory: graphQLHandler({
      handler: product.addProductCategoryHandler,
      validator: validateResponseHTTPObject,
    }),
    addProductAttribute: graphQLHandler({
      handler: product.addProductAttributeHandler,
      validator: validateResponseHTTPObject,
    }),
    addProductSubAttribute: graphQLHandler({
      handler: product.addProductSubAttributeHandler,
      validator: validateResponseHTTPObject,
    }),
    addProduct: graphQLHandler({
      handler: product.addProductHandler,
      validator: validateResponseHTTPArray,
    }),
    removeProduct: graphQLHandler({
      handler: product.removeProductHandler,
      validator: validateResponseHTTPObject,
    }),
    updateProductMain: graphQLHandler({
      handler: product.updateProductMainHandler,
      validator: validateResponseHTTPObject,
    }),
    updateProductTags: graphQLHandler({
      handler: product.updateProductTagsHandler,
      validator: validateResponseHTTPObject,
    }),
    updateProductCategories: graphQLHandler({
      handler: product.updateProductCategoriesHandler,
      validator: validateResponseHTTPObject,
    }),
    updateProductVariants: graphQLHandler({
      handler: product.updateProductVariantsHandler,
      validator: validateResponseHTTPObject,
    }),
    updateProductMainImages: graphQLHandler({
      handler: product.updateProductMainImagesHandler,
      validator: validateResponseHTTPObject,
    }),
    updateProductVariantImages: graphQLHandler({
      handler: product.updateProductVariantImagesHandler,
      validator: validateResponseHTTPObject,
    }),
    removeProductTags: graphQLHandler({
      handler: product.removeProductTagsHandler,
      validator: validateResponseHTTPObject,
    }),
    editProductTag: graphQLHandler({
      handler: product.editProductTagHandler,
      validator: validateResponseHTTPObject,
    }),
    addProductMultipleTag: graphQLHandler({
      handler: product.addProductMultipleTagHandler,
      validator: validateResponseHTTPObject,
    }),
    removeProductCategory: graphQLHandler({
      handler: product.removeProductCategoryHandler,
      validator: validateResponseHTTPObject,
    }),
    removeProductAttribute: graphQLHandler({
      handler: product.removeProductAttributeHandler,
      validator: validateResponseHTTPArray,
    }),
    crudProductCategory: graphQLHandler({
      handler: product.crudProductCategoryHandler,
      validator: validateResponseHTTPArray,
    }),
    addProductAttributeManage: graphQLHandler({
      handler: product.addProductAttributeManageHandler,
      validator: validateResponseHTTPObject,
    }),
    crudProductAttribute: graphQLHandler({
      handler: product.crudProductAttributeHandler,
      validator: validateResponseHTTPArray,
    }),
    addProductVariants: graphQLHandler({
      handler: product.addProductVariantsHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
