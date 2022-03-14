import {
  EBackgroundSize,
  EBackgroundSizeTitle,
  ElinkType,
  ElinkTypeTitle,
  ETextAlignment,
  HoverAnimationTypes,
  IDropDown,
  IShoppingCartHoverAnimation,
  IShoppingCartPatternBottomOptions,
  IShoppingCartPatternList,
  IShoppingCartPatternPagination,
  IShoppingCartProductAdvanceButtonList,
  IShoppingCartProductAdvanceLabelList,
  IShoppingCartProductAdvanceShowInfoList,
  IShoppingCartProductBuyButtonIcon,
  IShoppingCartProductBuyButtonStyle,
  IShoppingCartProductBuyFavButtonStyle,
  IShoppingCartProductLabelBestSeller,
  IShoppingCartProductLabelNew,
  IShoppingCartProductLabelRecommended,
  IShoppingCartProductPriceStyle,
  IShoppingCartProductRatingStyle,
  IShoppingCartProductSkuStyle,
  IShoppingCartProductSoldStyle,
  ShoppingCartAdvanceProductButtonTypes,
  ShoppingCartAdvanceProductLabelTypes,
  ShoppingCartAdvanceProductShowInfoTypes,
  ShoppingCartPatternBottomTypes,
  ShoppingCartPatternPaginationTypes,
  ShoppingCartProductBuyButtonIconTypes,
  ShoppingCartProductBuyButtonStyleTypes,
  ShoppingCartProductBuyFavButtonStyleTypes,
  ShoppingCartProductCodeSkuStyleTypes,
  ShoppingCartProductDisplayTypes,
  ShoppingCartProductLabelBestStyleTypes,
  ShoppingCartProductLabelNewStyleTypes,
  ShoppingCartProductLabelRecommendedStyleTypes,
  ShoppingCartProductPriceStyleTypes,
  ShoppingCartProductRatingStyleTypes,
  ShoppingCartProductSoldStyleTypes,
  ShoppingCartProductSortTypes,
  ShoppingCartTypes,
} from '@reactor-room/cms-models-lib';
import { IKeyValuePair } from '@reactor-room/model-lib';
import { ESidebarElement } from '../../cms-sidebar.model';
import { CmsShoppingCartProductAdvanceButtonBuyComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-button-buy/cms-shopping-cart-product-advance-button-buy.component';
import { CmsShoppingCartProductAdvanceButtonFavoriteComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-button-favorite/cms-shopping-cart-product-advance-button-favorite.component';
import { CmsShoppingCartProductAdvanceLabelBestSellerComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-label-best-seller/cms-shopping-cart-product-advance-label-best-seller.component';
import { CmsShoppingCartProductAdvanceLabelNewProductComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-label-new-product/cms-shopping-cart-product-advance-label-new-product.component';
import { CmsShoppingCartProductAdvanceLabelRecommendedComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-label-recommended/cms-shopping-cart-product-advance-label-recommended.component';
import { CmsShoppingCartProductAdvanceShowDescriptionComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-show-description/cms-shopping-cart-product-advance-show-description.component';
import { CmsShoppingCartProductAdvanceShowInventoryComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-show-inventory/cms-shopping-cart-product-advance-show-inventory.component';
import { CmsShoppingCartProductAdvanceShowMediaComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-show-media/cms-shopping-cart-product-advance-show-media.component';
import { CmsShoppingCartProductAdvanceShowPriceComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-show-price/cms-shopping-cart-product-advance-show-price.component';
import { CmsShoppingCartProductAdvanceShowProductNameComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-show-product-name/cms-shopping-cart-product-advance-show-product-name.component';
import { CmsShoppingCartProductAdvanceShowProductSKUComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-show-product-sku/cms-shopping-cart-product-advance-show-product-sku.component';
import { CmsShoppingCartProductAdvanceShowRatingProductsComponent } from './components/cms-layout-setting-shopping-cart/components/cms-layout-shopping-cart-products/cms-shopping-cart-product-advance-show-rating-products/cms-shopping-cart-product-advance-show-rating-products.component';

const imagePath = 'assets/cms/media-style/shopping-cart/';

export const linkTypeData: IDropDown[] = [
  {
    value: ElinkType.URL,
    title: ElinkTypeTitle.URL,
  },
  {
    value: ElinkType.PAGE,
    title: ElinkTypeTitle.PAGE,
  },
  {
    value: ElinkType.PRODUCT,
    title: ElinkTypeTitle.PRODUCT,
  },
  {
    value: ElinkType.CONTENT,
    title: ElinkTypeTitle.CONTENT,
  },
  {
    value: ElinkType.POPUP,
    title: ElinkTypeTitle.POPUP,
  },
  {
    value: ElinkType.ANCHOR,
    title: ElinkTypeTitle.ANCHOR,
  },
  {
    value: ElinkType.EMAIL,
    title: ElinkTypeTitle.EMAIL,
  },
];

export const paginationList: IShoppingCartPatternPagination[] = [
  {
    type: ShoppingCartPatternPaginationTypes.PAGINATION_1,
    imgURL: `${imagePath}pagination-1.svg`,
    selected: false,
  },
  {
    type: ShoppingCartPatternPaginationTypes.PAGINATION_2,
    imgURL: `${imagePath}pagination-2.svg`,
    selected: false,
  },
  {
    type: ShoppingCartPatternPaginationTypes.PAGINATION_3,
    imgURL: `${imagePath}pagination-3.svg`,
    selected: false,
  },
  {
    type: ShoppingCartPatternPaginationTypes.PAGINATION_4,
    imgURL: `${imagePath}pagination-4.svg`,
    selected: false,
  },
];

export const productCodeSkuStyleList: IShoppingCartProductSkuStyle[] = [
  {
    type: ShoppingCartProductCodeSkuStyleTypes.STYLE_1,
    imgURL: `${imagePath}product-sku-style-1.svg`,
    activeImageURL: `${imagePath}product-sku-style-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductCodeSkuStyleTypes.STYLE_2,
    imgURL: `${imagePath}product-sku-style-2.svg`,
    activeImageURL: `${imagePath}product-sku-style-2-a.svg`,
    selected: false,
  },
];

export const productRatingStyleList: IShoppingCartProductRatingStyle[] = [
  {
    type: ShoppingCartProductRatingStyleTypes.STYLE_1,
    imgURL: `${imagePath}product-rating-style-1.svg`,
    activeImageURL: `${imagePath}product-rating-style-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductRatingStyleTypes.STYLE_2,
    imgURL: `${imagePath}product-rating-style-2.svg`,
    activeImageURL: `${imagePath}product-rating-style-2-a.svg`,
    selected: false,
  },
];

export const productSoldStyleList: IShoppingCartProductSoldStyle[] = [
  {
    type: ShoppingCartProductSoldStyleTypes.STYLE_1,
    imgURL: `${imagePath}product-sold-style-1.svg`,
    activeImageURL: `${imagePath}product-sold-style-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductSoldStyleTypes.STYLE_2,
    imgURL: `${imagePath}product-sold-style-2.svg`,
    activeImageURL: `${imagePath}product-sold-style-2-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductSoldStyleTypes.STYLE_3,
    imgURL: `${imagePath}product-sold-style-3.svg`,
    activeImageURL: `${imagePath}product-sold-style-3-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductSoldStyleTypes.STYLE_4,
    imgURL: `${imagePath}product-sold-style-4.svg`,
    activeImageURL: `${imagePath}product-sold-style-4-a.svg`,
    selected: false,
  },
];

export const productPriceStyleList: IShoppingCartProductPriceStyle[] = [
  {
    type: ShoppingCartProductPriceStyleTypes.STYLE_1,
    imgURL: `${imagePath}product-price-style-1.svg`,
    activeImageURL: `${imagePath}product-price-style-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductPriceStyleTypes.STYLE_2,
    imgURL: `${imagePath}product-price-style-2.svg`,
    activeImageURL: `${imagePath}product-price-style-2-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductPriceStyleTypes.STYLE_3,
    imgURL: `${imagePath}product-price-style-3.svg`,
    activeImageURL: `${imagePath}product-price-style-3-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductPriceStyleTypes.STYLE_4,
    imgURL: `${imagePath}product-price-style-4.svg`,
    activeImageURL: `${imagePath}product-price-style-4-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductPriceStyleTypes.STYLE_5,
    imgURL: `${imagePath}product-price-style-5.svg`,
    activeImageURL: `${imagePath}product-price-style-5-a.svg`,
    selected: false,
  },
];

ShoppingCartProductPriceStyleTypes;

export const textAlignmentData = [
  {
    value: ETextAlignment.LEFT,
    selected: false,
  },
  {
    value: ETextAlignment.CENTER,
    selected: false,
  },
  {
    value: ETextAlignment.RIGHT,
    selected: false,
  },
  {
    value: ETextAlignment.JUSTIFY,
    selected: false,
  },
];

export const bottomOptions: IShoppingCartPatternBottomOptions[] = [
  {
    label: 'None',
    type: ShoppingCartPatternBottomTypes.NONE,
    checked: false,
  },

  {
    label: 'Button',
    type: ShoppingCartPatternBottomTypes.BUTTON,
    checked: false,
  },

  {
    label: 'Pagination',
    type: ShoppingCartPatternBottomTypes.PAGINATION,
    checked: true,
  },
];

export const pageData = [
  {
    value: 'Home',
    title: 'Home',
  },
  {
    value: 'Contact us',
    title: 'Contact us',
  },
  {
    value: 'About us',
    title: 'About us',
  },
];
export const productPageData = [
  {
    value: 'Product Home',
    title: 'Product Home',
  },
  {
    value: 'Product 1',
    title: 'Product 1',
  },
  {
    value: 'Product 2',
    title: 'Product 2',
  },
];
export const contentPageData = [
  {
    value: 'Content 1',
    title: 'Content 1',
  },
  {
    value: 'Content 2',
    title: 'Content 2',
  },
  {
    value: 'Content 3',
    title: 'Content 3',
  },
];
export const popupPageData = [
  {
    value: 'Popup 1',
    title: 'Popup 1',
  },
  {
    value: 'Popup 2',
    title: 'Popup 2',
  },
  {
    value: 'Popup 3',
    title: 'Popup 3',
  },
];
export const anchorData = [
  {
    value: 'Anchor 1',
    title: 'Anchor 1',
  },
  {
    value: 'Anchor 2',
    title: 'Anchor 2',
  },
  {
    value: 'Anchor 3',
    title: 'Anchor 3',
  },
];

export const shoppingCartProductDisplayTypeList: IKeyValuePair[] = [
  {
    key: ShoppingCartProductDisplayTypes.ALL_PRODUCTS,
    value: 'All Products',
  },
  {
    key: ShoppingCartProductDisplayTypes.NEW_ITEMS,
    value: 'New items',
  },
  {
    key: ShoppingCartProductDisplayTypes.RECOMMENDED_ITEMS,
    value: 'Recommended items',
  },
  {
    key: ShoppingCartProductDisplayTypes.BEST_SELLER,
    value: 'Best Seller',
  },
  {
    key: ShoppingCartProductDisplayTypes.CATEGORIES,
    value: 'Categories',
  },
  {
    key: ShoppingCartProductDisplayTypes.PROMOTION,
    value: 'Promotion',
  },
  {
    key: ShoppingCartProductDisplayTypes.TAGS,
    value: 'Tags',
  },
];

export const shoppingCartProductSortTypeList: IKeyValuePair[] = [
  {
    key: ShoppingCartProductSortTypes.PUBLISHED_DATE,
    value: 'Published date',
  },
  {
    key: ShoppingCartProductSortTypes.PRODUCT_NAME_A_Z,
    value: 'Product name (A-Z)',
  },
  {
    key: ShoppingCartProductSortTypes.ORDER,
    value: 'Order',
  },
  {
    key: ShoppingCartProductSortTypes.PIN_PRIORITY,
    value: 'Pin & Priority',
  },
  {
    key: ShoppingCartProductSortTypes.RATING_PRODUCTS,
    value: 'Rating products',
  },
  {
    key: ShoppingCartProductSortTypes.PRICE_RATE_LOW_HIGH,
    value: 'Price rate (Low-High)',
  },
  {
    key: ShoppingCartProductSortTypes.PRICE_RATE_HIGH_LOW,
    value: 'Price rate (High-Low)',
  },
  {
    key: ShoppingCartProductSortTypes.RANDOM,
    value: 'Random',
  },
  {
    key: ShoppingCartProductSortTypes.MANUAL,
    value: 'Manual',
  },
];

export const shoppingCartProductAdvanceShowInfoList: IShoppingCartProductAdvanceShowInfoList[] = [
  {
    label: 'Media',
    value: ShoppingCartAdvanceProductShowInfoTypes.MEDIA,
    checked: true,
    isSetting: true,
    position: 1,
    component: CmsShoppingCartProductAdvanceShowMediaComponent,
  },
  {
    label: 'Product Name',
    value: ShoppingCartAdvanceProductShowInfoTypes.PRODUCT_NAME,
    checked: true,
    isSetting: false,
    position: 2,
    component: CmsShoppingCartProductAdvanceShowProductNameComponent,
  },
  {
    label: 'Product Code / SKU',
    value: ShoppingCartAdvanceProductShowInfoTypes.PRODUCT_CODE_SKU,
    checked: true,
    isSetting: false,
    position: 3,
    component: CmsShoppingCartProductAdvanceShowProductSKUComponent,
  },
  {
    label: 'Rating products',
    value: ShoppingCartAdvanceProductShowInfoTypes.RATING_PRODUCTS,
    checked: true,
    isSetting: false,
    position: 4,
    component: CmsShoppingCartProductAdvanceShowRatingProductsComponent,
  },
  {
    label: 'Description',
    value: ShoppingCartAdvanceProductShowInfoTypes.DESCRIPTION,
    checked: true,
    isSetting: false,
    position: 5,
    component: CmsShoppingCartProductAdvanceShowDescriptionComponent,
  },
  {
    label: 'Price / Discount',
    value: ShoppingCartAdvanceProductShowInfoTypes.PRICE_DISCOUNT,
    checked: true,
    isSetting: false,
    position: 6,
    component: CmsShoppingCartProductAdvanceShowPriceComponent,
  },
  {
    label: 'Inventory / Sold',
    value: ShoppingCartAdvanceProductShowInfoTypes.INVENTORY_SOLD,
    checked: true,
    isSetting: false,
    position: 7,
    component: CmsShoppingCartProductAdvanceShowInventoryComponent,
  },
];

export const shoppingCartProductAdvanceButtonList: IShoppingCartProductAdvanceButtonList[] = [
  {
    label: 'Buy Button',
    value: ShoppingCartAdvanceProductButtonTypes.BUY_BUTTON,
    checked: true,
    isSetting: false,
    position: 1,
    component: CmsShoppingCartProductAdvanceButtonBuyComponent,
  },
  {
    label: 'Favorite Button',
    value: ShoppingCartAdvanceProductButtonTypes.FAVORITE_BOTTOM,
    checked: true,
    isSetting: false,
    position: 2,
    component: CmsShoppingCartProductAdvanceButtonFavoriteComponent,
  },
];

export const shoppingCartProductAdvanceLabelList: IShoppingCartProductAdvanceLabelList[] = [
  {
    label: 'New Product',
    value: ShoppingCartAdvanceProductLabelTypes.NEW_PRODUCT,
    checked: true,
    isSetting: false,
    position: 1,
    component: CmsShoppingCartProductAdvanceLabelNewProductComponent,
  },
  {
    label: 'Best Seller',
    value: ShoppingCartAdvanceProductLabelTypes.BEST_SELLER,
    checked: true,
    isSetting: false,
    position: 2,
    component: CmsShoppingCartProductAdvanceLabelBestSellerComponent,
  },
  {
    label: 'Recommended',
    value: ShoppingCartAdvanceProductLabelTypes.RECOMMENDED,
    checked: true,
    isSetting: false,
    position: 3,
    component: CmsShoppingCartProductAdvanceLabelRecommendedComponent,
  },
];

export const backgroundSize = [
  {
    value: EBackgroundSize.UNSET,
    title: EBackgroundSizeTitle.UNSET,
  },
  {
    value: EBackgroundSize.CONTAIN,
    title: EBackgroundSizeTitle.CONTAIN,
  },
  {
    value: EBackgroundSize.COVER,
    title: EBackgroundSizeTitle.COVER,
  },
  {
    value: EBackgroundSize.AUTO,
    title: EBackgroundSizeTitle.AUTO,
  },
];

export const hoverAnimations: IShoppingCartHoverAnimation[] = [
  {
    type: HoverAnimationTypes.NONE,
    imgURL: `assets/cms/animation-style/animation-1.svg`,
    activeImageURL: 'assets/cms/animation-style/animation-1-a.svg',
    selected: false,
  },
  {
    type: HoverAnimationTypes.SWAP,
    imgURL: `assets/cms/animation-style/animation-2.svg`,
    activeImageURL: 'assets/cms/animation-style/animation-2-a.svg',
    selected: false,
  },
  {
    type: HoverAnimationTypes.ZOOM_IN,
    imgURL: `assets/cms/animation-style/animation-3.svg`,
    activeImageURL: 'assets/cms/animation-style/animation-3-a.svg',
    selected: false,
  },
];

export const shoppingCartLayoutList = [
  {
    title: ESidebarElement.SHOPPING_CART_PATTERN,
    status: true,
  },
  {
    title: ESidebarElement.SHOPPING_CART_PRODUCTS,
    status: false,
  },
  {
    title: ESidebarElement.SHOPPING_CART_LANDING_PAGE,
    status: false,
  },
];

export const productBuyButtonStyleList: IShoppingCartProductBuyButtonStyle[] = [
  {
    type: ShoppingCartProductBuyButtonStyleTypes.STYLE_1,
    imgURL: `${imagePath}product-buy-button-style-1.svg`,
    activeImageURL: `${imagePath}product-buy-button-style-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductBuyButtonStyleTypes.STYLE_2,
    imgURL: `${imagePath}product-buy-button-style-2.svg`,
    activeImageURL: `${imagePath}product-buy-button-style-2-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductBuyButtonStyleTypes.STYLE_3,
    imgURL: `${imagePath}product-buy-button-style-3.svg`,
    activeImageURL: `${imagePath}product-buy-button-style-3-a.svg`,
    selected: false,
  },
];

export const productBuyButtonFavStyleList: IShoppingCartProductBuyFavButtonStyle[] = [
  {
    type: ShoppingCartProductBuyFavButtonStyleTypes.STYLE_1,
    imgURL: `${imagePath}product-fav-button-style-1.svg`,
    activeImageURL: `${imagePath}product-fav-button-style-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductBuyFavButtonStyleTypes.STYLE_2,
    imgURL: `${imagePath}product-fav-button-style-2.svg`,
    activeImageURL: `${imagePath}product-fav-button-style-2-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductBuyFavButtonStyleTypes.STYLE_3,
    imgURL: `${imagePath}product-fav-button-style-3.svg`,
    activeImageURL: `${imagePath}product-fav-button-style-3-a.svg`,
    selected: false,
  },
];

export const productBuyButtonIconList: IShoppingCartProductBuyButtonIcon[] = [
  {
    type: ShoppingCartProductBuyButtonIconTypes.STYLE_1,
    imgURL: `${imagePath}product-buy-button-icon-1.svg`,
    activeImageURL: `${imagePath}product-buy-button-icon-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductBuyButtonIconTypes.STYLE_2,
    imgURL: `${imagePath}product-buy-button-icon-2.svg`,
    activeImageURL: `${imagePath}product-buy-button-icon-2-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductBuyButtonIconTypes.STYLE_3,
    imgURL: `${imagePath}product-buy-button-icon-3.svg`,
    activeImageURL: `${imagePath}product-buy-button-icon-3-a.svg`,
    selected: false,
  },
];

export const productLabelNewList: IShoppingCartProductLabelNew[] = [
  {
    type: ShoppingCartProductLabelNewStyleTypes.STYLE_1,
    imgURL: `${imagePath}product-label-new-style-1.svg`,
    activeImageURL: `${imagePath}product-label-new-style-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductLabelNewStyleTypes.STYLE_2,
    imgURL: `${imagePath}product-label-new-style-2.svg`,
    activeImageURL: `${imagePath}product-label-new-style-2-a.svg`,
    selected: false,
  },
];

export const productPatternList: IShoppingCartPatternList[] = [
  {
    type: ShoppingCartTypes.SHOPPING_CART_1,
    imgURL: `${imagePath}cart-1.svg`,
    activeImageURL: `${imagePath}cart-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartTypes.SHOPPING_CART_2,
    imgURL: `${imagePath}cart-2.svg`,
    activeImageURL: `${imagePath}cart-2-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartTypes.SHOPPING_CART_3,
    imgURL: `${imagePath}cart-3.svg`,
    activeImageURL: `${imagePath}cart-3-a.svg`,
    selected: false,
  },
];

export const productLabelBestSellerList: IShoppingCartProductLabelBestSeller[] = [
  {
    type: ShoppingCartProductLabelBestStyleTypes.STYLE_1,
    imgURL: `${imagePath}product-label-best-seller-style-1.svg`,
    activeImageURL: `${imagePath}product-label-best-seller-style-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductLabelBestStyleTypes.STYLE_2,
    imgURL: `${imagePath}product-label-best-seller-style-2.svg`,
    activeImageURL: `${imagePath}product-label-best-seller-style-2-a.svg`,
    selected: false,
  },
];

export const productLabelRecommendedList: IShoppingCartProductLabelRecommended[] = [
  {
    type: ShoppingCartProductLabelRecommendedStyleTypes.STYLE_1,
    imgURL: `${imagePath}product-label-best-seller-style-1.svg`,
    activeImageURL: `${imagePath}product-label-best-seller-style-1-a.svg`,
    selected: false,
  },
  {
    type: ShoppingCartProductLabelRecommendedStyleTypes.STYLE_2,
    imgURL: `${imagePath}product-label-best-seller-style-2.svg`,
    activeImageURL: `${imagePath}product-label-best-seller-style-2-a.svg`,
    selected: false,
  },
];
