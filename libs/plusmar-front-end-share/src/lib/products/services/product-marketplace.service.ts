import { Injectable } from '@angular/core';
import { CRUD_MODE, IHTTPResult, INameObject, LanguageTypes } from '@reactor-room/model-lib';
import { IDropDown } from '@reactor-room/plusmar-front-end-share/app.model';
import {
  IIDisMerged,
  ILazadaCategories,
  ILazadaCategoryAttribute,
  ILazadaCreateProductPayload,
  IMergedProductData,
  IMergeMarketPlaceProductParams,
  IProductMarketPlaceCategoryTree,
  IProductMarketPlaceList,
  IProductMarketPlaceListParams,
  IProductMarketPlaceVariantList,
  IShopeeAttributes,
  IShopeeBrandResponse,
  IShopeeCreateProductPayload,
  MergeMarketPlaceType,
  ProductMarketPlaceUpdateTypes,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GET_LAZADA_CATEGORY_ATTRIBUTE,
  GET_LAZADA_SUGGESTED_CATEGORIES,
  GET_MARKETPLACE_BRAND_SUGGESTIONS,
  GET_PRODUCTS_FROM_LAZADA,
  GET_PRODUCTS_FROM_SHOPEE,
  GET_PRODUCT_MARKETPLACE_IMPORT_LIST,
  GET_PRODUCT_MARKET_PLACE_CATEGORY_TREE,
  GET_PRODUCT_MARKET_PLACE_VARIANT_LIST,
  GET_SHOPEE_BRANDS,
  GET_SHOPEE_CATEGORY_ATTRIBUTE,
  GET_SHOPEE_LOGISTICS,
  IMPORT_DELETE_PRODUCT_FROM_MARKETPLACE,
  MERGE_MARKET_PLACE_PRODUCT_OR_VARIANT,
  PUBLISH_PRODUCT_ON_LAZADA,
  PUBLISH_PRODUCT_ON_SHOPEE,
  PUBLISH_VARIANT_TO_SHOPEE_PRODUCT,
  UNMERGE_MARKET_PLACE_PRODUCT_OR_VARIANT,
  UPDATE_PRODUCT_ON_MARKETPLACES,
} from './product-marketplace.query';

@Injectable({
  providedIn: 'root',
})
export class ProductMarketPlaceService {
  private _lazadaIcon = 'assets/img/social/lazada.svg';
  private _shopeeIcon = 'assets/img/social/shopee.svg';
  private _appIcon = 'assets/icons/icon-72x72.png';
  setFormCategorySelected$ = new Subject<{ categoryPath: string; categoryId: number }>();
  private _marketPlaceDropdown: IDropDown[] = [
    {
      label: 'Select Marketplace',
      value: '',
    },
    {
      label: 'Lazada',
      value: SocialTypes.LAZADA,
    },
    {
      label: 'Shopee',
      value: SocialTypes.SHOPEE,
    },
  ];

  public marketPlaceIconObj = {
    [SocialTypes.LAZADA]: this._lazadaIcon,
    [SocialTypes.SHOPEE]: this._shopeeIcon,
    [SocialTypes.MORE_COMMERCE]: this._appIcon,
  };

  get lazadaIcon(): string {
    return this._lazadaIcon;
  }

  get shopeeIcon(): string {
    return this._shopeeIcon;
  }
  get appIcon(): string {
    return this._appIcon;
  }

  get marketPlaceDropdown(): IDropDown[] {
    return this._marketPlaceDropdown;
  }

  constructor(private apollo: Apollo) {}

  getMarketPlaceTypeIcon(type: SocialTypes): string {
    return this.marketPlaceIconObj[type] ? this.marketPlaceIconObj[type] : null;
  }

  getProductsFromLazada(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: GET_PRODUCTS_FROM_LAZADA,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductsFromLazada']));
  }

  getProductsFromShopee(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: GET_PRODUCTS_FROM_SHOPEE,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductsFromShopee']));
  }

  getProductMarketPlaceList(params: IProductMarketPlaceListParams): Observable<IProductMarketPlaceList[]> {
    return this.apollo
      .query({
        query: GET_PRODUCT_MARKETPLACE_IMPORT_LIST,
        variables: {
          ...params,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductMarketPlaceList']));
  }

  importDeleteProductFromMarketPlace(ids: number[], operation: CRUD_MODE): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: IMPORT_DELETE_PRODUCT_FROM_MARKETPLACE,
        variables: {
          ids,
          operation,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['importDeleteProductFromMarketPlace']));
  }

  getProductMarketPlaceVariantList(params: IIDisMerged): Observable<IProductMarketPlaceVariantList[]> {
    return this.apollo
      .query({
        query: GET_PRODUCT_MARKET_PLACE_VARIANT_LIST,
        variables: {
          ...params,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductMarketPlaceVariantList']));
  }

  mergeMarketPlaceProductOrVariant(params: IMergeMarketPlaceProductParams): Observable<IHTTPResult[]> {
    return this.apollo
      .mutate({
        mutation: MERGE_MARKET_PLACE_PRODUCT_OR_VARIANT,
        variables: {
          ...params,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['mergeMarketPlaceProductOrVariant']));
  }

  unMergeMarketPlaceProductOrVariant(unMergeItem: IMergedProductData[], unMergeType: MergeMarketPlaceType): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UNMERGE_MARKET_PLACE_PRODUCT_OR_VARIANT,
        variables: {
          unMergeItem,
          unMergeType,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['unMergeMarketPlaceProductOrVariant']));
  }

  getLazadaSuggestedCategories(keywords: string[]): Observable<ILazadaCategories[]> {
    return this.apollo
      .query({
        query: GET_LAZADA_SUGGESTED_CATEGORIES,
        variables: {
          keywords,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getLazadaSuggestedCategories']));
  }

  getMarketPlaceBrandSuggestions(keyword: string, socialType: SocialTypes, isSuggestion = true): Observable<INameObject[]> {
    return this.apollo
      .query({
        query: GET_MARKETPLACE_BRAND_SUGGESTIONS,
        variables: {
          keyword,
          socialType,
          isSuggestion,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getMarketPlaceBrandSuggestions']));
  }

  getProductMarketPlaceCategoryTree(
    marketPlaceType: SocialTypes,
    parentOrCategoryID: number,
    isCategory: boolean,
    language: LanguageTypes,
  ): Observable<IProductMarketPlaceCategoryTree[]> {
    return this.apollo
      .query({
        query: GET_PRODUCT_MARKET_PLACE_CATEGORY_TREE,
        variables: {
          marketPlaceType,
          parentOrCategoryID,
          isCategory,
          language,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getProductMarketPlaceCategoryTree']));
  }

  getLazadaCategoryAttribute(id: number, marketPlaceType: SocialTypes, lang: string): Observable<ILazadaCategoryAttribute[]> {
    return this.apollo
      .query({
        query: GET_LAZADA_CATEGORY_ATTRIBUTE,
        variables: {
          id,
          marketPlaceType,
          lang,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getLazadaCategoryAttribute']));
  }

  getShopeeCategoryAttribute(id: number, marketPlaceType: SocialTypes, lang: string): Observable<IShopeeAttributes[]> {
    return this.apollo
      .query({
        query: GET_SHOPEE_CATEGORY_ATTRIBUTE,
        variables: {
          id,
          marketPlaceType,
          lang,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getShopeeCategoryAttribute']));
  }

  getShopeeBrands(id: number): Observable<IShopeeBrandResponse> {
    return this.apollo
      .query({
        query: GET_SHOPEE_BRANDS,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getShopeeBrands']));
  }

  publishProductOnLazada(lazadaPayload: ILazadaCreateProductPayload): Observable<IHTTPResult[]> {
    return this.apollo
      .mutate({
        mutation: PUBLISH_PRODUCT_ON_LAZADA,
        variables: {
          payloadParams: { ...lazadaPayload },
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['publishProductOnLazada']));
  }

  getShopeeLogistics(): Observable<{ text: string }> {
    return this.apollo
      .query({
        query: GET_SHOPEE_LOGISTICS,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getShopeeLogistics']));
  }

  publishProductOnShopee(shopeePayload: IShopeeCreateProductPayload): Observable<IHTTPResult[]> {
    return this.apollo
      .mutate({
        mutation: PUBLISH_PRODUCT_ON_SHOPEE,
        variables: {
          payloadParams: shopeePayload,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['publishProductOnShopee']));
  }

  publishVariantToShopeeProduct(productID: number, variantIDs: number[]): Observable<IHTTPResult[]> {
    return this.apollo
      .mutate({
        mutation: PUBLISH_VARIANT_TO_SHOPEE_PRODUCT,
        variables: {
          productID,
          variantIDs,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['publishVariantToShopeeProduct']));
  }

  updateProductOnMarketPlaces(id: number, marketPlaceUpdateTypes: ProductMarketPlaceUpdateTypes[]): Observable<IHTTPResult[]> {
    const updateProductOnMarketPlaces = this.apollo.mutate({
      mutation: UPDATE_PRODUCT_ON_MARKETPLACES,
      variables: {
        id,
        marketPlaceUpdateTypes,
      },
      fetchPolicy: 'no-cache',
    });
    return updateProductOnMarketPlaces.pipe(map((x) => x.data['updateProductOnMarketPlaces']));
  }
}
