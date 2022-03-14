import { IMoreImageUrlResponse, IHTTPResult } from '@reactor-room/model-lib';
import { transformImageUrlArray, transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import {
  IProductAttributeList,
  IProductCatalogSale,
  IProductCatalogSession,
  IProductCategoryList,
  ISalePageCartList,
  ISalePageCartPayload,
  ISalePageProductFilter,
  ISalePageProducts,
  ISendCatalogToChatBoxArgs,
  IVariantsOfProduct,
  WebhookProductCatalogTemplateQueries,
} from '@reactor-room/itopplus-model-lib';
import { uniqBy } from 'lodash';
import { AuthService, PipelineProductCatalogMessageService, PlusmarService, SubscriptionService } from '..';
import {
  deleteCatalogStorage,
  getAttributesByProductID,
  getCatalogStorage,
  getCatalogStorageByMatchedKeys,
  getProductByIDForSalePage,
  getProductCategoriesForSalePage,
  getProductsForSalePage,
  getProductTagsForSalePage,
  getVariantsOfProduct,
  getVariantsOfProductByVariantID,
  setCatalogStorage,
} from '../../data';
import { getProductCatalogRedisKey } from '../../domains';
import { numberWithComma } from '../../domains/report/number-with-comma';
import { environmentLib } from '@reactor-room/environment-services-frontend';
export class ProductCatalogService {
  public authService: AuthService;
  public pipelineProductCatalogService: PipelineProductCatalogMessageService;
  public subscriptionService: SubscriptionService;
  constructor() {
    (this.pipelineProductCatalogService = new PipelineProductCatalogMessageService()), (this.authService = new AuthService());
    this.subscriptionService = new SubscriptionService();
  }
  async sendProductCatalogToChatBox(pageID: number, catalogArgs: ISendCatalogToChatBoxArgs, subscriptionID: string): Promise<IHTTPResult> {
    try {
      await this.pipelineProductCatalogService.sendProductCatalogToChatBox(pageID, catalogArgs, subscriptionID);
      return { status: 200, value: true };
    } catch (error) {
      const errorMessage = error.message;
      return { status: 403, value: errorMessage };
    }
  }

  async getProductsForSalePage(pageID: number, currentPage: number, catalogID: number, filters: ISalePageProductFilter, subscriptionID): Promise<ISalePageProducts[]> {
    try {
      const pageSize = 8;
      if (catalogID !== 0) throw new Error('IMPLEMENT_PRODUCT_CATALOG_OTHER_PRODUCTS');
      const page: number = (currentPage - 1) * pageSize;
      const { search, categoryIDs, tagIDs } = filters;
      const categoryIDList = categoryIDs?.length ? categoryIDs.join?.(', ') : '';
      const tagIDList = tagIDs?.length ? tagIDs.join?.(', ') : '';
      const searchString = search ? ` AND upper(p.name) LIKE upper('%${search}%')` : '';
      const categoryString = categoryIDs?.length
        ? ` AND p.id IN (SELECT DISTINCT product_id FROM product_category_mapping pcm  WHERE category_id IN (${categoryIDList}) OR sub_category_id IN (${categoryIDList})) `
        : '';
      const tagString = tagIDs?.length ? ` AND p.id IN ((SELECT DISTINCT product_id FROM product_tag_mapping ptm WHERE ptm.tag_id IN (${tagIDList}))) ` : '';
      const products = await this.getProductsForSaleCondition(pageID, page, pageSize, categoryString, tagString, searchString);
      const transformedProducts = products.map((product) => ({
        ...product,
        minPrice: numberWithComma(product.minPrice),
        maxPrice: numberWithComma(product.maxPrice),
        images: product.images?.length ? transformImageUrlArray([product?.images[0]], environmentLib.filesServer, subscriptionID) : [],
        imageURL: product.images?.length ? transformMediaLinkString(product?.images[0]?.mediaLink, environmentLib.filesServer, subscriptionID) : '/assets/images/image-icon.png',
      }));
      return transformedProducts;
    } catch (error) {
      console.log(' getProductsForSalePage -> Error getting sale page products :>> ', error);
      throw new Error(error);
    }
  }

  async getProductsForSaleCondition(pageID: number, page: number, pageSize: number, categoryString: string, tagString: string, searchString: string): Promise<ISalePageProducts[]> {
    let products = [] as ISalePageProducts[];
    if (categoryString) {
      const productWithCategory = (await getProductsForSalePage(pageID, page, pageSize, '', categoryString, '', PlusmarService.readerClient)) || [];
      products = [...productWithCategory];
    }

    if (tagString) {
      const productWithTag = (await getProductsForSalePage(pageID, page, pageSize, '', '', tagString, PlusmarService.readerClient)) || [];
      products = [...products, ...productWithTag];
    }

    if (searchString) {
      const productWithSearch = (await getProductsForSalePage(pageID, page, pageSize, searchString, '', '', PlusmarService.readerClient)) || [];
      products = [...products, ...productWithSearch];
    }

    if (!categoryString && !tagString && !searchString) {
      const productNoFilter = (await getProductsForSalePage(pageID, page, pageSize, '', '', '', PlusmarService.readerClient)) || [];
      products = [];
      products = productNoFilter;
    }
    return uniqBy(products, 'id');
  }

  async getTagsCategories(pageID: number): Promise<[IProductCatalogSale[], IProductCategoryList[]]> {
    const tags = await getProductTagsForSalePage(pageID, PlusmarService.readerClient);
    const categories = await getProductCategoriesForSalePage(pageID, PlusmarService.readerClient);
    return [tags, categories];
  }

  async handlePurchaseCatalogPage({ catalogID, auth, page, categoryIDs, tagIDs, search }: WebhookProductCatalogTemplateQueries): Promise<ISalePageProducts[]> {
    const credential = await this.authService.getCredentialFromToken(auth);
    const { pageID, subscriptionID } = credential;
    const filter = {
      search,
      tagIDs: tagIDs ? tagIDs.split(',') : null,
      categoryIDs: categoryIDs ? categoryIDs.split(',') : null,
    } as ISalePageProductFilter;
    const result = await this.getProductsForSalePage(pageID, page, +catalogID, filter, subscriptionID);
    return result;
  }

  async handleSessionSet(auth: string, catalogStorage: IProductCatalogSession): Promise<IHTTPResult> {
    try {
      const credential = await this.authService.getCredentialFromToken(auth);

      if (!credential?.pageID) throw new Error('NOT_A_VALID_REQUEST');
      const redisClient = PlusmarService.redisClient;
      const redisKey = getProductCatalogRedisKey(auth, credential.pageID);
      const redisValue = JSON.stringify(catalogStorage);
      await setCatalogStorage(redisKey, redisValue, redisClient);
      return { status: 200, value: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleSessionGet(auth: string): Promise<IProductCatalogSession> {
    try {
      const credential = await this.authService.getCredentialFromToken(auth);
      if (!credential?.pageID) throw new Error('NOT_A_VALID_REQUEST');
      const redisClient = PlusmarService.redisClient;
      const redisKey = getProductCatalogRedisKey(auth, credential.pageID);
      const catalogStorage = await getCatalogStorage(redisKey, redisClient);
      return catalogStorage;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteCatalogSession(pageID: number, audienceID: number): Promise<void> {
    try {
      const redisClient = PlusmarService.redisClient;
      const redisKey = `${audienceID}:*`;
      const dataList = await getCatalogStorageByMatchedKeys(redisKey, redisClient);
      for (let index = 0; index < dataList?.length; index++) {
        const auth = dataList[index];
        const catalogRedisKey = getProductCatalogRedisKey(auth, pageID);
        await deleteCatalogStorage(catalogRedisKey, redisClient);
      }
    } catch (error) {
      console.log('deleteCatalogSession -> error :>> ', error);
    }
  }

  async handlePurchaseCatalogCart(auth: string, cartPayload: ISalePageCartPayload): Promise<ISalePageCartList[]> {
    try {
      const credential = await this.authService.getCredentialFromToken(auth);
      const { pageID, subscriptionID } = credential;
      const variants = [] as IVariantsOfProduct[];
      for (let index = 0; index < cartPayload?.cart.length; index++) {
        const cart = cartPayload.cart[index];
        const variant = await getVariantsOfProductByVariantID(PlusmarService.readerClient, pageID, cart.productID, cart.variantID);
        variants.push(variant[0]);
      }
      const cartList: ISalePageCartList[] = variants.map((variant, index) => ({
        productID: variant.productID,
        variantID: variant.variantID,
        quantity: cartPayload?.cart[index].quantity,
        attributes: variant.variantAttributes,
        unitPrice: variant.variantUnitPrice,
        productName: variant.productName,
        displayPrice: `฿${numberWithComma(cartPayload?.cart[index].quantity * variant.variantUnitPrice)}`,
        price: +(cartPayload?.cart[index].quantity * variant.variantUnitPrice),
        imageURL: variant.variantImages?.length
          ? transformMediaLinkString((<IMoreImageUrlResponse>variant?.variantImages[0])?.mediaLink, environmentLib.filesServer, subscriptionID)
          : '/assets/images/image-icon.png',
      }));
      return cartList;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVariantProductAttributeForSalePage(pageID: number, productID: number, subscriptionID): Promise<[IVariantsOfProduct[], IProductAttributeList[], ISalePageProducts]> {
    const variantOfProducts = await getVariantsOfProduct(PlusmarService.readerClient, pageID, productID);
    const variants = variantOfProducts
      .map((variant) => ({
        ...variant,
        variantImages: variant.variantImages?.length
          ? transformImageUrlArray([(variant?.variantImages as IMoreImageUrlResponse[])[0]], environmentLib.filesServer, subscriptionID)
          : [],
      }))
      .map((variant) => ({ ...variant, imageURL: variant.variantImages?.length ? variant?.variantImages[0]?.mediaLink : '/assets/images/image-icon.png' }));

    const attributes = await getAttributesByProductID(pageID, productID, PlusmarService.readerClient);
    const products = await getProductByIDForSalePage(pageID, productID, PlusmarService.readerClient);
    const transformedProducts = products.map((product) => ({
      ...product,
      minPrice: numberWithComma(product.minPrice),
      maxPrice: numberWithComma(product.maxPrice),
      images: product.images?.length ? transformImageUrlArray([product?.images[0]], environmentLib.filesServer, subscriptionID) : [],
      imageURL: product.images?.length ? transformMediaLinkString(product?.images[0]?.mediaLink, environmentLib.filesServer, subscriptionID) : '/assets/images/image-icon.png',
    }));
    return [variants, attributes, transformedProducts[0]];
  }
}
