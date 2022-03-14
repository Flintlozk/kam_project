import { IHTTPResult, IIDOperation, INameObject } from '@reactor-room/model-lib';
import {
  EnumAuthScope,
  IGQLContext,
  IIDInterface,
  IIDisMerged,
  ILazadaCategories,
  ILazadaCategoryAttribute,
  ILazadaCreateProductPayload,
  ILazadaEnv,
  IMarketPlaceBrandSuggestion,
  IMarketPlaceCategoryAttribute,
  IMergedProductData,
  IMergeMarketPlaceProductParams,
  IPayload,
  IProductMarketPlaceCategoryTree,
  IProductMarketPlaceCategoryTreeParams,
  IProductMarketPlaceList,
  IProductMarketPlaceListParams,
  IProductMarketPlaceVariantList,
  IShopeeAttributes,
  IShopeeBrandResponse,
  IShopeeCreateProductPayload,
  IShopeeCreateVariantParams,
  IShopeeEnv,
  MergeMarketPlaceType,
  ProductMarketPlaceUpdateTypes,
} from '@reactor-room/itopplus-model-lib';
import { ProductMarketPlaceService, requireScope } from '@reactor-room/itopplus-services-lib';
import { environment } from '../../environments/environment';
import {
  validateCreateProductOnLazadaParamsRequest,
  validateKeywordsRequest,
  validateLazadaCategoryAttributeRequest,
  validateMarketPlaceBrandSuggestionsRequest,
  validateMarketPlaceCategoryTreeParamsRequest,
  validateMarketShopeeCreateProductRequest,
  validateMarketShopeeCreateVariantRequest,
  validateMergeMarketPlaceToProductRequest,
  validateProductLazadaCategoryAttributeResponse,
  validateProductLazadaCategoryListResponse,
  validateProductMarketPlaceCategoryTreeResponse,
  validateProductMarketPlaceIDMergeRequest,
  validateProductMarketPlaceListRequest,
  validateProductMarketPlaceListResponse,
  validateProductMarketPlaceUpdateRequest,
  validateProductMarketPlaceVariantListResponse,
  validateProductShopeeCategoryAttributeResponse,
  validateResponseHTTPArray,
  validateResponseHTTPObject,
  validateUnMergeMarketPlaceRequest,
} from '../../schema';
import { validateIdNumberArrayOperationObject, validateIDNumberObject, validateNameFieldArray, validateRequestPageID, validateTextStringObject } from '../../schema/common';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.CMS])
class ProductMarketPlace {
  public static instance;
  public static productMarketPlaceService: ProductMarketPlaceService;

  public static getInstance() {
    if (!ProductMarketPlace.instance) ProductMarketPlace.instance = new ProductMarketPlace();
    return ProductMarketPlace.instance;
  }

  constructor() {
    ProductMarketPlace.productMarketPlaceService = new ProductMarketPlaceService();
  }

  async getProductsFromLazadaHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const lazadaEnv: ILazadaEnv = environment.lazada;
    const result = await ProductMarketPlace.productMarketPlaceService.getProductFromLazada(pageID, lazadaEnv);
    return result;
  }

  async getProductsFromShopeeHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const shopeeEnv: IShopeeEnv = environment.shopee;
    const result = await ProductMarketPlace.productMarketPlaceService.getProductFromShopee(pageID, shopeeEnv);
    return result;
  }

  async getProductMarketPlaceListHandler(parents, args: IProductMarketPlaceListParams, context: IGQLContext): Promise<IProductMarketPlaceList[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { filters, isImported } = validateProductMarketPlaceListRequest<IProductMarketPlaceListParams>(args);
    const result = await ProductMarketPlace.productMarketPlaceService.getProductMarketPlaceList(pageID, { isImported, filters });
    return result;
  }

  async importDeleteProductFromMarketPlaceHandler(parents, args: IIDOperation, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { ids, operation } = validateIdNumberArrayOperationObject<IIDOperation>(args);
    const result = await ProductMarketPlace.productMarketPlaceService.importDeleteProductFromMarketPlace(pageID, ids, operation);
    return result;
  }

  async getProductMarketPlaceVariantListHandler(parents, args: IIDisMerged, context: IGQLContext): Promise<IProductMarketPlaceVariantList[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const params = validateProductMarketPlaceIDMergeRequest<IIDisMerged>(args);
    const { id, isMerged } = params;
    const result = await ProductMarketPlace.productMarketPlaceService.getProductMarketPlaceVariantList(pageID, [id], isMerged);
    return result;
  }

  async mergeMarketPlaceProductOrVariantHandler(parents, args: IMergeMarketPlaceProductParams, context: IGQLContext): Promise<IHTTPResult[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const params = validateMergeMarketPlaceToProductRequest<IMergeMarketPlaceProductParams>(args);
    const { lazada: lazadaEnv, shopee: shopeeEnv } = environment;
    const result = await ProductMarketPlace.productMarketPlaceService.mergeMarketPlaceProductOrVariant(pageID, params, { lazadaEnv, shopeeEnv });
    return result;
  }

  async unMergeMarketPlaceProductOrVariantHandler(parents, args, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { unMergeItem, unMergeType } = validateUnMergeMarketPlaceRequest<{ unMergeItem: IMergedProductData[]; unMergeType: MergeMarketPlaceType }>(args);

    return await ProductMarketPlace.productMarketPlaceService.unMergeMarketPlaceProductOrVariant(pageID, unMergeItem, unMergeType);
  }

  async getLazadaSuggestedCategoriesHandler(parents, args: { keywords: string[] }, context: IGQLContext): Promise<ILazadaCategories[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { keywords } = validateKeywordsRequest(args);
    const lazadaEnv: ILazadaEnv = environment.lazada;
    const result = await ProductMarketPlace.productMarketPlaceService.getLazadaSuggestedCategories(pageID, keywords, lazadaEnv);
    return result;
  }

  async getLazadaCategoryAttributesHandler(parents, args: IMarketPlaceCategoryAttribute, context: IGQLContext): Promise<ILazadaCategoryAttribute[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id, marketPlaceType, lang } = validateLazadaCategoryAttributeRequest<IMarketPlaceCategoryAttribute>(args);
    const lazadaEnv: ILazadaEnv = environment.lazada;
    const result = await ProductMarketPlace.productMarketPlaceService.getLazadaCategoryAttribute(pageID, id, marketPlaceType, lang, lazadaEnv);
    return result;
  }

  async getShopeeCategoryAttributesHandler(parents, args: IMarketPlaceCategoryAttribute, context: IGQLContext): Promise<IShopeeAttributes[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id, marketPlaceType, lang } = validateLazadaCategoryAttributeRequest<IMarketPlaceCategoryAttribute>(args);
    const shopeeEnv: IShopeeEnv = environment.shopee;
    const result = await ProductMarketPlace.productMarketPlaceService.getShopeeCategoryAttribute(pageID, id, marketPlaceType, lang, shopeeEnv);
    return result;
  }

  async publishProductOnLazadaHandler(parents, args: { payloadParams: ILazadaCreateProductPayload }, context: IGQLContext): Promise<IHTTPResult[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { payloadParams } = validateCreateProductOnLazadaParamsRequest(args);
    const lazadaEnv: ILazadaEnv = environment.lazada;
    return await ProductMarketPlace.productMarketPlaceService.publishProductOnLazada(pageID, payloadParams, lazadaEnv, context.payload.subscriptionID);
  }

  async getMarketPlaceBrandSuggestionsHandler(parents, args: IMarketPlaceBrandSuggestion, context: IGQLContext): Promise<INameObject[]> {
    const { keyword, socialType, isSuggestion } = validateMarketPlaceBrandSuggestionsRequest<IMarketPlaceBrandSuggestion>(args);
    const result = await ProductMarketPlace.productMarketPlaceService.getMarketPlaceBrandSuggestions(keyword, socialType, isSuggestion);
    return result;
  }

  async getProductMarketPlaceCategoryTreeHandler(parents, args: IProductMarketPlaceCategoryTreeParams, context: IGQLContext): Promise<IProductMarketPlaceCategoryTree[]> {
    const { parentOrCategoryID, marketPlaceType, isCategory, language } = validateMarketPlaceCategoryTreeParamsRequest<IProductMarketPlaceCategoryTreeParams>(args);
    const result = await ProductMarketPlace.productMarketPlaceService.getProductMarketPlaceCategoryTree(marketPlaceType, parentOrCategoryID, isCategory, language);
    return result;
  }

  async getShopeeLogisticsHandler(parent, args, context: IGQLContext): Promise<{ text: string }> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const shopeeEnv: IShopeeEnv = environment.shopee;
    const result = await ProductMarketPlace.productMarketPlaceService.getShopeeLogistics(pageID, shopeeEnv);
    return result;
  }

  async getShopeeBrandsHandler(parent, args: IIDInterface, context: IGQLContext): Promise<IShopeeBrandResponse> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { id } = validateIDNumberObject(args);
    const shopeeEnv: IShopeeEnv = environment.shopee;
    const result = await ProductMarketPlace.productMarketPlaceService.getShopeeBrands(pageID, id, shopeeEnv);
    return result;
  }

  async publishProductOnShopeeHandler(parents, args: { payloadParams: IShopeeCreateProductPayload }, context: IGQLContext): Promise<IHTTPResult[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { payloadParams } = validateMarketShopeeCreateProductRequest<{ payloadParams: IShopeeCreateProductPayload }>(args);
    const shopeeEnv: IShopeeEnv = environment.shopee;
    return await ProductMarketPlace.productMarketPlaceService.publishProductOnShopee(pageID, payloadParams, shopeeEnv, context.payload.subscriptionID);
  }

  async publishVariantToShopeeProductHandler(parents, args: IShopeeCreateVariantParams, context: IGQLContext): Promise<IHTTPResult[]> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { productID, variantIDs } = validateMarketShopeeCreateVariantRequest<IShopeeCreateVariantParams>(args);
    const shopeeEnv: IShopeeEnv = environment.shopee;
    return await ProductMarketPlace.productMarketPlaceService.publishVariantToShopeeProduct(pageID, productID, variantIDs, shopeeEnv, context.payload.subscriptionID);
  }
  async updateProductOnMarketPlacesHandler(parent, args: { id: number; marketPlaceUpdateTypes: ProductMarketPlaceUpdateTypes[] }, context: IGQLContext): Promise<IHTTPResult[]> {
    const { id, marketPlaceUpdateTypes } = validateProductMarketPlaceUpdateRequest<{ id: number; marketPlaceUpdateTypes: ProductMarketPlaceUpdateTypes[] }>(args);
    const { lazada: lazadaEnv, shopee: shopeeEnv } = environment;
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await ProductMarketPlace.productMarketPlaceService.updateProductOnMarketPlaces(
      pageID,
      id,
      marketPlaceUpdateTypes,
      { lazadaEnv, shopeeEnv },
      context.payload.subscriptionID,
    );
  }
}

const productMarketPlace: ProductMarketPlace = ProductMarketPlace.getInstance();

export const productMarketPlaceResolver = {
  Query: {
    getProductsFromLazada: graphQLHandler({
      handler: productMarketPlace.getProductsFromLazadaHandler,
      validator: validateResponseHTTPObject,
    }),
    getProductsFromShopee: graphQLHandler({
      handler: productMarketPlace.getProductsFromShopeeHandler,
      validator: validateResponseHTTPObject,
    }),
    getProductMarketPlaceList: graphQLHandler({
      handler: productMarketPlace.getProductMarketPlaceListHandler,
      validator: validateProductMarketPlaceListResponse,
    }),
    getProductMarketPlaceVariantList: graphQLHandler({
      handler: productMarketPlace.getProductMarketPlaceVariantListHandler,
      validator: validateProductMarketPlaceVariantListResponse,
    }),
    getLazadaSuggestedCategories: graphQLHandler({
      handler: productMarketPlace.getLazadaSuggestedCategoriesHandler,
      validator: validateProductLazadaCategoryListResponse,
    }),
    getMarketPlaceBrandSuggestions: graphQLHandler({
      handler: productMarketPlace.getMarketPlaceBrandSuggestionsHandler,
      validator: validateNameFieldArray,
    }),
    getLazadaCategoryAttribute: graphQLHandler({
      handler: productMarketPlace.getLazadaCategoryAttributesHandler,
      validator: validateProductLazadaCategoryAttributeResponse,
    }),
    getShopeeCategoryAttribute: graphQLHandler({
      handler: productMarketPlace.getShopeeCategoryAttributesHandler,
      validator: validateProductShopeeCategoryAttributeResponse,
    }),
    getProductMarketPlaceCategoryTree: graphQLHandler({
      handler: productMarketPlace.getProductMarketPlaceCategoryTreeHandler,
      validator: validateProductMarketPlaceCategoryTreeResponse,
    }),
    getShopeeLogistics: graphQLHandler({
      handler: productMarketPlace.getShopeeLogisticsHandler,
      validator: validateTextStringObject,
    }),
    getShopeeBrands: graphQLHandler({
      handler: productMarketPlace.getShopeeBrandsHandler,
      validator: (x) => x, //validateMarketPlaceShopeeBrandResponse,
    }),
  },
  Mutation: {
    importDeleteProductFromMarketPlace: graphQLHandler({
      handler: productMarketPlace.importDeleteProductFromMarketPlaceHandler,
      validator: validateResponseHTTPObject,
    }),
    mergeMarketPlaceProductOrVariant: graphQLHandler({
      handler: productMarketPlace.mergeMarketPlaceProductOrVariantHandler,
      validator: validateResponseHTTPArray,
    }),
    unMergeMarketPlaceProductOrVariant: graphQLHandler({
      handler: productMarketPlace.unMergeMarketPlaceProductOrVariantHandler,
      validator: validateResponseHTTPObject,
    }),
    publishProductOnLazada: graphQLHandler({
      handler: productMarketPlace.publishProductOnLazadaHandler,
      validator: validateResponseHTTPArray,
    }),
    publishProductOnShopee: graphQLHandler({
      handler: productMarketPlace.publishProductOnShopeeHandler,
      validator: validateResponseHTTPArray,
    }),
    publishVariantToShopeeProduct: graphQLHandler({
      handler: productMarketPlace.publishVariantToShopeeProductHandler,
      validator: validateResponseHTTPArray,
    }),
    updateProductOnMarketPlaces: graphQLHandler({
      handler: productMarketPlace.updateProductOnMarketPlacesHandler,
      validator: validateResponseHTTPArray,
    }),
  },
};
