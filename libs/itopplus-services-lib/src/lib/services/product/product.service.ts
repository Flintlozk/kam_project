import { environmentLib } from '@reactor-room/environment-services-backend';
import {
  isAllowCaptureException,
  isEmpty,
  PostgresHelper,
  tranformProductVariantData,
  transformImageUrlArray,
  transformImageURlFormat,
  transformMediaLinkString,
} from '@reactor-room/itopplus-back-end-helpers';
import {
  ICatSubCatHolder,
  IEditProductCategory,
  IEditProductImages,
  IEditProductTag,
  IEditProductVariant,
  IEditProductVariantImageData,
  IEditProductVariantImages,
  IGQLContext,
  INameIDPair,
  INameValuePair,
  IncreaseDecreaseType,
  IProduct,
  IProductAddVariants,
  IProductAllList,
  IProductByID,
  IProductList,
  IProductVariant,
  IProductVariantByID,
  IProductVariantIDInventory,
  IProductVariantImageChange,
  IProductVariantImages,
  IProductVariantPipeline,
  IProductVariantUpdateInventoryCalcPayload,
  ISubscriptionLimitAndDetails,
  IVariantsOfProduct,
  PRODUCT_TRANSLATE_MSG,
} from '@reactor-room/itopplus-model-lib';
import { CRUD_MODE, EnumFileFolder, IDObject, IGQLFileSteam, IHTTPResult, IMoreImageUrlResponse, ITableFilter } from '@reactor-room/model-lib';
import * as Sentry from '@sentry/node';
import _ from 'lodash';
import { Pool } from 'pg';
import { SubscriptionService } from '..';
import { getOrderItemList, getSubscriptionLimitAndDetails, updatePurchaseOrderItemStatus } from '../../data';
import * as productData from '../../data/product';
import {
  deleteProductVariant,
  executeRemoveVariantsByVariantID,
  executeUpdateProductVariantWithImages,
  getMarketPlaceVariantForProductList,
  getProduct,
  getProductsByPageID,
  getProductVariantForWebViewByVariantID,
  unMergeAndUnImportMarketPlaceByIDBatch,
  unMergeProductVariantMarketPlaceByIDBatch,
} from '../../data/product';
import { combineUpdateProductObject, getProductListToUpdate } from '../../domains/product/product-invertory.domain';
import { SubscriptionError } from '../../errors';
import { FileService } from '../file/file.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderService } from '../purchase-order';
import { ProductInventoryUpdateService } from './product-inventory-update.service';

export class ProductService {
  productInventoryUpdateService: ProductInventoryUpdateService;
  fileService: FileService;
  purchaseOrderService: PurchaseOrderService;
  subscriptionServices: SubscriptionService;
  constructor() {
    this.fileService = new FileService();
    this.productInventoryUpdateService = new ProductInventoryUpdateService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.subscriptionServices = new SubscriptionService();
  }
  getProductAllList = async (pageID: number, filters: ITableFilter, subscriptionID: string): Promise<IProductAllList[]> => {
    pageID = 91;
    const searchBy = ['name'];
    const { search, currentPage, orderBy, orderMethod, pageSize } = filters;
    let { dropDownID } = filters;
    if (+dropDownID === -1) {
      dropDownID = null;
    }
    const whereType = dropDownID
      ? `AND p.id in (select distinct(product_id) as "id" from product_category_mapping pcm where pcm.category_id = ${dropDownID} and pcm.active  = true )`
      : '';

    const searchQuery = search ? ` AND ${searchBy.map((column, i) => `UPPER(${column}) LIKE UPPER('%${search}%') ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')}` : '';

    const productSearchQuery = searchQuery ? searchQuery.replace('UPPER(name)', 'UPPER(p.name)') : '';
    const productMarketPlaceSearchQuery = searchQuery ? searchQuery.replace('UPPER(name)', 'UPPER(pm.name)') : '';

    const orderQuery = ` ${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;

    const page: number = (currentPage - 1) * pageSize;

    const products = await productData.getProductAllList(
      PlusmarService.readerClient,
      pageID,
      productSearchQuery,
      productMarketPlaceSearchQuery,
      whereType,
      orderQuery,
      page,
      pageSize,
    );

    const transformedProducts = products.map((product) => ({
      ...product,
      images: transformImageUrlArray(product.images, environmentLib.filesServer, subscriptionID),
    }));

    return transformedProducts;
  };

  async getProduct(pageID: number, productID: number): Promise<IProductList[]> {
    // ? being used at webhook-template.service
    return await getProduct(PlusmarService.readerClient, pageID, productID);
  }

  async getProductVariantForWebViewByVariantID(pageID: number, variantID: number, subscriptionID: string): Promise<IProductVariantPipeline> {
    // ? being used at webhook-template.service
    // todo
    const result = await getProductVariantForWebViewByVariantID(PlusmarService.readerClient, pageID, variantID);
    if (result?.variantImages) {
      let url = result.variantImages as string;
      url = transformMediaLinkString(url, environmentLib.filesServer, subscriptionID);
      result.variantImages = url;
    }
    return result;
  }

  async searchProductCodeExists(context: IGQLContext, name: string): Promise<IHTTPResult> {
    return await productData.searchProductCodeExists(PlusmarService.readerClient, context, name);
  }

  getProductList = async (pageID: number, filters: ITableFilter, subscriptionID: string): Promise<IProductList[]> => {
    const searchBy = ['p.name'];
    const { search, currentPage, orderBy, orderMethod, pageSize } = filters;
    let { dropDownID } = filters;
    if (+dropDownID === -1) {
      dropDownID = null;
    }
    const whereType = dropDownID
      ? `AND p.id in (select distinct(product_id) as "id" from product_category_mapping pcm where pcm.category_id = ${dropDownID} and pcm.active  = true )`
      : '';

    const searchQuery = search
      ? `${whereType} AND ${searchBy.map((column, i) => `UPPER(${column}) LIKE UPPER('%${search}%') ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')}`
      : whereType;

    const orderQuery = `${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;

    const page: number = (currentPage - 1) * pageSize;

    const products = await productData.getProductList(PlusmarService.readerClient, pageID, searchQuery, orderQuery, page, pageSize);

    const transformedProducts = products.map((product) => ({
      ...product,
      images: transformImageUrlArray(product.images, environmentLib.filesServer, subscriptionID),
    }));

    return transformedProducts;
  };

  removeProduct = async (context: IGQLContext, productIDs: IDObject[], marketPlaceIDs: number[], marketPlaceVariantIDs: number[]): Promise<IHTTPResult> => {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.readerClient);
    const { pageID } = context.payload;
    if (client) {
      const productID = productIDs.map(({ id }) => id);
      const removeResponse = await this.processRemovingOfProducts(pageID, productID, marketPlaceIDs, marketPlaceVariantIDs, client);
      return removeResponse;
    } else {
      console.log('removeProduct error not able to fetch client ');
      throw new Error('Error removing products, not able to fetch client');
    }
  };

  // IProductVariantPipeline
  getVariantsOfProduct = async (pageID: number, productID: number, marketProductIDs: number[]): Promise<IVariantsOfProduct[]> => {
    pageID = 91;
    const variants = await productData.getVariantsOfProduct(PlusmarService.readerClient, pageID, productID);
    const marketPlaceVariants = await getMarketPlaceVariantForProductList(pageID, marketProductIDs, PlusmarService.readerClient);
    const subscription = await this.subscriptionServices.getSubscriptionByPageID(pageID);
    const variantTransformed = tranformProductVariantData(variants, 'variantImages', environmentLib.filesServer, subscription.id);
    return [...variantTransformed, ...marketPlaceVariants];
  };

  async getVariantByID(pageID: number, variantID: number): Promise<IProductVariantByID> {
    return await productData.getVariantByID(pageID, variantID, PlusmarService.readerClient);
  }

  getShopProductVariants = async (pageID: number, filters: ITableFilter, subscriptionID: string): Promise<IProductList[]> => {
    const searchBy = ['p.name', 'pa.name'];
    const { search, currentPage, orderBy, orderMethod, pageSize } = filters;
    const searchQuery = search ? ` AND (${searchBy.map((column, i) => `UPPER(${column}) LIKE UPPER('%${search}%') ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')})` : '';
    const orderQuery = `${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;
    const page: number = (currentPage - 1) * pageSize;
    const products = await productData.getShopProducts(PlusmarService.readerClient, pageID, searchQuery, orderQuery, page, pageSize);
    if (isEmpty(products)) return [];

    const tranformedProduct = products.map((pro) => ({
      ...pro,
      images: transformImageUrlArray(pro.images, environmentLib.filesServer, subscriptionID),
      variantData: tranformProductVariantData(pro.variantData, 'variantImages', environmentLib.filesServer, subscriptionID),
    }));
    if (!isEmpty(tranformedProduct)) {
      return tranformedProduct;
    } else {
      return [];
    }
  };

  getProductByID = async (pageID: number, productID: number, subscriptionID: string): Promise<IProductByID[]> => {
    const product = await productData.getProductByID(PlusmarService.readerClient, pageID, productID);
    if (product) {
      const tranformedProduct = product?.map((pro) => ({
        ...pro,
        images: transformImageUrlArray(pro.images, environmentLib.filesServer, subscriptionID),
        variants: pro.variants?.map((variant) => ({
          ...variant,
          variantImages: transformImageUrlArray(variant.variantImages, environmentLib.filesServer, subscriptionID),
        })),
      }));
      return tranformedProduct;
    } else {
      return [];
    }
  };

  processRemovingOfProducts = async (pageID: number, productIDs: number[], marketPlaceIDs: number[], marketPlaceVariantIDs: number[], client: Pool): Promise<IHTTPResult> => {
    try {
      for (let i = 0; i < productIDs.length; i++) {
        const productID = productIDs[i];
        const mappingIDs = await productData.executeGetAttributeMappings(pageID, productID, PlusmarService.readerClient);
        await productData.executeRemoveVariants(pageID, productID, client);
        await this.processRemoveProductMapping(pageID, productID, mappingIDs, client);
        await productData.executeRemoveProduct(pageID, productID, client);
      }
      await unMergeAndUnImportMarketPlaceByIDBatch(pageID, marketPlaceIDs, client);
      await unMergeProductVariantMarketPlaceByIDBatch(pageID, marketPlaceVariantIDs, client);

      const dataCommited = await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.pro_save_remove_success, PRODUCT_TRANSLATE_MSG.pro_save_remove_error);
      return dataCommited;
    } catch (error) {
      console.log('ProductService -> processRemovingOfProducts', error);
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_save_error };
    }
  };

  processRemoveProductMapping = async (pageID: number, productID: number, mappingIDs: number[], client: Pool): Promise<void> => {
    try {
      for (let i = 0; i < mappingIDs?.length; i++) {
        const mappingID = mappingIDs[i];
        await productData.executeRemoveAttributeListMappings(pageID, mappingID, client);
        await productData.executeRemoveAttributeMappings(pageID, mappingID, client);
      }
      await productData.executeRemoveCategoryMappings(pageID, productID, client);
      await productData.executeRemoveTagMappings(pageID, productID, client);
    } catch (err) {
      console.log('ProductService -> processRemoveProductMapping ->', err);
      console.log('error removing product mappings');
    }
  };

  addProduct = async (context: IGQLContext, product: IProduct): Promise<IHTTPResult[]> => {
    //TODO: Reduce number of call function.
    const {
      pageID,
      page: { uuid: pageUUID },
    } = context.payload;
    const { tags, categories, variants, images } = product;
    const subscription = await this.subscriptionServices.getSubscriptionByPageID(pageID);
    if (!subscription) throw new SubscriptionError('PRODUCT_SUBSCRIPTION_NOT_FOUND');
    const subscriptionLimit: ISubscriptionLimitAndDetails = await getSubscriptionLimitAndDetails(PlusmarService.readerClient, subscription.id);
    const pageProducts = await getProductsByPageID(PlusmarService.readerClient, pageID);
    if (pageProducts.length >= subscriptionLimit.maximumProducts) throw new SubscriptionError('PRODUCT_REACHED_LIMIT');
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    if (client) {
      const productID = await productData.executeMainProductQuery(pageID, product, client);
      if (productID) {
        return await this.processProductChildrenSaving(pageID, productID, tags, categories, variants, images, subscription.id, client, pageUUID);
      }
    } else {
      throw new Error('Error saving product, not able to fetch client');
    }

    // ! execBatchCommitTransaction() not found
  };

  processProductChildrenSaving = async (
    pageID: number,
    productID: number,
    tags: INameIDPair[],
    categories: ICatSubCatHolder[],
    variants: IProductVariant[],
    images: any[],
    subscriptionID: string,
    client: Pool,
    pageUUID: string,
  ): Promise<IHTTPResult[]> => {
    const productResponse = [] as IHTTPResult[];
    await productData.executeTagMappingQueries(pageID, tags, productID, client);
    await productData.executeCategoryMappingQueries(pageID, categories, productID, client);
    const variantIDMapper = await this.processVariantExecution(variants, pageID, productID, client);
    const dataCommited = await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.pro_save_success, PRODUCT_TRANSLATE_MSG.pro_save_error);
    productResponse.push(dataCommited);
    const uploadUpdateImagesResponse = await this.uploadProductVariantImageAndUpdate(dataCommited, images, pageID, productID, variantIDMapper, subscriptionID, pageUUID);
    productResponse.push(...uploadUpdateImagesResponse);
    return productResponse;
  };

  async processVariantExecution(variants: IProductVariant[], pageID: number, productID: number, client: Pool): Promise<IProductVariantImages[]> {
    const variantIDMapper = [] as IProductVariantImages[];
    for (let idx = 0; idx < variants.length; idx++) {
      const variant: IProductVariant = variants[idx];
      const attributeMapping = await productData.executeAttributeMappingQueries(pageID, client);
      const attributeMappingID = attributeMapping.id;
      const { attributes, variantImages } = variant;
      await productData.executeAttributeListMappingQueries(pageID, attributeMappingID, attributes, client);
      const productVariantSaved = await productData.executeVariantsAttributeQueries(pageID, productID, attributeMappingID, variant, client);
      const { id } = productVariantSaved;
      variantIDMapper.push({ id, images: variantImages });
    }
    return variantIDMapper;
  }

  uploadProductVariantImageAndUpdate = async (
    dataCommited: IHTTPResult,
    images: any[],
    pageID: number,
    productID: number,
    variantIDMapper: IProductVariantImages[],
    subscriptionID: string,
    pageUUID: string,
  ): Promise<IHTTPResult[]> => {
    const productResponse = [] as IHTTPResult[];
    if (dataCommited.status === 200 && images?.length > 0) {
      try {
        const updateProductImageUpdate: IHTTPResult = await this.uploadProductImageAndUpdate(pageID, productID, images, subscriptionID, pageUUID);
        productResponse.push(updateProductImageUpdate);
        if (updateProductImageUpdate.status === 200) {
          if (variantIDMapper?.length) {
            const variantUpdateResponse: IHTTPResult = await this.uploadVariantImageAndUpdate(pageID, variantIDMapper, subscriptionID, pageUUID);
            productResponse.push(variantUpdateResponse);
          }
        } else {
          productResponse.push({ status: 403, value: PRODUCT_TRANSLATE_MSG.pro_variant_image_save_error });
        }
        return productResponse;
      } catch (error) {
        if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in uploadProductVariantImageAndUpdate', error);
        console.log('image upload -> uploadProductVariantImageAndUpdate', error);
        return productResponse;
      }
    }
  };

  uploadProductImageAndUpdate = async (pageID: number, productID: number, images: IGQLFileSteam[], subscriptionID: string, pageUUID: string): Promise<IHTTPResult> => {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const imagesArray = await this.fileService.uploadSystemFiles(pageID, images, subscriptionID, pageUUID, EnumFileFolder.PRODUCTS, productID.toString());
      return await productData.executeUpdateProductWithImages(client, pageID, productID, imagesArray);
    } catch (error) {
      console.log('error -< uploadProductImageAndUpdate', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in uploadProductImageAndUpdate', error);
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_image_save_error };
    }
  };

  uploadVariantImageAndUpdate = async (pageID: number, variantIDMapper: IProductVariantImages[], subscriptionID: string, pageUUID: string): Promise<IHTTPResult> => {
    try {
      const variantImagesArray: IProductVariantImages[] = await this.prepareAndUploadVariantImages(pageID, variantIDMapper, subscriptionID, pageUUID);
      const updateVariantsImages = await this.updateProductVariantImage(variantImagesArray);
      return updateVariantsImages;
    } catch (error) {
      console.log('error while upload image and update', error);
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_variant_image_save_error };
    }
  };

  updateProductVariantImage = async (images: IProductVariantImages[]): Promise<IHTTPResult> => {
    try {
      if (images?.length > 0) {
        const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
        if (client) {
          for (let i = 0; i < images.length; i++) {
            const variant = images[i];
            if (variant?.gcImage.length > 0 && variant.id) {
              await productData.executeUpdateProductVariantWithImages(variant, client);
            }
          }
          const dataCommited = await productData.commitProductQueries(
            client,
            PRODUCT_TRANSLATE_MSG.pro_variant_image_save_success,
            PRODUCT_TRANSLATE_MSG.pro_variant_image_save_error,
          );
          return dataCommited;
        }
      } else {
        return { status: 200, value: null };
      }
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in updateProductVariantImage', err);
      console.log('updateProductVariantImage -> err', err);
      throw new Error('Not able to update variants' + err);
    }
  };

  prepareAndUploadVariantImages = async (pageID: number, variantMapper: IProductVariantImages[], subscriptionID: string, pageUUID: string): Promise<IProductVariantImages[]> => {
    try {
      const imagesResponseArray = [] as IProductVariantImages[];
      if (variantMapper?.length > 0) {
        for (let vi = 0; vi < variantMapper?.length; vi++) {
          const variant = variantMapper[vi];
          const variantID = variant.id;
          const variantImages = variant?.images;
          if (variantImages?.length) {
            const uploadResponseArray = await this.fileService.uploadSystemFiles(pageID, variantImages, subscriptionID, pageUUID, EnumFileFolder.PRODUCTS, variantID.toString());
            imagesResponseArray.push({ id: variantID, gcImage: uploadResponseArray });
          }
        }
        return imagesResponseArray;
      }
    } catch (err) {
      console.log('prepareAndUploadVariantImages -> err', err);
      throw new Error('Error preparing product variant images ' + err);
    }
  };

  updateProductTags = async (pageID: number, productID: number, data: IEditProductTag[]): Promise<IHTTPResult> => {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

      const addTagsToProduct: INameIDPair[] = this.getItemForUpdate(data, 'ADD');
      const deleteTagsToProduct: INameIDPair[] = this.getItemForUpdate(data, 'DELETE');
      await productData.executeTagMappingQueries(pageID, addTagsToProduct, productID, client);
      for (let i = 0; i < deleteTagsToProduct.length; i++) {
        const tag = deleteTagsToProduct[i];
        await productData.executeRemoveSingleTagMappings(pageID, productID, tag.mainID, client);
      }
      const dataCommited = await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.pro_tag_update_success, PRODUCT_TRANSLATE_MSG.pro_tag_update_error);
      return dataCommited;
    } catch (error) {
      console.log('ProductService -> updateProductTags', error);
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_tag_update_error };
    }
  };

  updateProductCategories = async (pageID: number, productID: number, data: IEditProductCategory[]): Promise<IHTTPResult> => {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

      const addCategoryToProduct: ICatSubCatHolder[] = this.getItemForUpdate(data, CRUD_MODE.ADD);
      const deleteCategoryToProduct: ICatSubCatHolder[] = this.getItemForUpdate(data, CRUD_MODE.DELETE);

      await productData.executeCategoryMappingQueries(pageID, addCategoryToProduct, productID, client);

      for (let i = 0; i < deleteCategoryToProduct.length; i++) {
        const cat = deleteCategoryToProduct[i];
        await productData.executeRemoveSingleCategoryMappings(pageID, productID, cat.mainID, client);
      }
      const dataCommited = await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.pro_cat_update_success, PRODUCT_TRANSLATE_MSG.pro_cat_update_error);

      return dataCommited;
    } catch (error) {
      console.log('ProductService -> updateProductCategories', error);
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_cat_update_error };
    }
  };

  releasePurchaseProductOnCancelPayment = async (pageID: number, orderID: number, subscriptionID: string): Promise<void> => {
    console.log(' releasePurchaseProductOnCancelPayment');
    console.log(' releasePurchaseProductOnCancelPayment');
    console.log(' releasePurchaseProductOnCancelPayment');
    console.log(' releasePurchaseProductOnCancelPayment');
    const noOrder = null;

    const products = await getOrderItemList(PlusmarService.readerClient, pageID, orderID);
    const productList = getProductListToUpdate(products, IncreaseDecreaseType.INCREASE);
    const variantIDs = productList.map((item) => item.variantID);
    const updateProducts = combineUpdateProductObject(productList, await this.productInventoryUpdateService.getProductMarketplaceToUpdate(pageID, variantIDs, productList));
    await this.productInventoryUpdateService.updateProductInventoryV2Publisher(pageID, noOrder, updateProducts, subscriptionID);

    const isSell = false;
    const isReverse = true;
    await updatePurchaseOrderItemStatus(PlusmarService.readerClient, pageID, orderID, isSell, isReverse);
  };

  updateProductVariants = async (pageID: number, productID: number, variants: IEditProductVariant[], subscriptionID: string): Promise<IHTTPResult> => {
    try {
      if (variants?.length) {
        const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
        const variantData = variants.map((variant) => variant.data);

        const variantUpdatedIDInventories: IProductVariantIDInventory[] = variantData.map(({ inventory, variantID, currentInventory }) => ({
          variantID,
          inventory,
          currentInventory,
        }));

        const noOrder = null;
        const newInventory: IProductVariantUpdateInventoryCalcPayload[] = await this.productInventoryUpdateService.calculateProductToUpdate(pageID, variantUpdatedIDInventories);
        const variantIDs = newInventory.map((item) => item.variantID);
        const updateProducts = combineUpdateProductObject(newInventory, await this.productInventoryUpdateService.getProductMarketplaceToUpdate(pageID, variantIDs, newInventory));

        const columns = 'unit_price = :unitPrice, status = :status';
        for (let i = 0; i < variantData.length; i++) {
          const variant = variantData[i];

          const { variantID } = variant;
          const values = {
            unitPrice: variant.unitPrice,
            status: variant.status,
          };
          await productData.executeUpdateVariantQueries(pageID, productID, variantID, columns, values, client);
        }
        await PostgresHelper.execBatchCommitTransaction(client);
        await this.productInventoryUpdateService.updateProductInventoryV2Publisher(pageID, noOrder, updateProducts, subscriptionID);
      }
      const response: IHTTPResult = {
        status: 200,
        value: PRODUCT_TRANSLATE_MSG.pro_variant_update_success,
      };
      return response;
    } catch (error) {
      console.log('ProductService -> updateProductVariants', error);
      return {
        status: 403,
        value: error.message === 'ERROR_UPDATING_AT_MARKETPLACE' ? PRODUCT_TRANSLATE_MSG.pro_marketplace_error : PRODUCT_TRANSLATE_MSG.pro_variant_update_error,
      };
    }
  };

  getItemForUpdate = (data, mode: string) => {
    return data
      .map((item) => {
        if (item.mode === mode) {
          return item.data;
        }
      })
      .filter((el) => el);
  };

  updateProductMain = async (pageID: number, productID: number, basicFields: INameValuePair[]): Promise<IHTTPResult> => {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const columns = basicFields.map((item) => {
        if (item.name === 'weight') {
          item.value = String(Number(item.value) / 1000); // Turn grams into Kilograms
        }
        let value = item.value;
        item.name === 'dimension' ? (value = `'${item.value}'`) : (value = `'${item.value}'`);
        return `${item.name} = ${value}`;
      });
      const columnsString = columns.join(', ');
      await productData.execUpdateProductMain(pageID, productID, columnsString, client);
      const dataCommited = await productData.commitProductQueries(client, PRODUCT_TRANSLATE_MSG.pro_update_success, PRODUCT_TRANSLATE_MSG.pro_update_error);
      return dataCommited;
    } catch (error) {
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_update_error };
    }
  };

  updateProductMainImages = async (
    pageID: number,
    productID: number,
    storedImages: IMoreImageUrlResponse[],
    data: IEditProductImages[],
    subscriptionID: string,
    pageUUID: string,
  ): Promise<IHTTPResult> => {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      let addImagesToProduct: IGQLFileSteam[] = this.getItemForUpdate(data, 'ADD');
      addImagesToProduct = addImagesToProduct.map((item) => item.file);
      let uploadResponseArray = [];
      if (!isEmpty(addImagesToProduct)) {
        uploadResponseArray = await this.fileService.uploadSystemFiles(pageID, addImagesToProduct, subscriptionID, pageUUID, EnumFileFolder.PRODUCTS, productID.toString());
      }
      const deleteImagesToProduct = this.getItemForUpdate(data, 'DELETE');
      const requiredImages = this.processDeteteImages(storedImages, deleteImagesToProduct);
      requiredImages.map((item) => (item.mediaLink = transformImageURlFormat(item.mediaLink)));
      const updatedImageArray = [...(requiredImages ? requiredImages : []), ...(uploadResponseArray ? uploadResponseArray : [])] as IMoreImageUrlResponse[];
      return await productData.executeUpdateProductWithImages(client, pageID, productID, updatedImageArray);
    } catch (error) {
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_image_update_error };
    }
  };

  updateProductVariantImages = async (
    pageID: number,
    productID: number,
    storedVariantImages: IProductVariantImageChange[],
    data: IEditProductVariantImages[],
    bucketName: string,
    pageUUID: string,
  ): Promise<IHTTPResult> => {
    try {
      const addVariantImagesToProduct = this.getItemForUpdate(data, 'ADD');
      const deleteImagesToProduct = this.getItemForUpdate(data, 'DELETE');
      const addedIDs = addVariantImagesToProduct?.map((image) => image.id);
      const deletedIDs = deleteImagesToProduct?.map((image) => image.id);
      const mergedIDs = [...addedIDs, ...deletedIDs];
      const uniqueIDs: number[] = mergedIDs.filter(function (value, index) {
        return mergedIDs.indexOf(value) === index;
      });
      let addedVariantImages = [];
      if (!isEmpty(addVariantImagesToProduct)) {
        addedVariantImages = await this.processAddVariantImages(addVariantImagesToProduct, uniqueIDs, pageID, productID, bucketName, pageUUID);
      }
      const requiredImages = this.processDeteteVariantImages(storedVariantImages, uniqueIDs, deleteImagesToProduct);
      requiredImages.map((item) =>
        item.data.map((images) => {
          images.mediaLink = transformImageURlFormat(images.mediaLink);
        }),
      );
      const mergeImageData = [...requiredImages, ...addedVariantImages];

      const groupImageData = _(mergeImageData)
        .groupBy((item) => item.id)
        .map((value, key) => {
          const tempImagesArray = [];
          value.map((item) => {
            const itemData = item.data;
            tempImagesArray.push(...itemData);
          });
          return { id: +key, gcImage: tempImagesArray };
        })
        .value();
      const updateProductVariants = await this.updateProductVariantImageByID(groupImageData);
      return updateProductVariants;
    } catch (error) {
      console.log('ProductService -> updateProductVariantImages', error);
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_variant_image_update_error };
    }
  };

  async updateProductVariantImageByID(groupImageData: IProductVariantImages[]): Promise<IHTTPResult> {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      for (let idx = 0; idx < groupImageData?.length; idx++) {
        const imageData = groupImageData[idx];
        await executeUpdateProductVariantWithImages(imageData, client);
      }
      const dataCommited = await productData.commitProductQueries(
        client,
        PRODUCT_TRANSLATE_MSG.pro_variant_image_update_success,
        PRODUCT_TRANSLATE_MSG.pro_variant_image_update_error,
      );
      return dataCommited;
    } catch (error) {
      console.log('ProductService -> updateProductVariantImageByID', error);
      return { status: 403, value: PRODUCT_TRANSLATE_MSG.pro_variant_image_update_error };
    }
  }

  async addProductVariants(
    pageID: number,
    { product: { productID, variantIDs, isNoAttribute }, variants }: IProductAddVariants,
    subscriptionID: string,
    pageUUID: string,
  ): Promise<IHTTPResult> {
    return isNoAttribute
      ? await this.addVariantForNoVariants(pageID, productID, variantIDs, variants, subscriptionID, pageUUID)
      : await this.addVariantForExistingVariants(pageID, productID, variantIDs, variants, subscriptionID, pageUUID);
  }

  async addVariantForExistingVariants(
    pageID: number,
    productID: number,
    variantIDs: number[],
    variants: IProductVariant[],
    subscriptionID: string,
    pageUUID: string,
  ): Promise<IHTTPResult> {
    const writer = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      const editVariantsIDs = variants.map(({ variantID }) => variantID).filter((id) => id);
      const removeVariantIDs = _.differenceWith(variantIDs, editVariantsIDs) as number[];
      await this.removeOrDeActivateVariants(pageID, productID, removeVariantIDs, writer);
      const newVariants = variants.filter(({ variantID }) => !variantID);
      const productVariantIDs = await this.processVariantExecution(newVariants, pageID, productID, writer);
      const imageResult = await this.uploadVariantImageAndUpdate(pageID, productVariantIDs, subscriptionID, pageUUID);
      if (imageResult.status === 403) {
        throw new Error('error uploading variant images');
      }
      await PostgresHelper.execBatchCommitTransaction(PlusmarService.writerClient);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error at addVariantForExistingVariants:>>', error);
      await PostgresHelper.execBatchRollbackTransaction(PlusmarService.writerClient);
      throw new Error(error);
    }
  }

  async removeOrDeActivateVariants(pageID: number, productID: number, variantIDs: number[], writer: Pool): Promise<void> {
    if (variantIDs?.length) {
      const orderStatusList = await this.purchaseOrderService.getOrderExistsByVariantID(pageID, variantIDs);
      const orderExists = orderStatusList?.filter((order) => order.orderExists) || [];
      const orderNotExists = orderStatusList?.filter((order) => !order.orderExists) || [];
      for (let index = 0; index < orderNotExists?.length; index++) {
        const orderNotExistVariantID = orderNotExists[index].variantID;
        await deleteProductVariant(pageID, productID, orderNotExistVariantID, writer);
      }

      for (let index = 0; index < orderExists?.length; index++) {
        const orderExistVariantID = orderExists[index].variantID;
        await executeRemoveVariantsByVariantID(pageID, productID, orderExistVariantID, writer);
      }
    }
  }

  async addVariantForNoVariants(
    pageID: number,
    productID: number,
    variantIDs: number[],
    variants: IProductVariant[],
    subscriptionID: string,
    pageUUID: string,
  ): Promise<IHTTPResult> {
    const writer = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      await this.removeOrDeActivateVariants(pageID, productID, variantIDs, writer);
      const productVariantIDs = await this.processVariantExecution(variants, pageID, productID, writer);
      const imageResult = await this.uploadVariantImageAndUpdate(pageID, productVariantIDs, subscriptionID, pageUUID);
      if (imageResult.status === 403) {
        throw new Error('error uploading variant images');
      }
      await PostgresHelper.execBatchCommitTransaction(PlusmarService.writerClient);
      return { status: 200, value: true };
    } catch (error) {
      console.log('error at addVariantForNoVariants:>>', error);
      await PostgresHelper.execBatchRollbackTransaction(PlusmarService.writerClient);
      throw new Error(error);
    }
  }

  processDeteteImages(storedImages: IMoreImageUrlResponse[], deletedImages: IMoreImageUrlResponse[]): IMoreImageUrlResponse[] {
    const differenceImage = _.differenceWith(storedImages, deletedImages, _.isEqual);
    return differenceImage;
  }

  async processAddVariantImages(
    addedVariantImages: IEditProductVariantImageData[],
    uniqueIDs: number[],
    pageID: number,
    productID: number,
    subscriptionID: string,
    pageUUID: string,
  ): Promise<{ id: number; data: IMoreImageUrlResponse[] }[]> {
    const addedImageArray = [];

    for (let index = 0; index < uniqueIDs.length; index++) {
      const id = uniqueIDs[index];
      const addedImagesByID = addedVariantImages.filter((image) => image.id === id);
      const addedImagesOnly = addedImagesByID.map((item) => item?.variantImages?.file);
      const uploadResponseArray = await this.fileService.uploadSystemFiles(pageID, addedImagesOnly, subscriptionID, pageUUID, EnumFileFolder.PRODUCTS, productID.toString());
      addedImageArray.push({ id, data: uploadResponseArray });
    }

    return addedImageArray;
  }

  processDeteteVariantImages(
    storedImages: IProductVariantImageChange[],
    uniqueIDs: number[],
    deletedImages: IEditProductVariantImageData[],
  ): { id: number; data: IMoreImageUrlResponse[] }[] {
    const deletedImagesArray = [];
    uniqueIDs.forEach((id) => {
      const storedVariantImages = storedImages.find((image) => image.id === id);
      const deletedVariantImages = deletedImages.filter((image) => image.id === id);
      const deletedImagesMap = deletedVariantImages.map((item) => item.variantImages);
      const differenceImage = _.differenceWith(storedVariantImages.variantImages, deletedImagesMap, _.isEqual);
      if (differenceImage) {
        deletedImagesArray.push({ id, data: differenceImage });
      }
    });
    return deletedImagesArray;
  }

  convertToType(item: INameValuePair): INameValuePair {
    if (item.name === 'dimensions') {
      const obj = { ...item, value: JSON.stringify(item.value) };
      return obj;
    } else {
      return item;
    }
  }
}
