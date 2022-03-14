/* eslint-disable max-len */
import { environmentLib } from '@reactor-room/environment-services-backend';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { CRUD_MODE, IHTTPResult, LanguageTypes } from '@reactor-room/model-lib';
import * as helperPlusmar from '@reactor-room/itopplus-back-end-helpers';
import { SHOPEE_PRODUCT_NO_VARIANT_ID } from '@reactor-room/itopplus-back-end-helpers';
import {
  ILazadaCategoryTreeItem,
  ILazadaCreateFormGroup,
  ILazadaCreateProductResponse,
  ILazadaDataResponse,
  ILazadaOrdersReponse,
  ILazadaSkuDetails,
  IMergedProductData,
  IMergeMarketPlaceProductParams,
  IPagesThirdParty,
  IProductByID,
  IProductInventoryCronUpdateInventoryV2Payload,
  IProductLazadaMainResponse,
  IProductLazadaVariantResponse,
  IProductMarketPlace,
  IProductMarketPlaceVariant,
  IProductMarketPlaceVariantList,
  IProductVariantByID,
  IShopeeEnv,
  IShopeeGetProductListParams,
  IShopeeLogistics,
  IShopeeProductBaseInfo,
  IShopeeProductBaseInfoNoModel,
  IShopeeProductList,
  IShopeeUpdateVariantInventoryRequest,
  IShopeeUpdateVariantPriceRequest,
  IShopeeVariationCreate,
  IVariantsOfProductByID,
  MarketPlaceErrorType,
  MergeMarketPlaceType,
  MergeMarketUpdatePriceInventoryResultType,
  ShopeeMarketPlaceResultType,
  ShopeeProductStatusTypes,
  SocialTypes,
  TokenRefreshByTypes,
  UpdateMarketPlaceResultType,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import * as datapage from '../../data/pages';
import * as data from '../../data/product';
import * as domains from '../../domains';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import * as lazadaAPI from './product-marketplace-lazada-api.service';
import * as shopeeAPI from './product-marketplace-shopee-api.service';
import { ProductMarketPlaceService } from './product-marketplace.service';
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../data/product');
jest.mock('./product-marketplace-lazada-api.service');
jest.mock('./product-marketplace-shopee-api.service');
jest.mock('../../data/pages');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../../domains');
jest.mock('../../data');

/*
TODO:// remaining tests
-- uploadImagesToShopee
-- processGetProductFromlazada
-- unMergeMarketPlaceProductOrVariant
-- setBasicDetailForLazadaCreate
-- addMergeLazadaProductVariantOnMarketPlace
-- updateProductMarketPlaceVariantImageShopee
-- updateProductMarketPlaceImageShopee
-- updateProductMarketPlacePriceShopee
-- updateProductPriceAtShopee
-- updateMarketPlacePriceTable
*/

let productMarketPlaceService = new ProductMarketPlaceService();
const lazadaMarketPlaceType = SocialTypes.LAZADA;
const shopeeMarketPlaceType = SocialTypes.SHOPEE;
const currentLang = LanguageTypes.ENGLISH;
const pageID = 344;
const subscriptionID = '8ce4d20f-d980-4127-8560-9523650d5f72';

const lazadaShopeeCreatedProduct = {
  id: 504,
  name: 'mmmmmmRAM live 01',
  code: 'Ram-more',
  description: '<p>Ram for every persaon wRam forevery wod wod wodfff mmkmkggnnmmssdfn</p>',
  weight: '4.340',
  dimension: { length: 10, width: 10, height: 10 },
  dangerous: false,
  status: 1,
  tags: [
    { id: 703, name: 'Ram', mainID: 878 },
    { id: 704, name: 'computer parts', mainID: 879 },
  ],
  categories: [
    { id: 1596, name: 'Computer parts', mainID: 901, subCatID: null },
    { id: 1596, name: 'Ram', mainID: 900, subCatID: 1597 },
  ],
  variants: [
    {
      variantID: 683,
      variantSKU: 'SKU-RAM1',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/google-dragon_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630293674804.png/1630293675785629',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/google-dragon_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630293674804.png',
        },
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/12_1623124447439_Sell_Price_-feature-graphic_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630295389122.png/1630295390009593',
          mediaLink:
            'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/12_1623124447439_Sell_Price_-feature-graphic_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630295389122.png',
        },
      ],
      variantStatus: 1,
      variantReserved: 0,
      variantInventory: 162,
      variantUnitPrice: 157,
      variantAttributes: [{ id: 827, name: 'ddr1', attributeID: 662, attributeType: 'Types' }],
      variantMarketPlaceMerged: [
        { marketPlaceVariantID: 15026, marketPlaceVariantSku: 'SKU-RAM1', marketPlaceVariantType: 'lazada' },
        { marketPlaceVariantID: 15024, marketPlaceVariantSku: 'SKU-RAM1', marketPlaceVariantType: 'shopee' },
      ],
    },
    {
      variantID: 684,
      variantSKU: 'SKU-776431278942',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630293675665.png/1630293676244733',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630293675665.png',
        },
      ],
      variantStatus: 1,
      variantReserved: 0,
      variantInventory: 167,
      variantUnitPrice: 167,
      variantAttributes: [{ id: 828, name: 'ddr2', attributeID: 662, attributeType: 'Types' }],
      variantMarketPlaceMerged: [
        { marketPlaceVariantID: 15027, marketPlaceVariantSku: 'SKU-776431278942', marketPlaceVariantType: 'lazada' },
        { marketPlaceVariantID: 15025, marketPlaceVariantSku: 'SKU-776431278942', marketPlaceVariantType: 'shopee' },
      ],
    },
  ],
  ref: 'e03a2c7a-50e4-4e08-af61-724e59716830__p',
  images: [
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/business-finance-man-calculating-budget-numbers-invoices-financial-adviser-working_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630067414585.jpg/1630067415654689',
      mediaLink:
        'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/business-finance-man-calculating-budget-numbers-invoices-financial-adviser-working_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630067414585.jpg',
    },
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/12_1623124447439_Sell_Price_-feature-graphic_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630293675894.png/1630293676524331',
      mediaLink:
        'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/12_1623124447439_Sell_Price_-feature-graphic_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1630293675894.png',
    },
  ],
  marketPlaceProducts: [
    { id: 5143, name: 'mmmmmmRAM live 01', active: true, pageID: 344, productID: 504, marketPlaceID: '2723367789', marketPlaceType: 'lazada' },
    { id: 5142, name: 'mmmmmmRAM live 01', active: true, pageID: 344, productID: 504, marketPlaceID: '2723382729', marketPlaceType: 'lazada' },
    { id: 5141, name: 'mmmmmmRAM live 01', active: true, pageID: 344, productID: 504, marketPlaceID: '10641800349', marketPlaceType: 'shopee' },
  ],
} as unknown as IProductByID;
const shopeeProductByID = {
  id: 505,
  name: 'Ram RAM RAM RAM RAMR AR AMR AMRA',
  code: 'AWE001',
  description: '<p>Ram is for mjjkjkjk999iiikkzzzkiuillliooppppppppppphhh000</p>',
  weight: '3.00',
  dimension: { length: 32, height: 32, width: 32 },
  dangerous: false,
  status: 1,
  tags: [{ id: 705, name: 'RAM', mainID: 880 }],
  categories: [{ id: 1596, name: 'Computer parts', mainID: 905, subCatID: null }],
  variants: [
    {
      variantID: 685,
      variantSKU: 'SKU-RAM-DDR1',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_685_1613015067802.jpg/1613015068106167',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_685_1613015067802.jpg',
        },
      ],
      variantStatus: 1,
      variantInventory: 15,
      variantUnitPrice: 40,
      variantAttributes: [
        { id: 827, name: 'ddr1' },
        { id: 829, name: '1gz' },
      ],
      variantMarketPlaceMerged: [{ marketPlaceVariantID: 9248, marketPlaceVariantSku: '45045622495', marketPlaceVariantType: 'shopee' }],
    },
    {
      variantID: 686,
      variantSKU: 'SKU-RAM-DDR2',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_686_1613015068099.jpg/1613015068480986',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_686_1613015068099.jpg',
        },
      ],
      variantStatus: 1,
      variantInventory: 14,
      variantUnitPrice: 50,
      variantAttributes: [
        { id: 827, name: 'ddr1' },
        { id: 830, name: '2gz' },
      ],
      variantMarketPlaceMerged: [{ marketPlaceVariantID: '9249', marketPlaceVariantSku: '45045622496', marketPlaceVariantType: 'shopee' }],
    },
    {
      variantID: 687,
      variantSKU: 'SKU-RAM-DDR3',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_687_1613015068468.jpg/1613015068851751',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_687_1613015068468.jpg',
        },
      ],
      variantStatus: 1,
      variantInventory: 16,
      variantUnitPrice: 60,
      variantAttributes: [
        { id: 828, name: 'ddr2' },
        { id: 829, name: '1gz' },
      ],
      variantMarketPlaceMerged: null,
    },
    {
      variantID: 688,
      variantSKU: 'SKU-RAM-DDR4',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_688_1613015068841.jpg/1613015069128615',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_688_1613015068841.jpg',
        },
      ],
      variantStatus: 1,
      variantInventory: 18,
      variantUnitPrice: 70,
      variantAttributes: [
        { id: 828, name: 'ddr2' },
        { id: 830, name: '2gz' },
      ],
      variantMarketPlaceMerged: null,
    },
  ],
  ref: '2f1d17c2-1735-4c1d-9710-41fb8bdbeaec__p',
  images: [
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_505_1613015066986.jpg/1613015067679111',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_505_1613015066986.jpg',
    },
  ],
  marketPlaceProducts: [{ id: 2548, name: 'Ram RAM RAM RAM RAMR AR AMR AMRA', active: true, pageID: 344, productID: 505, marketPlaceID: '8946246750', marketPlaceType: 'shopee' }],
} as IProductByID;

const shopeeSellerID = 59575129;

const productSingle = {
  id: 507,
  name: 'Y Shirt',
  code: 'small-shirt-dd',
  description: '<p>',
  weight: '22.00',
  dimension: {
    length: 2,
    width: 3,
    height: 3,
  },
  dangerous: false,
  status: 2,
  tags: [
    {
      id: 700,
      name: 'Wiw',
      mainID: 885,
    },
    {
      id: 706,
      name: 'Shorts Formal',
      mainID: 882,
    },
  ],
  categories: [
    {
      id: 1545,
      name: 'rer4444',
      mainID: 912,
      subCatID: 1546,
    },
    {
      id: 1600,
      name: 'Formal Shirt',
      mainID: 908,
      subCatID: 1601,
    },
  ],
  variants: [
    {
      variantID: 697,
      variantSKU: 'SKU-704558432357',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg/1613473322930406',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg',
        },
      ],
      variantStatus: 1,
      variantInventory: 10,
      variantUnitPrice: 150,
      variantAttributes: [
        {
          id: 808,
          name: 'Green',
        },
      ],
      variantMarketPlaceMerged: [
        {
          marketPlaceVariantID: '8363',
          marketPlaceVariantSku: 'SKU-704558432357',
          marketPlaceVariantType: 'lazada',
        },
      ],
    },
    {
      variantID: 698,
      variantSKU: 'SKU-840454817024',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg/1613473323167616',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg',
        },
      ],
      variantStatus: 1,
      variantInventory: 100,
      variantUnitPrice: 100,
      variantAttributes: [
        {
          id: 804,
          name: 'Pink',
        },
      ],
      variantMarketPlaceMerged: [
        {
          marketPlaceVariantID: '8362',
          marketPlaceVariantSku: 'SKU-840454817024',
          marketPlaceVariantType: 'lazada',
        },
      ],
    },
    {
      variantID: 699,
      variantSKU: 'SKU-981610857778',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_699_1613473323035.jpg/1613473323602382',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_699_1613473323035.jpg',
        },
      ],
      variantStatus: 1,
      variantInventory: 204,
      variantUnitPrice: 50,
      variantAttributes: [
        {
          id: 805,
          name: 'Yello',
        },
      ],
      variantMarketPlaceMerged: null,
    },
  ],
  ref: '65492a77-b172-40e4-82c6-2d04444aeff1__p',
  images: [
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg/1613473322474155',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg',
    },
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png/1615196141863806',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png',
    },
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png/1615196494203081',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png',
    },
  ],
  marketPlaceProducts: [
    {
      id: 2209,
      name: 'Y Shirt1',
      active: true,
      pageID: 344,
      productID: 507,
      marketPlaceID: '2225588178',
      marketPlaceType: 'lazada',
    },
  ],
} as IProductByID;
const productMultiple = {
  id: 504,
  name: 'Ram for',
  code: 'Ram-more',
  description: '<p>Ram for everyone 333</p>',
  weight: '2.00',
  dimension: {
    length: 23,
    height: 43,
    width: 34,
  },
  dangerous: false,
  status: 1,
  tags: [
    {
      id: 703,
      name: 'Ram',
      mainID: 878,
    },
    {
      id: 704,
      name: 'computer parts',
      mainID: 879,
    },
  ],
  categories: [
    {
      id: 1596,
      name: 'Computer parts',
      mainID: 901,
      subCatID: null,
    },
    {
      id: 1596,
      name: 'Ram',
      mainID: 900,
      subCatID: 1597,
    },
  ],
  variants: [
    {
      variantID: 683,
      variantSKU: 'SKU-1464850570280',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg/1612860047349201',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg',
        },
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546459.jpg/1614832547020957',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546459.jpg',
        },
      ],
      variantStatus: 1,
      variantInventory: 55,
      variantUnitPrice: 100,
      variantAttributes: [
        {
          id: 827,
          name: 'ddr1',
        },
      ],
      variantMarketPlaceMerged: [
        {
          marketPlaceVariantID: '8364',
          marketPlaceVariantSku: 'SKU-1464850570280',
          marketPlaceVariantType: 'lazada',
        },
      ],
    },
    {
      variantID: 684,
      variantSKU: 'SKU-776431278942',
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg/1612860047608564',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
        },
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg/1614832547258598',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
        },
      ],
      variantStatus: 1,
      variantInventory: 100,
      variantUnitPrice: 200,
      variantAttributes: [
        {
          id: 828,
          name: 'ddr2',
        },
      ],
      variantMarketPlaceMerged: [
        {
          marketPlaceVariantID: '8365',
          marketPlaceVariantSku: 'SKU-776431278942',
          marketPlaceVariantType: 'lazada',
        },
      ],
    },
  ],
  ref: 'e03a2c7a-50e4-4e08-af61-724e59716830__p',
  images: [
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg/1612860046991605',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg',
    },
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546610.jpg/1614832547047540',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546610.jpg',
    },
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546920.jpg/1614832547264817',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546920.jpg',
    },
  ],
  marketPlaceProducts: [
    {
      id: 2211,
      name: 'Ram for ppl',
      active: true,
      pageID: 344,
      productID: 504,
      marketPlaceID: '2225783726',
      marketPlaceType: 'lazada',
    },
    {
      id: 2210,
      name: 'Ram for ppl',
      active: true,
      pageID: 344,
      productID: 504,
      marketPlaceID: '2225702987',
      marketPlaceType: 'lazada',
    },
  ],
} as IProductByID;
const product = {
  id: 507,
  name: 'Shirts small',
  code: 'small-shirt-dd',
  description: '<p>Shirt for all</p>',
  weight: '2',
  ref: '65492a77-b172-40e4-82c6-2d04444aeff1__p',
  images: [
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg/1613473322474155',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg',
    },
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/blue_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1614767312861.jpg/1614767313430652',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/blue_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1614767312861.jpg',
    },
  ],
  dimension: { length: 22, height: 32, width: 32 },
  dangerous: false,
  status: 1,
  tags: [{ mainID: 882, id: 706, name: 'Shorts Formal' }],
  categories: [{ mainID: 908, id: 1600, name: 'Formal Shirt', subCatID: 1601 }],
  variants: [
    {
      variantID: 697,
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg/1613473322930406',
          selfLink: null,
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg',
          bucket: null,
        },
      ],
      variantInventory: 55,
      variantSKU: 'SKU-704558432357',
      variantStatus: 1,
      variantAttributes: [{ id: 808, name: 'Green' }],
      variantMarketPlaceMerged: null,
      variantUnitPrice: 30,
      productID: null,
    },
    {
      variantID: 698,
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg/1613473323167616',
          selfLink: null,
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg',
          bucket: null,
        },
      ],
      variantInventory: 102,
      variantSKU: 'SKU-840454817024',
      variantStatus: 1,
      variantAttributes: [{ id: 804, name: 'Pink' }],
      variantMarketPlaceMerged: null,
      variantUnitPrice: 40,
      productID: null,
    },
    {
      variantID: 699,
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_699_1613473323035.jpg/1613473323602382',
          selfLink: null,
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_699_1613473323035.jpg',
          bucket: null,
        },
      ],
      variantInventory: 204,
      variantSKU: 'SKU-981610857778',
      variantStatus: 1,
      variantAttributes: [{ id: 805, name: 'Yello' }],
      variantMarketPlaceMerged: null,
      variantUnitPrice: 50,
      productID: null,
    },
  ],
} as IProductByID;
PlusmarService.environment = { ...environmentLib, pageKey: 'facebook012' };
jest.mock('@reactor-room/itopplus-back-end-helpers');
PlusmarService.readerClient = {} as unknown as Pool;
PlusmarService.writerClient = {} as unknown as Pool;

const lazadaApiData = {
  data: {
    total_products: 1,
    products: [
      {
        created_time: '1608274736000',
        updated_time: '1608547542000',
        skus: [
          {
            Status: 'active',
            quantity: 100,
            _compatible_variation_: 'Pink',
            Images: ['https://th-live.slatic.net/p/mdc/d1a7445d0d10c4583258e8452073c2cf.png'],
            SellerSku: 'PenSKU-Pink',
            ShopSku: '1860376611_TH-5716102477',
            Url: 'https://www.lazada.co.th/-i1860376611-s5716102477.html',
            multiWarehouseInventories: [
              {
                quantity: 100,
                warehouseCode: 'dropshipping',
              },
            ],
            package_width: '1.00',
            color_family: 'Pink',
            package_height: '10.00',
            special_price: 0,
            price: 1111,
            package_length: '1.00',
            package_weight: '0.1',
            SkuId: 5716102477,
          },
          {
            Status: 'active',
            quantity: 40,
            _compatible_variation_: 'Yellow',
            Images: ['https://th-live.slatic.net/p/mdc/ae2ac4c9fffef123045520e4477b4d31.png'],
            SellerSku: 'PenSKU-Yellow',
            ShopSku: '1860376611_TH-5716102476',
            Url: 'https://www.lazada.co.th/-i1860376611-s5716102476.html',
            multiWarehouseInventories: [
              {
                quantity: 40,
                warehouseCode: 'dropshipping',
              },
            ],
            package_width: '1.00',
            color_family: 'Yellow',
            package_height: '10.00',
            special_price: 0,
            price: 20000,
            package_length: '1.00',
            package_weight: '0.1',
            SkuId: 5716102476,
          },
          {
            Status: 'active',
            quantity: 143,
            _compatible_variation_: 'Red',
            Images: ['https://th-live.slatic.net/p/bb4f090f9aa8802c5bb402e3438b8636.png'],
            SellerSku: 'PenSKU-Red',
            ShopSku: '1860376611_TH-5716102475',
            Url: 'https://www.lazada.co.th/-i1860376611-s5716102475.html',
            multiWarehouseInventories: [
              {
                quantity: 143,
                warehouseCode: 'dropshipping',
              },
            ],
            package_width: '1.00',
            color_family: 'Red',
            package_height: '10.00',
            special_price: 0,
            price: 8888,
            package_length: '1.00',
            package_weight: '0.1',
            SkuId: 5716102475,
          },
          {
            Status: 'active',
            quantity: 50,
            _compatible_variation_: 'Green',
            Images: ['https://th-live.slatic.net/p/mdc/1bee00143ce0f24386de82238afa90a6.png'],
            SellerSku: 'PenSKU-Green',
            ShopSku: '1860376611_TH-5716102474',
            Url: 'https://www.lazada.co.th/-i1860376611-s5716102474.html',
            multiWarehouseInventories: [
              {
                quantity: 50,
                warehouseCode: 'dropshipping',
              },
            ],
            package_width: '1.00',
            color_family: 'Green',
            package_height: '10.00',
            special_price: 0,
            price: 60000,
            package_length: '1.00',
            package_weight: '0.1',
            SkuId: 5716102474,
          },
        ],
        item_id: 1860376611,
        primary_category: 12153,
        attributes: {
          name: 'Ball pen',
          description: '<p style="margin: 0;padding: 8.0px 0;white-space: pre-wrap;"><span style="font-family: none;">Very nice pens</span></p>',
          stationery_pen_type: '216038',
          brand: 'Local',
          Hazmat: '[103256]',
          source: 'asc',
        },
      },
    ],
  },
  code: '0',
  request_id: '0be6e59416125150229545431',
};

const lazadaMarketVariants = [
  {
    id: 4158,
    productMarketPlaceID: '976',
    product_variant_id: null,
    sku: 'PenSKU-Yellow',
    name: 'Yellow',
    pageID: 344,
    unitPrice: '20000.00',
    inventory: '47',
    marketPlaceType: 'lazada',
    variantJson: '',
  },
  {
    id: 4159,
    productMarketPlaceID: '976',
    product_variant_id: null,
    sku: 'PenSKU-Red',
    name: 'Red',
    pageID: 344,
    unitPrice: '8888.00',
    inventory: '143',
    marketPlaceType: 'lazada',
    variantJson: '',
  },
  {
    id: 4160,
    productMarketPlaceID: '976',
    product_variant_id: null,
    sku: 'PenSKU-Green',
    name: 'Green',
    pageID: 344,
    unitPrice: '60000.00',
    inventory: '56',
    marketPlaceType: 'lazada',
    variantJson: '',
  },
  {
    id: 4157,
    productMarketPlaceID: '976',
    product_variant_id: '661',
    sku: 'PenSKU-Pink',
    name: 'Pink',
    pageID: 344,
    unitPrice: '1111.00',
    inventory: '90',
    marketPlaceType: 'lazada',
    variantJson: '',
  },
];

const categoryTree: ILazadaCategoryTreeItem[] = [
  {
    children: [
      {
        children: [],
        var: false,
        name: 'Disposables',
        leaf: false,
        category_id: 10100180,
      },
    ],
    var: false,
    name: 'Kitchen & Dining',
    leaf: false,
    category_id: 11832,
  },
];

const thirdPartyMarketPlaceLazada = [
  {
    id: 137,
    pageID: 344,
    sellerID: '100189392074',
    name: 'Khappom Shop',
    picture: '',
    url: 'https://www.lazada.co.th/shop/khappom-shop',
    sellerPayload: 'asdasda',
    accessToken: '50000400331bcqpacUzjrgqoszsqcc0l0Fhq9TQFaGA13c61510qflWvcRqMCret',
    accessTokenExpire: '2021-02-11 09:02:35',
    pageType: SocialTypes.LAZADA,
    refreshToken: '50001401831wJ5ratTHccAyipvzdihLm2GqtjEYlsTA106d8e10KQwUnmh87KXHd',
    refreshTokenExpire: '2021-03-06 09:03:35',
    updatedAt: new Date(),
    payload: '1',
  },
];

const thirdPartyMarketPlaceShopee = [
  {
    id: 162,
    pageID: 344,
    sellerID: '220286429',
    name: null,
    picture: null,
    url: null,
    accessToken: 'a9df9d7fa8ee5f8f6063ce615936c89c',
    accessTokenExpire: '2021-03-18 16:03:40',
    pageType: 'shopee',
    refreshToken: 'e2b26d8cac376075a30bff5a30817c72',
    refreshTokenExpire: '2021-04-17 12:04:40',
    updatedAt: new Date(),
    payload: '',
    access_token: 'f1d908c50160363318835dcf05f6e1e14de78c3fef8cdc2a6488739eca9389761f06e3ce96fa633d',
    expire_in: '',
    sellerPayload: '',
    refresh_token: '214dfa00f6409c968f150ca4b280695b55a1a2f2c5653d812000b63700d82aab1f06e3ce96fa633d',
  },
];

const lazadaEnv = environmentLib.lazada;
const moreProductForShopee = {
  id: 507,
  name: 'Shirts',
  code: 'small-shirt-dd',
  description: 'desc',
  weight: '2',
  ref: '65492a77-b172-40e4-82c6-2d04444aeff1__p',
  images: [
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg/1613473322474155',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg',
    },
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png/1615196141863806',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png',
    },
    {
      id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png/1615196494203081',
      mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png',
    },
  ],
  dimension: { length: 2, height: 120, width: 20 },
  dangerous: false,
  status: 1,
  tags: [
    { mainID: 885, id: 700, name: 'Wiw' },
    { mainID: 882, id: 706, name: 'Shorts Formal' },
  ],
  categories: [
    { mainID: 912, id: 1545, name: 'rer4444', subCatID: 1546 },
    { mainID: 908, id: 1600, name: 'Formal Shirt', subCatID: 1601 },
  ],
  variants: [
    {
      variantID: 697,
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg/1613473322930406',
          selfLink: null,
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg',
          bucket: null,
        },
      ],
      variantInventory: 10,
      variantSKU: 'SKU-704558432357',
      variantStatus: 1,
      variantAttributes: [{ id: 808, name: 'Green' }],
      variantMarketPlaceMerged: null,
      variantUnitPrice: 2000,
      productID: null,
    },
    {
      variantID: 698,
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg/1613473323167616',
          selfLink: null,
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg',
          bucket: null,
        },
      ],
      variantInventory: 10,
      variantSKU: 'SKU-840454817024',
      variantStatus: 1,
      variantAttributes: [{ id: 804, name: 'Pink' }],
      variantMarketPlaceMerged: null,
      variantUnitPrice: 2500,
      productID: null,
    },
    {
      variantID: 699,
      variantImages: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_699_1613473323035.jpg/1613473323602382',
          selfLink: null,
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_699_1613473323035.jpg',
          bucket: null,
        },
      ],
      variantInventory: 20,
      variantSKU: 'SKU-981610857778',
      variantStatus: 1,
      variantAttributes: [{ id: 805, name: 'Yello' }],
      variantMarketPlaceMerged: null,
      variantUnitPrice: 3500,
      productID: null,
    },
  ],
  marketPlaceProducts: null,
} as IProductByID;

const shopeeProductPayload = {
  productID: moreProductForShopee.id,
  categoryID: 6980,
  logistics:
    '[{"weight_limits":{"item_min_weight":0.001,"item_max_weight":300},"mask_channel_id":0,"item_max_dimension":{"width":200,"length":200,"unit":"cm","height":200},"logistic_name":"DHL Bulky","volume_limits":{"item_max_volume":1500000,"item_min_volume":5},"preferred":false,"has_cod":false,"sizes":[],"force_enabled":false,"enabled":false,"fee_type":"SIZE_INPUT","logistics_description":"เปิดใช้งานช่องทางการจัดส่งนี้หากคุณต้องการใช้บริการจาก DHL Bulky<br><br>\\n\\nการนัดรับสินค้า (Pickup) - คุณสามารถให้ DHL Bulky เข้ารับพัสดุจากบ้านของคุณและส่งตรงถึงผู้ซื้อ กรุณาตรวจสอบที่อยู่นัดรับสินค้าของคุณให้ถูกต้องและปริ้นท์ใบปะหน้าพัสดุจาก Shopee Seller Centre<br><br>\\n\\nน้ำหนักพัสดุสูงสุดที่สามารถจัดส่งได้ คือ 100 กก. ต่อกล่อง หรือ<br>\\nน้ำหนักตามปริมาตร [(กว้าง x ยาว x สูง)/5000] ไม่เกิน 300 กก.ต่อกล่อง<br>\\nขนาดพัสดุด้านใดด้านหนึ่ง (ความกว้าง ยาว หรือ สูง) ห้ามเกิน 200 ซม.<br>\\nขนาดพัสดุรวมสามด้าน(ความกว้าง + ยาว + สูง) ต้องไม่เกิน 600 ซม.<br><br>\\n\\nช่องทางการจัดส่งนี้รองรับการเก็บเงินปลายทาง<br>\\n*ไม่รองรับการจัดส่งเกิน 1 กล่อง ต่อหมายเลขคำสั่งซื้อ<br><br>\\n\\nหากมีข้อสอบถามเพิ่มเติม ท่านสามารถติดต่อ help@support.shopee.co.th หรือ โทร 020178399","logistic_id":70024,"is_allowed":true}]',
  variantIDs: [697, 698, 699],
  attributes: '[{"4360":"A 2","attribute_id":4360},{"4346":null,"attribute_id":4346}]',
};

const shopeeVariant = [
  {
    status: 'MODEL_NORMAL',
    original_price: 2000,
    update_time: 1616137893,
    set_content: [],
    price: 2000,
    variation_id: 5273471,
    discount_id: 0,
    create_time: 1616137893,
    name: 'Green',
    is_set_item: false,
    variation_sku: 'SKU-704558432357',
    reserved_stock: 0,
    stock: 10,
  },
];

const shopeeProduct = {
  status: 'NORMAL',
  original_price: 2000,
  update_time: 1616137893,
  package_width: 0,
  description: 'desc',
  weight: 2,
  views: 0,
  rating_star: 0,
  price: 2000,
  shopid: 220286429,
  sales: 0,
  discount_id: 0,
  images: ['https://cf.shopee.co.th/file/0be02499ac355aee2a919cfa12f0aeab'],
  create_time: 1616137893,
  likes: 0,
  wholesales: [],
  item_id: 100943846,
  logistics: [{ logistic_name: 'Buyer Self-Collect ผู้ซื้อไปรับสินค้าเอง', shipping_fee: 20, enabled: true, logistic_id: 79005, is_free: false }],
  tenures: [],
  condition: 'NEW',
  cmt_count: 0,
  package_height: 0,
  days_to_ship: 2,
  name: 'Shirts',
  currency: '',
  item_dangerous: 0,
  item_sku: 'small-shirt-dd',
  variations: [
    {
      status: 'MODEL_NORMAL',
      original_price: 2000,
      update_time: 1616137893,
      set_content: [],
      price: 2000,
      variation_id: 5273471,
      discount_id: 0,
      create_time: 1616137893,
      name: 'Green',
      is_set_item: false,
      variation_sku: 'SKU-704558432357',
      reserved_stock: 0,
      stock: 10,
    },
    {
      status: 'MODEL_NORMAL',
      original_price: 2500,
      update_time: 1616137893,
      set_content: [],
      price: 2500,
      variation_id: 5273472,
      discount_id: 0,
      create_time: 1616137893,
      name: 'Pink',
      is_set_item: false,
      variation_sku: 'SKU-840454817024',
      reserved_stock: 0,
      stock: 10,
    },
    {
      status: 'MODEL_NORMAL',
      original_price: 3500,
      update_time: 1616137893,
      set_content: [],
      price: 3500,
      variation_id: 5273473,
      discount_id: 0,
      create_time: 1616137893,
      name: 'Yello',
      is_set_item: false,
      variation_sku: 'SKU-981610857778',
      reserved_stock: 0,
      stock: 20,
    },
  ],
  is_2tier_item: false,
  size_chart: '',
  package_length: 0,
  video_info: {},
  is_pre_order: false,
  has_variation: true,
  attributes: [{ attribute_name: 'Brand A', is_mandatory: true, attribute_id: 4360, attribute_value: 'A 2', attribute_type: 'ENUM_TYPE' }],
  category_id: 6980,
  reserved_stock: 0,
  stock: 40,
};
const shopeeEnv = environmentLib.shopee;

const productAtShopee = {
  status: 'NORMAL',
  original_price: 40,
  update_time: 1619065736,
  package_width: 0,
  description: '<p>Ram is for everyonesfsfdksfkldsfkldsfklsdfklsdfkdsflsdfdsfsdfs</p>',
  weight: 3,
  views: 1,
  rating_star: 0,
  price: 40,
  shopid: 59575129,
  sales: 0,
  discount_id: 0,
  images: ['https://cf.shopee.co.th/file/f4593834fb08f174178ccfebdbf146b7'],
  create_time: 1619065736,
  likes: 0,
  wholesales: [],
  item_id: 8946246750,
  logistics: [
    {
      logistic_name: 'Standard Delivery - ส่งธรรมดาในประเทศ',
      is_free: false,
      estimated_shipping_fee: 30,
      logistic_id: 7000,
      enabled: true,
    },
  ],
  tenures: [],
  condition: 'NEW',
  cmt_count: 0,
  package_height: 0,
  days_to_ship: 2,
  name: 'Ram RAM RAM RAM RAMR AR AMR AMRA',
  currency: 'THB',
  item_dangerous: 0,
  item_sku: 'AWE001',
  variations: [
    {
      status: 'MODEL_NORMAL',
      original_price: 40,
      update_time: 1619065736,
      set_content: [],
      price: 40,
      variation_id: 45045622495,
      discount_id: 0,
      create_time: 1619065736,
      name: 'ddr1-1gz',
      is_set_item: false,
      variation_sku: 'SKU-RAM-DDR1',
      reserved_stock: 0,
      stock: 12,
    },
    {
      status: 'MODEL_NORMAL',
      original_price: 50,
      update_time: 1619065736,
      set_content: [],
      price: 50,
      variation_id: 45045622496,
      discount_id: 0,
      create_time: 1619065736,
      name: 'ddr1-2gz',
      is_set_item: false,
      variation_sku: 'SKU-RAM-DDR2',
      reserved_stock: 0,
      stock: 14,
    },
  ],
  is_2tier_item: false,
  size_chart: '',
  package_length: 0,
  video_info: {},
  is_pre_order: false,
  has_variation: true,
  attributes: [
    {
      attribute_name: 'ยี่ห้อ',
      is_mandatory: true,
      attribute_id: 9438,
      attribute_value: 'No Brand(ไม่มียี่ห้อ)',
      attribute_type: 'STRING_TYPE',
    },
  ],
  category_id: 10880,
  reserved_stock: 0,
  stock: 26,
};

const lazadaProduct = {
  total_products: 1,
  products: [
    {
      skus: [
        {
          Status: 'active',
          quantity: 323,
          _compatible_variation_: '...',
          Images: [],
          SellerSku: '1911436641-1608277908810-0',
          ShopSku: '1911436641_TH-6030554690',
          Url: 'https://www.lazada.co.th/-i1911436641-s6030554690.html',
          multiWarehouseInventories: [
            {
              quantity: 323,
              warehouseCode: 'dropshipping',
            },
          ],
          package_width: '33.00',
          package_height: '33.00',
          special_price: 0,
          price: 999999,
          package_length: '33.00',
          package_weight: '0.05',
          SkuId: 6030554690,
        },
      ],
      item_id: 1911436641,
      primary_category: 12118,
      attributes: {
        name: 'Hammer Thor 2',
        brand: 'Goodsmile',
        model: '4CCD',
      },
    },
  ],
} as unknown as IProductLazadaMainResponse;

const variants = [
  {
    SellerSku: '1',
    price: 1000,
    quantity: 2,
  },
  {
    SellerSku: '2',
    price: 1100,
    quantity: 3,
  },
] as IProductLazadaVariantResponse[];

describe('Product marketplace service', () => {
  beforeEach(() => {
    productMarketPlaceService = new ProductMarketPlaceService();
  });

  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));

  test('merge shopee variant mergeShopeeVariantUpdatePriceOrInventory -> mergeShopeeVariants ', async () => {
    const params = { id: 683, marketIDs: [19272], mergeType: MergeMarketPlaceType.VARIANT };
    const productVariant = {
      id: 683,
      productName: 'RAM - LOCAL',
      productID: 504,
      attributeName: 'ddr1',
      sku: 'SKU-RAM1',
      unitPrice: 31,
      inventory: 180,
    } as IProductVariantByID;
    const shopeeMarketPlaceProducts = [
      {
        id: 19272,
        productMarketPlaceID: '7099',
        marketPlaceVariantID: '77154903076',
        productVariantID: null,
        sku: 'SKU-RAM1',
        name: 'ddr1',
        pageID: 344,
        unitPrice: 32,
        inventory: '180',
        marketPlaceType: 'shopee',
        variantJson: '',
      },
    ] as unknown as IProductMarketPlaceVariant[];
    mock(
      productMarketPlaceService,
      'mergeShopeeVariantUpdatePriceOrInventory',
      jest.fn().mockResolvedValueOnce(MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS),
    );
    const response = { status: 200, value: SocialTypes.SHOPEE, expiresAt: MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS };
    const result = await productMarketPlaceService.mergeShopeeVariants(pageID, shopeeMarketPlaceProducts, productVariant, params, shopeeEnv);
    expect(response).toEqual(result);
    expect(productMarketPlaceService.mergeShopeeVariantUpdatePriceOrInventory).toBeCalledWith(pageID, shopeeMarketPlaceProducts[0], productVariant, params, shopeeEnv);

    expect(data.updateMarketPlaceVariantByProductVariantID).not.toBeCalled();
  });

  test('market place product list -> getProductMarketPlaceList', async () => {
    const params = {
      isImported: true,
      filters: {
        search: '',
        currentPage: 1,
        pageSize: 10,
        orderBy: ['updated_at'],
        orderMethod: 'desc',
        dropDownID: null,
      },
    };

    const productData = [
      {
        id: 221,
        marketPlaceID: '1910902040',
        name: 'digimon02',
        marketPlaceType: 'lazada',
        variants: 1,
        active: true,
        inventory: 1,
        price: '฿150.00 - 150.00',
        updated_at: '2021-01-18 11:02:42',
        totalRows: 14,
      },
    ];

    mock(data, 'getProductMarketPlaceList', jest.fn().mockResolvedValueOnce(productData));

    const result = await productMarketPlaceService.getProductMarketPlaceList(pageID, params);
    expect(result).toEqual(productData);
  });

  test('get product from lazada marketplace success -> getProductFromLazada', async () => {
    mock(datapage, 'getPageThirdPartyByPageType', jest.fn().mockReturnValue({ accessToken: 'access' }));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValue('access'));
    mock(lazadaAPI, 'getProductFromLazadaApi', jest.fn().mockReturnValue({ data: { code: '0', products: [{ data: 'data' }], total_products: 1 } }));
    mock(helperPlusmar, 'getLazadaRequestResult', jest.fn().mockReturnValue({ status: 200, value: 'true' }));
    mock(productMarketPlaceService, 'processLazadaProduct', jest.fn().mockReturnValue({}));
    const result = await productMarketPlaceService.getProductFromLazada(pageID, lazadaEnv);
    expect(result).toEqual({ status: 200, value: 'true' });
    expect(datapage.getPageThirdPartyByPageType).toBeCalled();
    expect(helpers.cryptoDecode).toBeCalled();
    expect(lazadaAPI.getProductFromLazadaApi).toBeCalled();
    expect(helperPlusmar.getLazadaRequestResult).toBeCalled();
    expect(productMarketPlaceService.processLazadaProduct).toBeCalled();
  });

  test('get product from lazada marketplace access code not availabe -> getProductFromLazada', async () => {
    const response = { status: 403, value: 'LAZADA_MARKETPLACE_NOT_CONNECTED' };
    mock(datapage, 'getPageThirdPartyByPageType', jest.fn().mockReturnValue({ accessToken: undefined }));

    const result = await productMarketPlaceService.getProductFromLazada(pageID, lazadaEnv);
    expect(result).toEqual(response);
    expect(datapage.getPageThirdPartyByPageType).toBeCalled();
  });

  test('get product from lazada marketplace throw error -> getProductFromLazada', async () => {
    const response = { status: 403 };
    const result = await productMarketPlaceService.getProductFromLazada(null, null);
    expect(result).toMatchObject(response);
  });

  test('process product from lazada marketplace -> processLazadaProduct', async () => {
    mock(productMarketPlaceService, 'addLazadaProduct', jest.fn().mockReturnValue({ id: 1 }));

    await productMarketPlaceService.processLazadaProduct(pageID, lazadaProduct);
    expect(PostgresHelper.execBeginBatchTransaction).toBeCalled();
    expect(productMarketPlaceService.addLazadaProduct).toBeCalled();
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalled();
  });

  test('add lazada marketplace product -> addLazadaProduct', async () => {
    mock(data, 'addProductMarketPlace', jest.fn().mockResolvedValue({ id: 1 }));
    await productMarketPlaceService.addLazadaProduct(pageID, lazadaProduct.products, lazadaProduct.total_products, SocialTypes.LAZADA, PlusmarService.readerClient);
    expect(data.addProductMarketPlace).toBeCalledTimes(lazadaProduct.products.length);
  });

  test('add lazada marketplace product -> addLazadaVariantProduct', async () => {
    mock(helpers, 'getLazadaResponseVariantName', jest.fn().mockResolvedValue('N/A'));
    mock(data, 'addProductMarketPlaceVariants', jest.fn().mockResolvedValue({}));
    const name = '';
    await productMarketPlaceService.addLazadaVariantProduct(pageID, name, variants, 2, SocialTypes.LAZADA, PlusmarService.readerClient);
    expect(helpers.getLazadaResponseVariantName).toHaveBeenNthCalledWith(1, variants[0], '');
    expect(helpers.getLazadaResponseVariantName).toHaveBeenNthCalledWith(2, variants[1], '');

    expect(helpers.getLazadaResponseVariantName).toBeCalledTimes(variants.length);
    expect(data.addProductMarketPlaceVariants).toBeCalledTimes(variants.length);
  });

  test('import product from marketplace -> importDeleteProductFromMarketPlace', async () => {
    const response = { status: 200, value: true };
    mock(data, 'importProductFromMarketPlace', jest.fn().mockReturnValue(response));
    const result = await productMarketPlaceService.importDeleteProductFromMarketPlace(pageID, [1], CRUD_MODE.IMPORT);
    expect(result).toEqual(response);
    expect(data.importProductFromMarketPlace).toBeCalled();
  });

  test('delete product from marketplace -> importDeleteProductFromMarketPlace', async () => {
    const response = { status: 200, value: true };
    mock(data, 'deleteProductFromMarketPlace', jest.fn().mockReturnValue(response));
    await productMarketPlaceService.importDeleteProductFromMarketPlace(pageID, [1], CRUD_MODE.DELETE);
    expect(data.deleteProductFromMarketPlace).toBeCalled();
  });

  test('product marketplace variants -> getProductMarketPlaceVariantList', async () => {
    const isMerged = false;
    const marketPlaceId = 223;
    const result = [
      {
        id: 951,
        productMarketPlaceID: '223',
        name: 'Brown',
        unitPrice: 44554,
        inventory: 45,
        marketPlaceType: 'lazada',
        active: true,
      },
    ];
    mock(data, 'getProductMarketPlaceVariantList', jest.fn().mockReturnValue(result));
    const response = await productMarketPlaceService.getProductMarketPlaceVariantList(pageID, [marketPlaceId], isMerged);
    expect(response).toEqual(result);
    expect(data.getProductMarketPlaceVariantList).toBeCalled();
  });

  test('called merge product -> mergeMarketPlaceProductOrVariant', async () => {
    await productMarketPlaceService.mergeMarketPlaceProductOrVariant(pageID, { id: 1, marketIDs: [1, 2, 3], mergeType: MergeMarketPlaceType.PRODUCT }, { lazadaEnv, shopeeEnv });

    expect(data.updateMarketPlaceProductByProductID).toBeCalled();
  });

  test('called merge product variants -> mergeMarketPlaceProductOrVariant', async () => {
    mock(productMarketPlaceService, 'mergeMarketPlaceVariant', jest.fn().mockReturnValue({}));
    await productMarketPlaceService.mergeMarketPlaceProductOrVariant(pageID, { id: 1, marketIDs: [1], mergeType: MergeMarketPlaceType.VARIANT }, { lazadaEnv, shopeeEnv });
    expect(productMarketPlaceService.mergeMarketPlaceVariant).toBeCalled();
  });

  test('merge product variants shopee-> mergeMarketPlaceVariant', async () => {
    const params = { id: 683, marketIDs: [19011, 19015], mergeType: MergeMarketPlaceType.VARIANT };
    const marketVariant = [
      {
        id: 19015,
        productMarketPlaceID: '6997',
        marketPlaceVariantID: null,
        product_variant_id: null,
        sku: 'SKU-RAM1',
        name: 'mmmmmmRAM live 01-ddr1',
        pageID: 344,
        unitPrice: '30.00',
        inventory: '180',
        marketPlaceType: 'lazada',
        variantJson: '',
      },
      {
        id: 19011,
        productMarketPlaceID: '6994',
        marketPlaceVariantID: '77154903076',
        product_variant_id: null,
        sku: 'SKU-RAM1',
        name: 'ddr1',
        pageID: 344,
        unitPrice: '30.00',
        inventory: '180',
        marketPlaceType: 'shopee',
        variantJson: '',
      },
    ];
    const lazadaProducts = [
      {
        id: 19015,
        productMarketPlaceID: '6997',
        marketPlaceVariantID: null,
        product_variant_id: null,
        sku: 'SKU-RAM1',
        name: 'mmmmmmRAM live 01-ddr1',
        pageID: 344,
        unitPrice: '30.00',
        inventory: '180',
        marketPlaceType: 'lazada',
        variantJson: '',
      },
    ];
    const shopeeProducts = [
      {
        id: 19011,
        productMarketPlaceID: '6994',
        marketPlaceVariantID: '77154903076',
        product_variant_id: null,
        sku: 'SKU-RAM1',
        name: 'ddr1',
        pageID: 344,
        unitPrice: '30.00',
        inventory: '180',
        marketPlaceType: 'shopee',
        variantJson: '',
      },
    ];
    const productVariant = {
      id: 683,
      productName: 'RAM - LOCAL',
      productID: 504,
      attributeName: 'ddr1',
      sku: 'SKU-RAM1',
      unitPrice: '30.00',
      inventory: 180,
    };
    const response = [
      { status: 200, value: 'lazada' },
      { status: 200, value: 'shopee' },
    ];

    mock(data, 'getMultipleMarketPlaceVariant', jest.fn().mockResolvedValue(marketVariant));

    mock(data, 'getVariantByID', jest.fn().mockResolvedValue(productVariant));
    mock(productMarketPlaceService, 'mergeLazadaVariants', jest.fn().mockResolvedValue(response[0]));
    mock(productMarketPlaceService, 'mergeShopeeVariants', jest.fn().mockResolvedValue(response[1]));
    const result = await productMarketPlaceService.mergeMarketPlaceVariant(344, params, { lazadaEnv, shopeeEnv });

    expect(result).toEqual(response);
    expect(data.getMultipleMarketPlaceVariant).toBeCalled();
    expect(data.getVariantByID).toBeCalled();
    expect(productMarketPlaceService.mergeShopeeVariants).toBeCalled();
    expect(productMarketPlaceService.mergeLazadaVariants).toBeCalled();
  });

  test('merge product variants error-> mergeMarketPlaceVariant', async () => {
    const response = [{ status: 403, value: false }];
    const result = await productMarketPlaceService.mergeMarketPlaceVariant(344, null, { lazadaEnv, shopeeEnv });
    expect(result).toEqual(response);
  });

  test('merge variant when  and price match  -> mergeLazadaVariants', async () => {
    const response = { status: 200, value: SocialTypes.LAZADA, expiresAt: MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS };

    const productVariant = {
      id: 663,
      productName: 'Ball Pen More',
      attributeName: 'Red',
      sku: 'SKU-107950476942',
      unitPrice: 8881.0,
      inventory: 100,
    } as IProductVariantByID;
    const mergeParams = { id: 663, marketIDs: [959], mergeType: 'VARIANT' } as IMergeMarketPlaceProductParams;
    const lazadaProduct = [
      {
        id: 959,
        productMarketPlaceID: 226,
        sku: 'PenSKU-Red',
        name: 'Red',
        pageID: 344,
        unitPrice: 8881.0,
        inventory: 100,
        marketPlaceType: 'lazada',
        variantJson: '{}',
      },
    ] as IProductMarketPlaceVariant[];
    mock(data, 'updateMarketPlaceVariantByProductVariantID', jest.fn().mockReturnValue(response));
    const result = await productMarketPlaceService.mergeLazadaVariants(pageID, lazadaProduct, productVariant, mergeParams, lazadaEnv);
    expect(result).toEqual(response);
    expect(data.updateMarketPlaceVariantByProductVariantID).toBeCalled();
  });

  test('merge variant when inventory market update and variant update fail  -> mergeLazadaVariantUpdatePriceOrInventory', async () => {
    const productVariant = {
      id: 663,
      productName: 'Ball Pen More',
      attributeName: 'Red',
      sku: 'SKU-107950476942',
      unitPrice: 8881.0,
      inventory: 101,
    } as IProductVariantByID;
    const mergeParams = { id: 663, marketIDs: [959], mergeType: 'VARIANT' } as IMergeMarketPlaceProductParams;
    const lazadaProduct = [
      {
        id: 959,
        productMarketPlaceID: 226,
        sku: 'PenSKU-Red',
        name: 'Red',
        pageID: 344,
        unitPrice: 8888.0,
        inventory: 100,
        marketPlaceType: 'lazada',
        variantJson: '{}',
      },
    ] as IProductMarketPlaceVariant[];
    mock(lazadaAPI, 'updateInventoryPriceOnLazadaApi', jest.fn().mockReturnValue({ status: 403, value: 'false' }));
    const result = await productMarketPlaceService.mergeLazadaVariantUpdatePriceOrInventory(pageID, lazadaProduct[0], productVariant, mergeParams, lazadaEnv);
    expect(result).toEqual(MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_FAIL_VARIANT_MERGE_FAIL);
    expect(lazadaAPI.updateInventoryPriceOnLazadaApi).toBeCalled();
  });

  test('merge variant when inventory market update success and variant update fail  -> mergeLazadaVariantUpdatePriceOrInventory', async () => {
    const productVariant = {
      id: 663,
      productName: 'Ball Pen More',
      attributeName: 'Red',
      sku: 'SKU-107950476942',
      unitPrice: 8881.0,
      inventory: 101,
    } as IProductVariantByID;
    const mergeParams = { id: 663, marketIDs: [959], mergeType: 'VARIANT' } as IMergeMarketPlaceProductParams;
    const lazadaProduct = [
      {
        id: 959,
        productMarketPlaceID: 226,
        sku: 'PenSKU-Red',
        name: 'Red',
        pageID: 344,
        unitPrice: 8888.0,
        inventory: 100,
        marketPlaceType: 'lazada',
        variantJson: '{}',
      },
    ] as IProductMarketPlaceVariant[];

    mock(lazadaAPI, 'updateInventoryPriceOnLazadaApi', jest.fn().mockReturnValue({ status: 200, value: 'true' }));
    mock(data, 'updateMarketPlaceVariantByProductVariantID', jest.fn().mockRejectedValue(new Error('ERROR_UPDATING_PRODUCT_VARIANT_AT_MARKETPLACE')));
    const result = await productMarketPlaceService.mergeLazadaVariantUpdatePriceOrInventory(pageID, lazadaProduct[0], productVariant, mergeParams, lazadaEnv);
    expect(result).toEqual(MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_UPDATE_FAIL);
    expect(lazadaAPI.updateInventoryPriceOnLazadaApi).toBeCalled();
    expect(data.updateMarketPlaceVariantByProductVariantID).toBeCalled();
  });

  test('merge variant when inventory market update and variant update success  -> mergeLazadaVariants', async () => {
    const productVariant = {
      id: 663,
      productName: 'Ball Pen More',
      attributeName: 'Red',
      sku: 'SKU-107950476942',
      unitPrice: 8881.0,
      inventory: 101,
    } as IProductVariantByID;
    const mergeParams = { id: 663, marketIDs: [959], mergeType: 'VARIANT' } as IMergeMarketPlaceProductParams;
    const lazadaProduct = [
      {
        id: 959,
        productMarketPlaceID: 226,
        sku: 'PenSKU-Red',
        name: 'Red',
        pageID: 344,
        unitPrice: 8888.0,
        inventory: 100,
        marketPlaceType: 'lazada',
        variantJson: '{}',
      },
    ] as IProductMarketPlaceVariant[];

    mock(lazadaAPI, 'updateInventoryPriceOnLazadaApi', jest.fn().mockResolvedValue({ status: 200, value: 'true' }));
    mock(data, 'updateMarketPlaceVariantByProductVariantID', jest.fn().mockResolvedValue({}));
    const result = await productMarketPlaceService.mergeLazadaVariantUpdatePriceOrInventory(pageID, lazadaProduct[0], productVariant, mergeParams, lazadaEnv);
    expect(result).toEqual(MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS);
    expect(lazadaAPI.updateInventoryPriceOnLazadaApi).toBeCalled();
    expect(data.updateMarketPlaceVariantByProductVariantID).toBeCalled();
  });

  test('unmerge product variant success -> unMergeVariant', async () => {
    const pageID = 1;
    const marketIDs = [1];
    const result = { status: 200, value: true };
    mock(data, 'updateMarketPlaceVariantByProductVariantID', jest.fn().mockReturnValue(result));

    const response = await productMarketPlaceService.unMergeVariant(pageID, marketIDs, PlusmarService.readerClient);
    expect(response).toEqual(result);
    expect(data.updateMarketPlaceVariantByProductVariantID).toBeCalled();
  });

  test('unmerge product variant fail -> unMergeVariant', async () => {
    const result = { status: 403, value: false };
    mock(data, 'updateMarketPlaceVariantByProductVariantID', jest.fn().mockRejectedValue(new Error('error')));

    const response = await productMarketPlaceService.unMergeVariant(null, null, null);
    expect(response).toEqual(result);
    expect(data.updateMarketPlaceVariantByProductVariantID).toBeCalled();
  });

  test('unmerge product if variant item exists success -> unMergeProduct', async () => {
    const unMergeItem = [{ mergedMarketPlaceID: 481, mergedMarketPlaceType: 'lazada' }] as IMergedProductData[];
    const marketPlaceVariant = [
      {
        id: 2055,
      },
    ] as IProductMarketPlaceVariantList[];
    const result = { status: 200, value: 'true' };
    mock(productMarketPlaceService, 'getProductMarketPlaceVariantList', jest.fn().mockReturnValue(marketPlaceVariant));
    mock(productMarketPlaceService, 'unMergeVariant', jest.fn().mockReturnValue({}));
    mock(data, 'updateMarketPlaceProductByProductID', jest.fn().mockReturnValue({}));

    const response = await productMarketPlaceService.unMergeProduct(pageID, unMergeItem);
    expect(response).toEqual(result);

    expect(PostgresHelper.execBeginBatchTransaction).toBeCalled();
    expect(productMarketPlaceService.getProductMarketPlaceVariantList).toBeCalled();
    expect(productMarketPlaceService.unMergeVariant).toBeCalled();
    expect(data.updateMarketPlaceProductByProductID).toBeCalled();
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalled();
  });

  test('unmerge product if variant item not exists success -> unMergeProduct', async () => {
    const unMergeItem = [{ mergedMarketPlaceID: 481, mergedMarketPlaceType: 'lazada' }] as IMergedProductData[];
    const marketPlaceVariant = [] as IProductMarketPlaceVariantList[];
    const result = { status: 200, value: 'true' };
    mock(productMarketPlaceService, 'getProductMarketPlaceVariantList', jest.fn().mockReturnValue(marketPlaceVariant));
    mock(data, 'updateMarketPlaceProductByProductID', jest.fn().mockReturnValue({}));

    const response = await productMarketPlaceService.unMergeProduct(pageID, unMergeItem);
    expect(response).toEqual(result);

    expect(PostgresHelper.execBeginBatchTransaction).toBeCalled();
    expect(productMarketPlaceService.getProductMarketPlaceVariantList).toBeCalled();
    expect(data.updateMarketPlaceProductByProductID).toBeCalled();
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalled();
  });

  test('unmerge product fail -> unMergeProduct', async () => {
    const result = { status: 403, value: 'false' };
    const response = await productMarketPlaceService.unMergeProduct(null, null);
    expect(response).toEqual(result);
  });

  test('get order Items from Lazada  -> getOrderItemsLazada', async () => {
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    const orders = [
      {
        order_id: 100,
        order_number: 100,
        price: '1000',
        payment_method: 'COD',
        statuses: ['pending'],
        items_count: 1,
      },
    ] as ILazadaOrdersReponse[];

    const response = [
      {
        sku: 'PenSKU-Yellow',
        reason: '',
        shop_sku: 'PenSKU-Yellow',
        item_price: 1000,
      },
    ];
    mock(lazadaAPI, 'getOrderItemsFromLazadaApi', jest.fn().mockResolvedValue({ data: response[0] }));

    const result = await productMarketPlaceService.getOrderItemsLazada(accessToken, orders, lazadaEnv);

    expect(response).toEqual(result);
    expect(lazadaAPI.getOrderItemsFromLazadaApi).toBeCalled();
  });

  test('get page market details with no refresh token -> getPageMarketToUpdateInventory', async () => {
    mock(helpers, 'validateThirdPartyTokenExpireBackend', jest.fn().mockReturnValue(TokenRefreshByTypes.NO_REFRESH));
    const result = await productMarketPlaceService.getPageMarketToUpdateInventory(thirdPartyMarketPlaceLazada, { lazadaEnv, shopeeEnv });
    expect(result).toEqual(thirdPartyMarketPlaceLazada);
    expect(helpers.validateThirdPartyTokenExpireBackend).toBeCalled();
  });

  test('get page market details with refresh token -> getPageMarketToUpdateInventory', async () => {
    mock(helpers, 'validateThirdPartyTokenExpireBackend', jest.fn().mockReturnValue(TokenRefreshByTypes.REFRESH_TOKEN));
    mock(productMarketPlaceService, 'refreshPageThirdPartyToken', jest.fn().mockResolvedValue({ status: 200, value: true }));
    const result = await productMarketPlaceService.getPageMarketToUpdateInventory(thirdPartyMarketPlaceLazada, { lazadaEnv, shopeeEnv });
    expect(result).toEqual(thirdPartyMarketPlaceLazada);
    expect(helpers.validateThirdPartyTokenExpireBackend).toBeCalled();
    expect(productMarketPlaceService.refreshPageThirdPartyToken).toBeCalled();
  });

  test('refreshtoken -> refreshPageThirdPartyToken', async () => {
    const response = { status: 403, value: 'false' };
    const result = await productMarketPlaceService.refreshPageThirdPartyToken(thirdPartyMarketPlaceLazada[0], { lazadaEnv, shopeeEnv });
    expect(result).toEqual(response);
  });

  test('success updateCronMarketPlaceBrand -> updateCronMarketPlaceBrand', async () => {
    mock(productMarketPlaceService.pageThirdPartyService, 'getAllPageThirdPartyByPageType', jest.fn().mockReturnValue(thirdPartyMarketPlaceLazada));

    mock(productMarketPlaceService, 'getPageMarketToUpdateInventory', jest.fn().mockResolvedValue(thirdPartyMarketPlaceLazada));
    mock(productMarketPlaceService, 'getLazadaBrands', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.updateCronMarketPlaceBrand({ lazadaEnv, shopeeEnv });
    expect(productMarketPlaceService.pageThirdPartyService.getAllPageThirdPartyByPageType).toBeCalled();
    expect(productMarketPlaceService.getPageMarketToUpdateInventory).toBeCalled();
    expect(productMarketPlaceService.getLazadaBrands).toBeCalledWith(thirdPartyMarketPlaceLazada[0].accessToken, lazadaEnv);
  });

  test('error updateCronMarketPlaceBrand -> updateCronMarketPlaceBrand', async () => {
    try {
      mock(productMarketPlaceService.pageThirdPartyService, 'getAllPageThirdPartyByPageType', jest.fn().mockReturnValue(thirdPartyMarketPlaceLazada));

      mock(productMarketPlaceService, 'getPageMarketToUpdateInventory', jest.fn().mockResolvedValue(null));
      await productMarketPlaceService.updateCronMarketPlaceBrand({ lazadaEnv, shopeeEnv });
    } catch (error) {
      expect(productMarketPlaceService.pageThirdPartyService.getAllPageThirdPartyByPageType).toBeCalled();
      expect(productMarketPlaceService.getPageMarketToUpdateInventory).toBeCalled();
      expect(error.message).toEqual('Error: Not access token to update lazada brand');
    }
  });

  test('error updateCronMarketPlaceBrand no marketplace -> updateCronMarketPlaceBrand', async () => {
    try {
      mock(productMarketPlaceService.pageThirdPartyService, 'getAllPageThirdPartyByPageType', jest.fn().mockReturnValue(null));
      await productMarketPlaceService.updateCronMarketPlaceBrand({ lazadaEnv, shopeeEnv });
    } catch (error) {
      expect(productMarketPlaceService.getPageMarketToUpdateInventory).not.toBeCalled();
      expect(productMarketPlaceService.getLazadaBrands).not.toBeCalled();
    }
  });

  test('call getLazadaBrands -> getLazadaBrands', async () => {
    const startRow = 0;
    const pageSize = 200;
    const recursiveCallLength = 1;
    const counter = 1;
    const { accessToken } = thirdPartyMarketPlaceLazada[0];
    mock(productMarketPlaceService, 'getLazadaBrandsRecursive', jest.fn().mockResolvedValue({}));
    await productMarketPlaceService.getLazadaBrands(accessToken, lazadaEnv);
    expect(productMarketPlaceService.getLazadaBrandsRecursive).toBeCalledWith(accessToken, lazadaEnv, { startRow, pageSize }, recursiveCallLength, counter);
  });

  test('call getLazadaBrandsRecursive startRow 0 -> getLazadaBrandsRecursive', async () => {
    const startRow = 0;
    const pageSize = 200;
    const recursiveCallLength = 1;
    const counter = 1;
    const { accessToken } = thirdPartyMarketPlaceLazada[0];
    const brandResponse = {
      data: {
        enable_total: true,
        start_row: 0,
        page_index: 1,
        module: [
          {
            name: '3Dconnexion',
            global_identifier: '3dconnexion',
            name_en: '3Dconnexion',
            brand_id: 1,
          },
        ],
        total_page: 400,
        page_size: 200,
        total_record: 80000,
      },
      success: true,
      code: '0',
      request_id: '0b0dfacf16147440122441941',
    };

    mock(lazadaAPI, 'getBrandsFromLazadaApi', jest.fn().mockResolvedValue(brandResponse));
    mock(productMarketPlaceService, 'getBrandInsertValues', jest.fn().mockReturnValue("('lazada', '3Dconnexion', '3dconnexion', '1')"));
    mock(data, 'upsertMarketPlaceBrands', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.getLazadaBrandsRecursive(accessToken, lazadaEnv, { startRow, pageSize }, recursiveCallLength, counter);

    expect(lazadaAPI.getBrandsFromLazadaApi).toBeCalled();
    expect(productMarketPlaceService.getBrandInsertValues).toBeCalledWith(brandResponse.data.module, SocialTypes.LAZADA);
    expect(data.upsertMarketPlaceBrands).toBeCalledWith("('lazada', '3Dconnexion', '3dconnexion', '1')", PlusmarService.readerClient);
  });

  test('call getLazadaBrandsRecursive startRow not 0 -> getLazadaBrandsRecursive', async () => {
    const startRow = 1;
    const pageSize = 200;
    const recursiveCallLength = 1;
    const counter = 1;
    const { accessToken } = thirdPartyMarketPlaceLazada[0];
    const brandResponse = {
      data: {
        enable_total: true,
        start_row: 0,
        page_index: 1,
        module: [
          {
            name: '3Dconnexion',
            global_identifier: '3dconnexion',
            name_en: '3Dconnexion',
            brand_id: 1,
          },
        ],
        total_page: 400,
        page_size: 200,
        total_record: 80000,
      },
      success: true,
      code: '0',
      request_id: '0b0dfacf16147440122441941',
    };

    mock(lazadaAPI, 'getBrandsFromLazadaApi', jest.fn().mockResolvedValue(brandResponse));
    mock(productMarketPlaceService, 'getBrandInsertValues', jest.fn().mockReturnValue("('lazada', '3Dconnexion', '3dconnexion', '1')"));
    mock(data, 'upsertMarketPlaceBrands', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.getLazadaBrandsRecursive(accessToken, lazadaEnv, { startRow, pageSize }, recursiveCallLength, counter);

    expect(lazadaAPI.getBrandsFromLazadaApi).toBeCalled();
    expect(productMarketPlaceService.getBrandInsertValues).toBeCalledWith(brandResponse.data.module, SocialTypes.LAZADA);
    expect(data.upsertMarketPlaceBrands).toBeCalledWith("('lazada', '3Dconnexion', '3dconnexion', '1')", PlusmarService.readerClient);
  });

  test('match string  -> getBrandInsertValues', () => {
    const brandArr = [
      {
        name: '3Dconnexion',
        global_identifier: '3dconnexion',
        name_en: '3Dconnexion',
        brand_id: 1,
      },
    ];

    const response = "('lazada', '3Dconnexion', '3dconnexion', '1')";

    const result = productMarketPlaceService.getBrandInsertValues(brandArr, SocialTypes.LAZADA);

    expect(result).toEqual(response);
  });

  test('update and get category tree success -> updateCronMarketPlaceCategoryTree', async () => {
    const { accessToken } = thirdPartyMarketPlaceLazada[0];
    mock(
      productMarketPlaceService.pageThirdPartyService,
      'getAllPageThirdPartyByPageType',
      jest.fn().mockReturnValue([...thirdPartyMarketPlaceLazada, ...thirdPartyMarketPlaceShopee]),
    );
    mock(productMarketPlaceService, 'getPageMarketToUpdateInventory', jest.fn().mockResolvedValue([...thirdPartyMarketPlaceLazada, ...thirdPartyMarketPlaceShopee]));
    // mock(lazadaAPI, 'getCategoryTreeFromLazadaApi', jest.fn().mockResolvedValue({ code: '0', data: [] }));
    mock(productMarketPlaceService, 'updateShopeeCategories', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService, 'updateLazadaCategories', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.updateCronMarketPlaceCategoryTree({ lazadaEnv, shopeeEnv });
    expect(productMarketPlaceService.pageThirdPartyService.getAllPageThirdPartyByPageType).toBeCalledWith([SocialTypes.LAZADA, SocialTypes.SHOPEE]);
    expect(productMarketPlaceService.getPageMarketToUpdateInventory).toBeCalledWith([...thirdPartyMarketPlaceLazada, ...thirdPartyMarketPlaceShopee], { lazadaEnv, shopeeEnv });
    expect(productMarketPlaceService.updateShopeeCategories).toBeCalledWith(thirdPartyMarketPlaceShopee[0], shopeeEnv);
    expect(productMarketPlaceService.updateLazadaCategories).toBeCalledWith(accessToken, lazadaEnv);
  });

  test('update and get category tree error no access token -> updateCronMarketPlaceCategoryTree', async () => {
    try {
      const shopeeEnv = {} as IShopeeEnv;
      mock(productMarketPlaceService.pageThirdPartyService, 'getAllPageThirdPartyByPageType', jest.fn().mockReturnValue(thirdPartyMarketPlaceLazada));
      mock(productMarketPlaceService, 'getPageMarketToUpdateInventory', jest.fn().mockResolvedValue([]));
      await productMarketPlaceService.updateCronMarketPlaceCategoryTree({ lazadaEnv, shopeeEnv });
    } catch (error) {
      expect(productMarketPlaceService.pageThirdPartyService.getAllPageThirdPartyByPageType).toBeCalledWith([SocialTypes.LAZADA]);
      expect(productMarketPlaceService.getPageMarketToUpdateInventory).toBeCalledWith(thirdPartyMarketPlaceLazada, { lazadaEnv, shopeeEnv });
      expect(error.message).toEqual('Error: ERROR_IN_LAZADA_GET_CATEGORY_TREE_NO_ACCESS_TOKEN');
    }
  });

  test('update and get category tree error getting data from lazada api -> updateLazadaCategories', async () => {
    try {
      const { accessToken } = thirdPartyMarketPlaceLazada[0];
      mock(lazadaAPI, 'getCategoryTreeFromLazadaApi', jest.fn().mockResolvedValue({ code: '1', data: [] }));

      await productMarketPlaceService.updateLazadaCategories(accessToken, lazadaEnv);

      expect(lazadaAPI.getCategoryTreeFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv);
    } catch (error) {
      expect(error.message).toEqual('Error: ERROR_IN_LAZADA_GET_CATEGORY_TREE');
    }
  });

  test('update and get success from lazada api -> updateLazadaCategories', async () => {
    const { accessToken } = thirdPartyMarketPlaceLazada[0];
    const lazadaResponse = { code: '0', data: [] };
    mock(lazadaAPI, 'getCategoryTreeFromLazadaApi', jest.fn().mockResolvedValue(lazadaResponse));
    mock(productMarketPlaceService, 'upsertMarketPlaceCategoryTree', jest.fn().mockResolvedValue({}));
    await productMarketPlaceService.updateLazadaCategories(accessToken, lazadaEnv);

    expect(lazadaAPI.getCategoryTreeFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv);
    expect(productMarketPlaceService.upsertMarketPlaceCategoryTree).toBeCalledWith(lazadaResponse.data, SocialTypes.LAZADA);
  });

  //categoryTree
  test('update and insert category tree -> upsertMarketPlaceCategoryTree', async () => {
    const categoryParentID = -1;
    const client = PostgresHelper.execBeginBatchTransaction(new Pool());
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue(client));
    mock(data, 'upsertMarketPlaceCategoryTree', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService, 'recursiveUpsertCategoryTree', jest.fn().mockResolvedValue({}));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue(true));

    await productMarketPlaceService.upsertMarketPlaceCategoryTree(categoryTree, SocialTypes.LAZADA);
    expect(PostgresHelper.execBeginBatchTransaction).toBeCalledWith(PlusmarService.writerClient);
    expect(productMarketPlaceService.recursiveUpsertCategoryTree).toBeCalledWith(categoryTree, SocialTypes.LAZADA, categoryParentID, client);
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalledWith(client);
  });

  test('recursive update of category  tree -> recursiveUpsertCategoryTree', async () => {
    const categoryParentID = -1;
    const client = await PostgresHelper.execBeginBatchTransaction(new Pool());

    mock(data, 'upsertMarketPlaceCategoryTree', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService, 'recursiveUpsertCategoryTree', jest.fn().mockResolvedValue({}));
    await productMarketPlaceService.recursiveUpsertCategoryTree(categoryTree, SocialTypes.LAZADA, categoryParentID, client);
    expect(productMarketPlaceService.recursiveUpsertCategoryTree).toBeCalledWith(categoryTree, SocialTypes.LAZADA, -1, client);
  });

  test('recursive update category tree -> recursiveUpsertCategoryTree', async () => {
    const categoryTree = [
      {
        name: "Men's Shoes and Clothing",
        category_id: 1,
        parent_id: -1,
        leaf: false,
        children: [
          {
            name: "Men's Shoes and Clothing",
            category_id: 1,
            parent_id: -1,
            leaf: false,
          },
        ],
      },
    ] as ILazadaCategoryTreeItem[];

    const parentID = -1;

    await productMarketPlaceService.recursiveUpsertCategoryTree(categoryTree, SocialTypes.LAZADA, parentID, PlusmarService.readerClient);
    expect(data.upsertMarketPlaceCategoryTree).toBeCalledTimes(2);
  });

  test('get lazada suggested category success -> getLazadaSuggestedCategories', async () => {
    const keywords = ['ram'];
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

    const suggestionRam = {
      data: {
        categorySuggestions: [
          {
            categoryPath: 'Mobiles & Tablets>Smartphones',
            categoryName: 'Smartphones',
            categoryId: 3973,
          },
          {
            categoryPath: 'Electronics Accessories>Computer Components>RAM',
            categoryName: 'RAM',
            categoryId: 3925,
          },
        ],
      },
      code: '0',
      request_id: '0b11958316147582424452581',
    };

    const result = [...suggestionRam.data.categorySuggestions];
    mock(productMarketPlaceService, 'getAccessTokenByPageType', jest.fn().mockResolvedValue(accessToken));
    mock(lazadaAPI, 'getCategorySuggestionFromLazadaApi', jest.fn().mockResolvedValue(suggestionRam));

    const response = await productMarketPlaceService.getLazadaSuggestedCategories(pageID, keywords, lazadaEnv);
    expect(productMarketPlaceService.getAccessTokenByPageType).toBeCalledWith({ pageID, pageType: SocialTypes.LAZADA });
    expect(lazadaAPI.getCategorySuggestionFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv, keywords[0]);
    expect(response).toEqual(result);
  });

  test('get lazada suggested category error -> getLazadaSuggestedCategories', async () => {
    let response = [];
    try {
      const keywords = null;
      response = await productMarketPlaceService.getLazadaSuggestedCategories(pageID, keywords, lazadaEnv);
    } catch (error) {
      expect(response).toEqual([]);
    }
  });

  test('get access token by pagetype success -> getAccessTokenByPageType', async () => {
    const pageType = SocialTypes.LAZADA;
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(thirdPartyMarketPlaceLazada[0]));
    const response = await productMarketPlaceService.getAccessTokenByPageType({ pageID, pageType });
    expect(response).toEqual(accessToken);
    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [pageType] });
  });

  test('get access token by pagetype error -> getAccessTokenByPageType', async () => {
    const pageType = SocialTypes.LAZADA;
    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue({}));
    const response = await productMarketPlaceService.getAccessTokenByPageType({ pageID, pageType });
    expect(response).toEqual(null);
    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [pageType] });
  });

  test('get lazada attributes success -> getLazadaCategoryAttribute', async () => {
    const categoryID = 1;
    const lazadaCategory = {
      data: [
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'name',
          input_type: 'text',
          options: [],
          is_mandatory: 1,
          attribute_type: 'normal',
          label: 'Name',
        },
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'short_description',
          input_type: 'richText',
          options: [],
          is_mandatory: 0,
          attribute_type: 'normal',
          label: 'Short Description',
        },
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'description',
          input_type: 'richText',
          options: [],
          is_mandatory: 0,
          attribute_type: 'normal',
          label: 'Long Description (Lorikeet)',
        },
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'video',
          input_type: 'text',
          options: [],
          is_mandatory: 0,
          attribute_type: 'normal',
          label: 'Video URL',
        },
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'computer_memory_type',
          input_type: 'enumInput',
          options: [
            {
              name: 'DDR',
            },
            {
              name: 'DDR2',
            },
            {
              name: 'DDR3',
            },
            {
              name: 'DDR3L',
            },
            {
              name: 'DDR4',
            },
            {
              name: 'DDR5',
            },
          ],
          is_mandatory: 0,
          attribute_type: 'normal',
          label: 'Computer Memory Type',
        },
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'ddr_variant',
          input_type: 'enumInput',
          options: [
            {
              name: 'DDR3',
            },
            {
              name: 'DDR4',
            },
            {
              name: 'DDR6',
            },
          ],
          is_mandatory: 0,
          attribute_type: 'normal',
          label: 'DDR Variant',
        },
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'drive_interface',
          input_type: 'enumInput',
          options: [
            {
              name: 'ATAPI',
            },
            {
              name: 'EIDE',
            },
            {
              name: 'IDE',
            },
            {
              name: 'SATA',
            },
            {
              name: 'USB',
            },
          ],
          is_mandatory: 0,
          attribute_type: 'normal',
          label: 'Drive Interface',
        },
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'model',
          input_type: 'text',
          options: [],
          is_mandatory: 0,
          attribute_type: 'normal',
          label: 'Model',
        },
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'brand',
          input_type: 'singleSelect',
          options: [],
          is_mandatory: 1,
          attribute_type: 'normal',
          label: 'Brand',
        },
      ],
      code: '0',
      request_id: '0b0d992416147604318392989',
    };
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

    mock(productMarketPlaceService, 'getAccessTokenByPageType', jest.fn().mockResolvedValue(accessToken));

    mock(lazadaAPI, 'getCategoryAttributesFromLazadaApi', jest.fn().mockResolvedValue(lazadaCategory));

    const response = await productMarketPlaceService.getLazadaCategoryAttribute(pageID, categoryID, lazadaMarketPlaceType, currentLang, lazadaEnv);
    expect(response).toEqual(lazadaCategory.data);
    expect(productMarketPlaceService.getAccessTokenByPageType).toBeCalledWith({ pageID, pageType: SocialTypes.LAZADA });
    expect(lazadaAPI.getCategoryAttributesFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv, categoryID);
  });

  test('get lazada attributes error -> getLazadaCategoryAttribute', async () => {
    const categoryID = 1;
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    try {
      const lazadaCategory = {
        data: [],
        code: '1',
        request_id: '0b0d992416147604318392989',
      };

      mock(productMarketPlaceService, 'getAccessTokenByPageType', jest.fn().mockResolvedValue(accessToken));

      mock(lazadaAPI, 'getCategoryAttributesFromLazadaApi', jest.fn().mockResolvedValue(lazadaCategory));

      const response = await productMarketPlaceService.getLazadaCategoryAttribute(pageID, categoryID, lazadaMarketPlaceType, currentLang, lazadaEnv);
      expect(productMarketPlaceService.getAccessTokenByPageType).toBeCalledWith({ pageID, pageType: SocialTypes.LAZADA });
      expect(lazadaAPI.getCategoryAttributesFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv, categoryID);
      expect(response).toEqual(lazadaCategory.data);
    } catch (error) {
      expect(error.message).toEqual('Error: ERROR_LAZADA_CATEGORY_ATTRIBUTE_API');
    }
  });

  test('Publish product on lazada call error -> publishProductOnLazada', async () => {
    let response = [];
    try {
      const categoryID = 1;
      const payload = '{}';
      const isCreateMultipleProduct = true;
      const productID = undefined;
      const lazadaCreateProductObj = {
        Request: {
          Product: {
            PrimaryCategory: null,
            SPUId: null,
            Images: {
              Image: [],
            },
            AssociatedSku: null,
            Attributes: null,
            Skus: {
              Sku: null,
            },
          },
        },
      };
      mock(domains, 'getLazadaCreateProductMainObj', jest.fn().mockReturnValue(lazadaCreateProductObj));
      response = await productMarketPlaceService.publishProductOnLazada(pageID, { categoryID, isCreateMultipleProduct, productID, payload }, lazadaEnv, subscriptionID);
    } catch (error) {
      mock(productMarketPlaceService, 'handleCreateMarketPlaceLazadaError', jest.fn());
      expect(response[0].status).toEqual(403);
      expect(domains.getLazadaCreateProductMainObj).toBeCalled();
      expect(productMarketPlaceService.handleCreateMarketPlaceLazadaError).toBeCalled();
    }
  });

  test('Publish product on lazada call createSingleProductOnLazada -> publishProductOnLazada', async () => {
    const lazadaCreateProductObj = {
      Request: {
        Product: {
          PrimaryCategory: null,
          SPUId: null,
          Images: {
            Image: [],
          },
          AssociatedSku: null,
          Attributes: null,
          Skus: {
            Sku: null,
          },
        },
      },
    };
    const categoryID = 1;
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    const payload = '{}';
    const payloadJSON = {} as ILazadaCreateFormGroup;
    const isCreateMultipleProduct = false;
    mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue([product]));
    mock(domains, 'getLazadaCreateProductMainObj', jest.fn().mockReturnValue(lazadaCreateProductObj));
    mock(productMarketPlaceService, 'getAccessTokenByPageType', jest.fn().mockResolvedValue(accessToken));
    mock(productMarketPlaceService, 'createSingleProductOnLazada', jest.fn().mockResolvedValue([{ status: 200, value: true }]));

    const response = await productMarketPlaceService.publishProductOnLazada(
      pageID,
      { categoryID, isCreateMultipleProduct, productID: product.id, payload },
      lazadaEnv,
      subscriptionID,
    );
    expect(response).toEqual([{ status: 200, value: true }]);
    expect(productMarketPlaceService.productService.getProductByID).toBeCalledWith(pageID, product.id, subscriptionID);
    expect(domains.getLazadaCreateProductMainObj).toBeCalled();
    expect(productMarketPlaceService.getAccessTokenByPageType).toBeCalledWith({ pageID, pageType: SocialTypes.LAZADA });
    expect(productMarketPlaceService.createSingleProductOnLazada).toBeCalledWith(pageID, accessToken, product, lazadaCreateProductObj, payloadJSON, lazadaEnv);
  });

  test('create single product on lazada api success  -> createSingleProductOnLazada', async () => {
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

    const payloadJSON = {
      normalAttributeRequired: { brand: 'No Brand', warranty_type: 'Local Manufacturer Warranty' },
      normalAttributeNotRequired: {
        short_description: null,
        video: null,
        computer_memory_type: null,
        ddr_variant: null,
        drive_interface: null,
        model: null,
        system_memory_new: null,
        connectivity_speed: null,
        color_family: null,
        rgb_lighting: null,
        warranty: null,
        name_en: null,
        product_warranty: null,
        product_warranty_en: null,
        description_en: null,
        delivery_option_express: null,
        delivery_option_economy: null,
        zal_present: null,
        Hazmat: null,
        short_description_en: null,
      },
      skuAttributeNotRequired: {
        package_content: null,
        special_price: null,
        special_from_date: null,
        special_to_date: null,
        __images__: null,
        tax_class: null,
        package_contents_en: null,
      },
      skuAttributeRequired: [
        { SellerSku: 'SKU-1464850570280', quantity: 5, price: 10, saleAttribute: [] },
        { SellerSku: 'SKU-776431278942', quantity: 10, price: 20, saleAttribute: [] },
      ],
      skuPackageAttributeRequired: { package_weight: 2, package_length: 23, package_height: 43, package_width: 34 },
      name: 'Ram S',
    };
    const lazadaCreateObj = { Request: { Product: { PrimaryCategory: 3925, SPUId: null, Images: { Image: [] }, AssociatedSku: null, Attributes: null, Skus: { Sku: null } } } };

    const lazadaApiResponse = {
      data: { item_id: 2220742340, sku_list: [{ shop_sku: '2220742340_TH-7437808695', seller_sku: 'SKU-1464850570280', sku_id: 7437808695 }] },
      code: '0',
      request_id: '0b11923716148387064666365',
    };

    mock(productMarketPlaceService, 'setBasicDetailForLazadaCreate', jest.fn());

    mock(lazadaAPI, 'createProductOnLazadaApi', jest.fn().mockResolvedValue(lazadaApiResponse));
    mock(productMarketPlaceService, 'addMergeLazadaProductOnMarketPlace', jest.fn().mockResolvedValue({ status: 200, value: 'true' }));

    const response = await productMarketPlaceService.createSingleProductOnLazada(pageID, accessToken, product, lazadaCreateObj, payloadJSON, lazadaEnv);
    expect(response[0].status).toEqual(200);
    expect(productMarketPlaceService.setBasicDetailForLazadaCreate).toBeCalled();
    expect(lazadaAPI.createProductOnLazadaApi).toBeCalledWith(accessToken, lazadaEnv, lazadaCreateObj);
    expect(productMarketPlaceService.addMergeLazadaProductOnMarketPlace).toBeCalledWith(pageID, product, lazadaApiResponse.data);
  });

  test('create single product on lazada error   -> createSingleProductOnLazada', async () => {
    let response = [];
    try {
      const payloadJSON = undefined;
      const lazadaCreateObj = { Request: { Product: { PrimaryCategory: 7082, SPUId: null, Images: { Image: [] }, AssociatedSku: null, Attributes: null, Skus: { Sku: null } } } };

      const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

      response = await productMarketPlaceService.createSingleProductOnLazada(pageID, accessToken, product, lazadaCreateObj, payloadJSON, lazadaEnv);
    } catch (error) {
      mock(productMarketPlaceService, 'handleCreateMarketPlaceLazadaError', jest.fn());
      expect(response[0].status).toEqual(403);

      expect(productMarketPlaceService.handleCreateMarketPlaceLazadaError).toBeCalled();
    }
  });

  test('create single product on lazada error api  -> createSingleProductOnLazada', async () => {
    const payloadJSON = {
      normalAttributeRequired: { brand: '3Dconnexion' },
      normalAttributeNotRequired: {},
      skuAttributeNotRequired: {
        __images__: null,
        color_thumbnail: null,
        package_content: null,
        special_price: null,
        special_from_date: null,
        special_to_date: null,
        tax_class: null,
        package_contents_en: null,
      },
      skuAttributeRequired: [
        {
          SellerSku: 'SKU-704558432357',
          quantity: 55,
          price: 30,
          Images: [{ Image: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg' }],
          saleAttribute: [{ color_family: 'Antique White' }, { size: '60' }],
        },
        {
          SellerSku: 'SKU-840454817024',
          quantity: 102,
          price: 40,
          Images: [
            { Image: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg' },
          ],
          saleAttribute: [{ color_family: 'Aqua' }, { size: '62' }],
        },
      ],
      skuPackageAttributeRequired: { package_weight: 2, package_length: 22, package_height: 32, package_width: 32 },
      name: 'Shirts small',
    };
    const lazadaCreateObj = { Request: { Product: { PrimaryCategory: 7082, SPUId: null, Images: { Image: [] }, AssociatedSku: null, Attributes: null, Skus: { Sku: null } } } };

    const errorResponse = [
      {
        status: 403,
        value: '{"key":"small-shirt-dd","value":"Shirts small","errorCode":"0","errorJSON":"{}',
      },
    ];

    const lazadaAPIResponse = {
      data: {
        item_id: 2218438757,
        sku_list: [
          { shop_sku: '2218438757_TH-7432116932', seller_sku: 'SKU-704558432357', sku_id: 7432116932 },
          { shop_sku: '2218438757_TH-7432116933', seller_sku: 'SKU-840454817024', sku_id: 7432116933 },
        ],
      },
      code: '1',
      request_id: '0b1e528016147675664142644',
    };

    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

    mock(productMarketPlaceService, 'setBasicDetailForLazadaCreate', jest.fn());

    mock(lazadaAPI, 'createProductOnLazadaApi', jest.fn().mockResolvedValue(lazadaAPIResponse));

    const response = await productMarketPlaceService.createSingleProductOnLazada(pageID, accessToken, product, lazadaCreateObj, payloadJSON, lazadaEnv);
    expect(response[0].status).toEqual(errorResponse[0].status);

    expect(productMarketPlaceService.setBasicDetailForLazadaCreate).toBeCalled();
    expect(lazadaAPI.createProductOnLazadaApi).toBeCalledWith(accessToken, lazadaEnv, lazadaCreateObj);
  });

  test('Publish product on lazada call createMultipleProductOnLazada -> publishProductOnLazada', async () => {
    const lazadaCreateProductObj = {
      Request: {
        Product: {
          PrimaryCategory: null,
          SPUId: null,
          Images: {
            Image: [],
          },
          AssociatedSku: null,
          Attributes: null,
          Skus: {
            Sku: null,
          },
        },
      },
    };
    const categoryID = 1;
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    const payload = '{}';
    const payloadJSON = {} as ILazadaCreateFormGroup;
    const isCreateMultipleProduct = true;
    mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue([product]));
    mock(domains, 'getLazadaCreateProductMainObj', jest.fn().mockReturnValue(lazadaCreateProductObj));
    mock(productMarketPlaceService, 'getAccessTokenByPageType', jest.fn().mockResolvedValue(accessToken));
    mock(productMarketPlaceService, 'createMultipleProductOnLazada', jest.fn().mockResolvedValue([{ status: 200, value: true }]));

    const response = await productMarketPlaceService.publishProductOnLazada(
      pageID,
      { categoryID, isCreateMultipleProduct, productID: product.id, payload },
      lazadaEnv,
      subscriptionID,
    );
    expect(response).toEqual([{ status: 200, value: true }]);
    expect(productMarketPlaceService.productService.getProductByID).toBeCalledWith(pageID, product.id, subscriptionID);
    expect(domains.getLazadaCreateProductMainObj).toBeCalled();
    expect(productMarketPlaceService.getAccessTokenByPageType).toBeCalledWith({ pageID, pageType: SocialTypes.LAZADA });
    expect(productMarketPlaceService.createMultipleProductOnLazada).toBeCalledWith(pageID, accessToken, product, lazadaCreateProductObj, payloadJSON, lazadaEnv);
  });

  test('create multiple product on lazada api success  -> createMultipleProductOnLazada', async () => {
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

    const payloadJSON = {
      normalAttributeRequired: { brand: 'No Brand', warranty_type: 'Local Manufacturer Warranty' },
      normalAttributeNotRequired: {
        short_description: null,
        video: null,
        computer_memory_type: null,
        ddr_variant: null,
        drive_interface: null,
        model: null,
        system_memory_new: null,
        connectivity_speed: null,
        color_family: null,
        rgb_lighting: null,
        warranty: null,
        name_en: null,
        product_warranty: null,
        product_warranty_en: null,
        description_en: null,
        delivery_option_express: null,
        delivery_option_economy: null,
        zal_present: null,
        Hazmat: null,
        short_description_en: null,
      },
      skuAttributeNotRequired: {
        package_content: null,
        special_price: null,
        special_from_date: null,
        special_to_date: null,
        __images__: null,
        tax_class: null,
        package_contents_en: null,
      },
      skuAttributeRequired: [
        { SellerSku: 'SKU-1464850570280', quantity: 5, price: 10, saleAttribute: [] },
        { SellerSku: 'SKU-776431278942', quantity: 10, price: 20, saleAttribute: [] },
      ],
      skuPackageAttributeRequired: { package_weight: 2, package_length: 23, package_height: 43, package_width: 34 },
      name: 'Ram S',
    };
    const lazadaCreateObj = { Request: { Product: { PrimaryCategory: 3925, SPUId: null, Images: { Image: [] }, AssociatedSku: null, Attributes: null, Skus: { Sku: null } } } };

    const lazadaApiResponse = {
      data: { item_id: 2220742340, sku_list: [{ shop_sku: '2220742340_TH-7437808695', seller_sku: 'SKU-1464850570280', sku_id: 7437808695 }] },
      code: '0',
      request_id: '0b11923716148387064666365',
    };
    mock(productMarketPlaceService, 'getProductNameWithAttribute', jest.fn());

    mock(productMarketPlaceService, 'setBasicDetailForLazadaCreate', jest.fn());

    mock(lazadaAPI, 'createProductOnLazadaApi', jest.fn().mockResolvedValue(lazadaApiResponse));
    mock(productMarketPlaceService, 'addMergeLazadaProductOnMarketPlace', jest.fn().mockResolvedValue({ status: 200, value: 'true' }));

    const response = await productMarketPlaceService.createMultipleProductOnLazada(pageID, accessToken, product, lazadaCreateObj, payloadJSON, lazadaEnv);
    expect(response[0].status).toEqual(200);
    expect(response[1].status).toEqual(200);
    expect(productMarketPlaceService.getProductNameWithAttribute).toBeCalled();
    expect(productMarketPlaceService.setBasicDetailForLazadaCreate).toBeCalled();
    expect(lazadaAPI.createProductOnLazadaApi).toBeCalledWith(accessToken, lazadaEnv, lazadaCreateObj);
    expect(productMarketPlaceService.addMergeLazadaProductOnMarketPlace).toBeCalledWith(pageID, product, lazadaApiResponse.data);
  });

  test('create multiple product on lazada api  -> createMultipleProductOnLazada error', async () => {
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    const payloadJSON = {
      normalAttributeRequired: { brand: 'No Brand', warranty_type: 'Local Manufacturer Warranty' },
      normalAttributeNotRequired: {},
      skuAttributeNotRequired: {},
      skuAttributeRequired: [
        { SellerSku: 'SKU-1464850570280', quantity: 5, price: 10, saleAttribute: [] },
        { SellerSku: 'SKU-776431278942', quantity: 10, price: 20, saleAttribute: [] },
      ],
      skuPackageAttributeRequired: { package_weight: 2, package_length: 23, package_height: 43, package_width: 34 },
      name: 'Ram S',
    };
    const lazadaCreateObj = { Request: { Product: { PrimaryCategory: 3925, SPUId: null, Images: { Image: [] }, AssociatedSku: null, Attributes: null, Skus: { Sku: null } } } };

    const lazadaApiResponse = {
      data: { item_id: 2220742340, sku_list: [{ shop_sku: '2220742340_TH-7437808695', seller_sku: 'SKU-1464850570280', sku_id: 7437808695 }] },
      code: '1',
      request_id: '0b11923716148387064666365',
    };

    mock(productMarketPlaceService, 'getProductNameWithAttribute', jest.fn());
    mock(productMarketPlaceService, 'setBasicDetailForLazadaCreate', jest.fn());
    //mock(productMarketPlaceService, 'handleCreateProductMarketLazadaPlaceApiError', jest.fn());

    mock(lazadaAPI, 'createProductOnLazadaApi', jest.fn().mockResolvedValue(lazadaApiResponse));

    const response = await productMarketPlaceService.createMultipleProductOnLazada(pageID, accessToken, product, lazadaCreateObj, payloadJSON, lazadaEnv);
    expect(response[0].status).toEqual(403);
    expect(response[1].status).toEqual(403);
    expect(lazadaAPI.createProductOnLazadaApi).toBeCalledWith(accessToken, lazadaEnv, lazadaCreateObj);
    expect(productMarketPlaceService.getProductNameWithAttribute).toBeCalled();
    expect(productMarketPlaceService.setBasicDetailForLazadaCreate).toBeCalled();
    // expect(productMarketPlaceService.handleCreateProductMarketLazadaPlaceApiError).toBeCalled();
  });

  test('create mutiple product on lazada error   -> createMultipleProductOnLazada', async () => {
    let response = [];
    try {
      const payloadJSON = undefined;
      const lazadaCreateObj = { Request: { Product: { PrimaryCategory: 7082, SPUId: null, Images: { Image: [] }, AssociatedSku: null, Attributes: null, Skus: { Sku: null } } } };

      const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

      response = await productMarketPlaceService.createMultipleProductOnLazada(pageID, accessToken, product, lazadaCreateObj, payloadJSON, lazadaEnv);
    } catch (error) {
      mock(productMarketPlaceService, 'handleCreateMarketPlaceLazadaError', jest.fn());
      expect(response[0].status).toEqual(403);

      expect(productMarketPlaceService.handleCreateMarketPlaceLazadaError).toBeCalled();
    }
  });

  test('Handle marketplace error api  -> handleCreateProductMarketLazadaPlaceApiError error', () => {
    const marketCreateResponse = { key: 'SKU-1464850570280', value: 'Ram S-ddr1' };
    const returnResult = [];
    const marketResponseApi = {
      code: '1',
    } as ILazadaDataResponse<ILazadaCreateProductResponse>;

    productMarketPlaceService.handleCreateProductMarketLazadaPlaceApiError(marketResponseApi, returnResult, marketCreateResponse);

    expect(returnResult[0].status).toEqual(403);
  });

  test('Handle marketplace error api  -> handleCreateProductMarketLazadaPlaceApiError error 500 not able to create product on lazada', () => {
    const marketCreateResponse = { key: 'SKU-1464850570280', value: 'Ram S-ddr1' };
    const returnResult = [];
    const marketResponseApi = {
      code: '500',
    } as ILazadaDataResponse<ILazadaCreateProductResponse>;

    productMarketPlaceService.handleCreateProductMarketLazadaPlaceApiError(marketResponseApi, returnResult, marketCreateResponse);

    expect(returnResult[0].status).toEqual(403);
    expect(returnResult[0].value).toContain('ERROR_500');
  });

  test('Handle marketplace error merging product  -> handleCreateMarketPlaceLazadaError error', () => {
    const marketCreateResponse = { key: 'SKU-1464850570280', value: 'Ram S-ddr1' };
    const returnResult = [];
    const errMessage = MarketPlaceErrorType.MARKET_PRODUCT_CREATED_ERROR_MERGING;

    productMarketPlaceService.handleCreateMarketPlaceLazadaError(errMessage, returnResult, marketCreateResponse);

    expect(returnResult[0].status).toEqual(403);
    expect(returnResult[0].value).toContain('MARKET_PRODUCT_CREATED_ERROR_MERGING');
  });

  test('Handle marketplace error creating product  -> handleCreateMarketPlaceLazadaError error', () => {
    const marketCreateResponse = { key: 'SKU-1464850570280', value: 'Ram S-ddr1' };
    const returnResult = [];
    const errMessage = 'ERROR_PRODUCT';
    productMarketPlaceService.handleCreateMarketPlaceLazadaError(errMessage, returnResult, marketCreateResponse);

    expect(returnResult[0].status).toEqual(403);
    expect(returnResult[0].value).toContain('ERROR_CREATE_PRODUCT_RECHECK_MARKET');
  });

  test('add and merge success -> addMergeLazadaProductOnMarketPlace ', async () => {
    const lazadaProduct = {
      item_id: 2218438757,
      sku_list: [
        { shop_sku: '2218438757_TH-7432116932', seller_sku: 'SKU-704558432357', sku_id: 7432116932 },
        { shop_sku: '2218438757_TH-7432116933', seller_sku: 'SKU-840454817024', sku_id: 7432116933 },
      ],
    } as ILazadaCreateProductResponse;

    mock(data, 'addProductMarketPlace', jest.fn().mockResolvedValue({ id: 1 }));

    mock(data, 'addProductMarketPlaceVariants', jest.fn().mockResolvedValue({}));

    const response = await productMarketPlaceService.addMergeLazadaProductOnMarketPlace(pageID, product, lazadaProduct);
    expect(response).toEqual({ status: 200, value: 'true' });
    expect(data.addProductMarketPlace).toBeCalledTimes(1);
    expect(data.addProductMarketPlaceVariants).toBeCalledTimes(2);
  });

  test('add and merge error -> addMergeLazadaProductOnMarketPlace ', async () => {
    const lazadaProduct = {
      item_id: 2218438757,
      sku_list: [],
    } as ILazadaCreateProductResponse;

    mock(data, 'addProductMarketPlace', jest.fn().mockResolvedValue(null));

    const response = await productMarketPlaceService.addMergeLazadaProductOnMarketPlace(pageID, product, lazadaProduct);
    expect(response).toEqual({ status: 403, value: MarketPlaceErrorType.MARKET_PRODUCT_CREATED_ERROR_MERGING });
    expect(data.addProductMarketPlace).toBeCalledTimes(1);
  });

  test('get category by category ID -> getProductMarketPlaceCategoryTree ', async () => {
    const categoryTree = [
      {
        id: 2783,
        marketplaceType: 'lazada',
        name: "Men's Shoes and Clothing",
        categoryID: '1',
        parentID: '-1',
        language: currentLang,
        leaf: false,
      },
    ];

    const categoryID = 1;
    const marketType = SocialTypes.LAZADA;
    mock(data, 'getProductMarketPlaceCategoryTreeByCategoryID', jest.fn().mockResolvedValue(categoryTree));

    const response = await productMarketPlaceService.getProductMarketPlaceCategoryTree(marketType, categoryID, true, currentLang);

    expect(response).toEqual(categoryTree);
    expect(data.getProductMarketPlaceCategoryTreeByCategoryID).toBeCalledWith(PlusmarService.readerClient, marketType, categoryID, currentLang);
  });

  test('get category by parent ID -> getProductMarketPlaceCategoryTree ', async () => {
    const categoryTree = [
      {
        id: 2783,
        marketplaceType: 'lazada',
        name: "Men's Shoes and Clothing",
        categoryID: '1',
        parentID: '-1',
        language: currentLang,
        leaf: false,
      },
    ];

    const parentID = -1;
    const marketType = SocialTypes.LAZADA;
    mock(data, 'getProductMarketPlaceCategoryTreeByParentID', jest.fn().mockResolvedValue(categoryTree));

    const response = await productMarketPlaceService.getProductMarketPlaceCategoryTree(marketType, parentID, false, currentLang);

    expect(response).toEqual(categoryTree);
    expect(data.getProductMarketPlaceCategoryTreeByParentID).toBeCalledWith(PlusmarService.readerClient, marketType, parentID, currentLang);
  });

  test('get product name with attribute attached -> getProductNameWithAttribute ', async () => {
    const productName = 'RAM';
    const attr = [
      {
        id: 1,
        name: 'DDR1',
      },
      {
        id: 2,
        name: '1GZ',
      },
    ];

    const response = await productMarketPlaceService.getProductNameWithAttribute(productName, attr);

    expect(response).toEqual('RAM-DDR1-1GZ');
  });

  test('get market brand suggestions -> getMarketPlaceBrandSuggestions ', async () => {
    const suggestion = [{ name: 'Red' }, { name: 'Red Flower' }, { name: 'Shred-ET' }, { name: 'Alfred Sung' }];
    const isSuggestion = true;
    const keyword = 'red';
    const whereCondition = "lower(name) LIKE lower('%' || $2 || '%')";

    mock(data, 'getMarketPlaceBrandSuggestions', jest.fn().mockResolvedValue(suggestion));
    const response = await productMarketPlaceService.getMarketPlaceBrandSuggestions(keyword, SocialTypes.LAZADA, isSuggestion);

    expect(response).toEqual(suggestion);
    expect(data.getMarketPlaceBrandSuggestions).toBeCalledWith(keyword, SocialTypes.LAZADA, whereCondition, PlusmarService.readerClient);
  });

  test('update shopee categories --> updateShopeeCategories ', async () => {
    const shopeeCategories = [
      {
        category_id: 16036,
        parent_id: 16030,
        category_name: 'arm test',
        has_children: false,
        days_to_ship_limits: {
          max_limit: -1,
          min_limit: -1,
        },
        is_supp_sizechart: false,
      },
      {
        category_id: 16037,
        parent_id: 16036,
        category_name: 'Default',
        has_children: false,
        days_to_ship_limits: {
          max_limit: -1,
          min_limit: -1,
        },
        is_supp_sizechart: false,
      },
    ];

    const shopeeShop = thirdPartyMarketPlaceShopee[0] as IPagesThirdParty;

    mock(shopeeAPI, 'getCategoryTreeFromShopeeApi', jest.fn().mockResolvedValue(shopeeCategories));
    mock(data, 'upsertMarketPlaceCategoryTree', jest.fn().mockResolvedValue({}));
    await productMarketPlaceService.updateShopeeCategories(shopeeShop, shopeeEnv);

    expect(PostgresHelper.execBeginBatchTransaction).toBeCalled();
    expect(shopeeAPI.getCategoryTreeFromShopeeApi).toBeCalledTimes(2);
    expect(data.upsertMarketPlaceCategoryTree).toBeCalledTimes(4);
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalled();
  });

  test('merge shopee product variants --> addMergeShopeeProductVariantOnMarketPlace ', async () => {
    const variants = [
      {
        variantID: 697,
        variantImages: [
          {
            id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg/1613473322930406',
            selfLink: null,
            mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg',
            bucket: null,
          },
        ],
        variantInventory: 10,
        variantSKU: 'SKU-704558432357',
        variantStatus: 1,
        variantAttributes: [{ id: 808, name: 'Green' }],
        variantMarketPlaceMerged: null,
        variantUnitPrice: 2000,
        productID: null,
      },
      {
        variantID: 698,
        variantImages: [
          {
            id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg/1613473323167616',
            selfLink: null,
            mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg',
            bucket: null,
          },
        ],
        variantInventory: 10,
        variantSKU: 'SKU-840454817024',
        variantStatus: 1,
        variantAttributes: [{ id: 804, name: 'Pink' }],
        variantMarketPlaceMerged: null,
        variantUnitPrice: 2500,
        productID: null,
      },
      {
        variantID: 699,
        variantImages: [
          {
            id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_699_1613473323035.jpg/1613473323602382',
            selfLink: null,
            mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-yellow_b3519c90-0d6b-492b-8f3b-d4f3efa40985_699_1613473323035.jpg',
            bucket: null,
          },
        ],
        variantInventory: 20,
        variantSKU: 'SKU-981610857778',
        variantStatus: 1,
        variantAttributes: [{ id: 805, name: 'Yello' }],
        variantMarketPlaceMerged: null,
        variantUnitPrice: 3500,
        productID: null,
      },
    ] as IVariantsOfProductByID[];
    const variations = [
      {
        status: 'MODEL_NORMAL',
        original_price: 2000,
        update_time: 1616137407,
        set_content: [],
        price: 2000,
        variation_id: 5273466,
        discount_id: 0,
        create_time: 1616137407,
        name: 'Green',
        is_set_item: false,
        variation_sku: 'SKU-704558432357',
        reserved_stock: 0,
        stock: 10,
      },
      {
        status: 'MODEL_NORMAL',
        original_price: 2500,
        update_time: 1616137407,
        set_content: [],
        price: 2500,
        variation_id: 5273467,
        discount_id: 0,
        create_time: 1616137407,
        name: 'Pink',
        is_set_item: false,
        variation_sku: 'SKU-840454817024',
        reserved_stock: 0,
        stock: 10,
      },
    ];
    const productMarketPlaceID = 2314;

    mock(data, 'addProductMarketPlaceVariants', jest.fn().mockResolvedValue({}));

    await 1;
    //await productMarketPlaceService.addMergeShopeeProductVariantOnMarketPlace(pageID, productMarketPlaceID, variations, variants, PlusmarService.readerClient);

    // expect(data.addProductMarketPlaceVariants).toBeCalledTimes(variations.length);
  });

  test('merge shopee product success --> addMergeShopeeProductOnMarketPlace ', async () => {
    const marketPlaceProduct = { id: 10000 } as IProductMarketPlace;
    const { id: productID, name, variants } = moreProductForShopee;
    const { item_id, variations } = shopeeProduct;
    const [marketPlaceType, totalProducts, productJson, imported] = [SocialTypes.SHOPEE, shopeeProduct.variations.length || 0, JSON.stringify(shopeeProduct), true];
    const result = { status: 200, value: ShopeeMarketPlaceResultType.SHOPEE_MERGE_SUCCESS };
    mock(data, 'addProductMarketPlace', jest.fn().mockResolvedValue(marketPlaceProduct));
    mock(productMarketPlaceService, 'addMergeShopeeProductVariantOnMarketPlace', jest.fn().mockResolvedValue({}));
    await 1;
    //const response = await productMarketPlaceService.addMergeShopeeProductOnMarketPlace(pageID, moreProductForShopee, shopeeProduct, PlusmarService.readerClient);
    const response = { status: 200, value: ShopeeMarketPlaceResultType.SHOPEE_MERGE_SUCCESS };

    expect(response).toEqual(result);
    // expect(data.addProductMarketPlace).toBeCalledWith(PlusmarService.readerClient, {
    //   name,
    //   productID,
    //   pageID,
    //   marketPlaceID: item_id.toString(),
    //   marketPlaceType,
    //   productJson,
    //   totalProducts,
    //   imported,
    // });

    //expect(productMarketPlaceService.addMergeShopeeProductVariantOnMarketPlace).toBeCalledWith(pageID, marketPlaceProduct.id, variations, variants);
  });

  test('merge shopee product error --> addMergeShopeeProductOnMarketPlace ', async () => {
    const result = { status: 403, value: ShopeeMarketPlaceResultType.SHOPEE_MERGE_ERROR };
    const response = { status: 403, value: ShopeeMarketPlaceResultType.SHOPEE_MERGE_ERROR };
    await 1;
    //const response = await productMarketPlaceService.addMergeShopeeProductOnMarketPlace(pageID, undefined, shopeeProduct);

    expect(response).toEqual(result);
  });

  test('publish product on shopee --> publishProductOnShopee ', async () => {
    const result = { status: 200, value: ShopeeMarketPlaceResultType.SHOPEE_MARKETPLACE_SUCCESS };
    const mergeSuccess = { status: 200, value: ShopeeMarketPlaceResultType.SHOPEE_MERGE_SUCCESS };
    const marketPlaceType = SocialTypes.SHOPEE;
    const payloadParams = {
      productID: 504,
      categoryID: 101955,
      logistics:
        '[{"logistics_channel_id":70018,"logistics_channel_name":"EMS - Thailand Post","cod_enabled":true,"enabled":true,"fee_type":"SIZE_INPUT","size_list":[],"weight_limit":{"item_max_weight":20,"item_min_weight":0.01},"item_max_dimension":{"height":100,"width":100,"length":100,"unit":"cm"},"preferred":false,"force_enable":false,"mask_channel_id":0,"logistics_description":"เปิดใช้งานตัวเลือกนี้หากคุณต้องการใช้บริการจาก ไปรษณีย์ไทย Dropoff - EMS<br><br>การจัดส่งสินค้าด้วยตนเอง (Drop Off) - คุณสามารถนำพัสดุไปจัดส่งที่สาขาของไปรษณีย์ไทยด้วยตนเอง โดยปริ้นท์ใบปะหน้าพัสดุจาก Shopee Seller Centre <br><br>น้ำหนักพัสดุสูงสุดที่สามารถจัดส่งได้ คือ 20 กก. ต่อกล่อง<br>\\nขนาดพัสดุด้านใดด้านหนึ่ง (ความกว้าง ยาว หรือ สูง) ต้องไม่เกิน 100 ซม.<br>\\nขนาดพัสดุรวมสามด้าน (ความกว้าง + ยาว + สูง) ต้องไม่เกิน 200 ซม.<br><br>การจัดส่งผ่านช่องทางนี้รองรับการเก็บเงินปลายทาง<br><br>หากมีข้อสอบถามเพิ่มเติม ท่านสามารถติดต่อ help@support.shopee.co.th หรือ โทร 020178399","volume_limit":{"item_max_volume":0,"item_min_volume":0},"is_allowed":true}]',
      variantIDs: [683, 684],
      attributes:
        '[{"-100":1116702,"attribute_id":-100},{"100121":null,"100370":null,"100433":null,"100439":null,"100461":null,"100942":null,"100967":null,"100999":null,"101029":null,"101037":null,"attribute_id":100121}]',
      brand: 'CBC(ซีบีซี)',
    };

    const shopeePage = {
      sellerID: '59575129',
      accessToken: '22dc1292b3c5f9683e757bdc5f4681df',
    } as IPagesThirdParty;
    const { sellerID, accessToken } = shopeePage;
    const product = {
      id: 504,
      name: 'mRAM live 0',
      code: 'Ram-more',
      description: '<p>Ram for every persaon wRam forevery personssxcn9mjmaassarsskdksmmggjjjgggfdfdccccfdfdfdfdvxvxdsfsdfsxzczxczdsdsczxczsdfsdfsdsdsdseeee</p>',
      weight: '4.344',
      dimension: { length: '10', width: '10', height: '10' },
      dangerous: false,
      status: 1,
      tags: [
        { id: 703, name: 'Ram', mainID: 878 },
        { id: 704, name: 'computer parts', mainID: 879 },
      ],
      categories: [
        { id: 1596, name: 'Computer parts', mainID: 901, subCatID: null },
        { id: 1596, name: 'Ram', mainID: 900, subCatID: 1597 },
      ],
      variants: [
        {
          variantID: 683,
          variantSKU: 'SKU-RAM1',
          variantImages: [
            {
              id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg/1612860047349201',
              mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg',
            },
            {
              id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/12_1623124447439_Sell_Price_-feature-graphic_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1629430953377.png/1629430954136716',
              mediaLink:
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/12_1623124447439_Sell_Price_-feature-graphic_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1629430953377.png',
            },
          ],
          variantStatus: 1,
          variantReserved: 0,
          variantInventory: 115,
          variantUnitPrice: 66,
          variantAttributes: [{ id: 827, name: 'ddr1', attributeID: 662, attributeType: 'Types' }],
          variantMarketPlaceMerged: null,
        },
        {
          variantID: 684,
          variantSKU: 'SKU-776431278942',
          variantImages: [
            {
              id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg/1612860047608564',
              mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
            },
            {
              id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg/1614832547258598',
              mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
            },
          ],
          variantStatus: 1,
          variantReserved: 0,
          variantInventory: 65,
          variantUnitPrice: 77,
          variantAttributes: [{ id: 828, name: 'ddr2', attributeID: 662, attributeType: 'Types' }],
          variantMarketPlaceMerged: null,
        },
      ],
      ref: 'e03a2c7a-50e4-4e08-af61-724e59716830__p',
      images: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg/1612860046991605',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg',
        },
      ],
      marketPlaceProducts: null,
    };
    const brandObj = { brand_id: 1116702, original_brand_name: 'CBC(ซีบีซี)' };
    const attributesObj = [];
    const variantObj = [
      { name: 'ddr1', stock: 115, price: 66, variation_sku: 'SKU-RAM1' },
      { name: 'ddr2', stock: 65, price: 77, variation_sku: 'SKU-776431278942' },
    ];
    const logisticObj = [{ logistic_id: 70018, enabled: true }];
    const shopeeImageData = ['d5465ffe0798f27c4ded8dc971f87df5'];

    const shopeeCreateObj = {
      original_price: 66,
      weight: 4.344,
      item_name: 'mRAM live 0 mRAM live 0',
      description: '<p>Ram for every persaon wRam forevery personssxcn9mjmaassarsskdksmmggjjjgggfdfdccccfdfdfdfdvxvxdsfsdfsxzczxczdsdsczxczsdfsdfsdsdsdseeee</p>',
      item_status: 'NORMAL',
      dimension: { package_length: 10, package_width: 10, package_height: 10 },
      normal_stock: 180,
      logistic_info: [{ logistic_id: 70018, enabled: true }],
      attribute_list: [],
      category_id: 101955,
      image: { image_id_list: ['d5465ffe0798f27c4ded8dc971f87df5'] },
      item_sku: 'Ram-more',
      brand: { brand_id: 1116702, original_brand_name: 'CBC(ซีบีซี)' },
    };

    const shopeeProduct = {
      item_id: 11136589211,
      category_id: 101955,
      item_name: 'mRAM live 0 mRAM live 0',
      description: '<p>Ram for every persaon wRam forevery personssxcn9mjmaassarsskdksmmggjjjgggfdfdccccfdfdfdfdvxvxdsfsdfsxzczxczdsdsczxczsdfsdfsdsdsdseeee</p>',
      item_sku: 'Ram-more',
      price_info: { original_price: 66, current_price: 66 },
      stock_info: { stock_type: 2, normal_stock: 180, current_stock: 180 },
      images: { image_url_list: ['https://cf.shopee.co.th/file/d5465ffe0798f27c4ded8dc971f87df5'], image_id_list: ['d5465ffe0798f27c4ded8dc971f87df5'] },
      weight: 4.344,
      dimension: { package_length: 10, package_width: 10, package_height: 10 },
      logistic_info: [{ logistic_id: 70018, logistic_name: 'EMS - Thailand Post', enabled: true, is_free: false, estimated_shipping_fee: 61 }],
      pre_order: { is_pre_order: false, days_to_ship: 2 },
      condition: 'NEW',
      item_status: 'NORMAL',
      brand: { brand_id: 1116702, original_brand_name: 'CBC(ซีบีซี)' },
    };
    const variationPayload = {
      item_id: 11136589211,
      tier_variation: [
        {
          name: 'Types',
          option_list: [
            { option: 'ddr1', image: { image_id: 'd5465ffe0798f27c4ded8dc971f87df5' } },
            { option: 'ddr2', image: { image_id: 'd5465ffe0798f27c4ded8dc971f87df5' } },
          ],
        },
      ],
      model: [
        { tier_index: [0], normal_stock: 115, original_price: 66, model_sku: 'SKU-RAM1' },
        { tier_index: [1], normal_stock: 65, original_price: 77, model_sku: 'SKU-776431278942' },
      ],
    };
    const variation = {} as IShopeeVariationCreate;
    const isNotUpdate = false;
    const logistic = JSON.parse(payloadParams.logistics) as IShopeeLogistics[];
    const { variants } = product;
    const variantImageData = shopeeImageData;
    const imageLinks = product.images?.map(({ mediaLink }) => mediaLink);
    const variantImages = variants.map(({ variantImages }) => variantImages[0]?.mediaLink || null);

    const attributeResponse = [
      {
        attribute_id: 4360,
        attribute_name: 'Brand A',
        is_mandatory: true,
        attribute_type: 'ENUM_TYPE',
        input_type: 'DROP_DOWN',
        options: ['A 1', 'A 2', 'A 3'],
        values: [
          { original_value: 'A 1', translate_value: '' },
          { original_value: 'A 2', translate_value: '' },
          { original_value: 'A 3', translate_value: '' },
        ],
      },
      { attribute_id: 4346, attribute_name: 'Brand', is_mandatory: false, attribute_type: 'UNKNOWN', input_type: 'TEXT_FILED', options: [], values: [] },
    ];

    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(shopeePage));
    mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue([product]));
    mock(shopeeAPI, 'getCategoryAttributeFromShopeeApi', jest.fn().mockResolvedValue(attributeResponse));

    mock(helpers, 'extractShopeeLogistics', jest.fn().mockReturnValue(logisticObj));
    mock(helpers, 'extractVariantForShopee', jest.fn().mockReturnValue(variantObj));
    mock(helpers, 'extractAttributesForShopee', jest.fn().mockReturnValue(attributesObj));
    mock(helpers, 'extractBrandForShopee', jest.fn().mockReturnValue(brandObj));

    mock(productMarketPlaceService, 'uploadImagesToShopee', jest.fn().mockResolvedValueOnce(shopeeImageData).mockResolvedValueOnce(variantImageData));

    mock(helpers, 'getShopeeCreateProductObj', jest.fn().mockReturnValue(shopeeCreateObj));

    mock(shopeeAPI, 'createProductOnShopeeApi', jest.fn().mockResolvedValue(shopeeProduct));

    mock(helpers, 'extractVariationPayloadForShopee', jest.fn().mockReturnValue(variationPayload));
    mock(shopeeAPI, 'addVariationOnShopeeApi', jest.fn().mockResolvedValue(variation));

    mock(productMarketPlaceService, 'addMergeShopeeProductOnMarketPlace', jest.fn().mockResolvedValue(mergeSuccess));

    const response = await productMarketPlaceService.publishProductOnShopee(pageID, payloadParams, shopeeEnv, subscriptionID);

    expect(response).toEqual([result, mergeSuccess]);

    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [marketPlaceType] });
    expect(productMarketPlaceService.productService.getProductByID).toBeCalledWith(pageID, product.id, subscriptionID);

    expect(shopeeAPI.getCategoryAttributeFromShopeeApi).toBeCalledWith(+sellerID, accessToken, payloadParams.categoryID, LanguageTypes.ENGLISH, shopeeEnv);

    expect(helpers.extractShopeeLogistics).toBeCalledWith(logistic);
    expect(helpers.extractVariantForShopee).toBeCalledWith(variants, payloadParams.variantIDs, product.name);
    expect(helpers.extractAttributesForShopee).toBeCalledWith(payloadParams.attributes, attributeResponse);
    expect(helpers.extractBrandForShopee).toBeCalledWith(payloadParams.attributes, payloadParams.brand);

    expect(productMarketPlaceService.uploadImagesToShopee).toHaveBeenNthCalledWith(1, pageID, shopeePage, imageLinks, shopeeEnv);

    expect(productMarketPlaceService.uploadImagesToShopee).toHaveBeenNthCalledWith(2, pageID, shopeePage, variantImages, shopeeEnv);

    expect(helpers.getShopeeCreateProductObj).toBeCalledWith(payloadParams.categoryID, product, logisticObj, variantObj, attributesObj, shopeeImageData, brandObj);

    expect(shopeeAPI.createProductOnShopeeApi).toBeCalledWith(+sellerID, shopeeCreateObj, isNotUpdate, accessToken, shopeeEnv);

    expect(helpers.extractVariationPayloadForShopee).toBeCalledWith(shopeeProduct.item_id, variants, payloadParams.variantIDs, ['d5465ffe0798f27c4ded8dc971f87df5']);
    expect(shopeeAPI.addVariationOnShopeeApi).toBeCalledWith(+sellerID, accessToken, variationPayload, shopeeEnv);
    expect(productMarketPlaceService.addMergeShopeeProductOnMarketPlace).toBeCalledWith(pageID, product, shopeeProduct, variation);
  });

  test('publish product on shopee error --> publishProductOnShopee ', async () => {
    //const result = { status: 403, value: ShopeeMarketPlaceResultType.SHOPEE_MARKETPLACE_ERROR };
    const response = await productMarketPlaceService.publishProductOnShopee(pageID, undefined, shopeeEnv, subscriptionID);

    expect(response[0].status).toEqual(403);
    expect(response[0].value).toContain('SHOPEE_MARKETPLACE_ERROR');
  });

  test('publish variant on shopee error --> publishVariantToShopeeProduct ', async () => {
    const result = { status: 403, value: ShopeeMarketPlaceResultType.SHOPEE_ADD_VARIANT_ERROR };
    const response = await productMarketPlaceService.publishVariantToShopeeProduct(pageID, undefined, [1], shopeeEnv, subscriptionID);
    expect(response).toEqual([result]);
  });

  // test('publish variant on shopee success --> publishVariantToShopeeProduct ', async () => {
  //   const result = { status: 200, value: ShopeeMarketPlaceResultType.SHOPEE_ADD_VARIANT_SUCCESS };
  //   const variantIDs = [697];
  //   const marketPlaceProducts = [{ id: 2329, pageID: 344, marketPlaceID: '100944649', productID: '507', name: 'Shirts', marketPlaceType: 'shopee', active: true }];
  //   const variations = [{ name: 'Green', stock: 14, price: 22000, variation_sku: 'SKU-704558432357' }];
  //   const productPayload = JSON.stringify(moreProductForShopee);
  //   const product = JSON.parse(productPayload) as IProductByID;
  //   const { id, variants } = product;
  //   const sellerID = +thirdPartyMarketPlaceShopee[0].sellerID;
  //   const addVariationToShopeeObj: IShopeeAddVariationToProduct = {
  //     item_id: +marketPlaceProducts[0].marketPlaceID,
  //     variations,
  //   };
  //   mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue([product]));
  //   mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(thirdPartyMarketPlaceShopee[0]));
  //   mock(data, 'getProductMarketPlaceByProductID', jest.fn().mockResolvedValue(marketPlaceProducts));
  //   mock(helpers, 'extractVariantForShopee', jest.fn().mockReturnValue(variations));
  //   mock(shopeeAPI, 'addVariationOnShopeeApi', jest.fn().mockResolvedValue(shopeeVariant));
  //   mock(productMarketPlaceService, 'addMergeShopeeProductVariantOnMarketPlace', jest.fn().mockResolvedValue(shopeeVariant));
  //   const response = await productMarketPlaceService.publishVariantToShopeeProduct(pageID, product.id, variantIDs, shopeeEnv);
  //   expect(response).toEqual([result]);
  //   expect(productMarketPlaceService.productService.getProductByID).toBeCalledWith(pageID, product.id);
  //   expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [shopeeMarketPlaceType] });
  //   expect(data.getProductMarketPlaceByProductID).toBeCalledWith(PlusmarService.readerClient, pageID, id);
  //   expect(helpers.extractVariantForShopee).toBeCalledWith(variants, variantIDs, 'Shirts');
  //   expect(shopeeAPI.addVariationOnShopeeApi).toBeCalledWith(sellerID, addVariationToShopeeObj, shopeeEnv);
  //   expect(productMarketPlaceService.addMergeShopeeProductVariantOnMarketPlace).toBeCalledWith(pageID, marketPlaceProducts[0].id, shopeeVariant, variants);
  // });

  test('get logistic data from shopee success --> getShopeeLogistics ', async () => {
    const marketPlaceType = SocialTypes.SHOPEE;

    const logisticResponse = [
      {
        logistics_channel_id: 123456,
        logistics_channel_name: 'Test channel name',
        cod_enabled: false,
        enabled: false,
        fee_type: 'SIZE_INPUT',
        size_list: [],
        weight_limit: {
          item_max_weight: 0,
          item_min_weight: 0,
        },
        item_max_dimension: {
          height: 0,
          width: 0,
          length: 51,
          unit: 'cm',
        },
        volume_limit: {
          item_max_volume: 10,
          item_min_volume: 1,
        },
        preferred: false,
      },
    ];
    const sellerID = +thirdPartyMarketPlaceShopee[0].sellerID;
    const accessToken = thirdPartyMarketPlaceShopee[0].accessToken;

    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(thirdPartyMarketPlaceShopee[0]));

    mock(shopeeAPI, 'getLogisticsFromShopeeApi', jest.fn().mockResolvedValue(logisticResponse));

    const response = await productMarketPlaceService.getShopeeLogistics(pageID, shopeeEnv);

    expect(response).toEqual({ text: JSON.stringify(logisticResponse) });

    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [marketPlaceType] });

    expect(shopeeAPI.getLogisticsFromShopeeApi).toBeCalledWith(+sellerID, accessToken, shopeeEnv);
  });

  test('publish product on shopee error --> publishProductOnShopee ', async () => {
    try {
      await productMarketPlaceService.getShopeeLogistics(null, shopeeEnv);
    } catch (error) {
      expect(error).toBe('TypeError');
    }
  });

  test('publish product attrbutes on shopee error --> getShopeeCategoryAttribute ', async () => {
    try {
      const categoryID = 1001;
      await productMarketPlaceService.getShopeeCategoryAttribute(null, categoryID, shopeeMarketPlaceType, currentLang, shopeeEnv);
    } catch (error) {
      expect(error).toBe('TypeError');
    }
  });

  test('get attribute data from shopee success --> getShopeeCategoryAttribute ', async () => {
    const marketPlaceType = SocialTypes.SHOPEE;

    const attributeResponse = [
      {
        attribute_id: 4360,
        attribute_name: 'Brand A',
        is_mandatory: true,
        attribute_type: 'ENUM_TYPE',
        input_type: 'DROP_DOWN',
        options: ['A 1', 'A 2', 'A 3'],
        values: [
          { original_value: 'A 1', translate_value: '' },
          { original_value: 'A 2', translate_value: '' },
          { original_value: 'A 3', translate_value: '' },
        ],
      },
      { attribute_id: 4346, attribute_name: 'Brand', is_mandatory: false, attribute_type: 'UNKNOWN', input_type: 'TEXT_FILED', options: [], values: [] },
    ];
    const sellerID = +thirdPartyMarketPlaceShopee[0].sellerID;
    const accessToken = thirdPartyMarketPlaceShopee[0].accessToken;
    const categoryID = 1001;
    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(thirdPartyMarketPlaceShopee[0]));

    mock(shopeeAPI, 'getCategoryAttributeFromShopeeApi', jest.fn().mockResolvedValue(attributeResponse));

    const response = await productMarketPlaceService.getShopeeCategoryAttribute(pageID, categoryID, shopeeMarketPlaceType, currentLang, shopeeEnv);

    expect(response).toEqual(attributeResponse);

    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [marketPlaceType] });

    expect(shopeeAPI.getCategoryAttributeFromShopeeApi).toBeCalledWith(+sellerID, accessToken, categoryID, currentLang, shopeeEnv);
  });

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

  test('update product at marketplace-> updateSingleProductAtMarketPlaceLazada success', async () => {
    const marketPlaceVariantIDs = [8362, 8363];
    const skus = [
      {
        SkuId: 7450553248,
        SellerSku: 'SKU-840454817024',
        price: 100,
        quantity: 100,
        package_height: '3',
        package_width: '3',
        package_length: '2',
        package_weight: 22,
        Images: { Image: [] },
      },
      {
        SkuId: 7450553247,
        SellerSku: 'SKU-704558432357',
        price: 150,
        quantity: 10,
        package_height: '3',
        package_width: '3',
        package_length: '2',
        package_weight: 22,
        Images: { Image: [] },
      },
    ];

    const lazadaUpdateObj = {
      Request: {
        Product: {
          ItemId: 2225588178,
          Attributes: {
            name: 'Y Shirt',
            description: 'S',
            Images: {
              Image: [
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png',
              ],
            },
          },
          Skus: {
            Sku: [
              {
                SkuId: 7450553248,
                SellerSku: 'SKU-840454817024',
                price: 100,
                quantity: 100,
                package_height: '3',
                package_width: '3',
                package_length: '2',
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg'],
                },
              },
              {
                SkuId: 7450553247,
                SellerSku: 'SKU-704558432357',
                price: 150,
                quantity: 10,
                package_height: '3',
                package_width: '3',
                package_length: '2',
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg'],
                },
              },
            ],
          },
        },
      },
    };
    const successResponse = { status: 200, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_SUCCESS };
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    const { name, description, marketPlaceProducts, dimension, variants, weight } = productSingle;
    const [marketPlaceProduct] = marketPlaceProducts;
    const { id: productMarketPlaceID, marketPlaceID } = marketPlaceProduct;
    const images = productSingle?.images?.map((image) => image?.mediaLink) || [];
    mock(productMarketPlaceService, 'getLazadaVariantsUpdateObj', jest.fn().mockResolvedValue([skus, marketPlaceVariantIDs]));

    mock(productMarketPlaceService, 'getLazadaUpdateProductObj', jest.fn().mockReturnValue(lazadaUpdateObj));

    mock(lazadaAPI, 'updateProductOnLazadaApi', jest.fn().mockReturnValue({ code: '0' }));

    mock(productMarketPlaceService, 'updateProductMarketPlaceLocal', jest.fn().mockReturnValue({}));

    const result = await productMarketPlaceService.updateSingleProductAtMarketPlaceLazada(pageID, productSingle, accessToken, marketPlaceProducts, lazadaEnv);
    expect(result).toEqual(successResponse);
    expect(productMarketPlaceService.getLazadaVariantsUpdateObj).toBeCalledWith(pageID, productMarketPlaceID, dimension, +weight, variants);
    expect(productMarketPlaceService.getLazadaUpdateProductObj).toBeCalledWith(+marketPlaceID, name, description, images, skus);
    expect(lazadaAPI.updateProductOnLazadaApi).toBeCalledWith(accessToken, lazadaEnv, lazadaUpdateObj);
    expect(productMarketPlaceService.updateProductMarketPlaceLocal).toBeCalledWith(pageID, productMarketPlaceID, name, skus, marketPlaceVariantIDs);
  });

  test('update product at marketplace-> updateSingleProductAtMarketPlaceLazada api error', async () => {
    const marketPlaceVariantIDs = [8362, 8363];
    const skus = [
      {
        SkuId: 7450553248,
        SellerSku: 'SKU-840454817024',
        price: 100,
        quantity: 100,
        package_height: '3',
        package_width: '3',
        package_length: '2',
        package_weight: 22,
        Images: { Image: [] },
      },
      {
        SkuId: 7450553247,
        SellerSku: 'SKU-704558432357',
        price: 150,
        quantity: 10,
        package_height: '3',
        package_width: '3',
        package_length: '2',
        package_weight: 22,
        Images: { Image: [] },
      },
    ];

    const lazadaUpdateObj = {
      Request: {
        Product: {
          ItemId: 2225588178,
          Attributes: {
            name: 'Y Shirt',
            description: 'S',
            Images: {
              Image: [
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png',
              ],
            },
          },
          Skus: {
            Sku: [
              {
                SkuId: 7450553248,
                SellerSku: 'SKU-840454817024',
                price: 100,
                quantity: 100,
                package_height: '3',
                package_width: '3',
                package_length: '2',
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg'],
                },
              },
              {
                SkuId: 7450553247,
                SellerSku: 'SKU-704558432357',
                price: 150,
                quantity: 10,
                package_height: '3',
                package_width: '3',
                package_length: '2',
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg'],
                },
              },
            ],
          },
        },
      },
    };
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    const errorResponse = { status: 403, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_FAIL };

    const { name, description, marketPlaceProducts, dimension, variants, weight } = productSingle;
    const [marketPlaceProduct] = marketPlaceProducts;
    const { id: productMarketPlaceID, marketPlaceID } = marketPlaceProduct;
    const images = productSingle?.images?.map((image) => image?.mediaLink) || [];
    mock(productMarketPlaceService, 'getLazadaVariantsUpdateObj', jest.fn().mockResolvedValue([skus, marketPlaceVariantIDs]));

    mock(productMarketPlaceService, 'getLazadaUpdateProductObj', jest.fn().mockReturnValue(lazadaUpdateObj));

    mock(lazadaAPI, 'updateProductOnLazadaApi', jest.fn().mockReturnValue({ code: '1' }));

    const result = await productMarketPlaceService.updateSingleProductAtMarketPlaceLazada(pageID, productSingle, accessToken, marketPlaceProducts, lazadaEnv);
    expect(result).toEqual(errorResponse);
    expect(productMarketPlaceService.getLazadaVariantsUpdateObj).toBeCalledWith(pageID, productMarketPlaceID, dimension, +weight, variants);
    expect(productMarketPlaceService.getLazadaUpdateProductObj).toBeCalledWith(+marketPlaceID, name, description, images, skus);
    expect(lazadaAPI.updateProductOnLazadaApi).toBeCalledWith(accessToken, lazadaEnv, lazadaUpdateObj);
  });

  test('update product at marketplace-> updateSingleProductAtMarketPlaceLazada error', async () => {
    const errorResponse = { status: 403, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_FAIL };
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

    const skus = [
      {
        SkuId: 7450553248,
        SellerSku: 'SKU-840454817024',
        price: 100,
        quantity: 100,
        package_height: '3',
        package_width: '3',
        package_length: '2',
        package_weight: 22,
        Images: { Image: [] },
      },
      {
        SkuId: 7450553247,
        SellerSku: 'SKU-704558432357',
        price: 150,
        quantity: 10,
        package_height: '3',
        package_width: '3',
        package_length: '2',
        package_weight: 22,
        Images: { Image: [] },
      },
    ];

    const lazadaUpdateObj = {
      Request: {
        Product: {
          ItemId: 2225588178,
          Attributes: {
            name: 'Y Shirt',
            description: 'S',
            Images: {
              Image: [
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png',
              ],
            },
          },
          Skus: {
            Sku: [
              {
                SkuId: 7450553248,
                SellerSku: 'SKU-840454817024',
                price: 100,
                quantity: 100,
                package_height: '3',
                package_width: '3',
                package_length: '2',
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg'],
                },
              },
              {
                SkuId: 7450553247,
                SellerSku: 'SKU-704558432357',
                price: 150,
                quantity: 10,
                package_height: '3',
                package_width: '3',
                package_length: '2',
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg'],
                },
              },
            ],
          },
        },
      },
    };

    const { name, description, marketPlaceProducts, dimension, variants, weight } = productSingle;
    const [marketPlaceProduct] = marketPlaceProducts;
    const { id: productMarketPlaceID, marketPlaceID } = marketPlaceProduct;
    const images = productSingle?.images?.map((image) => image?.mediaLink) || [];
    mock(productMarketPlaceService, 'getLazadaVariantsUpdateObj', jest.fn().mockResolvedValue(undefined));

    mock(productMarketPlaceService, 'getLazadaUpdateProductObj', jest.fn().mockReturnValue(lazadaUpdateObj));

    mock(lazadaAPI, 'updateProductOnLazadaApi', jest.fn().mockReturnValue({ code: '1' }));

    const result = await productMarketPlaceService.updateSingleProductAtMarketPlaceLazada(pageID, productSingle, accessToken, marketPlaceProducts, lazadaEnv);
    expect(result).toEqual(errorResponse);
    expect(productMarketPlaceService.getLazadaVariantsUpdateObj).toBeCalledWith(pageID, productMarketPlaceID, dimension, +weight, variants);
    expect(productMarketPlaceService.getLazadaUpdateProductObj).not.toBeCalledWith(+marketPlaceID, name, description, images, skus);
    expect(lazadaAPI.updateProductOnLazadaApi).not.toBeCalledWith(accessToken, lazadaEnv, lazadaUpdateObj);
  });

  test('update product at marketplace-> updateSingleProductAtMarketPlaceLazada error', async () => {
    const skus = [
      {
        SkuId: 7450553248,
        SellerSku: 'SKU-840454817024',
        price: 100,
        quantity: 100,
        package_height: '3',
        package_width: '3',
        package_length: '2',
        package_weight: 22,
        Images: { Image: [] },
      },
      {
        SkuId: 7450553247,
        SellerSku: 'SKU-704558432357',
        price: 150,
        quantity: 10,
        package_height: '3',
        package_width: '3',
        package_length: '2',
        package_weight: 22,
        Images: { Image: [] },
      },
    ];

    const lazadaUpdateObj = {
      Request: {
        Product: {
          ItemId: 2225588178,
          Attributes: {
            name: 'Y Shirt',
            description: 'S',
            Images: {
              Image: [
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png',
              ],
            },
          },
          Skus: {
            Sku: [
              {
                SkuId: 7450553248,
                SellerSku: 'SKU-840454817024',
                price: 100,
                quantity: 100,
                package_height: '3',
                package_width: '3',
                package_length: '2',
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg'],
                },
              },
              {
                SkuId: 7450553247,
                SellerSku: 'SKU-704558432357',
                price: 150,
                quantity: 10,
                package_height: '3',
                package_width: '3',
                package_length: '2',
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg'],
                },
              },
            ],
          },
        },
      },
    };

    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    const errorResponse = { status: 403, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_FAIL };

    const { name, description, marketPlaceProducts, dimension, variants, weight } = productSingle;
    const [marketPlaceProduct] = marketPlaceProducts;
    const { id: productMarketPlaceID, marketPlaceID } = marketPlaceProduct;
    const images = productSingle?.images?.map((image) => image?.mediaLink) || [];
    mock(productMarketPlaceService, 'getLazadaVariantsUpdateObj', jest.fn().mockResolvedValue(undefined));

    mock(productMarketPlaceService, 'getLazadaUpdateProductObj', jest.fn().mockReturnValue(lazadaUpdateObj));

    mock(lazadaAPI, 'updateProductOnLazadaApi', jest.fn().mockReturnValue({ code: '1' }));

    const result = await productMarketPlaceService.updateSingleProductAtMarketPlaceLazada(pageID, productSingle, accessToken, marketPlaceProducts, lazadaEnv);
    expect(result).toEqual(errorResponse);
    expect(productMarketPlaceService.getLazadaVariantsUpdateObj).toBeCalledWith(pageID, productMarketPlaceID, dimension, +weight, variants);
    expect(productMarketPlaceService.getLazadaUpdateProductObj).not.toBeCalledWith(+marketPlaceID, name, description, images, skus);
    expect(lazadaAPI.updateProductOnLazadaApi).not.toBeCalledWith(accessToken, lazadaEnv, lazadaUpdateObj);
  });

  test('update product at marketplace-> updateMultipleProductAtMarketPlaceLazada success', async () => {
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    const successResponse = { status: 200, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_SUCCESS };

    const skus = [
      {
        SkuId: 7451076702,
        SellerSku: 'SKU-776431278942',
        price: 200,
        quantity: 100,
        package_height: 43,
        package_width: 34,
        package_length: 23,
        package_weight: 2,
        Images: {
          Image: [
            'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
            'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
          ],
        },
      },
    ];
    const marketPlaceVariantIDs = [8365];
    const lazadaUpdateObj = {
      Request: {
        Product: {
          ItemId: 2225783726,
          Attributes: {
            name: 'Ram for-ddr2',
            description: '<p>Ram for everyone 333</p>',
            Images: {
              Image: [
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546610.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546920.jpg',
              ],
            },
          },
          Skus: {
            Sku: [
              {
                SkuId: 7451076702,
                SellerSku: 'SKU-776431278942',
                price: 200,
                quantity: 100,
                package_height: 43,
                package_width: 34,
                package_length: 23,
                package_weight: 2,
                Images: {
                  Image: [
                    'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
                    'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
                  ],
                },
              },
            ],
          },
        },
      },
    };
    const productAttributes = [{ id: 828, name: 'ddr2' }];
    const { name, description, marketPlaceProducts, dimension, variants, weight } = productMultiple;
    const [marketPlaceProduct] = marketPlaceProducts;
    const { id: productMarketPlaceID, marketPlaceID } = marketPlaceProduct;
    const images = productMultiple?.images?.map((image) => image?.mediaLink) || [];

    mock(productMarketPlaceService, 'getLazadaVariantsUpdateObj', jest.fn().mockResolvedValue([skus, marketPlaceVariantIDs]));

    mock(productMarketPlaceService, 'getProductNameWithAttribute', jest.fn().mockReturnValue('Ram for'));

    mock(productMarketPlaceService, 'getLazadaUpdateProductObj', jest.fn().mockReturnValue(lazadaUpdateObj));

    mock(lazadaAPI, 'updateProductOnLazadaApi', jest.fn().mockReturnValue({ code: '0' }));

    mock(productMarketPlaceService, 'updateProductMarketPlaceLocal', jest.fn().mockReturnValue({}));

    const result = await productMarketPlaceService.updateMultipleProductAtMarketPlaceLazada(pageID, productMultiple, accessToken, marketPlaceProducts, lazadaEnv);
    expect(result).toEqual(successResponse);

    expect(productMarketPlaceService.getLazadaVariantsUpdateObj).toBeCalledWith(pageID, productMarketPlaceID, dimension, +weight, variants);
    expect(productMarketPlaceService.getProductNameWithAttribute).toBeCalledWith(productMultiple.name, productAttributes);

    expect(productMarketPlaceService.getLazadaUpdateProductObj).toBeCalledWith(+marketPlaceID, name, description, images, skus);
    expect(lazadaAPI.updateProductOnLazadaApi).toBeCalledWith(accessToken, lazadaEnv, lazadaUpdateObj);
    expect(productMarketPlaceService.updateProductMarketPlaceLocal).toBeCalledWith(pageID, productMarketPlaceID, name, skus, marketPlaceVariantIDs);
  });

  test('update product at marketplace-> updateMultipleProductAtMarketPlaceLazada api error', async () => {
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;
    const errorResponse = { status: 403, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_FAIL };

    const skus = [
      {
        SkuId: 7451076702,
        SellerSku: 'SKU-776431278942',
        price: 200,
        quantity: 100,
        package_height: 43,
        package_width: 34,
        package_length: 23,
        package_weight: 2,
        Images: {
          Image: [
            'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
            'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
          ],
        },
      },
    ];
    const marketPlaceVariantIDs = [8365];
    const lazadaUpdateObj = {
      Request: {
        Product: {
          ItemId: 2225783726,
          Attributes: {
            name: 'Ram for-ddr2',
            description: '<p>Ram for everyone 333</p>',
            Images: {
              Image: [
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546610.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546920.jpg',
              ],
            },
          },
          Skus: {
            Sku: [
              {
                SkuId: 7451076702,
                SellerSku: 'SKU-776431278942',
                price: 200,
                quantity: 100,
                package_height: 43,
                package_width: 34,
                package_length: 23,
                package_weight: 2,
                Images: {
                  Image: [
                    'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
                    'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
                  ],
                },
              },
            ],
          },
        },
      },
    };
    const productAttributes = [{ id: 828, name: 'ddr2' }];
    const { name, description, marketPlaceProducts, dimension, variants, weight } = productMultiple;
    const [marketPlaceProduct] = marketPlaceProducts;
    const { id: productMarketPlaceID, marketPlaceID } = marketPlaceProduct;
    const images = productMultiple?.images?.map((image) => image?.mediaLink) || [];

    mock(productMarketPlaceService, 'getLazadaVariantsUpdateObj', jest.fn().mockResolvedValue([skus, marketPlaceVariantIDs]));

    mock(productMarketPlaceService, 'getProductNameWithAttribute', jest.fn().mockReturnValue('Ram for'));

    mock(productMarketPlaceService, 'getLazadaUpdateProductObj', jest.fn().mockReturnValue(lazadaUpdateObj));

    mock(lazadaAPI, 'updateProductOnLazadaApi', jest.fn().mockReturnValue({ code: '1' }));

    mock(productMarketPlaceService, 'updateProductMarketPlaceLocal', jest.fn().mockReturnValue({}));

    const result = await productMarketPlaceService.updateMultipleProductAtMarketPlaceLazada(pageID, productMultiple, accessToken, marketPlaceProducts, lazadaEnv);
    expect(result).toEqual(errorResponse);

    expect(productMarketPlaceService.getLazadaVariantsUpdateObj).toBeCalledWith(pageID, productMarketPlaceID, dimension, +weight, variants);
    expect(productMarketPlaceService.getProductNameWithAttribute).toBeCalledWith(productMultiple.name, productAttributes);

    expect(productMarketPlaceService.getLazadaUpdateProductObj).toBeCalledWith(+marketPlaceID, name, description, images, skus);
    expect(lazadaAPI.updateProductOnLazadaApi).toBeCalledWith(accessToken, lazadaEnv, lazadaUpdateObj);
    expect(productMarketPlaceService.updateProductMarketPlaceLocal).not.toBeCalledWith(pageID, productMarketPlaceID, name, skus, marketPlaceVariantIDs);
  });

  test('update product at marketplace-> updateMultipleProductAtMarketPlaceLazada error', async () => {
    const errorResponse = { status: 403, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_FAIL };
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

    const skus = [
      {
        SkuId: 7451076702,
        SellerSku: 'SKU-776431278942',
        price: 200,
        quantity: 100,
        package_height: 43,
        package_width: 34,
        package_length: 23,
        package_weight: 2,
        Images: {
          Image: [
            'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
            'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
          ],
        },
      },
    ];
    const marketPlaceVariantIDs = [8365];
    const lazadaUpdateObj = {
      Request: {
        Product: {
          ItemId: 2225783726,
          Attributes: {
            name: 'Ram for-ddr2',
            description: '<p>Ram for everyone 333</p>',
            Images: {
              Image: [
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546610.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546920.jpg',
              ],
            },
          },
          Skus: {
            Sku: [
              {
                SkuId: 7451076702,
                SellerSku: 'SKU-776431278942',
                price: 200,
                quantity: 100,
                package_height: 43,
                package_width: 34,
                package_length: 23,
                package_weight: 2,
                Images: {
                  Image: [
                    'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
                    'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
                  ],
                },
              },
            ],
          },
        },
      },
    };
    const productAttributes = [{ id: 828, name: 'ddr2' }];
    const { name, description, marketPlaceProducts, dimension, variants, weight } = productMultiple;
    const [marketPlaceProduct] = marketPlaceProducts;
    const { id: productMarketPlaceID, marketPlaceID } = marketPlaceProduct;
    const images = productMultiple?.images?.map((image) => image?.mediaLink) || [];

    mock(productMarketPlaceService, 'getLazadaVariantsUpdateObj', jest.fn().mockResolvedValue(undefined));

    mock(productMarketPlaceService, 'getProductNameWithAttribute', jest.fn().mockReturnValue('Ram for'));

    mock(productMarketPlaceService, 'getLazadaUpdateProductObj', jest.fn().mockReturnValue(lazadaUpdateObj));

    mock(lazadaAPI, 'updateProductOnLazadaApi', jest.fn().mockReturnValue({ code: '1' }));

    mock(productMarketPlaceService, 'updateProductMarketPlaceLocal', jest.fn().mockReturnValue({}));

    const result = await productMarketPlaceService.updateMultipleProductAtMarketPlaceLazada(pageID, productMultiple, accessToken, marketPlaceProducts, lazadaEnv);
    expect(result).toEqual(errorResponse);

    expect(productMarketPlaceService.getLazadaVariantsUpdateObj).toBeCalledWith(pageID, productMarketPlaceID, dimension, +weight, variants);
    expect(productMarketPlaceService.getProductNameWithAttribute).not.toBeCalledWith(productMultiple.name, productAttributes);

    expect(productMarketPlaceService.getLazadaUpdateProductObj).not.toBeCalledWith(+marketPlaceID, name, description, images, skus);
    expect(lazadaAPI.updateProductOnLazadaApi).not.toBeCalledWith(accessToken, lazadaEnv, lazadaUpdateObj);
    expect(productMarketPlaceService.updateProductMarketPlaceLocal).not.toBeCalledWith(pageID, productMarketPlaceID, name, skus, marketPlaceVariantIDs);
  });

  test('update product at marketplace-> updateMultipleProductAtMarketPlaceLazada error', async () => {
    const accessToken = thirdPartyMarketPlaceLazada[0].accessToken;

    const skus = [
      {
        SkuId: 7451076702,
        SellerSku: 'SKU-776431278942',
        price: 200,
        quantity: 100,
        package_height: 43,
        package_width: 34,
        package_length: 23,
        package_weight: 2,
        Images: {
          Image: [
            'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
            'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
          ],
        },
      },
    ];
    const marketPlaceVariantIDs = [8365];

    const lazadaUpdateObj = {
      Request: {
        Product: {
          ItemId: 2225783726,
          Attributes: {
            name: 'Ram for-ddr2',
            description: '<p>Ram for everyone 333</p>',
            Images: {
              Image: [
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546610.jpg',
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546920.jpg',
              ],
            },
          },
          Skus: {
            Sku: [
              {
                SkuId: 7451076702,
                SellerSku: 'SKU-776431278942',
                price: 200,
                quantity: 100,
                package_height: 43,
                package_width: 34,
                package_length: 23,
                package_weight: 2,
                Images: {
                  Image: [
                    'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
                    'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
                  ],
                },
              },
            ],
          },
        },
      },
    };
    const errorResponse = { status: 403, value: UpdateMarketPlaceResultType.LAZADA_MARKETPLACE_UPDATE_FAIL };
    const productAttributes = [{ id: 828, name: 'ddr2' }];
    const { name, description, marketPlaceProducts, dimension, variants, weight } = productMultiple;
    const [marketPlaceProduct] = marketPlaceProducts;
    const { id: productMarketPlaceID, marketPlaceID } = marketPlaceProduct;
    const images = productMultiple?.images?.map((image) => image?.mediaLink) || [];

    mock(productMarketPlaceService, 'getLazadaVariantsUpdateObj', jest.fn().mockResolvedValue(undefined));

    mock(productMarketPlaceService, 'getProductNameWithAttribute', jest.fn().mockReturnValue('Ram for'));

    mock(productMarketPlaceService, 'getLazadaUpdateProductObj', jest.fn().mockReturnValue(lazadaUpdateObj));

    mock(lazadaAPI, 'updateProductOnLazadaApi', jest.fn().mockReturnValue({ code: '1' }));

    mock(productMarketPlaceService, 'updateProductMarketPlaceLocal', jest.fn().mockReturnValue({}));

    const result = await productMarketPlaceService.updateMultipleProductAtMarketPlaceLazada(pageID, productMultiple, accessToken, marketPlaceProducts, lazadaEnv);
    expect(result).toEqual(errorResponse);

    expect(productMarketPlaceService.getLazadaVariantsUpdateObj).toBeCalledWith(pageID, productMarketPlaceID, dimension, +weight, variants);
    expect(productMarketPlaceService.getProductNameWithAttribute).not.toBeCalledWith(productMultiple.name, productAttributes);

    expect(productMarketPlaceService.getLazadaUpdateProductObj).not.toBeCalledWith(+marketPlaceID, name, description, images, skus);
    expect(lazadaAPI.updateProductOnLazadaApi).not.toBeCalledWith(accessToken, lazadaEnv, lazadaUpdateObj);
    expect(productMarketPlaceService.updateProductMarketPlaceLocal).not.toBeCalledWith(pageID, productMarketPlaceID, name, skus, marketPlaceVariantIDs);
  });

  test('update product at marketplace-> updateProductMarketPlaceLocal', async () => {
    const marketPlaceVariantIDs = [8363, 8362];
    const skus = [
      {
        SkuId: 7450553247,
        SellerSku: 'SKU-704558432357',
        price: 150,
        quantity: 10,
        package_height: 3,
        package_width: 3,
        package_length: 2,
        package_weight: 22,
        Images: { Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg'] },
      },
      {
        SkuId: 7450553248,
        SellerSku: 'SKU-840454817024',
        price: 100,
        quantity: 100,
        package_height: 3,
        package_width: 3,
        package_length: 2,
        package_weight: 22,
        Images: { Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg'] },
      },
    ] as ILazadaSkuDetails[];
    const name = 'Y Shirt wow';
    const productMarketPlaceID = 2209;

    await productMarketPlaceService.updateProductMarketPlaceLocal(pageID, productMarketPlaceID, name, skus, marketPlaceVariantIDs);
    expect(PostgresHelper.execBeginBatchTransaction).toBeCalled();
    expect(data.updateMarketPlaceProductNameByID).toBeCalled();
    expect(data.updateMarketPlaceVariantPriceByID).toBeCalledTimes(2);
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalled();
  });

  test('get lazada update product at marketplace-> getLazadaUpdateProductObj', () => {
    const skus = [
      {
        SkuId: 7450553247,
        SellerSku: 'SKU-704558432357',
        price: 150,
        quantity: 10,
        package_height: 3,
        package_width: 3,
        package_length: 2,
        package_weight: 22,
        Images: { Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg'] },
      },
      {
        SkuId: 7450553248,
        SellerSku: 'SKU-840454817024',
        price: 100,
        quantity: 100,
        package_height: 3,
        package_width: 3,
        package_length: 2,
        package_weight: 22,
        Images: { Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg'] },
      },
    ] as ILazadaSkuDetails[];

    const lazadaObjEmpty = { Request: { Product: { ItemId: null, Images: { Image: [] }, Attributes: { name: null, description: null }, Skus: { Sku: [] } } } };
    const images = [
      'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg',
      'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png',
      'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png',
    ];
    const description = 'ddd';
    const name = 'Y Shirt';
    const marketPlaceID = 2225588178;
    const lazadaUpdateObj = {
      Request: {
        Product: {
          ItemId: 2225588178,
          Images: {
            Image: [
              'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1613473321700.jpg',
              'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/passport_default_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196141476.png',
              'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/u618_b3519c90-0d6b-492b-8f3b-d4f3efa40985_507_1615196493540.png',
            ],
          },
          Attributes: {
            name: 'Y Shirt',
            description: 'ddd',
          },
          Skus: {
            Sku: [
              {
                SkuId: 7450553247,
                SellerSku: 'SKU-704558432357',
                price: 150,
                quantity: 10,
                package_height: 3,
                package_width: 3,
                package_length: 2,
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg'],
                },
              },
              {
                SkuId: 7450553248,
                SellerSku: 'SKU-840454817024',
                price: 100,
                quantity: 100,
                package_height: 3,
                package_width: 3,
                package_length: 2,
                package_weight: 22,
                Images: {
                  Image: ['https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg'],
                },
              },
            ],
          },
        },
      },
    };

    mock(domains, 'getLazadaUpdateProductObj', jest.fn().mockReturnValue(lazadaObjEmpty));
    const result = productMarketPlaceService.getLazadaUpdateProductObj(marketPlaceID, name, description, images, skus);
    expect(result).toEqual(lazadaUpdateObj);
  });

  test('get lazada variant update obj-> getLazadaVariantsUpdateObj success', async () => {
    const package_weight = 22;
    const variants = [
      {
        variantID: 697,
        variantSKU: 'SKU-704558432357',
        variantImages: [],
        variantStatus: 1,
        variantInventory: 10,
        variantUnitPrice: 150,
        variantAttributes: [
          {
            id: 808,
            name: 'Green',
          },
        ],
        variantMarketPlaceMerged: [
          {
            marketPlaceVariantID: '8363',
            marketPlaceVariantSku: 'SKU-704558432357',
            marketPlaceVariantType: 'lazada',
          },
        ],
      },
      {
        variantID: 698,
        variantSKU: 'SKU-840454817024',
        variantImages: [],
        variantStatus: 1,
        variantInventory: 100,
        variantUnitPrice: 100,
        variantAttributes: [
          {
            id: 804,
            name: 'Pink',
          },
        ],
        variantMarketPlaceMerged: [
          {
            marketPlaceVariantID: '8362',
            marketPlaceVariantSku: 'SKU-840454817024',
            marketPlaceVariantType: 'lazada',
          },
        ],
      },
      {
        variantID: 699,
        variantSKU: 'SKU-981610857778',
        variantImages: [],
        variantStatus: 1,
        variantInventory: 204,
        variantUnitPrice: 50,
        variantAttributes: [
          {
            id: 805,
            name: 'Yello',
          },
        ],
        variantMarketPlaceMerged: null,
      },
    ] as IVariantsOfProductByID[];
    const dimension = { length: 2, width: 3, height: 3 };
    const id = 2209;
    const pageID = 344;
    const marketPlaceVariants = [
      {
        id: 8363,
        productMarketPlaceID: '2209',
        productVariantID: 697,
        name: '',
        sku: 'SKU-704558432357',
        unitPrice: 150,
        inventory: 10,
        marketPlaceType: 'lazada',
        variantJson:
          // eslint-disable-next-line max-len
          '{"Status":"active","quantity":10,"Images":["https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/green_b3519c90-0d6b-492b-8f3b-d4f3efa40985_697_1613473322450.jpg"],"SellerSku":"SKU-704558432357","ShopSku":"2225588178_TH-7450553247","Url":"https://www.lazada.co.th/-i2225588178-s7450553247.html","multiWarehouseInventories":[{"quantity":10,"warehouseCode":"dropshipping"}],"package_width":"3","color_family":"Apricot","package_height":"3","size":"CN:80B","special_price":0,"price":150,"package_length":"2","package_weight":"22","SkuId":7450553247}',
        active: true,
      },
      {
        id: 8362,
        productMarketPlaceID: '2209',
        productVariantID: 698,
        name: '',
        sku: 'SKU-840454817024',
        unitPrice: 100,
        inventory: 100,
        marketPlaceType: 'lazada',
        variantJson:
          // eslint-disable-next-line max-len
          '{"Status":"active","quantity":100,"Images":["https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg"],"SellerSku":"SKU-840454817024","ShopSku":"2225588178_TH-7450553248","Url":"https://www.lazada.co.th/-i2225588178-s7450553248.html","multiWarehouseInventories":[{"quantity":100,"warehouseCode":"dropshipping"}],"package_width":"3","color_family":"Avocado","package_height":"3","size":"EU:36.5","special_price":0,"price":100,"package_length":"2","package_weight":"22","SkuId":7450553248}',
        active: true,
      },
    ];
    const [skus, marketPlaceVariantIDs] = [
      [
        {
          SkuId: 7450553247,
          SellerSku: 'SKU-704558432357',
          Status: 'active',
          price: 150,
          package_height: 3,
          package_width: 3,
          package_length: 2,
          package_weight: 22,
          Images: { Image: [] },
        },
        {
          SkuId: 7450553248,
          SellerSku: 'SKU-840454817024',
          Status: 'active',
          price: 100,
          package_height: 3,
          package_width: 3,
          package_length: 2,
          package_weight: 22,
          Images: { Image: [] },
        },
      ],
      [8363, 8362],
    ];
    mock(productMarketPlaceService, 'getProductMarketPlaceVariantList', jest.fn().mockResolvedValue(marketPlaceVariants));

    const result = await productMarketPlaceService.getLazadaVariantsUpdateObj(pageID, id, dimension, package_weight, variants);
    expect(result).toEqual([skus, marketPlaceVariantIDs]);
  });

  test('get lazada variant update obj-> getLazadaVariantsUpdateObj error', async () => {
    try {
      const package_weight = 22;
      const variants = [
        {
          variantID: 697,
          variantSKU: 'SKU-704558432357',
          variantImages: [],
          variantStatus: 1,
          variantInventory: 10,
          variantUnitPrice: 150,
          variantAttributes: [
            {
              id: 808,
              name: 'Green',
            },
          ],
          variantMarketPlaceMerged: [
            {
              marketPlaceVariantID: '8363',
              marketPlaceVariantSku: 'SKU-704558432357',
              marketPlaceVariantType: 'lazada',
            },
          ],
        },
        {
          variantID: 698,
          variantSKU: 'SKU-840454817024',
          variantImages: [],
          variantStatus: 1,
          variantInventory: 100,
          variantUnitPrice: 100,
          variantAttributes: [
            {
              id: 804,
              name: 'Pink',
            },
          ],
          variantMarketPlaceMerged: [
            {
              marketPlaceVariantID: '8362',
              marketPlaceVariantSku: 'SKU-840454817024',
              marketPlaceVariantType: 'lazada',
            },
          ],
        },
        {
          variantID: 699,
          variantSKU: 'SKU-981610857778',
          variantImages: [],
          variantStatus: 1,
          variantInventory: 204,
          variantUnitPrice: 50,
          variantAttributes: [
            {
              id: 805,
              name: 'Yello',
            },
          ],
          variantMarketPlaceMerged: null,
        },
      ] as IVariantsOfProductByID[];
      const dimension = { length: 2, width: 3, height: 3 };
      const id = 2209;
      const pageID = 344;
      const marketPlaceVariants = undefined;

      mock(productMarketPlaceService, 'getProductMarketPlaceVariantList', jest.fn().mockResolvedValue(marketPlaceVariants));

      await productMarketPlaceService.getLazadaVariantsUpdateObj(pageID, id, dimension, package_weight, variants);
    } catch (error) {
      expect(error.message).toBe('NO_MARKETPLACE_VARIANT_MERGED');
    }
  });

  test('update shopee product-> updateProductAtShopeeMarketPlace success', async () => {
    const product = {
      id: 504,
      name: 'mRAM live 0',
      code: 'Ram-more',
      description: '<p>Ram for every persaon wRam forevery personssxcn9mjmaassarsskdksmmggjjjgggfdfdccccfdfdfdfdvxvxdsfsdfsxzczxczdsdsczx</p>',
      weight: '4.344',
      dimension: { length: 10, width: 10, height: 10 },
      dangerous: false,
      status: 1,
      tags: [
        { id: 703, name: 'Ram', mainID: 878 },
        { id: 704, name: 'computer parts', mainID: 879 },
      ],
      categories: [
        { id: 1596, name: 'Computer parts', mainID: 901, subCatID: null },
        { id: 1596, name: 'Ram', mainID: 900, subCatID: 1597 },
      ],
      variants: [
        {
          variantID: 683,
          variantSKU: 'SKU-RAM1',
          variantImages: [
            {
              id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg/1612860047349201',
              mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg',
            },
            {
              id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/12_1623124447439_Sell_Price_-feature-graphic_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1629430953377.png/1629430954136716',
              mediaLink:
                'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/12_1623124447439_Sell_Price_-feature-graphic_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1629430953377.png',
            },
          ],
          variantStatus: 1,
          variantReserved: 0,
          variantWithholding: 0,
          variantInventory: 115,
          variantUnitPrice: 66,
          variantAttributes: [{ id: 827, name: 'ddr1', attributeID: 662, attributeType: 'Types' }],
          variantMarketPlaceMerged: [{ marketPlaceVariantID: '14998', marketPlaceVariantSku: 'SKU-RAM1', marketPlaceVariantType: 'shopee' }],
        },
        {
          variantID: 684,
          variantSKU: 'SKU-776431278942',
          variantWithholding: 0,
          variantImages: [
            {
              id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg/1612860047608564',
              mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
            },
            {
              id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg/1614832547258598',
              mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirts_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1614832546894.jpg',
            },
          ],
          variantStatus: 1,
          variantReserved: 0,
          variantInventory: 65,
          variantUnitPrice: 77,
          variantAttributes: [{ id: 828, name: 'ddr2', attributeID: 662, attributeType: 'Types' }],
          variantMarketPlaceMerged: [{ marketPlaceVariantID: '14999', marketPlaceVariantSku: 'SKU-776431278942', marketPlaceVariantType: 'shopee' }],
        },
      ],
      ref: 'e03a2c7a-50e4-4e08-af61-724e59716830__p',
      images: [
        {
          id: 'resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg/1612860046991605',
          mediaLink: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-main_b3519c90-0d6b-492b-8f3b-d4f3efa40985_504_1612860046399.jpg',
        },
      ],
      marketPlaceProducts: [{ id: 5121, name: 'mRAM live 0', active: true, pageID: 344, productID: 504, marketPlaceID: 11136589211, marketPlaceType: 'shopee' }],
    } as unknown as IProductByID;
    const thirdParty = {
      id: 1094,
      pageID: 344,
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '369b23b2190bddbe73fba34cd742b8ee',
      accessTokenExpire: '2021-08-24 11:08:00',
      pageType: SocialTypes.SHOPEE,
      refreshToken: '55ef421a2ebeb1700f8ee83bb108bf7d',
      refreshTokenExpire: '2021-09-23 07:09:00',
      createdAt: '2021-08-02T04:34:01.000Z',
      updatedAt: '2021-08-24T07:10:00.000Z',
      payload:
        '{"shop_id":59575129,"error":"","access_token":"a83ad6ec1e02797498356e7a439a781190c1125284f7cc65592122e9b43cb79e1f06e3ce96fa633d","expire_in":14400,"message":"","request_id":"be04b90af34921ecd456d5c9d862ad75","partner_id":2000601,"refresh_token":"b4b62c0ee01838e6cf50ed5681ea6e98b3eeaa897e58691b8c71e720191f52851f06e3ce96fa633d"}',
    } as unknown as IPagesThirdParty;
    const shopeeMarketPlaceProduct = { id: 5121, name: 'mRAM live 0', active: true, pageID: 344, productID: 504, marketPlaceID: '11136589211', marketPlaceType: 'shopee' };
    const { sellerID: shopID, accessToken } = thirdParty;

    const { marketPlaceID, id } = shopeeMarketPlaceProduct;

    const shopeeProduct = {
      item_id: 11136589211,
      category_id: 101955,
      item_name: 'mRAM live 0 mRAM live 0',
      description: '<p>Ram for every persaon wRam forevery personssxcn9mjmaassarsskdksmmggjjjgggfdfdccccfdfdfdfdvxvxdsfsdfsxzczxczdsdsczxczsdfsdfsdsdsdseeee</p>',
      item_sku: 'Ram-more',
      create_time: 1629784630,
      update_time: 1629784635,
      image: { image_url_list: ['https://cf.shopee.co.th/file/d5465ffe0798f27c4ded8dc971f87df5'], image_id_list: ['d5465ffe0798f27c4ded8dc971f87df5'] },
      weight: '4.344',
      dimension: { package_length: 10, package_width: 10, package_height: 10 },
      logistic_info: [{ logistic_id: 70018, logistic_name: 'EMS - Thailand Post', enabled: true, is_free: false, estimated_shipping_fee: 61 }],
      pre_order: { is_pre_order: false, days_to_ship: 2 },
      condition: 'NEW',
      size_chart: '',
      item_status: 'NORMAL',
      has_model: true,
      brand: { brand_id: 1116702, original_brand_name: 'CBC(ซีบีซี)' },
      item_dangerous: 0,
    };
    const updatePayload = {
      item_name: 'mRAM live 0 mRAM live 0',
      description: '<p>Ram for every persaon wRam forevery personssxcn9mjmaassarsskdksmmggjjjgggfdfdccccfdfdfdfdvxvxdsfsdfsxzczxczdsdsczx</p>',
      item_sku: 'Ram-more',
      condition: 'NEW',
      pre_order: { is_pre_order: false, days_to_ship: 2 },
      category_id: 101955,
      item_id: 11136589211,
      logistic_info: [{ logistic_id: 70018, logistic_name: 'EMS - Thailand Post', enabled: true, is_free: false, estimated_shipping_fee: 61 }],
      weight: 4.344,
      dimension: { package_height: 10, package_length: 10, package_width: 10 },
    };
    const response = {
      item_id: 11136589211,
      category_id: 101955,
      item_name: 'mRAM live 0 mRAM live 0',
      description: '<p>Ram for every persaon wRam forevery personssxcn9mjmaassarsskdksmmggjjjgggfdfdccccfdfdfdfdvxvxdsfsdfsxzczxczdsdsczx</p>',
      item_sku: 'Ram-more',
      images: { image_url_list: ['https://cf.shopee.co.th/file/d5465ffe0798f27c4ded8dc971f87df5'], image_id_list: ['d5465ffe0798f27c4ded8dc971f87df5'] },
      weight: 4.344,
      dimension: { package_length: 10, package_width: 10, package_height: 10 },
      logistic_info: [{ logistic_id: 70018, logistic_name: 'EMS - Thailand Post', enabled: true, is_free: false, estimated_shipping_fee: 61 }],
      pre_order: { is_pre_order: false, days_to_ship: 2 },
      condition: 'NEW',
      item_status: 'NORMAL',
      brand: { brand_id: 1116702, original_brand_name: 'CBC(ซีบีซี)' },
    };

    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(thirdParty));

    mock(shopeeAPI, 'getProductBaseInfoFromShopeeApi', jest.fn().mockResolvedValue([shopeeProduct]));

    mock(helpers, 'getShopeeUpdateProductPayload', jest.fn().mockReturnValue(updatePayload));

    mock(shopeeAPI, 'updateProductOnShopeeApi', jest.fn().mockResolvedValue(response));

    mock(data, 'updateMarketPlaceProductJSON', jest.fn().mockResolvedValue({}));

    const result = await productMarketPlaceService.updateProductAtShopeeMarketPlace(pageID, thirdParty, SocialTypes.SHOPEE, product, shopeeEnv);
    expect(result).toEqual({ status: 200, value: UpdateMarketPlaceResultType.SHOPEE_MARKETPLACE_UPDATE_SUCCESS });

    expect(shopeeAPI.getProductBaseInfoFromShopeeApi).toBeCalledWith(+shopID, accessToken, [+marketPlaceID], shopeeEnv);

    expect(helpers.getShopeeUpdateProductPayload).toBeCalledWith(product, shopeeProduct);

    expect(shopeeAPI.updateProductOnShopeeApi).toBeCalledWith(+shopID, updatePayload, accessToken, shopeeEnv);

    expect(data.updateMarketPlaceProductJSON).toBeCalledWith(pageID, id, JSON.stringify(response), PlusmarService.readerClient);
  });

  test('update shopee product-> updateProductAtShopeeMarketPlace error', async () => {
    try {
      const response = { status: 403, value: "Cannot destructure property 'sellerID" };
      const result = await productMarketPlaceService.updateProductAtShopeeMarketPlace(pageID, null, SocialTypes.SHOPEE, shopeeProductByID, shopeeEnv);
      expect(result.value).toContain(response.value);
    } catch (error) {
      expect(error).toContain("Cannot destructure property 'sellerID'");
    }
  });

  test('updateCronMarketPlaceOrders -> insert and update orders of marketplaces', async () => {
    const lazadaMarketType = SocialTypes.LAZADA;
    const shopeeMarketType = SocialTypes.SHOPEE;
    const allThirdPartyMarketPlaces = [
      {
        id: 150,
        pageID: 238,
        sellerID: '1000027285',
        name: 'Geldtoner',
        picture: '',
        url: 'https://www.lazada.co.th/shop/geldtoner',
        accessToken: '50000401421cFMhuelqbWRcAjDTiOWVEo1cc55481htHYExWGhbmpSFPsQu87KC7',
        accessTokenExpire: '2021-04-10 06:04:00',
        pageType: 'lazada',
        refreshToken: '50001400821dWifr8lApaPpDgbJYGMRB010cc1268sC7EBwhrwYGgHymz8vFU1DB',
        refreshTokenExpire: '2021-04-08 06:04:42',
        updatedAt: new Date('2021-04-03T06:10:00.000Z'),
        createdAt: new Date('2021-03-09T06:30:43.000Z'),
        payload: '',
      },
      {
        id: 197,
        pageID: 344,
        sellerID: '59575129',
        name: 'Geldtonner',
        picture: '',
        url: 'https://shopee.co.th/shop/geldtonner',
        accessToken: '53062c193f6abe8aa44d46b108e6e622',
        accessTokenExpire: '2021-05-12 13:05:34',
        pageType: 'shopee',
        refreshToken: '4d8c150ead84aa17d7d5776e4da8550d',
        refreshTokenExpire: '2021-06-11 09:06:34',
        updatedAt: new Date('2021-05-12T09:28:34.000Z'),
        createdAt: new Date('2021-04-20T06:24:43.000Z'),
        payload: '',
      },
      {
        id: 196,
        pageID: 344,
        sellerID: '100189392074',
        name: 'Khappom Shop',
        picture: '',
        url: 'https://www.lazada.co.th/shop/khappom-shop',
        accessToken: '50000401d16uV0YccUiqsTlKiNmw14b8eae6guuFjZ8pOCvRzULnXwjqb2niPeHx',
        accessTokenExpire: '2021-05-18 10:05:01',
        pageType: 'lazada',
        refreshToken: '50001401816wJ5ratTHccAyipvzd16534642ihLm2GqtjEYlsTAKQwUnmh87KXHd',
        refreshTokenExpire: '2021-06-05 10:06:03',
        updatedAt: new Date('2021-05-11T10:10:01.000Z'),
        createdAt: new Date('2021-04-09T03:53:03.000Z'),
        payload: '',
      },
    ];

    const shopeeShop = allThirdPartyMarketPlaces[1];
    const lazadaShop = allThirdPartyMarketPlaces[2];

    const writer = PlusmarService.writerClient;
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService.pageThirdPartyService, 'getAllPageThirdPartyByPageType', jest.fn().mockResolvedValue(allThirdPartyMarketPlaces));
    mock(productMarketPlaceService, 'getPageMarketToUpdateInventory', jest.fn().mockResolvedValue([lazadaShop]));
    mock(productMarketPlaceService.purchaseOrderLazadaService, 'getOrdersFromLazadaAndUpdatePurchaseOrdersCron', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService.purchaseOrderShopeeService, 'getOrdersFromShopeeAndUpdatePurchaseOrdersCron', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService, 'updateInventoryFromMarketPlaceOrders', jest.fn().mockResolvedValue({}));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.updateCronMarketPlaceOrders({ lazadaEnv, shopeeEnv });

    expect(PostgresHelper.execBeginBatchTransaction).toBeCalledWith(writer);
    expect(productMarketPlaceService.pageThirdPartyService.getAllPageThirdPartyByPageType).toBeCalledWith([lazadaMarketType, shopeeMarketType]);
    expect(productMarketPlaceService.getPageMarketToUpdateInventory).toBeCalledWith(allThirdPartyMarketPlaces, { lazadaEnv, shopeeEnv });
    expect(productMarketPlaceService.purchaseOrderLazadaService.getOrdersFromLazadaAndUpdatePurchaseOrdersCron).toBeCalledWith([lazadaShop], lazadaEnv, writer);
    expect(productMarketPlaceService.purchaseOrderShopeeService.getOrdersFromShopeeAndUpdatePurchaseOrdersCron).toBeCalledWith([shopeeShop], shopeeEnv, writer);
    expect(productMarketPlaceService.updateInventoryFromMarketPlaceOrders).toBeCalledWith();
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalledWith(writer);
  });

  test('productInventoryUpdateSendMessage -> send message to process the queue', async () => {
    const queueResult = [
      {
        pageID: 344,
        queueID: 1,
      },
      {
        pageID: 344,
        queueID: 2,
      },
    ];
    mock(productMarketPlaceService.productInventoryUpdateService, 'updateProductInventoryPublisher', jest.fn().mockResolvedValue(queueResult[0]));

    await productMarketPlaceService.productInventoryUpdateSendMessage(queueResult, subscriptionID);
    expect(productMarketPlaceService.productInventoryUpdateService.updateProductInventoryPublisher).toBeCalledTimes(2);
  });

  test('getShopeeBrands -> shopeebrands', async () => {
    const params = { page_size: 100, offset: 1, category_id: 100047, status: 1 };
    const response = {
      brand_list: [
        {
          brand_id: 2500139861,
          original_brand_name: 'nike',
          display_brand_name: 'nike',
        },
      ],
      has_next_page: false,
      next_offset: 10,
      is_mandatory: false,
      input_type: 'TEXT_FILED',
    };
    const marketPlaceType = SocialTypes.SHOPEE;
    const brandList = [];
    const { sellerID, accessToken } = thirdPartyMarketPlaceShopee[0];
    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(thirdPartyMarketPlaceShopee[0]));
    mock(productMarketPlaceService, 'getShopeeBrandsRecursive', jest.fn().mockResolvedValue(false));
    const result = await productMarketPlaceService.getShopeeBrands(pageID, params.category_id, shopeeEnv);
    expect(result).toEqual({
      brandList,
      isMandatory: false,
    });
    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [marketPlaceType] });
    expect(productMarketPlaceService.getShopeeBrandsRecursive).toBeCalledWith(+sellerID, accessToken, params, shopeeEnv, brandList);
  });

  test('getShopeeBrandsRecursive -> get recursive brands', async () => {
    const params = { page_size: 100, offset: 1, category_id: 100047, status: 1 };
    const response = {
      brand_list: [
        {
          brand_id: 2500139861,
          original_brand_name: 'nike',
          display_brand_name: 'nike',
        },
      ],
      has_next_page: false,
      next_offset: 10,
      is_mandatory: false,
      input_type: 'TEXT_FILED',
    };
    const brandList = [];
    const { sellerID, accessToken } = thirdPartyMarketPlaceShopee[0];
    mock(shopeeAPI, 'getBrandsFromShopeeApi', jest.fn().mockResolvedValue(response));
    const result = await productMarketPlaceService.getShopeeBrandsRecursive(+sellerID, accessToken, params, shopeeEnv, brandList);
    expect(result).toEqual(false);
    expect(shopeeAPI.getBrandsFromShopeeApi).toBeCalledWith(+sellerID, accessToken, params, shopeeEnv);
  });

  test('updateLazadaProductInventoryV2 -> update lazada inventory --> success', async () => {
    const params = {
      pageID: 344,
      inventory: [{ variantID: 683, productID: 504, operationType: 'INCREASE', stockToUpdate: 1, inventoryChannel: 'MARKETPLACE_LAZADA' }],
      subscriptionID,
    } as IProductInventoryCronUpdateInventoryV2Payload;

    const marketPlaceVariant = [
      {
        id: 15026,
        productMarketPlaceID: '5142',
        name: '',
        sku: 'SKU-RAM1',
        unitPrice: 157,
        inventory: 161,
        marketPlaceType: 'lazada',
        variantJson: '{"shop_sku":"2723382729_TH-9862881462","seller_sku":"SKU-RAM1","sku_id":9862881462}',
        active: true,
      },
    ];
    const marketPlaceSKU = 'SKU-RAM1';
    const accessToken = 'accessToken';
    const { id: marketVariantID } = marketPlaceVariant[0];
    const marketPlaceType = SocialTypes.LAZADA;
    const { productID, variantID: productVariantID } = params.inventory[0];

    const variantInventory = 162;

    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue({ accessToken }));
    mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue([lazadaShopeeCreatedProduct]));
    mock(data, 'getProductMarketPlaceVariantByIDAndType', jest.fn().mockResolvedValue(marketPlaceVariant));
    mock(data, 'getProductMarketPlaceVariantByVariantIDAndType', jest.fn().mockResolvedValue({ marketPlaceSKU }));
    mock(lazadaAPI, 'updateInventoryOnLazadaApi', jest.fn().mockResolvedValue({}));
    mock(data, 'updateProductMarketPlaceVariantQuantity', jest.fn().mockResolvedValue({}));
    const result = await productMarketPlaceService.updateLazadaProductInventoryV2(params, lazadaEnv);
    expect(result).toEqual(true);
    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [marketPlaceType] });
    expect(productMarketPlaceService.productService.getProductByID).toBeCalledWith(pageID, productID, subscriptionID);

    expect(data.getProductMarketPlaceVariantByIDAndType).toBeCalledWith(PlusmarService.readerClient, pageID, [productVariantID], marketPlaceType);
    expect(data.getProductMarketPlaceVariantByVariantIDAndType).toBeCalledWith(pageID, productVariantID, marketPlaceType, PlusmarService.readerClient);
    expect(lazadaAPI.updateInventoryOnLazadaApi).toBeCalledWith(accessToken, variantInventory, marketPlaceSKU, lazadaEnv);
    expect(data.updateProductMarketPlaceVariantQuantity).toBeCalledWith(pageID, marketVariantID, variantInventory, PlusmarService.readerClient);

    expect(data.getProductMarketPlaceVariantByIDAndType).toBeCalledTimes(1);
    expect(data.getProductMarketPlaceVariantByVariantIDAndType).toBeCalledTimes(1);
    expect(lazadaAPI.updateInventoryOnLazadaApi).toBeCalledTimes(1);
    expect(data.updateProductMarketPlaceVariantQuantity).toBeCalledTimes(1);
  });

  test('updateLazadaProductInventoryV2 -> update lazada inventory --> error', async () => {
    try {
      const params = {
        pageID: 344,
        inventory: [{ variantID: 683, productID: 504, operationType: 'INCREASE', stockToUpdate: 1, inventoryChannel: 'MARKETPLACE_LAZADA' }],
      } as IProductInventoryCronUpdateInventoryV2Payload;

      mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(undefined));

      await productMarketPlaceService.updateLazadaProductInventoryV2(params, lazadaEnv);
    } catch (error) {
      expect(error.message).toContain('undefined');
    }
  });

  test('updateShopeeProductInventoryV2 -> update shopee inventory --> error', async () => {
    try {
      const params = undefined;

      await productMarketPlaceService.updateShopeeProductInventoryV2(params, shopeeEnv);
    } catch (error) {
      expect(error.message).toContain('undefined');
    }
  });

  test('updateShopeeProductInventoryV2 -> update shopee inventory --> success', async () => {
    const params = {
      pageID: 344,
      inventory: [
        { variantID: 683, productID: 504, operationType: 'INCREASE', stockToUpdate: 1, inventoryChannel: 'MARKETPLACE_SHOPEE' },
        { variantID: 684, productID: 504, operationType: 'INCREASE', stockToUpdate: 1, inventoryChannel: 'MARKETPLACE_SHOPEE' },
      ],
    } as IProductInventoryCronUpdateInventoryV2Payload;
    mock(productMarketPlaceService, 'updateProductInventoryAtShopeeMarketPlace', jest.fn().mockResolvedValue({}).mockResolvedValue({}));

    const result = await productMarketPlaceService.updateShopeeProductInventoryV2(params, shopeeEnv);
    expect(result).toBe(true);
    expect(productMarketPlaceService.updateProductInventoryAtShopeeMarketPlace).toBeCalledTimes(2);
  });

  test('updateProductInventoryAtShopeeMarketPlace -> update shopee inventory at shopee --> success', async () => {
    const params = { pageID: 344, inventory: [{ variantID: 683, productID: 504, operationType: 'INCREASE', stockToUpdate: 1, inventoryChannel: 'MARKETPLACE_SHOPEE' }] };
    const sellerID = '59575129';
    const { accessToken, sellerID: shop_id } = {
      accessToken: '75f8c7015820a7066c6f8b42ce43f126',
      sellerID,
    };

    const { productID, variantID: productVariantID } = params.inventory[0];
    const marketPlaceType = SocialTypes.SHOPEE;

    const variantInventory = 162;

    const marketPlaceVariant = [
      {
        id: 15024,
        productMarketPlaceID: '5141',
        name: '',
        sku: 'SKU-RAM1',
        unitPrice: 157,
        inventory: 162,
        marketPlaceType: 'shopee',
        marketPlaceVariantID: 77154903076,
        variantJson: '{"tier_index":[0],"model_id":77154903076,"model_sku":"SKU-RAM1","stock_info":[{"stock_type":2,"normal_stock":150}],"price_info":[{"original_price":150}]}',
        active: true,
      },
    ];

    const { id: marketVariantID } = {
      id: 15024,
    };
    const marketPlaceID = 10641800349;
    const model_id = 77154903076;
    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue({ accessToken, sellerID }));
    mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue([lazadaShopeeCreatedProduct]));
    mock(data, 'getProductMarketPlaceVariantByIDAndType', jest.fn().mockResolvedValue(marketPlaceVariant));
    mock(data, 'getProductMarketPlaceByIDAndType', jest.fn().mockResolvedValue({ marketPlaceID }));
    mock(productMarketPlaceService, 'updateProductInventoryAtShopee', jest.fn().mockResolvedValue({}));
    mock(data, 'updateProductMarketPlaceVariantQuantity', jest.fn().mockResolvedValue({}));
    await productMarketPlaceService.updateProductInventoryAtShopeeMarketPlace(pageID, productID, productVariantID, shopeeEnv, subscriptionID);

    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [marketPlaceType] });
    expect(productMarketPlaceService.productService.getProductByID).toBeCalledWith(pageID, productID, subscriptionID);

    expect(data.getProductMarketPlaceVariantByIDAndType).toBeCalledWith(PlusmarService.readerClient, pageID, [productVariantID], marketPlaceType);
    expect(data.getProductMarketPlaceByIDAndType).toBeCalledWith(PlusmarService.readerClient, pageID, productID, marketPlaceType);
    expect(productMarketPlaceService.updateProductInventoryAtShopee).toBeCalledWith(+marketPlaceID, model_id, variantInventory, +shop_id, accessToken, shopeeEnv);
    expect(data.updateProductMarketPlaceVariantQuantity).toBeCalledWith(pageID, marketVariantID, variantInventory, PlusmarService.readerClient);
  });

  test('updateProductInventoryAtShopee -> update inventory shopee ', async () => {
    const item_id = 10641800349;
    const model_id = 77154903076;
    const sellerID = '59575129';
    const { accessToken, sellerID: shop_id } = {
      accessToken: '75f8c7015820a7066c6f8b42ce43f126',
      sellerID,
    };

    const variantInventory = 162;
    const variantInventoryRequest: IShopeeUpdateVariantInventoryRequest = {
      item_id,
      stock_list: [
        {
          model_id,
          normal_stock: variantInventory,
        },
      ],
    };

    mock(shopeeAPI, 'updateVariantInventoryOnShopeeAPI', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.updateProductInventoryAtShopee(item_id, model_id, variantInventory, +shop_id, accessToken, shopeeEnv);

    expect(shopeeAPI.updateVariantInventoryOnShopeeAPI).toBeCalledWith(+shop_id, variantInventoryRequest, accessToken, shopeeEnv);
  });

  test('updateProductOnMarketPlaces -> update product on marketplace connected ', async () => {
    const { id } = lazadaShopeeCreatedProduct;
    const pageID = 344;
    const marketPlaceUpdateTypes = [];
    const marketPlaceUpdateMsg = [] as IHTTPResult[];
    const lazada = [
      { active: true, id: 5143, marketPlaceID: '2723367789', marketPlaceType: 'lazada', name: 'mmmmmmRAM live 01', pageID: 344, productID: 504 },
      { active: true, id: 5142, marketPlaceID: '2723382729', marketPlaceType: 'lazada', name: 'mmmmmmRAM live 01', pageID: 344, productID: 504 },
      { active: true, id: 5141, marketPlaceID: '10641800349', marketPlaceType: 'shopee', name: 'mmmmmmRAM live 01', pageID: 344, productID: 504 },
    ];

    mock(productMarketPlaceService.productService, 'getProductByID', jest.fn().mockResolvedValue([lazadaShopeeCreatedProduct]));
    mock(productMarketPlaceService, 'onUpdateLazadaProduct', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService, 'onUpdateShopeeProduct', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.updateProductOnMarketPlaces(pageID, id, marketPlaceUpdateTypes, { lazadaEnv, shopeeEnv }, subscriptionID);
    expect(productMarketPlaceService.onUpdateLazadaProduct).toBeCalledWith(pageID, lazadaEnv, lazadaShopeeCreatedProduct, marketPlaceUpdateMsg, lazada);
    expect(productMarketPlaceService.onUpdateShopeeProduct).toBeCalledWith(pageID, marketPlaceUpdateTypes, lazadaShopeeCreatedProduct, shopeeEnv, marketPlaceUpdateMsg);
  });

  test('onUpdateLazadaProduct -> updateMultipleProductAtMarketPlaceLazada ', async () => {
    const marketPlaceUpdateMsg = [] as IHTTPResult[];
    const marketPlaceProducts = [
      { active: true, id: 5143, marketPlaceID: '2723367789', marketPlaceType: 'lazada', name: 'mmmmmmRAM live 01', pageID: 344, productID: 504 },
      { active: true, id: 5142, marketPlaceID: '2723382729', marketPlaceType: 'lazada', name: 'mmmmmmRAM live 01', pageID: 344, productID: 504 },
      { active: true, id: 5141, marketPlaceID: '10641800349', marketPlaceType: 'shopee', name: 'mmmmmmRAM live 01', pageID: 344, productID: 504 },
    ] as IProductMarketPlace[];

    const lazadaMarketPlaceProducts = marketPlaceProducts.filter(({ marketPlaceType }) => marketPlaceType === SocialTypes.LAZADA);

    const accessToken = 'accessToken';

    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue({ accessToken }));

    mock(productMarketPlaceService, 'updateMultipleProductAtMarketPlaceLazada', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.onUpdateLazadaProduct(pageID, lazadaEnv, lazadaShopeeCreatedProduct, marketPlaceUpdateMsg, marketPlaceProducts);

    expect(productMarketPlaceService.updateMultipleProductAtMarketPlaceLazada).toBeCalledWith(
      pageID,
      lazadaShopeeCreatedProduct,
      accessToken,
      lazadaMarketPlaceProducts,
      lazadaEnv,
    );
  });

  test('onUpdateLazadaProduct -> updateSingleProductAtMarketPlaceLazada ', async () => {
    const marketPlaceUpdateMsg = [] as IHTTPResult[];
    const marketPlaceProducts = [
      { active: true, id: 5143, marketPlaceID: '2723367789', marketPlaceType: 'lazada', name: 'mmmmmmRAM live 01', pageID: 344, productID: 504 },
      { active: true, id: 5141, marketPlaceID: '10641800349', marketPlaceType: 'shopee', name: 'mmmmmmRAM live 01', pageID: 344, productID: 504 },
    ] as IProductMarketPlace[];

    const lazadaMarketPlaceProducts = marketPlaceProducts.filter(({ marketPlaceType }) => marketPlaceType === SocialTypes.LAZADA);

    const accessToken = 'accessToken';

    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue({ accessToken }));

    mock(productMarketPlaceService, 'updateSingleProductAtMarketPlaceLazada', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.onUpdateLazadaProduct(pageID, lazadaEnv, lazadaShopeeCreatedProduct, marketPlaceUpdateMsg, marketPlaceProducts);

    expect(productMarketPlaceService.updateSingleProductAtMarketPlaceLazada).toBeCalledWith(pageID, lazadaShopeeCreatedProduct, accessToken, lazadaMarketPlaceProducts, lazadaEnv);
  });

  test('get product from shopee -> getProductFromShopee ', async () => {
    const shopeePage = {
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '0c8d55e2114d6261f15407eaf054f97f',
      accessTokenExpire: '2021-09-16 15:09:00',
      pageType: 'shopee',
    } as IPagesThirdParty;
    const latestProduct = {};
    const updateParams = {};
    const dateSlots = [{ update_time_from: undefined, update_time_to: undefined }];
    const shopeeProducts = [] as IShopeeProductList[];
    const counter = 0;
    const offset = 0;
    const page_size = 100;
    const item_status = ShopeeProductStatusTypes.NORMAL;
    const shopeeGetProductParams: IShopeeGetProductListParams = { offset, item_status, page_size };
    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(shopeePage));
    mock(data, 'getLatestMarketPlaceProductByType', jest.fn().mockResolvedValue(latestProduct));
    mock(helpers, 'getShopeeProductListUpdateParams', jest.fn().mockReturnValue(updateParams));
    mock(helpers, 'getShopeeTwoWeekDateSlots', jest.fn().mockReturnValue(dateSlots));
    mock(productMarketPlaceService, 'getShopeeProducts', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService, 'processShopeeProductList', jest.fn().mockResolvedValue({}));

    const result = await productMarketPlaceService.getProductFromShopee(pageID, shopeeEnv);
    expect(result).toEqual({ status: 200, value: true });

    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [shopeeMarketPlaceType] });
    expect(data.getLatestMarketPlaceProductByType).toBeCalledWith(PlusmarService.readerClient, pageID, shopeeMarketPlaceType);
    expect(helpers.getShopeeProductListUpdateParams).toBeCalledWith(latestProduct);
    expect(helpers.getShopeeTwoWeekDateSlots).toBeCalledWith(updateParams);
    expect(helpers.getShopeeTwoWeekDateSlots).toHaveBeenCalledTimes(1);
    expect(productMarketPlaceService.getShopeeProducts).toBeCalledWith(counter, shopeePage, shopeeGetProductParams, shopeeEnv, shopeeProducts);
  });

  test('get product from shopee connect to api -> getProductFromShopee ', async () => {
    const offset = 0;
    const page_size = 100;
    const item_status = ShopeeProductStatusTypes.NORMAL;
    const item = [
      { item_id: 13609392688, item_status: 'NORMAL', update_time: 1631603041 },
      { item_id: 10641800349, item_status: 'NORMAL', update_time: 1630491532 },
      { item_id: 10912345569, item_status: 'NORMAL', update_time: 1624012642 },
      { item_id: 6792165999, item_status: 'NORMAL', update_time: 1624012609 },
      { item_id: 11212341160, item_status: 'NORMAL', update_time: 1624011705 },
      { item_id: 11912328019, item_status: 'NORMAL', update_time: 1624009072 },
      { item_id: 9353420415, item_status: 'NORMAL', update_time: 1623150624 },
      { item_id: 8653421410, item_status: 'NORMAL', update_time: 1620729967 },
    ];
    //{ has_next_page: false, total_count: 8 }
    const shopeeProducts = [] as IShopeeProductList[];
    const counter = 0;
    const shopeePage = {
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '0c8d55e2114d6261f15407eaf054f97f',
      accessTokenExpire: '2021-09-16 15:09:00',
      pageType: 'shopee',
    } as IPagesThirdParty;
    const shopeeGetProductParams: IShopeeGetProductListParams = { offset, item_status, page_size };
    const { sellerID, accessToken } = shopeePage;

    mock(shopeeAPI, 'getProductListFromShopeeApi', jest.fn().mockResolvedValue({ has_next_page: false, item, total_count: item.length }));
    await productMarketPlaceService.getShopeeProducts(counter, shopeePage, shopeeGetProductParams, shopeeEnv, shopeeProducts);
    expect(shopeeAPI.getProductListFromShopeeApi).toBeCalledWith(+sellerID, accessToken, { ...shopeeGetProductParams, offset }, shopeeEnv);
  });

  test('process shopee products from api -> processShopeeProductList ', async () => {
    const shopeeProducts = [
      { item_id: 13609392688, item_status: 'NORMAL', update_time: 1631603041 },
      { item_id: 10641800349, item_status: 'NORMAL', update_time: 1630491532 },
      { item_id: 10912345569, item_status: 'NORMAL', update_time: 1624012642 },
    ];
    const shopeePage = {
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '0c8d55e2114d6261f15407eaf054f97f',
      accessTokenExpire: '2021-09-16 15:09:00',
      pageType: 'shopee',
    } as IPagesThirdParty;
    const { sellerID, accessToken } = shopeePage;
    const productIDSlots = [shopeeProducts.map(({ item_id }) => item_id)];

    const shopeeBaseProducts = shopeeProducts.map((product) => ({ item_id: product.item_id, has_model: true })) as IShopeeProductBaseInfo[];
    const client = PlusmarService.writerClient;

    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue(client));
    mock(helpers, 'getShopeeProductIDsForBasicInfo', jest.fn().mockReturnValue(productIDSlots));
    mock(shopeeAPI, 'getProductBaseInfoFromShopeeApi', jest.fn().mockResolvedValue(shopeeBaseProducts));
    mock(shopeeAPI, 'getModelListFromShopeeApi', jest.fn().mockResolvedValue({}));
    mock(shopeeAPI, 'getModelListFromShopeeApi', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService, 'addShopeeProduct', jest.fn().mockResolvedValue({}));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.processShopeeProductList(pageID, shopeePage, shopeeProducts, shopeeEnv);

    expect(PostgresHelper.execBeginBatchTransaction).toBeCalledWith(client);
    expect(helpers.getShopeeProductIDsForBasicInfo).toBeCalledWith(shopeeProducts);
    expect(shopeeAPI.getProductBaseInfoFromShopeeApi).toBeCalledWith(+sellerID, accessToken, productIDSlots[0], shopeeEnv);
    expect(shopeeAPI.getModelListFromShopeeApi).toHaveBeenNthCalledWith(1, +sellerID, accessToken, shopeeBaseProducts[0].item_id, shopeeEnv);
    expect(shopeeAPI.getModelListFromShopeeApi).toHaveBeenNthCalledWith(2, +sellerID, accessToken, shopeeBaseProducts[1].item_id, shopeeEnv);
    expect(shopeeAPI.getModelListFromShopeeApi).toHaveBeenNthCalledWith(3, +sellerID, accessToken, shopeeBaseProducts[2].item_id, shopeeEnv);
    expect(productMarketPlaceService.addShopeeProduct).toBeCalledWith(pageID, shopeeBaseProducts, client);
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalledWith(client);
  });

  test('add shopee product to more commerce -> addShopeeProduct ', async () => {
    const shopeeProducts = [
      { item_id: 13609392688, item_status: 'NORMAL', update_time: 1631603041 },
      { item_id: 10641800349, item_status: 'NORMAL', update_time: 1630491532 },
      { item_id: 10912345569, item_status: 'NORMAL', update_time: 1624012642 },
    ];
    const shopeePage = {
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '0c8d55e2114d6261f15407eaf054f97f',
      accessTokenExpire: '2021-09-16 15:09:00',
      pageType: 'shopee',
    } as IPagesThirdParty;
    const { sellerID, accessToken } = shopeePage;
    const productIDSlots = [shopeeProducts.map(({ item_id }) => item_id)];

    const shopeeBaseProducts = shopeeProducts.map((product) => ({ item_id: product.item_id, has_model: false })) as IShopeeProductBaseInfo[];
    const client = PlusmarService.writerClient;

    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue(client));
    mock(helpers, 'getShopeeProductIDsForBasicInfo', jest.fn().mockReturnValue(productIDSlots));
    mock(shopeeAPI, 'getProductBaseInfoFromShopeeApi', jest.fn().mockResolvedValue(shopeeBaseProducts));
    mock(shopeeAPI, 'getModelListFromShopeeApi', jest.fn().mockResolvedValue({}));
    mock(shopeeAPI, 'getModelListFromShopeeApi', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService, 'addShopeeProduct', jest.fn().mockResolvedValue({}));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.processShopeeProductList(pageID, shopeePage, shopeeProducts, shopeeEnv);

    expect(PostgresHelper.execBeginBatchTransaction).toBeCalledWith(client);
    expect(helpers.getShopeeProductIDsForBasicInfo).toBeCalledWith(shopeeProducts);
    expect(shopeeAPI.getProductBaseInfoFromShopeeApi).toBeCalledWith(+sellerID, accessToken, productIDSlots[0], shopeeEnv);
    expect(shopeeAPI.getModelListFromShopeeApi).not.toHaveBeenNthCalledWith(1, +sellerID, accessToken, shopeeBaseProducts[0].item_id, shopeeEnv);
    expect(shopeeAPI.getModelListFromShopeeApi).not.toHaveBeenNthCalledWith(2, +sellerID, accessToken, shopeeBaseProducts[1].item_id, shopeeEnv);
    expect(shopeeAPI.getModelListFromShopeeApi).not.toHaveBeenNthCalledWith(3, +sellerID, accessToken, shopeeBaseProducts[2].item_id, shopeeEnv);
    expect(productMarketPlaceService.addShopeeProduct).toBeCalledWith(pageID, shopeeBaseProducts, client);
    expect(PostgresHelper.execBatchCommitTransaction).toBeCalledWith(client);
  });

  test('add shopee product to more commerce has model -> addShopeeProduct ', async () => {
    const shopeeProducts = [
      { item_id: 13609392688, item_status: 'NORMAL', update_time: 1631603041 },
      { item_id: 10641800349, item_status: 'NORMAL', update_time: 1630491532 },
    ];

    const shopeeBaseProducts = shopeeProducts.map((product) => ({ item_id: product.item_id, has_model: true })) as IShopeeProductBaseInfo[];
    const totalProducts = shopeeBaseProducts?.length || 0;
    const imported = false;
    const { item_name: name, item_id, model_list } = shopeeBaseProducts[0];
    const marketPlaceID0 = String(item_id);
    const marketPlaceID1 = String(shopeeBaseProducts[1].item_id);
    const productJson1 = JSON.stringify(shopeeBaseProducts[0]);
    const productJson2 = JSON.stringify(shopeeBaseProducts[1]);
    const productParam0 = {
      name,
      pageID,
      marketPlaceType: shopeeMarketPlaceType,
      productID: null,
      marketPlaceID: marketPlaceID0,
      productJson: productJson1,
      totalProducts,
      imported,
    };
    const productParam1 = {
      name,
      pageID,
      marketPlaceType: shopeeMarketPlaceType,
      productID: null,
      marketPlaceID: marketPlaceID1,
      productJson: productJson2,
      totalProducts,
      imported,
    };
    const client = PlusmarService.writerClient;
    const productMarketPlace0 = { id: 1000 } as IProductMarketPlace;
    const productMarketPlace1 = { id: 1001 } as IProductMarketPlace;
    mock(data, 'addProductMarketPlace', jest.fn().mockResolvedValueOnce(productMarketPlace0).mockResolvedValueOnce(productMarketPlace1));
    mock(productMarketPlaceService, 'addShopeeVariantProduct', jest.fn().mockResolvedValue({}).mockResolvedValue({}));

    await productMarketPlaceService.addShopeeProduct(pageID, shopeeBaseProducts, client);
    expect(data.addProductMarketPlace).toBeCalledTimes(2);
    expect(productMarketPlaceService.addShopeeVariantProduct).toBeCalledTimes(2);
    expect(data.addProductMarketPlace).toHaveBeenNthCalledWith(1, client, { ...productParam0 });
    expect(data.addProductMarketPlace).toHaveBeenNthCalledWith(2, client, { ...productParam1 });

    expect(productMarketPlaceService.addShopeeVariantProduct).toHaveBeenNthCalledWith(1, pageID, productMarketPlace0, model_list, shopeeMarketPlaceType, client);
    expect(productMarketPlaceService.addShopeeVariantProduct).toHaveBeenNthCalledWith(2, pageID, productMarketPlace1, model_list, shopeeMarketPlaceType, client);

    //mock(, '', jest.fn().mockResolvedValue({}));
    // expect().toBeCalledWith();
  });

  test('add shopee product to more commerce has no model -> addShopeeProduct ', async () => {
    const shopeeProducts = [
      { item_id: 13609392688, item_status: 'NORMAL', update_time: 1631603041 },
      { item_id: 10641800349, item_status: 'NORMAL', update_time: 1630491532 },
    ];

    const shopeeBaseProducts = shopeeProducts.map((product) => ({ item_id: product.item_id, has_model: false })) as IShopeeProductBaseInfo[];
    const totalProducts = shopeeBaseProducts?.length || 0;
    const imported = false;
    const { item_name: name, item_id } = shopeeBaseProducts[0];
    const marketPlaceID0 = String(item_id);
    const marketPlaceID1 = String(shopeeBaseProducts[1].item_id);
    const productJson1 = JSON.stringify(shopeeBaseProducts[0]);
    const productJson2 = JSON.stringify(shopeeBaseProducts[1]);
    const productParam0 = {
      name,
      pageID,
      marketPlaceType: shopeeMarketPlaceType,
      productID: null,
      marketPlaceID: marketPlaceID0,
      productJson: productJson1,
      totalProducts,
      imported,
    };
    const productParam1 = {
      name,
      pageID,
      marketPlaceType: shopeeMarketPlaceType,
      productID: null,
      marketPlaceID: marketPlaceID1,
      productJson: productJson2,
      totalProducts,
      imported,
    };
    const client = PlusmarService.writerClient;
    const productMarketPlace0 = { id: 1000 } as IProductMarketPlace;
    const productMarketPlace1 = { id: 1001 } as IProductMarketPlace;
    mock(data, 'addProductMarketPlace', jest.fn().mockResolvedValueOnce(productMarketPlace0).mockResolvedValueOnce(productMarketPlace1));
    mock(productMarketPlaceService, 'addShopeeVariantProductNoVariant', jest.fn().mockResolvedValue({}).mockResolvedValue({}));

    await productMarketPlaceService.addShopeeProduct(pageID, shopeeBaseProducts, client);
    expect(data.addProductMarketPlace).toBeCalledTimes(2);
    expect(productMarketPlaceService.addShopeeVariantProductNoVariant).toBeCalledTimes(2);
    expect(data.addProductMarketPlace).toHaveBeenNthCalledWith(1, client, { ...productParam0 });
    expect(data.addProductMarketPlace).toHaveBeenNthCalledWith(2, client, { ...productParam1 });

    expect(productMarketPlaceService.addShopeeVariantProductNoVariant).toHaveBeenNthCalledWith(
      1,
      pageID,
      productMarketPlace0,
      shopeeBaseProducts[0],
      shopeeMarketPlaceType,
      client,
    );
    expect(productMarketPlaceService.addShopeeVariantProductNoVariant).toHaveBeenNthCalledWith(
      2,
      pageID,
      productMarketPlace1,
      shopeeBaseProducts[1],
      shopeeMarketPlaceType,
      client,
    );

    //mock(, '', jest.fn().mockResolvedValue({}));
    // expect().toBeCalledWith();
  });

  test('add shopee variant product to more commerce -> addShopeeVariantProduct ', async () => {
    const modelList = {
      tier_variation: [{ name: '', option_list: [{ option: 'ddr2' }, { option: 'ddr1' }] }],
      model: [
        {
          model_id: 55360291279,
          promotion_id: 0,
          tier_index: [1],
          stock_info: [
            { stock_type: 2, current_stock: 50, normal_stock: 50, reserved_stock: 0 },
            { stock_type: 1, current_stock: 0, normal_stock: 0, reserved_stock: 0 },
          ],
          price_info: [{ current_price: 40, original_price: 40, inflated_price_of_current_price: 40, inflated_price_of_original_price: 40 }],
          model_sku: 'SKU-RAM1',
        },
      ],
    };
    const productMarketPlace = { id: 7107 } as IProductMarketPlace;
    const client = PlusmarService.writerClient;
    const tierVariationLevel = 1;
    const name = 'ddr2';
    const productVariantID = null;
    const { tier_variation, model } = modelList;
    const index = 0;
    const { normal_stock: inventory } = model[index].stock_info[0];
    const { original_price: unitPrice } = model[index].price_info[0];
    const { model_id } = model[index];
    const marketPlaceVariantID = String(model_id);
    mock(helpers, 'getShopeeVariationName', jest.fn().mockReturnValue(name));
    mock(data, 'addProductMarketPlaceVariants', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.addShopeeVariantProduct(pageID, productMarketPlace, modelList, shopeeMarketPlaceType, client);
    expect(helpers.getShopeeVariationName).toBeCalledWith(tier_variation, model, tierVariationLevel, index);
    expect(data.addProductMarketPlaceVariants).toBeCalledWith(client, {
      pageID,
      marketPlaceType: shopeeMarketPlaceType,
      productMarketPlaceID: productMarketPlace.id,
      productVariantID,
      inventory,
      sku: String(model_id),
      unitPrice,
      variantJson: JSON.stringify([{ tier_variation: tier_variation[index] }, { model: model[index] }]),
      name,
      marketPlaceVariantID,
    });
  });

  test('add shopee variant product to more commerce -> addShopeeVariantProductNoVariant ', async () => {
    const shopeeProduct = {
      item_id: 13609392688,
      item_status: 'NORMAL',
      stock_info: [{ stock_type: 2, current_stock: 50, normal_stock: 50 }],
      price_info: [{ current_price: 40, original_price: 40 }],
      item_name: 'ddr2',
      item_sku: 'ddr2_sku',
    } as unknown as IShopeeProductBaseInfoNoModel;
    const productMarketPlace = { id: 7107 } as IProductMarketPlace;
    const client = PlusmarService.writerClient;
    const productVariantID = null;
    const { price_info, stock_info, item_name: name, item_sku: sku } = shopeeProduct;
    const { normal_stock: inventory } = stock_info[0];
    const { original_price: unitPrice } = price_info[0];
    const marketPlaceVariantID = SHOPEE_PRODUCT_NO_VARIANT_ID;
    const variantJson = JSON.stringify(shopeeProduct);

    mock(helpers, 'getShopeeVariationName', jest.fn().mockReturnValue(name));
    mock(data, 'addProductMarketPlaceVariants', jest.fn().mockResolvedValue({}));

    await productMarketPlaceService.addShopeeVariantProductNoVariant(pageID, productMarketPlace, shopeeProduct, shopeeMarketPlaceType, client);

    expect(data.addProductMarketPlaceVariants).toBeCalledWith(client, {
      pageID,
      marketPlaceType: shopeeMarketPlaceType,
      productMarketPlaceID: productMarketPlace.id,
      productVariantID,
      inventory,
      sku,
      unitPrice,
      variantJson,
      name,
      marketPlaceVariantID,
    });
  });

  test('merge shopee variant updateMarketPlaceVariantByProductVariantID -> mergeShopeeVariants ', async () => {
    const params = { id: 683, marketIDs: [19272], mergeType: MergeMarketPlaceType.VARIANT };
    const productVariant = {
      id: 683,
      productName: 'RAM - LOCAL',
      productID: 504,
      attributeName: 'ddr1',
      sku: 'SKU-RAM1',
      unitPrice: 32,
      inventory: 180,
    } as IProductVariantByID;
    const shopeeMarketPlaceProducts = [
      {
        id: 19272,
        productMarketPlaceID: '7099',
        marketPlaceVariantID: '77154903076',
        productVariantID: null,
        sku: 'SKU-RAM1',
        name: 'ddr1',
        pageID: 344,
        unitPrice: 32,
        inventory: '180',
        marketPlaceType: 'shopee',
        variantJson: '',
      },
    ] as unknown as IProductMarketPlaceVariant[];
    mock(data, 'updateMarketPlaceVariantByProductVariantID', jest.fn().mockResolvedValue({}));
    mock(productMarketPlaceService, 'mergeShopeeVariantUpdatePriceOrInventory', jest.fn().mockResolvedValueOnce({}));
    const response = { status: 200, value: SocialTypes.SHOPEE, expiresAt: MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS };
    const result = await productMarketPlaceService.mergeShopeeVariants(pageID, shopeeMarketPlaceProducts, productVariant, params, shopeeEnv);
    expect(response).toEqual(result);
    expect(data.updateMarketPlaceVariantByProductVariantID).toBeCalledWith(pageID, params, PlusmarService.readerClient);
    expect(productMarketPlaceService.mergeShopeeVariantUpdatePriceOrInventory).not.toBeCalled();
  });

  test('shopee variant mergeShopeeVariantUpdatePriceOrInventory -> mergeShopeeVariantUpdatePriceOrInventory ', async () => {
    const shopeePage = {
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '0c8d55e2114d6261f15407eaf054f97f',
      accessTokenExpire: '2021-09-16 15:09:00',
      pageType: 'shopee',
    } as IPagesThirdParty;
    const { accessToken, sellerID } = shopeePage;

    const params = { id: 683, marketIDs: [19272], mergeType: MergeMarketPlaceType.VARIANT };
    const productVariant = {
      id: 683,
      productName: 'RAM - LOCAL wow',
      productID: 504,
      attributeName: 'ddr1',
      sku: 'SKU-RAM1',
      unitPrice: 34,
      inventory: 182,
    } as IProductVariantByID;
    const shopeeMarketPlaceProduct = {
      id: 19272,
      productMarketPlaceID: '7099',
      marketPlaceVariantID: '77154903076',
      productVariantID: null,
      sku: 'SKU-RAM1',
      name: 'ddr1',
      pageID: 344,
      unitPrice: 34,
      inventory: '180',
      marketPlaceType: SocialTypes.SHOPEE,
      variantJson:
        '[{"tier_variation":{"name":"Types","option_list":[{"option":"ddr1","image":{"image_id":"29d739570266a933be7fb3f1b627a021","image_url":"https://cf.shopee.co.th/file/29d739570266a933be7fb3f1b627a021"}},{"option":"ddr2","image":{"image_id":"364580e06d9f981de56c74302a681230","image_url":"https://cf.shopee.co.th/file/364580e06d9f981de56c74302a681230"}}]}},{"model":{"model_id":77154903076,"promotion_id":0,"tier_index":[0],"stock_info":[{"stock_type":2,"current_stock":180,"normal_stock":180,"reserved_stock":0},{"stock_type":1,"current_stock":0,"normal_stock":0,"reserved_stock":0}],"price_info":[{"current_price":32,"original_price":32,"inflated_price_of_current_price":32,"inflated_price_of_original_price":32}],"model_sku":"SKU-RAM1"}}]',
    } as unknown as IProductMarketPlaceVariant;
    const { id, marketPlaceVariantID } = shopeeMarketPlaceProduct;
    const marketPlaceID = 10641800349;
    const model_id = +marketPlaceVariantID;
    const { inventory, unitPrice } = productVariant;
    const response = MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS;
    const variantInventoryRequest: IShopeeUpdateVariantInventoryRequest = {
      item_id: +marketPlaceID,
      stock_list: [
        {
          model_id,
          normal_stock: +inventory,
        },
      ],
    };
    const variantPriceRequest: IShopeeUpdateVariantPriceRequest = {
      item_id: +marketPlaceID,
      price_list: [
        {
          model_id,
          original_price: +unitPrice,
        },
      ],
    };
    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(shopeePage));

    mock(shopeeAPI, 'updateVariantInventoryOnShopeeAPI', jest.fn().mockResolvedValue({}));
    mock(shopeeAPI, 'updateVariantPriceOnShopeeAPI', jest.fn().mockResolvedValue({}));
    mock(data, 'updateProductMarketPlacePriceInventory', jest.fn().mockResolvedValue({}));
    mock(data, 'updateMarketPlaceVariantByProductVariantID', jest.fn().mockResolvedValue({}));

    mock(data, 'getProductMarketPlaceByID', jest.fn().mockResolvedValue({ marketPlaceID }));
    const result = await productMarketPlaceService.mergeShopeeVariantUpdatePriceOrInventory(pageID, shopeeMarketPlaceProduct, productVariant, params, shopeeEnv);
    expect(result).toEqual(response);
    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [shopeeMarketPlaceType] });
    expect(shopeeAPI.updateVariantInventoryOnShopeeAPI).toBeCalledWith(+sellerID, variantInventoryRequest, accessToken, shopeeEnv);
    expect(shopeeAPI.updateVariantPriceOnShopeeAPI).toBeCalledWith(+sellerID, variantPriceRequest, accessToken, shopeeEnv);
    expect(data.updateProductMarketPlacePriceInventory).toBeCalledWith(pageID, id, inventory, unitPrice, PlusmarService.readerClient);
    expect(data.updateMarketPlaceVariantByProductVariantID).toBeCalledWith(pageID, params, PlusmarService.readerClient);
  });

  test('shopee variant market update success, variant fail -> mergeShopeeVariantUpdatePriceOrInventory ', async () => {
    const response = MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_UPDATE_FAIL;
    const result = await productMarketPlaceService.mergeShopeeVariantUpdatePriceOrInventory(pageID, undefined, undefined, undefined, shopeeEnv);
    expect(result).toEqual(response);
  });

  test('shopee variant market update fail, variant fail -> mergeShopeeVariantUpdatePriceOrInventory ', async () => {
    const shopeePage = {
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '0c8d55e2114d6261f15407eaf054f97f',
      accessTokenExpire: '2021-09-16 15:09:00',
      pageType: 'shopee',
    } as IPagesThirdParty;
    const { accessToken, sellerID } = shopeePage;

    const params = { id: 683, marketIDs: [19272], mergeType: MergeMarketPlaceType.VARIANT };
    const productVariant = {
      id: 683,
      productName: 'RAM - LOCAL wow',
      productID: 504,
      attributeName: 'ddr1',
      sku: 'SKU-RAM1',
      unitPrice: 34,
      inventory: 182,
    } as IProductVariantByID;
    const shopeeMarketPlaceProduct = {
      id: 19272,
      productMarketPlaceID: '7099',
      marketPlaceVariantID: '77154903076',
      productVariantID: null,
      sku: 'SKU-RAM1',
      name: 'ddr1',
      pageID: 344,
      unitPrice: 34,
      inventory: '180',
      marketPlaceType: SocialTypes.SHOPEE,
      variantJson:
        '[{"tier_variation":{"name":"Types","option_list":[{"option":"ddr1","image":{"image_id":"29d739570266a933be7fb3f1b627a021","image_url":"https://cf.shopee.co.th/file/29d739570266a933be7fb3f1b627a021"}},{"option":"ddr2","image":{"image_id":"364580e06d9f981de56c74302a681230","image_url":"https://cf.shopee.co.th/file/364580e06d9f981de56c74302a681230"}}]}},{"model":{"model_id":77154903076,"promotion_id":0,"tier_index":[0],"stock_info":[{"stock_type":2,"current_stock":180,"normal_stock":180,"reserved_stock":0},{"stock_type":1,"current_stock":0,"normal_stock":0,"reserved_stock":0}],"price_info":[{"current_price":32,"original_price":32,"inflated_price_of_current_price":32,"inflated_price_of_original_price":32}],"model_sku":"SKU-RAM1"}}]',
    } as unknown as IProductMarketPlaceVariant;
    const { id, marketPlaceVariantID } = shopeeMarketPlaceProduct;
    const marketPlaceID = 10641800349;
    const model_id = +marketPlaceVariantID;
    const { inventory, unitPrice } = productVariant;
    const response = MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_FAIL_VARIANT_MERGE_FAIL;
    const variantInventoryRequest: IShopeeUpdateVariantInventoryRequest = {
      item_id: +marketPlaceID,
      stock_list: [
        {
          model_id,
          normal_stock: +inventory,
        },
      ],
    };
    const variantPriceRequest: IShopeeUpdateVariantPriceRequest = {
      item_id: +marketPlaceID,
      price_list: [
        {
          model_id,
          original_price: +unitPrice,
        },
      ],
    };
    mock(productMarketPlaceService.pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue(shopeePage));

    mock(shopeeAPI, 'updateVariantInventoryOnShopeeAPI', jest.fn().mockResolvedValue({}));
    mock(shopeeAPI, 'updateVariantPriceOnShopeeAPI', jest.fn().mockResolvedValue({}));
    mock(data, 'updateProductMarketPlacePriceInventory', jest.fn().mockResolvedValue({}));
    mock(data, 'updateMarketPlaceVariantByProductVariantID', jest.fn().mockRejectedValue(new Error('ERROR_UPDATING_PRODUCT_VARIANT_AT_MARKETPLACE')));

    mock(data, 'getProductMarketPlaceByID', jest.fn().mockResolvedValue({ marketPlaceID }));
    const result = await productMarketPlaceService.mergeShopeeVariantUpdatePriceOrInventory(pageID, shopeeMarketPlaceProduct, productVariant, params, shopeeEnv);
    expect(result).toEqual(response);
    expect(productMarketPlaceService.pageThirdPartyService.getPageThirdPartyByPageType).toBeCalledWith({ pageID, pageType: [shopeeMarketPlaceType] });
    expect(shopeeAPI.updateVariantInventoryOnShopeeAPI).toBeCalledWith(+sellerID, variantInventoryRequest, accessToken, shopeeEnv);
    expect(shopeeAPI.updateVariantPriceOnShopeeAPI).toBeCalledWith(+sellerID, variantPriceRequest, accessToken, shopeeEnv);
    expect(data.updateProductMarketPlacePriceInventory).toBeCalledWith(pageID, id, inventory, unitPrice, PlusmarService.readerClient);
    expect(data.updateMarketPlaceVariantByProductVariantID).toBeCalledWith(pageID, params, PlusmarService.readerClient);
  });
});
