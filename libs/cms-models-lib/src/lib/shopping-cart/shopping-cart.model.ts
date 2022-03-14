import { EBackgroundSize, HoverAnimationTypes, ShoppingCartTypes } from '../component';

export enum ShoppingCartPatternBottomTypes {
  NONE = 'NONE',
  BUTTON = 'BUTTON',
  PAGINATION = 'PAGINATION',
}

export enum ShoppingCartProductNameTypes {
  FULL_NAME = 'FULL_NAME',
  SHORT_NAME = 'SHORT_NAME',
}

export enum ShoppingCartProductLayoutTypes {
  INSIDE_IMAGE = 'INSIDE_IMAGE',
  OUTSIDE_IMAGE = 'OUTSIDE_IMAGE',
}

export enum ShoppingCartProductCodeSkuTypes {
  PRODUCT_CODE = 'PRODUCT_CODE',
  PRODUCT_SKU = 'PRODUCT_SKU',
}

export enum ShoppingCartProductCodeSkuStyleTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
}

export enum ShoppingCartProductRatingStyleTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
}

export enum ShoppingCartProductPriceStyleTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
  STYLE_3 = 'STYLE_3',
  STYLE_4 = 'STYLE_4',
  STYLE_5 = 'STYLE_5',
}

export enum ShoppingCartProductSoldStyleTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
  STYLE_3 = 'STYLE_3',
  STYLE_4 = 'STYLE_4',
}

export enum ShoppingCartProductBuyButtonStyleTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
  STYLE_3 = 'STYLE_3',
}

export enum ShoppingCartProductBuyFavButtonStyleTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
  STYLE_3 = 'STYLE_3',
}

export enum ShoppingCartProductBuyButtonIconTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
  STYLE_3 = 'STYLE_3',
}

export enum ShoppingCartPatternPaginationTypes {
  PAGINATION_1 = 'PAGINATION-1',
  PAGINATION_2 = 'PAGINATION-2',
  PAGINATION_3 = 'PAGINATION-3',
  PAGINATION_4 = 'PAGINATION-4',
}

export enum ShoppingCartProductLabelNewStyleTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
}

export enum ShoppingCartProductLabelBestStyleTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
}

export enum ShoppingCartProductLabelRecommendedStyleTypes {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2',
}

export enum ShoppingCartProductDisplayTypes {
  ALL_PRODUCTS = 'ALL_PRODUCTS',
  NEW_ITEMS = 'NEW_ITEMS',
  RECOMMENDED_ITEMS = 'RECOMMENDED_ITEMS',
  BEST_SELLER = 'BEST_SELLER',
  CATEGORIES = 'CATEGORIES',
  PROMOTION = 'PROMOTION',
  TAGS = 'TAGS',
}

export enum ShoppingCartProductSortTypes {
  PUBLISHED_DATE = 'PUBLISHED_DATE',
  PRODUCT_NAME_A_Z = 'PRODUCT_NAME_A_Z',
  ORDER = 'ORDER',
  PIN_PRIORITY = 'PIN_PRIORITY',
  RATING_PRODUCTS = 'RATING_PRODUCTS',
  PRICE_RATE_LOW_HIGH = 'PRICE_RATE_LOW_HIGH',
  PRICE_RATE_HIGH_LOW = 'PRICE_RATE_HIGH_LOW',
  RANDOM = 'RANDOM',
  MANUAL = 'MANUAL',
}

export enum ShoppingCartAdvanceProductShowInfoTypes {
  MEDIA = 'MEDIA',
  PRODUCT_NAME = 'PRODUCT_NAME',
  PRODUCT_CODE_SKU = 'PRODUCT_CODE_SKU',
  RATING_PRODUCTS = 'RATING_PRODUCTS',
  DESCRIPTION = 'DESCRIPTION',
  PRICE_DISCOUNT = 'PRICE_DISCOUNT',
  INVENTORY_SOLD = 'INVENTORY_SOLD',
}

export enum ShoppingCartAdvanceProductButtonTypes {
  BUY_BUTTON = 'BUY_BUTTON',
  FAVORITE_BOTTOM = 'FAVORITE_BOTTOM',
}

export enum ShoppingCartAdvanceProductLabelTypes {
  NEW_PRODUCT = 'NEW_PRODUCT',
  BEST_SELLER = 'BEST_SELLER',
  RECOMMENDED = 'RECOMMENDED',
}

export enum ShoppingCartAdvanceBottomTypes {
  BUY_BOTTOM = 'BUY_BOTTOM',
  FAVORITE_BOTTOM = 'FAVORITE_BOTTOM',
}

export enum ShoppingCartAdvanceLabelTypes {
  NEW_PRODUCT = 'NEW_PRODUCT',
  BEST_SELLER = 'BEST_SELLER',
  RECOMMENDED = 'RECOMMENDED',
}
export interface IShoppingCartPatternBottomOptions {
  label: string;
  type: ShoppingCartPatternBottomTypes;
  checked: boolean;
}

export interface IShoppingCartPatternPagination extends IimgURLSelected {
  type: ShoppingCartPatternPaginationTypes;
}

export interface IShoppingCartHoverAnimation extends IimgURLSelected {
  type: HoverAnimationTypes;
}

export interface IShoppingCartProductSkuStyle extends IimgURLSelected {
  type: ShoppingCartProductCodeSkuStyleTypes;
}

export interface IShoppingCartProductRatingStyle extends IimgURLSelected {
  type: ShoppingCartProductRatingStyleTypes;
}

export interface IShoppingCartProductPriceStyle extends IimgURLSelected {
  type: ShoppingCartProductPriceStyleTypes;
}

export interface IShoppingCartProductSoldStyle extends IimgURLSelected {
  type: ShoppingCartProductSoldStyleTypes;
}

export interface IShoppingCartProductBuyButtonStyle extends IimgURLSelected {
  type: ShoppingCartProductBuyButtonStyleTypes;
}

export interface IShoppingCartProductBuyFavButtonStyle extends IimgURLSelected {
  type: ShoppingCartProductBuyFavButtonStyleTypes;
}
export interface IShoppingCartProductBuyButtonIcon extends IimgURLSelected {
  type: ShoppingCartProductBuyButtonIconTypes;
}

export interface IShoppingCartProductLabelNew extends IimgURLSelected {
  type: ShoppingCartProductLabelNewStyleTypes;
}

export interface IShoppingCartPatternList extends IimgURLSelected {
  type: ShoppingCartTypes | string;
}

export interface IShoppingCartProductLabelBestSeller extends IimgURLSelected {
  type: ShoppingCartProductLabelBestStyleTypes;
}

export interface IShoppingCartProductLabelRecommended extends IimgURLSelected {
  type: ShoppingCartProductLabelRecommendedStyleTypes;
}
export interface IimgURLSelected {
  imgURL: string;
  hoverImageURL?: string;
  activeImageURL?: string;
  selected: boolean;
}

export interface IShoppingCartAdvanceCommon {
  label: string;
  checked: boolean;
  isSetting: boolean;
  position: number;
}
export interface IShoppingCartProductAdvanceShowInfoList extends IShoppingCartAdvanceCommon {
  value: ShoppingCartAdvanceProductShowInfoTypes;
  component: any;
  // | typeof CmsShoppingCartProductAdvanceShowMediaComponent
  // | typeof CmsShoppingCartProductAdvanceShowProductNameComponent
  // | typeof CmsShoppingCartProductAdvanceShowProductSKUComponent
  // | typeof CmsShoppingCartProductAdvanceShowRatingProductsComponent
  // | typeof CmsShoppingCartProductAdvanceShowDescriptionComponent
  // | typeof CmsShoppingCartProductAdvanceShowPriceComponent
  // | typeof CmsShoppingCartProductAdvanceShowInventoryComponent;
}

export interface IShoppingCartProductAdvanceButtonList extends IShoppingCartAdvanceCommon {
  value: ShoppingCartAdvanceProductButtonTypes;
  component: any;
  // typeof CmsShoppingCartProductAdvanceButtonBuyComponent | typeof CmsShoppingCartProductAdvanceButtonFavoriteComponent;
}

export interface IShoppingCartProductAdvanceLabelList extends IShoppingCartAdvanceCommon {
  value: ShoppingCartAdvanceProductLabelTypes;
  component: any;
  // | typeof CmsShoppingCartProductAdvanceLabelBestSellerComponent
  // | typeof CmsShoppingCartProductAdvanceLabelNewProductComponent
  // | typeof CmsShoppingCartProductAdvanceLabelRecommendedComponent;
}

export interface IShoppingCartMediaFormValues {
  imageScale?: EBackgroundSize;
  widthPx?: number;
  heightPx?: number;
  hoverAnimation?: HoverAnimationTypes;
  applyAll?: boolean;
}
