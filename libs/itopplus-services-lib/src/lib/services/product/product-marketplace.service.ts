import {
  extractAttributesForShopee,
  extractBrandForShopee,
  extractShopeeLogistics,
  extractVariantForShopee,
  extractVariationPayloadForShopee,
  getLazadaResponseVariantName,
  getShopeeCreateProductObj,
  getShopeeProductIDsForBasicInfo,
  getShopeeProductListUpdateParams,
  getShopeeTwoWeekDateSlots,
  getShopeeUpdateProductPayload,
  getShopeeVariationName,
  isAllowCaptureException,
  PostgresHelper,
  validateThirdPartyTokenExpireBackend,
} from '@reactor-room/itopplus-back-end-helpers';
import { CRUD_MODE, ICreateProductMarketPlaceResponse, IHTTPResult, INameObject, LanguageTypes } from '@reactor-room/model-lib';
import {
  DEFAULT_MORE_COMMERCE_IMAGE,
  getLazadaRequestResult,
  getProductUpdateInventoryMarketOrderParams,
  getShopeeCustomVariantID,
  LAZADA_API_SUCCESS_CODE,
  SHOPEE_PRODUCT_NO_VARIANT_ID,
} from '@reactor-room/itopplus-back-end-helpers';
import {
  ILazadaBrand,
  ILazadaBrandDataApi,
  ILazadaBrandParams,
  ILazadaCategories,
  ILazadaCategoryAttribute,
  ILazadaCategoryAttributeResponse,
  ILazadaCategorySuggestionResponse,
  ILazadaCategoryTreeData,
  ILazadaCategoryTreeItem,
  ILazadaCreateFormGroup,
  ILazadaCreateProductPayload,
  ILazadaCreateProductRequest,
  ILazadaCreateProductResponse,
  ILazadaCreateProductSKUList,
  ILazadaDataResponse,
  ILazadaEnv,
  ILazadaOrderItemsResponse,
  ILazadaOrdersReponse,
  ILazadaSkuDetails,
  ILazadaUpdateProductRequest,
  IMergedProductData,
  IMergeMarketPlaceProductParams,
  INameIDPair,
  InventoryChannel,
  IPagesThirdParty,
  IPageThirdPartyEnv,
  IProductByID,
  IProductDimension,
  IProductInventoryCronUpdateInventoryV2Payload,
  IProductLazadaMainResponse,
  IProductLazadaProductResponse,
  IProductLazadaVariantResponse,
  IProductMarketPlace,
  IProductMarketPlaceCategoryTree,
  IProductMarketPlaceList,
  IProductMarketPlaceListParams,
  IProductMarketPlaceVariant,
  IProductMarketPlaceVariantList,
  IProductUpdateInventoryQueueResponse,
  IProductVariantByID,
  IProductVariantUpdateInventoryCalcPayload,
  IShopeeAddVariationToProduct,
  IShopeeAttributes,
  IShopeeBrandApiParams,
  IShopeeBrandList,
  IShopeeBrandResponse,
  IShopeeCategories,
  IShopeeCreateProductPayload,
  IShopeeCreateProductResponse,
  IShopeeEnv,
  IShopeeGetProductListParams,
  IShopeeImageInfo,
  IShopeeLogistics,
  IShopeeProductBaseInfo,
  IShopeeProductBaseInfoNoModel,
  IShopeeProductList,
  IShopeeProductListResponse,
  IShopeeProductUpdatePayload,
  IShopeeUpdateTierVariationPayload,
  IShopeeUpdateVariantInventoryRequest,
  IShopeeUpdateVariantPriceRequest,
  IShopeeVariationCreate,
  IShopeeVariationModelListResponse,
  IShopeeVariationModelResponse,
  IUpdateProductVariantPriceMarketPlace,
  IVariantsOfProductByID,
  MarketPlaceErrorType,
  MergeMarketPlaceType,
  MergeMarketUpdatePriceInventoryResultType,
  ProductMarketPlaceUpdateTypes,
  ShopeeBrandStatusTypes,
  ShopeeMarketPlaceResultType,
  ShopeeProductStatusTypes,
  SocialTypes,
  TokenRefreshByTypes,
  UpdateMarketPlaceResultType,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { isEmpty, uniqBy } from 'lodash';
import * as os from 'os';
import { Pool } from 'pg';
import * as sharp from 'sharp';
import { getPurchaseOrderItemsToUpdateInventory, getSubscriptionByPageID, updatePurchaseOrderItemsIsQuantityCheckCountZero } from '../../data';
import {
  addProductMarketPlace,
  addProductMarketPlaceVariants,
  deleteProductFromMarketPlace,
  getLatestMarketPlaceProductByType,
  getMarketPlaceBrandSuggestions,
  getMultipleMarketPlaceVariant,
  getProductMarketPlaceByID,
  getProductMarketPlaceByIDAndType,
  getProductMarketPlaceByProductID,
  getProductMarketPlaceCategoryTreeByCategoryID,
  getProductMarketPlaceCategoryTreeByParentID,
  getProductMarketPlaceList,
  getProductMarketPlaceVariantByIDAndType,
  getProductMarketPlaceVariantByVariantIDAndType,
  getProductMarketPlaceVariantList,
  getVariantByID,
  importProductFromMarketPlace,
  updateMarketPlaceProductByProductID,
  updateMarketPlaceProductJSON,
  updateMarketPlaceProductNameByID,
  updateMarketPlaceVariantByProductVariantID,
  updateMarketPlaceVariantPriceByID,
  updateProductMarketPlacePriceInventory,
  updateProductMarketPlaceVariantQuantity,
  upsertMarketPlaceBrands,
  upsertMarketPlaceCategoryTree,
} from '../../data/product';
import { getLazadaCreateProductMainObj, getLazadaUpdateProductObj } from '../../domains';
import { combineUpdateProductObject } from '../../domains/product/product-invertory.domain';
import { PagesThirdPartyService } from '../pages/pages-third-party.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderLazadaService, PurchaseOrderShopeeService } from '../purchase-order';
import { ProductInventoryUpdateService } from './product-inventory-update.service';
import {
  createProductOnLazadaApi,
  getBrandsFromLazadaApi,
  getCategoryAttributesFromLazadaApi,
  getCategorySuggestionFromLazadaApi,
  getCategoryTreeFromLazadaApi,
  getOrderItemsFromLazadaApi,
  getProductFromLazadaApi,
  setProductActivationOnLazadaApi,
  updateInventoryOnLazadaApi,
  updateInventoryPriceOnLazadaApi,
  updateProductOnLazadaApi,
} from './product-marketplace-lazada-api.service';
import {
  addVariationOnShopeeApi,
  createProductOnShopeeApi,
  getBrandsFromShopeeApi,
  getCategoryAttributeFromShopeeApi,
  getCategoryTreeFromShopeeApi,
  getLogisticsFromShopeeApi,
  getModelListFromShopeeApi,
  getProductBaseInfoFromShopeeApi,
  getProductListFromShopeeApi,
  updateProductOnShopeeApi,
  updateTierVariationOnShopeeAPI,
  updateVariantInventoryOnShopeeAPI,
  updateVariantPriceOnShopeeAPI,
  uploadImageShopeeApi,
} from './product-marketplace-shopee-api.service';
import { ProductService } from './product.service';

export class ProductMarketPlaceService {
  public pageThirdPartyService: PagesThirdPartyService;
  public purchaseOrderLazadaService: PurchaseOrderLazadaService;
  public purchaseOrderShopeeService: PurchaseOrderShopeeService;
  public productService: ProductService;
  productInventoryUpdateService: ProductInventoryUpdateService;

  constructor() {
    this.pageThirdPartyService = new PagesThirdPartyService();
    this.purchaseOrderLazadaService = new PurchaseOrderLazadaService();
    this.purchaseOrderShopeeService = new PurchaseOrderShopeeService();
    this.productService = new ProductService();
    this.productInventoryUpdateService = new ProductInventoryUpdateService();
  }

  async updateLazadaProductInventoryV2({ pageID, inventory, subscriptionID }: IProductInventoryCronUpdateInventoryV2Payload, lazadaEnv: ILazadaEnv): Promise<boolean> {
    const marketPlaceType = SocialTypes.LAZADA;
    const accessToken = (await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [SocialTypes.LAZADA] })).accessToken;
    try {
      for (let index = 0; index < inventory.length; index++) {
        const { productID, variantID: productVariantID } = inventory[index];
        const [product] = await this.productService.getProductByID(pageID, productID, subscriptionID);
        const variant = product.variants?.find(({ variantID }) => variantID === productVariantID);
        const { variantInventory } = variant;
        const marketPlaceVariant = await getProductMarketPlaceVariantByIDAndType(PlusmarService.readerClient, pageID, [productVariantID], marketPlaceType);
        const { id: marketVariantID } = marketPlaceVariant[0];
        const { marketPlaceSKU } = await getProductMarketPlaceVariantByVariantIDAndType(pageID, productVariantID, marketPlaceType, PlusmarService.readerClient);
        await updateInventoryOnLazadaApi(accessToken, variantInventory, marketPlaceSKU, lazadaEnv);
        await updateProductMarketPlaceVariantQuantity(pageID, marketVariantID, variantInventory, PlusmarService.readerClient);
      }
      return true;
    } catch (err) {
      console.log('updateLazadaProductInventoryV2 error : ', err);
      return false;
    }
  }

  async updateSingleProductAtMarketPlaceLazada(
    pageID: number,
    product: IProductByID,
    accessToken: string,
    lazadaMarketPlaceProducts: IProductMarketPlace[],
    lazadaEnv: ILazadaEnv,
  ): Promise<IHTTPResult> {
    try {
      const { name, description, dimension, variants, weight } = product;
      const { id: productMarketPlaceID, marketPlaceID } = lazadaMarketPlaceProducts[0];
      const [skus, marketPlaceVariantIDs] = await this.getLazadaVariantsUpdateObj(pageID, productMarketPlaceID, dimension, +weight, variants);
      const images = product?.images?.map((image) => image?.mediaLink) || [];
      const lazadaUpdateObj = this.getLazadaUpdateProductObj(+marketPlaceID, name, description, images, skus);
      const updateResponse = await updateProductOnLazadaApi<ILazadaDataResponse<{ data: null }>>(accessToken, lazadaEnv, lazadaUpdateObj);
      if (updateResponse?.code === LAZADA_API_SUCCESS_CODE) {
        await this.updateProductMarketPlaceLocal(pageID, productMarketPlaceID, name, skus, marketPlaceVariantIDs);
      } else {
        throw new Error(UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_FAIL);
      }
      return { status: 200, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_SUCCESS };
    } catch (error) {
      console.log('updateSingleProductAtMarketPlaceLazada :>> ', error);
      const errMsg = error?.message.includes('NO_MARKETPLACE_VARIANT_MERGED')
        ? UpdateMarketPlaceResultType.NO_MARKETPLACE_VARIANT_MERGED
        : UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_FAIL;
      return { status: 403, value: errMsg };
    }
  }

  async updateMultipleProductAtMarketPlaceLazada(
    pageID: number,
    product: IProductByID,
    accessToken: string,
    lazadaMarketPlaceProducts: IProductMarketPlace[],
    lazadaEnv: ILazadaEnv,
  ): Promise<IHTTPResult> {
    const { name, description, dimension, variants, weight, status } = product;
    try {
      for (let index = 0; index < lazadaMarketPlaceProducts.length; index++) {
        const marketPlaceProduct = lazadaMarketPlaceProducts[index];
        const { id: productMarketPlaceID, marketPlaceID } = marketPlaceProduct;
        const [skus, marketPlaceVariantIDs] = await this.getLazadaVariantsUpdateObj(pageID, productMarketPlaceID, dimension, +weight, variants);
        const [sku] = skus;
        const productAttributes = variants.find(({ variantSKU }) => variantSKU === sku.SellerSku)?.variantAttributes || [];
        const images = product?.images?.map((image) => image?.mediaLink) || [];
        const productName = this.getProductNameWithAttribute(name, productAttributes);

        const lazadaUpdateObj = this.getLazadaUpdateProductObj(+marketPlaceID, productName, description, images, skus);
        const updateResponse = await updateProductOnLazadaApi<ILazadaDataResponse<{ data: null }>>(accessToken, lazadaEnv, lazadaUpdateObj);
        await setProductActivationOnLazadaApi<ILazadaDataResponse<{ data: null }>>(accessToken, lazadaEnv, status);

        if (updateResponse?.code === LAZADA_API_SUCCESS_CODE) {
          await this.updateProductMarketPlaceLocal(pageID, productMarketPlaceID, name, skus, marketPlaceVariantIDs);
        } else {
          console.log('error --> updateMultipleProductAtMarketPlaceLazada', JSON.stringify(updateResponse));
          if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in updateMultipleProductAtMarketPlaceLazada-' + JSON.stringify(updateResponse));
          throw new Error('Unable to update on lazada marketplace');
        }
      }
      return { status: 200, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_SUCCESS };
    } catch (error) {
      console.log('updateMultipleProductAtMarketPlaceLazada -> error :>> ', error);
      const errMsg = error?.message.includes('NO_MARKETPLACE_VARIANT_MERGED')
        ? UpdateMarketPlaceResultType.NO_MARKETPLACE_VARIANT_MERGED
        : UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_FAIL;
      return { status: 403, value: errMsg };
    }
  }

  async updateShopeeProductInventoryV2({ pageID, inventory, subscriptionID }: IProductInventoryCronUpdateInventoryV2Payload, shopeeEnv: IShopeeEnv): Promise<boolean> {
    try {
      for (let index = 0; index < inventory.length; index++) {
        const { productID, variantID } = inventory[index];
        await this.updateProductInventoryAtShopeeMarketPlace(pageID, productID, variantID, shopeeEnv, subscriptionID);
      }
      return true;
    } catch (err) {
      console.log('updateShopeeProductInventoryV2 error : ', err);
      return false;
    }
  }

  async updateProductInventoryAtShopeeMarketPlace(pageID: number, productID: number, productVariantID: number, shopeeEnv: IShopeeEnv, subscriptionID: string): Promise<void> {
    const marketPlaceType = SocialTypes.SHOPEE;
    const { accessToken, sellerID: shop_id } = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
    const [product] = await this.productService.getProductByID(pageID, productID, subscriptionID);
    const variant = product.variants?.find(({ variantID }) => variantID === productVariantID);
    const { variantInventory } = variant;
    const marketPlaceVariant = await getProductMarketPlaceVariantByIDAndType(PlusmarService.readerClient, pageID, [productVariantID], marketPlaceType);
    const { marketPlaceVariantID, id: marketVariantID } = marketPlaceVariant[0];
    const { marketPlaceID: item_id } = await getProductMarketPlaceByIDAndType(PlusmarService.readerClient, pageID, productID, marketPlaceType);
    const model_id = +marketPlaceVariantID;
    await this.updateProductInventoryAtShopee(+item_id, model_id, variantInventory, +shop_id, accessToken, shopeeEnv);
    await updateProductMarketPlaceVariantQuantity(pageID, marketVariantID, variantInventory, PlusmarService.readerClient);
  }

  async updateProductInventoryAtShopee(item_id: number, model_id: number, normal_stock: number, shop_id: number, accessToken: string, shopeeEnv: IShopeeEnv): Promise<void> {
    const variantInventoryRequest: IShopeeUpdateVariantInventoryRequest = {
      item_id,
      stock_list: [
        {
          model_id,
          normal_stock,
        },
      ],
    };
    await updateVariantInventoryOnShopeeAPI(+shop_id, variantInventoryRequest, accessToken, shopeeEnv);
  }

  async getProductMarketPlaceList(pageID: number, params: IProductMarketPlaceListParams): Promise<IProductMarketPlaceList[]> {
    const { filters, isImported } = params;
    const { search, currentPage, orderBy, orderMethod, pageSize, dropDownID, isAllRows } = filters;

    const searchCondition = search ? ` AND UPPER(pm.name) LIKE UPPER('%${search}%')` : '';

    const dropdownCondition = dropDownID ? ` AND pm.marketplace_type = '${dropDownID}'` : '';

    const searchQuery = `${searchCondition} ${dropdownCondition} `;
    const orderQuery = `${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;

    const page: number = (currentPage - 1) * pageSize;
    const result = await getProductMarketPlaceList(PlusmarService.readerClient, pageID, isImported, searchQuery, orderQuery, page, pageSize, isAllRows);
    return result;
  }

  async processGetProductFromlazada(
    productLists: IProductLazadaProductResponse[],
    accessToken: string,
    lazadaEnv: ILazadaEnv,
    offset = null,
    limit = null,
  ): Promise<ILazadaDataResponse<IProductLazadaMainResponse>> {
    const lazadaResponseData = await getProductFromLazadaApi<ILazadaDataResponse<IProductLazadaMainResponse>>(accessToken, lazadaEnv, offset, limit);
    const lazadaApiResult = getLazadaRequestResult(lazadaResponseData);
    if (lazadaApiResult.status === 200) {
      if (lazadaResponseData?.data?.products) {
        productLists.push(...lazadaResponseData.data.products);
      }
      return lazadaResponseData;
    } else {
      throw new Error(lazadaResponseData?.code ? lazadaResponseData?.code : 'Error in getting lazada products');
    }
  }

  async getProductFromShopee(pageID: number, shopeeEnv: IShopeeEnv): Promise<IHTTPResult> {
    try {
      const marketPlaceType = SocialTypes.SHOPEE;
      const shopeePage = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
      if (!isEmpty(shopeePage)) {
        const latestProduct = await getLatestMarketPlaceProductByType(PlusmarService.readerClient, pageID, marketPlaceType);
        const offset = 0;
        const page_size = 100;
        const item_status = ShopeeProductStatusTypes.NORMAL;
        const updateParams = getShopeeProductListUpdateParams(latestProduct);
        const shopeeProducts = [] as IShopeeProductList[];
        const dateSlots = getShopeeTwoWeekDateSlots(updateParams);
        for (let index = 0; index < dateSlots.length; index++) {
          const slot = dateSlots[index];
          const counter = 0;
          const shopeeGetProductParams: IShopeeGetProductListParams = { offset, item_status, page_size, ...(slot?.update_time_from ? slot : {}) };
          await this.getShopeeProducts(counter, shopeePage, shopeeGetProductParams, shopeeEnv, shopeeProducts);
        }
        await this.processShopeeProductList(pageID, shopeePage, shopeeProducts, shopeeEnv);
        return { status: 200, value: true };
      }
    } catch (error) {
      console.log('error at getProductFromShopee :>> ', error);
    }
  }

  async processShopeeProductList(pageID: number, shopeePage: IPagesThirdParty, shopeeProducts: IShopeeProductList[], shopeeEnv: IShopeeEnv): Promise<void> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      const productIDSlots = getShopeeProductIDsForBasicInfo(shopeeProducts);
      const { sellerID, accessToken } = shopeePage;
      const shopeeBaseInfoProducts = [] as IShopeeProductBaseInfo[];
      for (let index = 0; index < productIDSlots?.length; index++) {
        const idSlots = productIDSlots[index];
        const shopeeBaseProducts = await getProductBaseInfoFromShopeeApi<IShopeeProductBaseInfo[]>(+sellerID, accessToken, idSlots, shopeeEnv);
        for (let index = 0; index < shopeeBaseProducts?.length; index++) {
          const shopeeBaseProduct = shopeeBaseProducts[index];
          const { has_model } = shopeeBaseProduct;
          const modelList = has_model
            ? await getModelListFromShopeeApi<IShopeeVariationModelListResponse>(+sellerID, accessToken, shopeeBaseProduct.item_id, shopeeEnv)
            : ({} as IShopeeVariationModelListResponse);
          shopeeBaseProduct.model_list = modelList;
          shopeeBaseInfoProducts.push(shopeeBaseProduct);
        }
      }
      await this.addShopeeProduct(pageID, shopeeBaseInfoProducts, client);
      await PostgresHelper.execBatchCommitTransaction(client);
    } catch (error) {
      console.log('error => processShopeeProductList :>> ', error);
      await PostgresHelper.execBatchRollbackTransaction(client);
      throw new Error(error);
    }
  }

  async addShopeeProduct(pageID: number, products: IShopeeProductBaseInfo[], client: Pool): Promise<void> {
    const marketPlaceType = SocialTypes.SHOPEE;
    const totalProducts = products?.length || 0;
    const imported = false;
    for (let index = 0; index < products?.length; index++) {
      const product = products[index];
      const { item_name: name, item_id, model_list, has_model } = product;
      const marketPlaceID = String(item_id);
      const productJson = JSON.stringify(product);
      const productMarketPlace = await addProductMarketPlace(client, { name, pageID, marketPlaceType, productID: null, marketPlaceID, productJson, totalProducts, imported });
      if (has_model) {
        await this.addShopeeVariantProduct(pageID, productMarketPlace, model_list, marketPlaceType, client);
      } else {
        const productNoModel = product as IShopeeProductBaseInfoNoModel;
        await this.addShopeeVariantProductNoVariant(pageID, productMarketPlace, productNoModel, marketPlaceType, client);
      }
    }
  }

  async addShopeeVariantProductNoVariant(
    pageID: number,
    { id: productMarketPlaceID }: IProductMarketPlace,
    shopeeProduct: IShopeeProductBaseInfoNoModel,
    marketPlaceType: SocialTypes,
    client: Pool,
  ): Promise<void> {
    const productVariantID = null;
    const variantJson = JSON.stringify(shopeeProduct);
    const { price_info, stock_info, item_name: name, item_sku, item_id } = shopeeProduct;
    const sku = item_sku || getShopeeCustomVariantID(item_id);
    const { normal_stock: inventory } = stock_info[0];
    const { original_price: unitPrice } = price_info[0];
    const marketPlaceVariantID = SHOPEE_PRODUCT_NO_VARIANT_ID;
    await addProductMarketPlaceVariants(client, {
      pageID,
      marketPlaceType,
      productMarketPlaceID,
      productVariantID,
      inventory,
      sku,
      unitPrice,
      variantJson,
      name,
      marketPlaceVariantID,
    });
  }

  async addShopeeVariantProduct(
    pageID: number,
    { id: productMarketPlaceID }: IProductMarketPlace,
    modelList: IShopeeVariationModelListResponse,
    marketPlaceType: SocialTypes,
    client: Pool,
  ): Promise<void> {
    const { tier_variation, model } = modelList;
    const tierVariationLevel = model[0]?.tier_index?.length;
    for (let index = 0; index < model?.length; index++) {
      const name = getShopeeVariationName(tier_variation, model, tierVariationLevel, index);
      const productVariantID = null;
      const { normal_stock: inventory } = model[index].stock_info[0];
      const { original_price: unitPrice } = model[index].price_info[0];
      const { model_id } = model[index];
      const marketPlaceVariantID = String(model_id);
      const variantJson = JSON.stringify([{ tier_variation: tier_variation[index] }, { model: model[index] }]);
      await addProductMarketPlaceVariants(client, {
        pageID,
        marketPlaceType,
        productMarketPlaceID,
        productVariantID,
        inventory,
        sku: String(model_id),
        unitPrice,
        variantJson,
        name,
        marketPlaceVariantID,
      });
    }
  }

  async getShopeeProducts(
    counter: number,
    shopeePage: IPagesThirdParty,
    shopeeGetProductParams: IShopeeGetProductListParams,
    shopeeEnv: IShopeeEnv,
    shopeeProducts: IShopeeProductList[],
  ): Promise<void> {
    const offset = counter++ * shopeeGetProductParams.page_size;
    const { sellerID, accessToken } = shopeePage;
    const { has_next_page, item, total_count } = await getProductListFromShopeeApi<IShopeeProductListResponse>(
      +sellerID,
      accessToken,
      { ...shopeeGetProductParams, offset },
      shopeeEnv,
    );
    if (!total_count) return;
    shopeeProducts.push(...item);
    if (has_next_page) {
      await this.getShopeeProducts(counter, shopeePage, shopeeGetProductParams, shopeeEnv, shopeeProducts);
    }
  }

  async getProductFromLazada(pageID: number, lazadaEnv: ILazadaEnv): Promise<IHTTPResult> {
    try {
      const marketPlaceType = SocialTypes.LAZADA;
      const { accessToken } = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
      if (accessToken) {
        const productLists: IProductLazadaProductResponse[] = [];
        const offset = 0;
        const limit = 50;

        const lazadaResponseData = await this.processGetProductFromlazada(productLists, accessToken, lazadaEnv, offset, limit);
        const {
          data: { total_products },
        } = lazadaResponseData;

        for (let index = 1; index < Math.ceil(total_products / limit); index++) {
          const newOffset = (offset + limit) * index;
          await this.processGetProductFromlazada(productLists, accessToken, lazadaEnv, newOffset, limit);
        }

        await this.processLazadaProduct(pageID, { total_products, products: productLists });
        return { status: 200, value: 'true' };
      } else {
        return { status: 403, value: 'LAZADA_MARKETPLACE_NOT_CONNECTED' };
      }
    } catch (error) {
      console.log('getProductFromLazada error : ', error);
      return { status: 403, value: error.message.toString() };
    }
  }

  async processLazadaProduct(pageID: number, productData: IProductLazadaMainResponse): Promise<void> {
    try {
      const { products, total_products } = productData;
      const marketPlaceType = SocialTypes.LAZADA;
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      if (products.length) await this.addLazadaProduct(pageID, products, total_products, marketPlaceType, client);
      await PostgresHelper.execBatchCommitTransaction(client);
    } catch (error) {
      console.log('error at processLazadaProduct :>> ', error);
      throw new Error(error);
    }
  }

  async addLazadaProduct(pageID: number, products: IProductLazadaProductResponse[], totalProducts: number, marketPlaceType: SocialTypes, client: Pool): Promise<void> {
    try {
      for (let pIndex = 0; pIndex < products.length; pIndex++) {
        const productResponse = products[pIndex];
        const {
          attributes: { name },
          item_id,
          skus: variants,
        } = productResponse;
        const [marketPlaceID, productJson, productID, imported] = [String(item_id), JSON.stringify(productResponse), null, false];
        const productMarketPlace = await addProductMarketPlace(client, { name, pageID, marketPlaceType, productID, marketPlaceID, productJson, totalProducts, imported });
        if (variants.length) {
          const { id: productMarketPlaceID } = productMarketPlace;
          await this.addLazadaVariantProduct(pageID, name, variants, productMarketPlaceID, marketPlaceType, client);
        }
      }
      return;
    } catch (error) {
      console.log('error at addLazadaProduct :>> ', error);
      throw new Error(error);
    }
  }

  async addLazadaVariantProduct(
    pageID: number,
    lazadaProductName: string,
    variants: IProductLazadaVariantResponse[],
    productMarketPlaceID: number,
    marketPlaceType: SocialTypes,
    client: Pool,
  ): Promise<void> {
    try {
      for (let vIndex = 0; vIndex < variants.length; vIndex++) {
        const variant = variants[vIndex];
        const variantJson = JSON.stringify(variant);
        const { SellerSku, price: unitPrice, quantity: inventory, SkuId } = variant;
        const name = getLazadaResponseVariantName(variant, lazadaProductName);
        const sku = String(SellerSku);
        const productVariantID = null;
        const marketPlaceVariantID = SkuId ? String(SkuId) : null;
        await addProductMarketPlaceVariants(client, {
          pageID,
          marketPlaceType,
          productMarketPlaceID,
          productVariantID,
          inventory,
          sku,
          unitPrice,
          variantJson,
          name: name || '',
          marketPlaceVariantID,
        });
      }
    } catch (error) {
      console.log('error at addLazadaVariantProduct :>> ', error);
      throw new Error(error);
    }
  }

  async importDeleteProductFromMarketPlace(pageID: number, ids: number[], operation: CRUD_MODE): Promise<IHTTPResult> {
    switch (operation) {
      case CRUD_MODE.IMPORT:
        return await importProductFromMarketPlace(PlusmarService.readerClient, pageID, ids);
      case CRUD_MODE.DELETE:
        return await deleteProductFromMarketPlace(PlusmarService.readerClient, pageID, ids);
      default:
        throw new Error('NOT_A_VALID_MARKETPLACE_OPERATION_TYPE');
    }
  }

  async getProductMarketPlaceVariantList(pageID: number, id: number[], isMerged: boolean): Promise<IProductMarketPlaceVariantList[]> {
    try {
      const whereQuery = isMerged ? ' AND pmv.product_variant_id IS NOT NULL ' : ' AND pmv.product_variant_id IS NULL ';
      const result = await getProductMarketPlaceVariantList(pageID, id, whereQuery, PlusmarService.readerClient);
      return result;
    } catch (error) {
      console.log('error at getProductMarketPlaceVariantList :>> ', error);
      throw new Error(error);
    }
  }

  async mergeMarketPlaceProductOrVariant(pageID: number, params: IMergeMarketPlaceProductParams, { lazadaEnv, shopeeEnv }: IPageThirdPartyEnv): Promise<IHTTPResult[]> {
    const { mergeType } = params;
    return mergeType === MergeMarketPlaceType.PRODUCT
      ? [await updateMarketPlaceProductByProductID(pageID, params, PlusmarService.readerClient)]
      : await this.mergeMarketPlaceVariant(pageID, params, { lazadaEnv, shopeeEnv });
  }

  async mergeMarketPlaceVariant(pageID: number, params: IMergeMarketPlaceProductParams, { lazadaEnv, shopeeEnv }: IPageThirdPartyEnv): Promise<IHTTPResult[]> {
    try {
      const response = [];

      const { id: productVariantID, marketIDs } = params;
      const marketVariant = await getMultipleMarketPlaceVariant(pageID, marketIDs, PlusmarService.readerClient);
      const lazadaProducts = marketVariant?.filter((variant) => variant.marketPlaceType === SocialTypes.LAZADA);
      const shopeeProducts = marketVariant?.filter((variant) => variant.marketPlaceType === SocialTypes.SHOPEE);

      const productVariant = await getVariantByID(pageID, productVariantID, PlusmarService.readerClient);

      if (lazadaProducts?.length) {
        const result = await this.mergeLazadaVariants(pageID, lazadaProducts, productVariant, params, lazadaEnv);
        response.push(result);
      }
      if (shopeeProducts?.length) {
        const result = await this.mergeShopeeVariants(pageID, shopeeProducts, productVariant, params, shopeeEnv);
        response.push(result);
      }
      return response;
    } catch (error) {
      return [{ value: false, status: 403 }];
    }
  }

  async mergeShopeeVariants(
    pageID: number,
    shopeeMarketPlaceProducts: IProductMarketPlaceVariant[],
    productVariant: IProductVariantByID,
    params: IMergeMarketPlaceProductParams,
    shopeeEnv: IShopeeEnv,
  ): Promise<IHTTPResult> {
    const [shopeeMarketPlaceProduct] = shopeeMarketPlaceProducts;
    let mergeResult = null;
    const { inventory: marketPlaceInventory, unitPrice: marketPlacePrice } = shopeeMarketPlaceProduct;
    const { inventory: productInventory, unitPrice: productPrice } = productVariant;
    if (+marketPlaceInventory === +productInventory && +marketPlacePrice === +productPrice) {
      await updateMarketPlaceVariantByProductVariantID(pageID, params, PlusmarService.readerClient);
      mergeResult = MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS;
    } else {
      mergeResult = await this.mergeShopeeVariantUpdatePriceOrInventory(pageID, shopeeMarketPlaceProduct, productVariant, params, shopeeEnv);
    }
    return { status: 200, value: SocialTypes.SHOPEE, expiresAt: mergeResult };
  }

  async mergeShopeeVariantUpdatePriceOrInventory(
    pageID: number,
    shopeeMarketPlaceProduct: IProductMarketPlaceVariant,
    productVariant: IProductVariantByID,
    params: IMergeMarketPlaceProductParams,
    shopeeEnv: IShopeeEnv,
  ): Promise<MergeMarketUpdatePriceInventoryResultType> {
    try {
      const marketPlaceType = SocialTypes.SHOPEE;
      const { accessToken, sellerID } = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });

      const { productMarketPlaceID, id, marketPlaceVariantID } = shopeeMarketPlaceProduct;
      const model_id = +marketPlaceVariantID;
      const { marketPlaceID } = await getProductMarketPlaceByID(PlusmarService.readerClient, pageID, productMarketPlaceID);
      const { inventory, unitPrice } = productVariant;
      const variantInventoryRequest: IShopeeUpdateVariantInventoryRequest = {
        item_id: +marketPlaceID,
        stock_list: [
          {
            model_id,
            normal_stock: +inventory,
          },
        ],
      };
      await updateVariantInventoryOnShopeeAPI(+sellerID, variantInventoryRequest, accessToken, shopeeEnv);

      const variantPriceRequest: IShopeeUpdateVariantPriceRequest = {
        item_id: +marketPlaceID,
        price_list: [
          {
            model_id,
            original_price: +unitPrice,
          },
        ],
      };
      await updateVariantPriceOnShopeeAPI(+sellerID, variantPriceRequest, accessToken, shopeeEnv);
      await updateProductMarketPlacePriceInventory(pageID, id, inventory, unitPrice, PlusmarService.readerClient);
      await updateMarketPlaceVariantByProductVariantID(pageID, params, PlusmarService.readerClient);
      return MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS;
    } catch (error) {
      const updateVariantIDStatus = error?.message.includes('ERROR_UPDATING_PRODUCT_VARIANT_AT_MARKETPLACE');
      return updateVariantIDStatus
        ? MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_FAIL_VARIANT_MERGE_FAIL
        : MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_UPDATE_FAIL;
    }
  }

  async mergeLazadaVariants(
    pageID: number,
    lazadaMarketPlaceProducts: IProductMarketPlaceVariant[],
    productVariant: IProductVariantByID,
    params: IMergeMarketPlaceProductParams,
    lazadaEnv: ILazadaEnv,
  ): Promise<IHTTPResult> {
    //comments not to update whole product in future
    //const marketPlaceUpdateMsg = [] as IHTTPResult[];
    let mergeResult = null;
    try {
      if (lazadaMarketPlaceProducts?.length === 1 && !isEmpty(productVariant)) {
        const [lazadaMarketPlaceProduct] = lazadaMarketPlaceProducts;
        const { inventory: marketPlaceInventory, unitPrice: marketPlacePrice } = lazadaMarketPlaceProduct;
        const { inventory: productInventory, unitPrice: productPrice } = productVariant;
        //const [product] = await this.productService.getProductByID(pageID, productID);
        if (+marketPlaceInventory === +productInventory && +marketPlacePrice === +productPrice) {
          await updateMarketPlaceVariantByProductVariantID(pageID, params, PlusmarService.readerClient);
          mergeResult = MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS;
        } else {
          mergeResult = await this.mergeLazadaVariantUpdatePriceOrInventory(pageID, lazadaMarketPlaceProduct, productVariant, params, lazadaEnv);
        }
        //await this.onUpdateLazadaProduct(pageID, lazadaEnv, product, marketPlaceUpdateMsg, product.marketPlaceProducts);
        return { status: 200, value: SocialTypes.LAZADA, expiresAt: mergeResult };
      } else {
        throw new Error('Cannot merge multiple lazada product');
      }
    } catch (error) {
      return { value: SocialTypes.LAZADA, status: 403, expiresAt: MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_UPDATE_FAIL };
    }
  }
  async mergeLazadaVariantUpdatePriceOrInventory(
    pageID: number,
    lazadaProduct: IProductMarketPlaceVariant,
    productVariant: IProductVariantByID,
    params: IMergeMarketPlaceProductParams,
    lazadaEnv: ILazadaEnv,
  ): Promise<MergeMarketUpdatePriceInventoryResultType> {
    try {
      const { id: marketVariantID, sku: marketPlaceSKU } = lazadaProduct;
      const { inventory: productInventory, unitPrice: productPrice } = productVariant;
      const marketPlaceType = SocialTypes.LAZADA;
      const { accessToken } = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
      const lazadaUpdateInventoryResult = await updateInventoryPriceOnLazadaApi(accessToken, productInventory, productPrice, marketPlaceSKU, lazadaEnv);
      await updateProductMarketPlacePriceInventory(pageID, marketVariantID, productInventory, productPrice, PlusmarService.readerClient);
      await this.updateProductOnMarketPlaces;
      if (lazadaUpdateInventoryResult?.status === 200) {
        await updateMarketPlaceVariantByProductVariantID(pageID, params, PlusmarService.readerClient);
        return MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS;
      } else {
        return MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_FAIL_VARIANT_MERGE_FAIL;
      }
    } catch (error) {
      const updateVariantIDStatus = error?.message.includes('ERROR_UPDATING_PRODUCT_VARIANT_AT_MARKETPLACE');
      return updateVariantIDStatus
        ? MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_UPDATE_FAIL
        : MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_FAIL_VARIANT_MERGE_FAIL;
    }
  }

  async unMergeMarketPlaceProductOrVariant(pageID: number, unMergeItem: IMergedProductData[], unMergeType: MergeMarketPlaceType): Promise<IHTTPResult> {
    return unMergeType === MergeMarketPlaceType.PRODUCT
      ? await this.unMergeProduct(pageID, unMergeItem)
      : await this.unMergeVariant(
          pageID,
          unMergeItem.map(({ mergedMarketPlaceID }) => mergedMarketPlaceID),
          PlusmarService.readerClient,
        );
  }

  async unMergeVariant(pageID: number, marketIDs: number[], client: Pool): Promise<IHTTPResult> {
    try {
      await updateMarketPlaceVariantByProductVariantID(pageID, { id: null, marketIDs }, client);
      return { status: 200, value: true };
    } catch (error) {
      return { status: 403, value: false };
    }
  }

  async unMergeProduct(pageID: number, unMergeItem: IMergedProductData[]): Promise<IHTTPResult> {
    try {
      const marketIDs = unMergeItem.map(({ mergedMarketPlaceID }) => mergedMarketPlaceID);
      const isMerged = true;
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const marketPlaceVariant = await this.getProductMarketPlaceVariantList(pageID, marketIDs, isMerged);
      if (marketPlaceVariant?.length) {
        const variantIDs = marketPlaceVariant.map(({ id }) => id);
        await this.unMergeVariant(pageID, variantIDs, client);
      }
      await updateMarketPlaceProductByProductID(pageID, { id: null, marketIDs }, client);
      await PostgresHelper.execBatchCommitTransaction(client);
      return { status: 200, value: 'true' };
    } catch (error) {
      return { status: 403, value: 'false' };
    }
  }

  async updateCronMarketPlaceOrders({ lazadaEnv, shopeeEnv }: IPageThirdPartyEnv): Promise<void> {
    const clientBatch = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      const lazadaMarketType = SocialTypes.LAZADA;
      const shopeeMarketType = SocialTypes.SHOPEE;
      const marketPlaces = [lazadaMarketType, shopeeMarketType];
      const allThirdPartyMarketPlaces = await this.pageThirdPartyService.getAllPageThirdPartyByPageType(marketPlaces);
      if (allThirdPartyMarketPlaces?.length) {
        const pageMarketPlaces = await this.getPageMarketToUpdateInventory(allThirdPartyMarketPlaces, { lazadaEnv, shopeeEnv });
        const pageMarketPlaceLazada = pageMarketPlaces.filter(({ pageType }) => pageType === lazadaMarketType);
        const pageMarketPlaceShopee = allThirdPartyMarketPlaces.filter(({ pageType }) => pageType === shopeeMarketType);
        pageMarketPlaceLazada?.length && (await this.purchaseOrderLazadaService.getOrdersFromLazadaAndUpdatePurchaseOrdersCron(pageMarketPlaceLazada, lazadaEnv, clientBatch));
        pageMarketPlaceShopee?.length && (await this.purchaseOrderShopeeService.getOrdersFromShopeeAndUpdatePurchaseOrdersCron(pageMarketPlaceShopee, shopeeEnv, clientBatch));
      }
      await PostgresHelper.execBatchCommitTransaction(clientBatch);
      await this.updateInventoryFromMarketPlaceOrders();
    } catch (error) {
      await PostgresHelper.execBatchRollbackTransaction(clientBatch);
      console.log('error at updateCronMarketPlaceOrders :>> ', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in updateCronMarketPlaceOrders', error);
      throw new Error(error);
    }
  }

  async updateInventoryFromMarketPlaceOrders(): Promise<void> {
    const updateInventoryPool = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      const marketPlaceOrdersToUpdate = await getPurchaseOrderItemsToUpdateInventory(updateInventoryPool);
      const productUpdateInvOrderParams = getProductUpdateInventoryMarketOrderParams(marketPlaceOrdersToUpdate);
      const quantityChecked = true;
      for (let index = 0; index < productUpdateInvOrderParams?.length; index++) {
        const { orderItems, pageID, orderID } = productUpdateInvOrderParams[index];
        const variantInventoryPayloads: IProductVariantUpdateInventoryCalcPayload[] = orderItems.map(({ variantID, productID, operationType, stockToUpdate }) => ({
          variantID,
          productID,
          operationType,
          stockToUpdate,
          inventoryChannel: InventoryChannel.MORE_COMMERCE,
        }));
        const subscription = await getSubscriptionByPageID(PlusmarService.readerClient, pageID);
        const purchaseOrderItemsIds = orderItems.map(({ purchaseOrderItemID }) => purchaseOrderItemID);
        const variantIDs = variantInventoryPayloads.map((item) => item.variantID);
        const updateProducts = combineUpdateProductObject(
          variantInventoryPayloads,
          await this.productInventoryUpdateService.getProductMarketplaceToUpdate(pageID, variantIDs, variantInventoryPayloads),
        );
        await this.productInventoryUpdateService.updateProductInventoryV2Publisher(pageID, +orderID, updateProducts, subscription.id);
        for (let index = 0; index < purchaseOrderItemsIds.length; index++) {
          const orderItemId = purchaseOrderItemsIds[index];
          await updatePurchaseOrderItemsIsQuantityCheckCountZero(pageID, orderItemId, quantityChecked, updateInventoryPool);
        }
      }
      await PostgresHelper.execBatchCommitTransaction(updateInventoryPool);
    } catch (error) {
      console.log('error at updateInventoryFromMarketPlaceOrders :>> ', error);
      await PostgresHelper.execBatchRollbackTransaction(updateInventoryPool);
      throw new Error(error);
    }
  }

  async productInventoryUpdateSendMessage(queueResult: IProductUpdateInventoryQueueResponse[], subscriptionID: string): Promise<void> {
    for (let index = 0; index < queueResult.length; index++) {
      const { queueID, pageID } = queueResult[index];
      await this.productInventoryUpdateService.updateProductInventoryPublisher(pageID, queueID, subscriptionID);
    }
  }

  async updateCronMarketPlaceBrand({ lazadaEnv, shopeeEnv }: IPageThirdPartyEnv): Promise<void> {
    try {
      const marketPlaces = [SocialTypes.LAZADA];
      const allThirdPartyMarketPlaces = await this.pageThirdPartyService.getAllPageThirdPartyByPageType(marketPlaces);
      if (allThirdPartyMarketPlaces?.length) {
        const pageMarketPlace = await this.getPageMarketToUpdateInventory(allThirdPartyMarketPlaces, { lazadaEnv, shopeeEnv });
        const lazadaAccessToken = pageMarketPlace?.filter((pageMarketPlace) => pageMarketPlace.pageType === SocialTypes.LAZADA)[0].accessToken || null;
        if (!lazadaAccessToken) throw new Error('Not access token to update lazada brand');
        await this.getLazadaBrands(lazadaAccessToken, lazadaEnv);
      }
      console.log('end');
    } catch (error) {
      console.log('error at updateCronMarketPlaceBrand :>> ', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in updateCronMarketPlaceBrand', error);
      throw new Error(error);
    }
  }

  async updateCronMarketPlaceCategoryTree({ lazadaEnv, shopeeEnv }: IPageThirdPartyEnv): Promise<void> {
    try {
      const marketPlaces = [SocialTypes.LAZADA, SocialTypes.SHOPEE];
      const allThirdPartyMarketPlaces = await this.pageThirdPartyService.getAllPageThirdPartyByPageType(marketPlaces);
      if (allThirdPartyMarketPlaces?.length) {
        const pageMarketPlace = await this.getPageMarketToUpdateInventory(allThirdPartyMarketPlaces, { lazadaEnv, shopeeEnv });
        const shopeeShop = pageMarketPlace?.filter((pageMarketPlace) => pageMarketPlace.pageType === SocialTypes.SHOPEE)[0] || null;
        const lazadaAccessToken = pageMarketPlace?.filter((pageMarketPlace) => pageMarketPlace.pageType === SocialTypes.LAZADA)[0]?.accessToken || null;

        !isEmpty(shopeeShop) && (await this.updateShopeeCategories(shopeeShop, shopeeEnv));
        lazadaAccessToken && (await this.updateLazadaCategories(lazadaAccessToken, lazadaEnv));
      }
    } catch (error) {
      console.log('~ error in updateCronMarketPlaceCategoryTree', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in updateCronMarketPlaceCategoryTree', error);
      throw new Error(error);
    }
  }
  async updateLazadaCategories(accessToken: string, lazadaEnv: ILazadaEnv): Promise<void> {
    try {
      const lazadaCategoryTree = accessToken && (await getCategoryTreeFromLazadaApi<ILazadaCategoryTreeData>(accessToken, lazadaEnv));
      if (lazadaCategoryTree.code !== LAZADA_API_SUCCESS_CODE) throw new Error('ERROR_IN_LAZADA_GET_CATEGORY_TREE');
      await this.upsertMarketPlaceCategoryTree(lazadaCategoryTree?.data, SocialTypes.LAZADA);
    } catch (error) {
      console.log('~ error in updateLazadaCategories', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in updateLazadaCategories', error);
    }
  }

  async getOrderItemsLazada(accessToken: string, orders: ILazadaOrdersReponse[], lazadaEnv: ILazadaEnv): Promise<ILazadaOrderItemsResponse[]> {
    const orderItems = [] as ILazadaOrderItemsResponse[];
    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      const { order_number } = order;
      const orderItemsData = await getOrderItemsFromLazadaApi<ILazadaDataResponse<ILazadaOrderItemsResponse>>(accessToken, lazadaEnv, order_number);
      orderItemsData?.data && orderItems.push(orderItemsData?.data);
    }
    return orderItems;
  }

  async getPageMarketToUpdateInventory(allThirdPartyMarketPlaces: IPagesThirdParty[], marketPlaceEnv: IPageThirdPartyEnv): Promise<IPagesThirdParty[]> {
    const pagesMarketNoRefresh = [] as IPagesThirdParty[];
    const pagesMarketRefreshToken = [] as IPagesThirdParty[];

    for (let index = 0; index < allThirdPartyMarketPlaces.length; index++) {
      const marketPlace = allThirdPartyMarketPlaces[index];
      const refreshTokenType = validateThirdPartyTokenExpireBackend(marketPlace);
      if (refreshTokenType === TokenRefreshByTypes.NO_REFRESH) pagesMarketNoRefresh.push(marketPlace);
      if (refreshTokenType === TokenRefreshByTypes.REFRESH_TOKEN) {
        const refreshedMarketPlace = await this.refreshPageThirdPartyToken(marketPlace, marketPlaceEnv);
        refreshedMarketPlace.status === 200 && pagesMarketRefreshToken.push(marketPlace);
      }
    }
    return [...(pagesMarketNoRefresh || []), ...(pagesMarketRefreshToken || [])];
  }

  async refreshPageThirdPartyToken(marketPlace: IPagesThirdParty, marketPlaceEnv: IPageThirdPartyEnv): Promise<IHTTPResult> {
    const { pageID, pageType } = marketPlace;
    return await this.pageThirdPartyService.refreshPageThirdPartyToken(pageID, marketPlaceEnv, { pageType, tokenType: TokenRefreshByTypes.REFRESH_TOKEN });
  }

  async getLazadaBrands(accessToken: string, lazadaEnv: ILazadaEnv): Promise<void> {
    const startRow = 0;
    const pageSize = 200;
    const recursiveCallLength = 1;
    const counter = 1;
    await this.getLazadaBrandsRecursive(accessToken, lazadaEnv, { startRow, pageSize }, recursiveCallLength, counter);
  }

  async getLazadaBrandsRecursive(
    accessToken: string,
    lazadaEnv: ILazadaEnv,
    { startRow, pageSize }: ILazadaBrandParams,
    recursiveCallLength: number,
    counter: number,
  ): Promise<void> {
    const bulkInsertArray = [] as string[];
    const response = await getBrandsFromLazadaApi<ILazadaDataResponse<ILazadaBrandDataApi>>(accessToken, { startRow: startRow, pageSize }, lazadaEnv);
    if (counter <= recursiveCallLength && response.code === LAZADA_API_SUCCESS_CODE) {
      if (startRow === 0) {
        const { total_record, module } = response.data;
        const brandInsertValues = this.getBrandInsertValues(module, SocialTypes.LAZADA);
        bulkInsertArray.push(brandInsertValues);
        recursiveCallLength = Math.round(total_record / pageSize) + 1;
        await upsertMarketPlaceBrands(bulkInsertArray.join(', '), PlusmarService.readerClient);
      } else {
        response?.data?.module?.length && bulkInsertArray.push(this.getBrandInsertValues(response.data.module, SocialTypes.LAZADA));
        await upsertMarketPlaceBrands(bulkInsertArray.join(', '), PlusmarService.readerClient);
      }
      startRow = pageSize * counter + 1;
      counter = counter + 1;
      await this.getLazadaBrandsRecursive(accessToken, lazadaEnv, { startRow, pageSize }, recursiveCallLength, counter);
    }
  }

  getBrandInsertValues(brands: ILazadaBrand[], marketPlaceType: SocialTypes): string {
    return brands
      .map((brand) => {
        delete brand?.name_en;
        const { name, global_identifier, brand_id } = brand;
        brand = { marketPlaceType, name: name ? name : null, global_identifier: global_identifier ? global_identifier : null, brand_id: brand_id };
        return `(${Object.values(brand)
          .map((brandValue) => `'${String(brandValue).replace(/'/g, "''")}'`)
          .join(', ')})`;
      })
      .join(', ');
  }

  async upsertMarketPlaceCategoryTree(categoryTree: ILazadaCategoryTreeItem[], socialType: SocialTypes): Promise<void> {
    const categoryParentID = -1;
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    const marketPlaceType = socialType;
    await this.recursiveUpsertCategoryTree(categoryTree, marketPlaceType, categoryParentID, client);
    await PostgresHelper.execBatchCommitTransaction(client);
  }

  async recursiveUpsertCategoryTree(categoryTree: ILazadaCategoryTreeItem[], marketPlaceType: SocialTypes, parentID: number, client: Pool): Promise<void> {
    categoryTree = categoryTree.map((category) => ({ ...category, parent_id: parentID }));
    for (let index = 0; index < categoryTree.length; index++) {
      const category = categoryTree[index];
      const { category_id: categoryID, leaf, name, var: varType, parent_id: parentID, children } = category;
      const language = LanguageTypes.ENGLISH;
      await upsertMarketPlaceCategoryTree({ marketPlaceType, categoryID, leaf, name, parentID, varType, language }, client);
      if (children?.length) {
        await this.recursiveUpsertCategoryTree(children, marketPlaceType, categoryID, client);
      }
    }
  }

  async getLazadaSuggestedCategories(pageID: number, keywords: string[], lazadaEnv: ILazadaEnv): Promise<ILazadaCategories[]> {
    try {
      const pageType = SocialTypes.LAZADA;
      const accessToken = await this.getAccessTokenByPageType({ pageID, pageType });
      if (!accessToken) return [];
      const categorySuggestions = [] as ILazadaCategories[];
      for (let index = 0; index < keywords.length; index++) {
        const keyword = keywords[index];
        const categoriesData = await getCategorySuggestionFromLazadaApi<ILazadaCategorySuggestionResponse>(accessToken, lazadaEnv, keyword);

        if (categoriesData?.code === LAZADA_API_SUCCESS_CODE && categoriesData?.data?.categorySuggestions?.length) {
          categorySuggestions.push(...categoriesData.data.categorySuggestions);
        }
      }
      return uniqBy(categorySuggestions, 'categoryId');
    } catch (error) {
      console.log('~ error in getLazadaSuggestedCategories', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in getLazadaSuggestedCategories', error);
      return [];
    }
  }

  async getAccessTokenByPageType({ pageID, pageType }: { pageID: number; pageType: SocialTypes }): Promise<string> {
    const pageThirdParty = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [pageType] });
    if (isEmpty(pageThirdParty)) return null;
    return pageThirdParty.accessToken;
  }

  async getLazadaCategoryAttribute(pageID: number, categoryID: number, marketPlaceType: SocialTypes, lang: string, lazadaEnv: ILazadaEnv): Promise<ILazadaCategoryAttribute[]> {
    try {
      const accessToken = await this.getAccessTokenByPageType({ pageID, pageType: marketPlaceType });
      const categoryAttributeResponse = await getCategoryAttributesFromLazadaApi<ILazadaCategoryAttributeResponse>(accessToken, lazadaEnv, categoryID);
      if (categoryAttributeResponse.code !== LAZADA_API_SUCCESS_CODE) throw new Error('ERROR_LAZADA_CATEGORY_ATTRIBUTE_API');
      const quantityAttrib = categoryAttributeResponse.data.find(({ name }) => name === 'quantity');
      if (quantityAttrib) quantityAttrib['is_mandatory'] = 1;
      return categoryAttributeResponse.data;
    } catch (error) {
      console.log('Error getting category attribute from Lazada :>> ', error);
      throw new Error(error);
    }
  }

  async publishProductOnLazada(
    pageID: number,
    { productID, categoryID: PrimaryCategory, isCreateMultipleProduct, payload }: ILazadaCreateProductPayload,
    lazadaEnv: ILazadaEnv,
    subscriptionID: string,
  ): Promise<IHTTPResult[]> {
    try {
      const [product] = await this.productService.getProductByID(pageID, productID, subscriptionID);
      const payloadJSON = JSON.parse(payload) as ILazadaCreateFormGroup;
      const lazadaCreateObj = getLazadaCreateProductMainObj();
      lazadaCreateObj.Request.Product.PrimaryCategory = PrimaryCategory;
      const pageType = SocialTypes.LAZADA;
      const accessToken = await this.getAccessTokenByPageType({ pageID, pageType });
      if (isCreateMultipleProduct) {
        return await this.createMultipleProductOnLazada(pageID, accessToken, product, lazadaCreateObj, payloadJSON, lazadaEnv);
      } else {
        return await this.createSingleProductOnLazada(pageID, accessToken, product, lazadaCreateObj, payloadJSON, lazadaEnv);
      }
    } catch (error) {
      console.log('error :>> ', error);
      const result = [] as IHTTPResult[];
      this.handleCreateMarketPlaceLazadaError(error.message, result, { key: null, value: null });
      return result;
    }
  }

  setBasicDetailForLazadaCreate<T, V>(name: string, description: string, normalAttributeRequired: any, lazadaCreateObj: ILazadaCreateProductRequest<T, V>, images: string[]): void {
    normalAttributeRequired.name = name;
    normalAttributeRequired.description = description;
    lazadaCreateObj.Request.Product.Attributes = normalAttributeRequired;
    lazadaCreateObj.Request.Product.Images = { Image: [] };
    lazadaCreateObj.Request.Product.Images.Image = images;
  }

  async createSingleProductOnLazada<T, V>(
    pageID: number,
    accessToken: string,
    product: IProductByID,
    lazadaCreateObj: ILazadaCreateProductRequest<T, V>,
    payloadJSON: ILazadaCreateFormGroup,
    lazadaEnv: ILazadaEnv,
  ): Promise<IHTTPResult[]> {
    const result = [] as IHTTPResult[];
    const { code, name, description } = product;
    let marketResponse = {} as ICreateProductMarketPlaceResponse;
    marketResponse = { key: code, value: name };
    try {
      const { skuAttributeRequired, skuPackageAttributeRequired, normalAttributeRequired } = payloadJSON;
      const productImages = product?.images?.map((image) => image.mediaLink) || [];
      this.setBasicDetailForLazadaCreate(name, description, normalAttributeRequired, lazadaCreateObj, productImages);
      lazadaCreateObj.Request.Product.Skus.Sku = [];
      for (let index = 0; index < skuAttributeRequired.length; index++) {
        const skuAttribute = { ...skuAttributeRequired[index], ...skuPackageAttributeRequired };
        const saleAttribute = skuAttribute?.saleAttribute || [];
        const skuPayload = Object.assign(skuAttribute, ...saleAttribute);
        delete skuPayload?.saleAttribute;
        lazadaCreateObj.Request.Product.Skus.Sku.push(skuPayload);
      }
      const response = await createProductOnLazadaApi<ILazadaDataResponse<ILazadaCreateProductResponse>>(accessToken, lazadaEnv, lazadaCreateObj);
      if (response.code === LAZADA_API_SUCCESS_CODE) {
        const mergeResult = await this.addMergeLazadaProductOnMarketPlace(pageID, product, response.data);
        mergeResult.status === 200 ? result.push({ status: 200, value: JSON.stringify(marketResponse) }) : result.push({ status: 403, value: JSON.stringify(marketResponse) });
      } else {
        this.handleCreateProductMarketLazadaPlaceApiError(response, result, marketResponse);
      }
      return result;
    } catch (error) {
      this.handleCreateMarketPlaceLazadaError(error?.message, result, marketResponse);
      console.log('error :>> ', error);
      return result;
    }
  }

  async createMultipleProductOnLazada<T, V>(
    pageID: number,
    accessToken: string,
    product: IProductByID,
    lazadaCreateObj: ILazadaCreateProductRequest<T, V>,
    payloadJSON: ILazadaCreateFormGroup,
    lazadaEnv: ILazadaEnv,
  ): Promise<IHTTPResult[]> {
    const result = [] as IHTTPResult[];
    let marketResponse = {} as ICreateProductMarketPlaceResponse;
    let lazadaProductName = null;
    try {
      const { normalAttributeRequired, skuAttributeRequired, skuPackageAttributeRequired } = payloadJSON;
      const { variants, name, description } = product;
      const productName = name;
      for (let index = 0; index < skuAttributeRequired.length; index++) {
        marketResponse = {} as ICreateProductMarketPlaceResponse;
        const skuAttribute = skuAttributeRequired[index];
        const skuAttributeSeller = skuAttribute.SellerSku;
        const variant = variants.find(({ variantSKU }) => variantSKU === skuAttributeSeller);
        const variantAttribute = variant?.variantAttributes;
        lazadaProductName = this.getProductNameWithAttribute(productName, variantAttribute) || 'Product';
        marketResponse = { key: skuAttributeSeller, value: lazadaProductName };
        const variantImages = variant?.variantImages?.map((image) => image.mediaLink);
        this.setBasicDetailForLazadaCreate(lazadaProductName, description, normalAttributeRequired, lazadaCreateObj, variantImages);
        const skuPayload = { ...skuAttribute, ...skuPackageAttributeRequired };
        lazadaCreateObj.Request.Product.Skus.Sku = [];
        lazadaCreateObj.Request.Product.Skus.Sku.push(skuPayload);
        const response = await createProductOnLazadaApi<ILazadaDataResponse<ILazadaCreateProductResponse>>(accessToken, lazadaEnv, lazadaCreateObj);
        if (response.code === LAZADA_API_SUCCESS_CODE) {
          const mergeResult = await this.addMergeLazadaProductOnMarketPlace(pageID, product, response.data);
          mergeResult.status === 200
            ? result.push({ status: 200, value: JSON.stringify(marketResponse) })
            : this.handleCreateMarketPlaceLazadaError(mergeResult?.value, result, marketResponse);
        } else {
          console.log('error at createMultipleProductOnLazada api :>> ', response?.data);
          this.handleCreateProductMarketLazadaPlaceApiError(response, result, marketResponse);
        }
      }
      return result;
    } catch (error) {
      console.log('createMultipleProductOnLazada -> creating multiple lazada product :>> ', error);
      this.handleCreateMarketPlaceLazadaError(error?.message, result, marketResponse);
      return result;
    }
  }

  handleCreateProductMarketLazadaPlaceApiError(
    marketResponseApi: ILazadaDataResponse<ILazadaCreateProductResponse>,
    returnResult: IHTTPResult[],
    marketCreateResponse: ICreateProductMarketPlaceResponse,
  ): void {
    returnResult.push({
      status: 403,
      value: JSON.stringify({
        ...marketCreateResponse,
        errorCode: marketResponseApi.code === '500' ? MarketPlaceErrorType.ERROR_500 : marketResponseApi.code,
        errorJSON: JSON.stringify(marketResponseApi),
      }),
    });
  }

  handleCreateMarketPlaceLazadaError(errMessage: string, returnResult: IHTTPResult[], marketResponse: ICreateProductMarketPlaceResponse): void {
    const errorCode =
      errMessage === MarketPlaceErrorType.MARKET_PRODUCT_CREATED_ERROR_MERGING
        ? MarketPlaceErrorType.MARKET_PRODUCT_CREATED_ERROR_MERGING
        : MarketPlaceErrorType.ERROR_CREATE_PRODUCT_RECHECK_MARKET;
    returnResult.push({ status: 403, value: JSON.stringify({ ...marketResponse, errorCode }) });
  }

  async addMergeLazadaProductOnMarketPlace(pageID: number, moreProduct: IProductByID, lazadaProduct: ILazadaCreateProductResponse): Promise<IHTTPResult> {
    try {
      const { id: productID, name, variants } = moreProduct;
      const { item_id, sku_list } = lazadaProduct;
      const [marketPlaceType, totalProducts, productJson, imported] = [SocialTypes.LAZADA, lazadaProduct.sku_list.length || 0, JSON.stringify(lazadaProduct), true];
      const marketProduct = await addProductMarketPlace(PlusmarService.readerClient, {
        name,
        productID,
        pageID,
        marketPlaceID: item_id.toString(),
        marketPlaceType,
        productJson,
        totalProducts,
        imported,
      });

      const { id } = marketProduct;

      await this.addMergeLazadaProductVariantOnMarketPlace(pageID, id, sku_list, variants);

      return { status: 200, value: 'true' };
    } catch (error) {
      console.log('Error merging product to lazada after create :>> ', error);
      return { status: 403, value: MarketPlaceErrorType.MARKET_PRODUCT_CREATED_ERROR_MERGING };
    }
  }

  async addMergeLazadaProductVariantOnMarketPlace(
    pageID: number,
    productMarketPlaceID: number,
    sku_list: ILazadaCreateProductSKUList[],
    variants: IVariantsOfProductByID[],
  ): Promise<void> {
    for (let index = 0; index < sku_list.length; index++) {
      const lazadaSKUDetails = sku_list[index];
      const { seller_sku, sku_id } = lazadaSKUDetails;
      const marketPlaceVariantID = String(sku_id);
      const variant = variants.find(({ variantSKU }) => variantSKU === seller_sku);
      const { variantID: productVariantID, variantInventory: inventory, variantUnitPrice: unitPrice } = variant;
      await addProductMarketPlaceVariants(PlusmarService.readerClient, {
        productMarketPlaceID,
        sku: seller_sku,
        name: '',
        pageID,
        inventory,
        unitPrice,
        productVariantID,
        marketPlaceType: SocialTypes.LAZADA,
        variantJson: JSON.stringify(lazadaSKUDetails),
        marketPlaceVariantID,
      });
    }
  }

  async getProductMarketPlaceCategoryTree(
    marketPlaceType: SocialTypes,
    parentOrCategoryID: number,
    isCategory: boolean,
    language: LanguageTypes,
  ): Promise<IProductMarketPlaceCategoryTree[]> {
    const data = isCategory
      ? await getProductMarketPlaceCategoryTreeByCategoryID(PlusmarService.readerClient, marketPlaceType, parentOrCategoryID, language)
      : await getProductMarketPlaceCategoryTreeByParentID(PlusmarService.readerClient, marketPlaceType, parentOrCategoryID, language);
    return data;
  }

  getProductNameWithAttribute(productName: string, variantAttribute: INameIDPair[]): string {
    let attributeName = '';
    for (let index = 0; index < variantAttribute?.length; index++) {
      const attribute = variantAttribute[index].name;
      attributeName += `-${attribute}`;
    }
    return `${productName}${attributeName}`;
  }

  getMarketPlaceBrandSuggestions(keyword: string, socialType: SocialTypes, isSuggestion: boolean): Promise<INameObject[]> {
    const whereCondition = isSuggestion ? "lower(name) LIKE lower('%' || $2 || '%')" : 'name = $2';
    return getMarketPlaceBrandSuggestions(keyword, socialType, whereCondition, PlusmarService.readerClient);
  }

  async updateShopeeCategories(shopeeShop: IPagesThirdParty, shopeeEnv: IShopeeEnv): Promise<void> {
    try {
      const { shopeeLanguages } = shopeeEnv;
      const { sellerID, accessToken } = shopeeShop;
      const marketPlaceType = SocialTypes.SHOPEE;
      for (let index = 0; index < shopeeLanguages.length; index++) {
        const language = shopeeLanguages[index];
        const shopeeCategories = await getCategoryTreeFromShopeeApi<IShopeeCategories[]>(+sellerID, accessToken, language, shopeeEnv);
        const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
        for (let index = 0; index < shopeeCategories.length; index++) {
          const shopeeCategory = shopeeCategories[index];
          const { category_id, display_category_name: name, has_children, parent_category_id } = shopeeCategory;
          const categoryID = category_id === 0 ? -1 : category_id;
          const parentID = parent_category_id === 0 ? -1 : parent_category_id;
          const varType = false;
          await upsertMarketPlaceCategoryTree({ marketPlaceType, categoryID, leaf: !has_children, name, parentID, varType, language }, client);
        }
        await PostgresHelper.execBatchCommitTransaction(client);
      }
    } catch (error) {
      console.log('~ error in updateShopeeCategories', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in updateShopeeCategories', error);
    }
  }

  async addMergeShopeeProductVariantOnMarketPlace(
    pageID: number,
    productMarketPlaceID: number,
    variations: IShopeeVariationCreate,
    variants: IVariantsOfProductByID[],
    client: Pool,
  ): Promise<void> {
    const variationModel = variations.model as IShopeeVariationModelResponse[];
    for (let index = 0; index < variationModel.length; index++) {
      const shopeeVariation = variationModel[index] as IShopeeVariationModelResponse;
      const { model_sku, model_id } = shopeeVariation;
      const marketPlaceVariantID = String(model_id);
      const variant = variants.find(({ variantSKU }) => variantSKU === model_sku);
      const { variantID: productVariantID, variantInventory: inventory, variantUnitPrice: unitPrice } = variant;
      await addProductMarketPlaceVariants(client, {
        productMarketPlaceID,
        sku: model_sku,
        name: '',
        pageID,
        inventory,
        unitPrice,
        productVariantID,
        marketPlaceType: SocialTypes.SHOPEE,
        variantJson: JSON.stringify(shopeeVariation),
        marketPlaceVariantID,
      });
    }
  }

  async addMergeShopeeProductOnMarketPlace(
    pageID: number,
    moreProduct: IProductByID,
    shopeeProduct: IShopeeCreateProductResponse,
    variations: IShopeeVariationCreate,
  ): Promise<IHTTPResult> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      const { id: productID, name, variants } = moreProduct;
      const { item_id } = shopeeProduct;
      const [marketPlaceType, totalProducts, productJson, imported] = [SocialTypes.SHOPEE, variations?.model?.length || 0, JSON.stringify(shopeeProduct), true];
      const marketProduct = await addProductMarketPlace(client, {
        name,
        productID,
        pageID,
        marketPlaceID: item_id.toString(),
        marketPlaceType,
        productJson,
        totalProducts,
        imported,
      });
      const { id } = marketProduct;
      if (!isEmpty(variations)) {
        await this.addMergeShopeeProductVariantOnMarketPlace(pageID, id, variations, variants, client);
      }
      await PostgresHelper.execBatchCommitTransaction(client);
      return { status: 200, value: ShopeeMarketPlaceResultType.SHOPEE_MERGE_SUCCESS };
    } catch (error) {
      await PostgresHelper.execBatchRollbackTransaction(client);
      console.log('Error merging product to shopee after create :>> ', error);
      return { status: 403, value: ShopeeMarketPlaceResultType.SHOPEE_MERGE_ERROR };
    }
  }

  async publishProductOnShopee(pageID: number, payloadParams: IShopeeCreateProductPayload, shopeeEnv: IShopeeEnv, subscriptionID: string): Promise<IHTTPResult[]> {
    const result = [] as IHTTPResult[];
    try {
      const marketPlaceType = SocialTypes.SHOPEE;
      const { categoryID, logistics, productID, variantIDs, attributes, brand } = payloadParams;
      const logistic = JSON.parse(logistics) as IShopeeLogistics[];
      const shopeePage = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
      const { sellerID, accessToken } = shopeePage;

      const [product] = await this.productService.getProductByID(pageID, productID, subscriptionID);
      const { variants, name, images } = product;
      const variantImages = variants.map(({ variantImages }) => variantImages[0]?.mediaLink || DEFAULT_MORE_COMMERCE_IMAGE);
      const imageLinks = images?.map(({ mediaLink }) => mediaLink);
      const attributeList = await getCategoryAttributeFromShopeeApi<IShopeeAttributes[]>(+sellerID, accessToken, categoryID, LanguageTypes.ENGLISH, shopeeEnv);
      const [logisticObj, variantObj, attributesObj, brandObj] = [
        extractShopeeLogistics(logistic),
        extractVariantForShopee(variants, variantIDs, name),
        extractAttributesForShopee(attributes, attributeList),
        extractBrandForShopee(attributes, brand),
      ];
      const shopeeImageData = await this.uploadImagesToShopee(pageID, shopeePage, imageLinks, shopeeEnv);
      const variantImageData = await this.uploadImagesToShopee(pageID, shopeePage, variantImages, shopeeEnv);
      const shopeeCreateObj = getShopeeCreateProductObj(categoryID, product, logisticObj, variantObj, attributesObj, shopeeImageData, brandObj);
      const isNotUpdate = false;
      const shopeeProduct = await createProductOnShopeeApi<IShopeeCreateProductResponse>(+sellerID, shopeeCreateObj, isNotUpdate, accessToken, shopeeEnv);

      const variationPayload = extractVariationPayloadForShopee(shopeeProduct.item_id, variants, variantIDs, variantImageData);
      const variation = await addVariationOnShopeeApi(+sellerID, accessToken, variationPayload, shopeeEnv);
      const mergeResponse = await this.addMergeShopeeProductOnMarketPlace(pageID, product, shopeeProduct, variation);
      result.push({ status: 200, value: ShopeeMarketPlaceResultType.SHOPEE_MARKETPLACE_SUCCESS });
      result.push(mergeResponse);
      return result;
    } catch (error) {
      const errMsg = `${ShopeeMarketPlaceResultType.SHOPEE_MARKETPLACE_ERROR} Shopee Error => ${error.message}`;
      console.log('publishProductOnShopee -> error', error);
      return [{ status: 403, value: errMsg }];
    }
  }

  async uploadImagesToShopee(pageID: number, shopeePage: IPagesThirdParty, images: string[], shopeeEnv: IShopeeEnv): Promise<string[]> {
    const osPath = os.tmpdir();
    const imageKeyValue = [] as string[];
    for (let index = 0; index < images?.length; index++) {
      const url = images[index];
      if (url) {
        const fileName = `${Math.random().toString(36).substring(2, 8)}.png`;
        const tmpPath = `${osPath}/${fileName}`;
        const inputBuffer = (await axios({ url, responseType: 'arraybuffer' })).data;
        await sharp(inputBuffer)
          .resize({
            fit: sharp.fit.contain,
            width: 1024,
            height: 1024,
          })
          .png({ quality: 50 })
          .toFile(tmpPath);
        const fileStream = await fs.createReadStream(tmpPath);
        const formData = new FormData();
        formData.append('image', fileStream, { contentType: 'multipart/form-data' });
        const imageInfo = await uploadImageShopeeApi<IShopeeImageInfo>(+shopeePage?.sellerID, shopeePage.accessToken, shopeeEnv, formData);
        const { image_id } = imageInfo;
        imageKeyValue.push(image_id);
      } else {
        imageKeyValue.push(null);
      }
    }
    return imageKeyValue;
  }

  async publishVariantToShopeeProduct(pageID: number, productID: number, variantIDs: number[], shopeeEnv: IShopeeEnv, subscriptionID: string): Promise<IHTTPResult[]> {
    try {
      const marketPlaceType = SocialTypes.SHOPEE;
      const shopeePage = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
      const { sellerID } = shopeePage;
      const [product] = await this.productService.getProductByID(pageID, productID, subscriptionID);
      const { variants, name } = product;
      const marketPlaceProducts = await getProductMarketPlaceByProductID(PlusmarService.readerClient, pageID, productID);
      const shopeeProduct = marketPlaceProducts?.find(({ marketPlaceType }) => marketPlaceType === SocialTypes.SHOPEE) || undefined;
      if (!isEmpty(shopeeProduct)) {
        const { id: marketPlaceProductID, marketPlaceID } = shopeeProduct;
        const variations = extractVariantForShopee(variants, variantIDs, name);
        const addVariationToShopeeObj: IShopeeAddVariationToProduct = {
          item_id: +marketPlaceID,
          variations,
        };
        // const shopeeVariation = await addVariationOnShopeeApi(+sellerID, addVariationToShopeeObj, shopeeEnv);
        //await this.addMergeShopeeProductVariantOnMarketPlace(pageID, marketPlaceProductID, shopeeVariation, variants);
        return [{ status: 200, value: ShopeeMarketPlaceResultType.SHOPEE_ADD_VARIANT_SUCCESS }];
      } else {
        throw new Error('NO_SHOPEE_PRODUCT_FOUND');
      }
    } catch (error) {
      console.log('error at publishVariantToShopeeProduct', error);
      return [{ status: 403, value: ShopeeMarketPlaceResultType.SHOPEE_ADD_VARIANT_ERROR }];
    }
  }

  async getShopeeLogistics(pageID: number, shopeeEnv: IShopeeEnv): Promise<{ text: string }> {
    try {
      const marketPlaceType = SocialTypes.SHOPEE;
      const shopeePage = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
      const { sellerID: shop_id, accessToken } = shopeePage;
      const shopeeLogistics = await getLogisticsFromShopeeApi<IShopeeLogistics[]>(+shop_id, accessToken, shopeeEnv);
      return { text: JSON.stringify(shopeeLogistics) };
    } catch (error) {
      console.log('Error getting logistic from shopee :>> ', error);
      throw new Error(error);
    }
  }

  async getShopeeCategoryAttribute(pageID: number, category_id: number, marketPlaceType: SocialTypes, language: string, shopeeEnv: IShopeeEnv): Promise<IShopeeAttributes[]> {
    try {
      const shopeePage = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
      const { sellerID: shop_id, accessToken } = shopeePage;
      const shopeeAttributes = await getCategoryAttributeFromShopeeApi<IShopeeAttributes[]>(+shop_id, accessToken, category_id, language, shopeeEnv);
      return shopeeAttributes;
    } catch (error) {
      console.log('Error getting attribute from shopee :>> ', error);
      throw new Error(error);
    }
  }

  async getShopeeBrands(pageID: number, category_id: number, shopeeEnv: IShopeeEnv): Promise<IShopeeBrandResponse> {
    const marketPlaceType = SocialTypes.SHOPEE;
    const shopeePage = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
    const { sellerID, accessToken } = shopeePage;
    const shop_id = +sellerID;
    const page_size = 100;
    const offset = 1;
    const brandList = [];
    const status = ShopeeBrandStatusTypes.NORMAL;
    const params: IShopeeBrandApiParams = {
      page_size,
      offset,
      category_id,
      status,
    };
    const isMandatory = await this.getShopeeBrandsRecursive(+shop_id, accessToken, params, shopeeEnv, brandList);
    return {
      brandList,
      isMandatory,
    };
  }

  async getShopeeBrandsRecursive(shop_id: number, accessToken: string, brandParams: IShopeeBrandApiParams, shopeeEnv: IShopeeEnv, brandList: IShopeeBrandList[]): Promise<boolean> {
    const shopeeBrands = await getBrandsFromShopeeApi(+shop_id, accessToken, brandParams, shopeeEnv);
    brandList.push(...shopeeBrands.brand_list);
    if (shopeeBrands.has_next_page) {
      brandParams.offset = shopeeBrands.next_offset;
      await this.getShopeeBrandsRecursive(shop_id, accessToken, brandParams, shopeeEnv, brandList);
    }
    const isMandatory = shopeeBrands.is_mandatory;
    return isMandatory;
  }

  async updateProductOnMarketPlaces(
    pageID: number,
    productID: number,
    marketPlaceUpdateTypes: ProductMarketPlaceUpdateTypes[],
    { lazadaEnv, shopeeEnv }: IPageThirdPartyEnv,
    subscriptionID: string,
  ): Promise<IHTTPResult[]> {
    try {
      const [product] = await this.productService.getProductByID(pageID, productID, subscriptionID);
      const { marketPlaceProducts } = product;

      const marketPlaceTypes = marketPlaceProducts?.map(({ marketPlaceType }) => marketPlaceType);
      const marketPlaceUpdateMsg = [] as IHTTPResult[];
      // LAZADA MARKETPLACE
      if (marketPlaceTypes.includes(SocialTypes.LAZADA)) {
        console.log('UPDATE ON ', SocialTypes.LAZADA);
        await this.onUpdateLazadaProduct(pageID, lazadaEnv, product, marketPlaceUpdateMsg, marketPlaceProducts);
      }
      // SHOPEE MARKETPLACE
      if (marketPlaceTypes.includes(SocialTypes.SHOPEE)) {
        console.log('UPDATE ON ', SocialTypes.SHOPEE);
        await this.onUpdateShopeeProduct(pageID, marketPlaceUpdateTypes, product, shopeeEnv, marketPlaceUpdateMsg);
      }
      return marketPlaceUpdateMsg;
    } catch (error) {
      console.log('updateProductOnMarketPlaces --> error :>> ', error);
      return [{ status: 403, value: UpdateMarketPlaceResultType.MARKETPLACE_UPDATE_FAIL }];
    }
  }

  async onUpdateShopeeProduct(
    pageID: number,
    marketPlaceUpdateTypes: ProductMarketPlaceUpdateTypes[],
    product: IProductByID,
    shopeeEnv: IShopeeEnv,
    marketPlaceUpdateMsg: IHTTPResult[],
  ): Promise<void> {
    const marketPlaceType = SocialTypes.SHOPEE;
    const shopeePage = await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [marketPlaceType] });
    const isMainProductUpdate = marketPlaceUpdateTypes.includes(ProductMarketPlaceUpdateTypes.PRODUCT_MAIN);
    const isVariantUpdate = marketPlaceUpdateTypes.includes(ProductMarketPlaceUpdateTypes.VARIANT);
    const isMainImageUpdate = marketPlaceUpdateTypes.includes(ProductMarketPlaceUpdateTypes.PRODUCT_IMAGES);
    const isVariantImageUpdate = marketPlaceUpdateTypes.includes(ProductMarketPlaceUpdateTypes.VARIANT_IMAGES);
    if (isMainProductUpdate) {
      const shopeeUpdateResponse = await this.updateProductAtShopeeMarketPlace(pageID, shopeePage, marketPlaceType, product, shopeeEnv);
      marketPlaceUpdateMsg.push(shopeeUpdateResponse);
    }
    const productMarketPlaceIDs = product.variants.map(({ variantID }) => variantID);
    const marketPlaceVariants = await getProductMarketPlaceVariantByIDAndType(PlusmarService.readerClient, pageID, productMarketPlaceIDs, SocialTypes.SHOPEE);

    if (isVariantUpdate) {
      if (marketPlaceVariants?.length) {
        const shopeeUpdateResponse = await this.updateProductMarketPlacePriceShopee(pageID, shopeePage, marketPlaceType, product.id, product.variants, shopeeEnv);
        marketPlaceUpdateMsg.push(shopeeUpdateResponse);
      } else {
        marketPlaceUpdateMsg.push({ status: 403, value: UpdateMarketPlaceResultType.NO_MARKETPLACE_VARIANT_MERGED });
      }
    }
    if (isMainImageUpdate) {
      const shopeeUpdateResponse = await this.updateProductMarketPlaceImageShopee(pageID, shopeePage, marketPlaceType, product, shopeeEnv);
      marketPlaceUpdateMsg.push(shopeeUpdateResponse);
    }

    if (isVariantImageUpdate) {
      if (marketPlaceVariants?.length) {
        const shopeeUpdateResponse = await this.updateProductMarketPlaceVariantImageShopee(pageID, shopeePage, marketPlaceType, product, shopeeEnv);
        marketPlaceUpdateMsg.push(shopeeUpdateResponse);
      } else {
        marketPlaceUpdateMsg.push({ status: 403, value: UpdateMarketPlaceResultType.NO_MARKETPLACE_VARIANT_MERGED });
      }
    }
  }

  async updateProductMarketPlaceVariantImageShopee(
    pageID: number,
    shopeePage: IPagesThirdParty,
    marketPlaceType: SocialTypes,
    product: IProductByID,
    shopeeEnv: IShopeeEnv,
  ): Promise<IHTTPResult> {
    try {
      const { sellerID, accessToken } = shopeePage;
      const { marketPlaceID } = await getProductMarketPlaceByIDAndType(PlusmarService.readerClient, pageID, product.id, marketPlaceType);
      const item_id = +marketPlaceID;
      const { variants } = product;
      const variantIDs = variants.map(({ variantID }) => variantID);
      const variantImages = variants.map(({ variantImages }) => variantImages[0]?.mediaLink || null);
      const variantImageData = await this.uploadImagesToShopee(pageID, shopeePage, variantImages, shopeeEnv);
      const { tier_variation } = extractVariationPayloadForShopee(item_id, variants, variantIDs, variantImageData);
      const updatePayload: IShopeeUpdateTierVariationPayload = {
        item_id,
        tier_variation,
      };
      await updateTierVariationOnShopeeAPI(+sellerID, updatePayload, accessToken, shopeeEnv);
      return { status: 200, value: 'Variant Images updated at shopee' };
    } catch (error) {
      console.log('updateProductMarketPlaceVariantImageShopee -> error :>> ', error);
      return { status: 403, value: `Fail to update variant images at shopee. Shopee error => ${error.message}` };
    }
  }

  async updateProductMarketPlaceImageShopee(
    pageID: number,
    shopeePage: IPagesThirdParty,
    marketPlaceType: SocialTypes,
    product: IProductByID,
    shopeeEnv: IShopeeEnv,
  ): Promise<IHTTPResult> {
    try {
      const { images, id: productID } = product;
      const imageLinks = images.map(({ mediaLink }) => mediaLink);
      const { sellerID, accessToken } = shopeePage;
      const { marketPlaceID } = await getProductMarketPlaceByIDAndType(PlusmarService.readerClient, pageID, productID, marketPlaceType);
      const image_id_list = await this.uploadImagesToShopee(pageID, shopeePage, imageLinks, shopeeEnv);
      const imageUploadPayload: IShopeeProductUpdatePayload = {
        item_id: +marketPlaceID,
        image: {
          image_id_list,
        },
      };
      await updateProductOnShopeeApi(+sellerID, imageUploadPayload, accessToken, shopeeEnv);
      return { status: 200, value: 'Images updated at shopee marketplace' };
    } catch (error) {
      console.log('updateProductMarketPlaceImageShopee :>> ', error);
      return { status: 403, value: 'Error updating images at shopee marketplace' };
    }
  }

  async updateProductMarketPlacePriceShopee(
    pageID: number,
    shopeePage: IPagesThirdParty,
    shopeeMarketPlaceType: SocialTypes,
    productID: number,
    variantData: IVariantsOfProductByID[],
    shopeeEnv: IShopeeEnv,
  ): Promise<IHTTPResult> {
    try {
      const shopeeVariant = variantData
        .map((variant) => ({
          variantID: variant.variantID,
          variantPrice: variant.variantUnitPrice,
          ...variant?.variantMarketPlaceMerged?.find((merged) => merged.marketPlaceVariantType === SocialTypes.SHOPEE),
        }))
        .filter((variant) => variant?.marketPlaceVariantType === SocialTypes.SHOPEE) as unknown as IUpdateProductVariantPriceMarketPlace[];
      if (shopeeVariant?.length) {
        await this.updateProductPriceAtShopee(pageID, shopeePage, shopeeMarketPlaceType, productID, shopeeVariant, shopeeEnv);
        return { status: 200, value: 'Shopee Variant price updated successfully' };
      }
    } catch (error) {
      console.log('error  :>> updateProductMarketPlacePriceShopee :>> ', error);
      return { status: 403, value: 'Error updating variant price at shopee' };
    }
  }

  async updateProductPriceAtShopee(
    pageID: number,
    shopeePage: IPagesThirdParty,
    shopeeMarketPlaceType: SocialTypes,
    productID: number,
    shopeeVariant: IUpdateProductVariantPriceMarketPlace[],
    shopeeEnv: IShopeeEnv,
  ): Promise<void> {
    const variantIDs = shopeeVariant.map(({ variantID }) => variantID);
    const { sellerID: shop_id, accessToken } = shopeePage;
    const variantMarketPlaces = await getProductMarketPlaceVariantByIDAndType(PlusmarService.readerClient, pageID, variantIDs, shopeeMarketPlaceType);

    const { marketPlaceID } = await getProductMarketPlaceByIDAndType(PlusmarService.readerClient, pageID, productID, shopeeMarketPlaceType);
    const modelIDs = variantMarketPlaces.map((variantMarket) => {
      const { marketPlaceVariantID } = variantMarket;
      const model_id = +marketPlaceVariantID;
      return model_id;
    });
    const variantPriceRequest: IShopeeUpdateVariantPriceRequest = {
      item_id: +marketPlaceID,
      price_list: shopeeVariant.map((variant, index) => ({
        model_id: modelIDs[index],
        original_price: variant.variantPrice,
      })),
    };
    await updateVariantPriceOnShopeeAPI(+shop_id, variantPriceRequest, accessToken, shopeeEnv);
    await this.updateMarketPlacePriceTable(pageID, shopeeVariant);
  }

  async updateMarketPlacePriceTable(pageID: number, shopeeVariant: IUpdateProductVariantPriceMarketPlace[]): Promise<void> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    for (let index = 0; index < shopeeVariant.length; index++) {
      const { variantPrice, marketPlaceVariantID } = shopeeVariant[index];
      const status = true;
      await updateMarketPlaceVariantPriceByID(pageID, marketPlaceVariantID, variantPrice, status, client);
    }
    await PostgresHelper.execBatchCommitTransaction(client);
  }

  async updateProductAtShopeeMarketPlace(
    pageID: number,
    shopeePage: IPagesThirdParty,
    shopeeMarketPlaceType: SocialTypes,
    product: IProductByID,
    shopeeEnv: IShopeeEnv,
  ): Promise<IHTTPResult> {
    try {
      const { sellerID: shopID, accessToken } = shopeePage;
      const { marketPlaceProducts } = product;
      const shopeeMarketPlaceProduct = marketPlaceProducts.find(({ marketPlaceType }) => marketPlaceType === shopeeMarketPlaceType);
      const { marketPlaceID, id } = shopeeMarketPlaceProduct;
      const [shopeeProduct] = await getProductBaseInfoFromShopeeApi<IShopeeProductBaseInfo[]>(+shopID, accessToken, [+marketPlaceID], shopeeEnv);
      const updatePayload = getShopeeUpdateProductPayload(product, shopeeProduct);
      const response = await updateProductOnShopeeApi(+shopID, updatePayload, accessToken, shopeeEnv);
      await updateMarketPlaceProductJSON(pageID, id, JSON.stringify(response), PlusmarService.readerClient);
      return { status: 200, value: UpdateMarketPlaceResultType.SHOPEE_MARKETPLACE_UPDATE_SUCCESS };
    } catch (error) {
      console.log('updateProductAtShopeeMarketPlace :>> ', error);
      const value = error.message;
      return { status: 403, value };
    }
  }

  async onUpdateLazadaProduct(
    pageID: number,
    lazadaEnv: ILazadaEnv,
    product: IProductByID,
    marketPlaceUpdateMsg: IHTTPResult[],
    marketPlaceProducts: IProductMarketPlace[],
  ): Promise<void> {
    const lazadaMarketPlaceProducts = marketPlaceProducts.filter(({ marketPlaceType }) => marketPlaceType === SocialTypes.LAZADA);

    const isMultipleProductLinked = lazadaMarketPlaceProducts?.length > 1 ? true : false;
    const accessToken = (await this.pageThirdPartyService.getPageThirdPartyByPageType({ pageID, pageType: [SocialTypes.LAZADA] })).accessToken;

    const lazadaUpdateResponse = !isMultipleProductLinked
      ? await this.updateSingleProductAtMarketPlaceLazada(pageID, product, accessToken, lazadaMarketPlaceProducts, lazadaEnv)
      : await this.updateMultipleProductAtMarketPlaceLazada(pageID, product, accessToken, lazadaMarketPlaceProducts, lazadaEnv);
    marketPlaceUpdateMsg.push(lazadaUpdateResponse);
  }

  // test('update product at marketplace-> updateProductOnMarketPlaces execute single', async () => {
  //   const successResponse = { status: 200, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_SUCCESS };
  //   mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue([productSingle]));
  //   mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(thirdPartyMarketPlaceLazada[0]));
  //   mock(productMarketPlaceService, 'updateSingleProductAtMarketPlaceLazada', jest.fn().mockResolvedValue(successResponse));
  //   const result = await productMarketPlaceService.updateProductOnMarketPlaces(pageID, productSingle.id, { lazadaEnv, shopeeEnv });

  //   expect(result).toEqual([successResponse]);
  //   expect(productMarketPlaceService.productService.getProductByID).toBeCalledWith(pageID, productSingle.id);
  //   expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [SocialTypes.LAZADA] });
  //   expect(productMarketPlaceService.updateSingleProductAtMarketPlaceLazada).toBeCalledWith(
  //     pageID,
  //     productSingle,
  //     thirdPartyMarketPlaceLazada[0].accessToken,
  //     productSingle.marketPlaceProducts,
  //     lazadaEnv,
  //   );
  // });

  // test('update product at marketplace-> updateProductOnMarketPlaces execute multiple', async () => {
  //   const successResponse = { status: 200, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_SUCCESS };
  //   mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue([productMultiple]));
  //   mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(thirdPartyMarketPlaceLazada[0]));
  //   mock(productMarketPlaceService, 'updateMultipleProductAtMarketPlaceLazada', jest.fn().mockResolvedValue(successResponse));
  //   const result = await productMarketPlaceService.updateProductOnMarketPlaces(pageID, productMultiple.id, { lazadaEnv, shopeeEnv });

  //   expect(result).toEqual([successResponse]);
  //   expect(productMarketPlaceService.productService.getProductByID).toBeCalledWith(pageID, productMultiple.id);
  //   expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [SocialTypes.LAZADA] });
  //   expect(productMarketPlaceService.updateMultipleProductAtMarketPlaceLazada).toBeCalledWith(
  //     pageID,
  //     productMultiple,
  //     thirdPartyMarketPlaceLazada[0].accessToken,
  //     productMultiple.marketPlaceProducts,
  //     lazadaEnv,
  //   );
  // });

  // test('update product at marketplace-> updateProductOnMarketPlaces error', async () => {
  //   const errorResponse = { status: 403, value: UpdateMarketPlaceResultType.MARKETPLACE_UPDATE_FAIL };

  //   mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue(undefined));
  //   const result = await productMarketPlaceService.updateProductOnMarketPlaces(pageID, productSingle.id, { lazadaEnv, shopeeEnv });
  //   expect(result).toEqual([errorResponse]);
  //   expect(productMarketPlaceService.productService.getProductByID).toBeCalledWith(pageID, productSingle.id);
  // });

  async updateProductMarketPlaceLocal(pageID: number, productMarketPlaceID: number, name: string, skus: ILazadaSkuDetails[], marketPlaceVariantIDs: number[]): Promise<void> {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await updateMarketPlaceProductNameByID(pageID, productMarketPlaceID, name, client);
      for (let index = 0; index < marketPlaceVariantIDs.length; index++) {
        const marketPlaceVariantID = marketPlaceVariantIDs[index];
        const { price, Status } = skus[index];
        await updateMarketPlaceVariantPriceByID(pageID, marketPlaceVariantID, price, Status === 'active', client);
      }
      await PostgresHelper.execBatchCommitTransaction(client);
    } catch (error) {
      console.log('error --> updateProductMarketPlaceLocal', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in updateProductMarketPlaceLocal', error);
      throw new Error(error);
    }
  }

  getLazadaUpdateProductObj(marketPlaceID: number, name: string, description: string, images: string[], skus: ILazadaSkuDetails[]): ILazadaUpdateProductRequest<ILazadaSkuDetails> {
    const lazadaUpdateObj = getLazadaUpdateProductObj<ILazadaSkuDetails>();
    const { Product } = lazadaUpdateObj.Request;
    Product.ItemId = +marketPlaceID;
    Product.Images.Image = images;
    Product.Attributes.name = name;
    Product.Attributes.description = description;
    Product.Skus.Sku = skus;
    return lazadaUpdateObj;
  }

  async getLazadaVariantsUpdateObj(
    pageID: number,
    id: number,
    dimension: IProductDimension,
    package_weight: number,
    variants: IVariantsOfProductByID[],
  ): Promise<[ILazadaSkuDetails[], number[]]> {
    const isMergedVariants = true;
    const { height: package_height, length: package_length, width: package_width } = dimension;
    const marketPlaceVariants = await this.getProductMarketPlaceVariantList(pageID, [id], isMergedVariants);
    const skus = [] as ILazadaSkuDetails[];
    const marketPlaceVariantIDs = [] as number[];
    if (marketPlaceVariants?.length) {
      for (let index = 0; index < marketPlaceVariants.length; index++) {
        const marketVariant = marketPlaceVariants[index];
        const { sku: SellerSku, variantJson, productVariantID } = marketVariant;
        const { SkuId } = JSON.parse(variantJson);
        const productVariant = variants.find(({ variantID }) => variantID === +productVariantID);
        const { variantUnitPrice: price, variantImages, variantStatus } = productVariant;
        const lazadaSku: ILazadaSkuDetails = {
          SkuId,
          SellerSku,
          Status: variantStatus === 1 ? 'active' : 'inactive',
          price,
          package_height,
          package_width,
          package_length,
          package_weight,
          Images: { Image: variantImages.map((image) => image?.mediaLink) || [] },
        };
        skus.push(lazadaSku);
        marketPlaceVariantIDs.push(marketVariant.id);
      }
      return [skus, marketPlaceVariantIDs];
    } else {
      throw new Error('NO_MARKETPLACE_VARIANT_MERGED');
    }
  }
}
