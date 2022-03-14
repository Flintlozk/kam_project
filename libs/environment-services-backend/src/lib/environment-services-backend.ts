import { LanguageTypes } from '@reactor-room/model-lib';
import { env } from 'process';
// import { readFileSync } from 'fs';
import { IEnvironmentBackEnd, IEnvironmentFrontend, plusmarProductionHostName, plusmarStagingHostName } from '@reactor-room/environment-services';
import { environmentLib as environmentFrontEnd } from '@reactor-room/environment-services-frontend';

// import path from 'path';
let URL = '';
try {
  URL = window?.location?.hostname;
} catch {
  console.log('URL Empty');
}

// const IS_PRODUCTION = URL.indexOf('more-commerce.com') !== -1 || env.NODE_ENV === 'production';
const IS_PRODUCTION = plusmarProductionHostName.includes(URL) || env.NODE_ENV === 'production';
const IS_STAGING = plusmarStagingHostName.includes(URL) || env.NODE_ENV === 'staging';
// const IS_STAGING = URL?.indexOf('plusmarweb.more-commerce.com') !== -1 || env.NODE_ENV === 'staging';

//#region DEFAULT (DEVELOPMENT)

let mongoDB = 'mongodb+srv://plusmar-staging:cA0lZMEiwQRG3sRd@itoppluscluster.ixeww.gcp.mongodb.net/plusmar-staging?retryWrites=true&w=majority';
let mongoAutodigiDB = 'mongodb+srv://autodigi-staging:xGesKIsnWfZXOCsp@itoppluscluster.ixeww.gcp.mongodb.net/autodigi-staging?retryWrites=true&w=majority';
// let mongoAutodigiDB = 'mongodb://devAutodigi:tbdadmin@192.168.0.99:27018,192.168.1.99:27018/ITOPPLUSUNKNOWN?replicaSet=rs0';

let mongoAutodigiCosmosDB = 'NO';
const mongoReturnLimit = 10000;
let PG_URL_READ = 'postgres://developer:tbdadmin@35.186.155.175:5432/plusmar-staging';
let PG_URL_WRITE = 'postgres://developer:tbdadmin@35.186.155.175:5432/plusmar-staging';

let MCPort = 3333;
let CMSPort = 3334;
let CMSAPIPort = 3335;

let redisHost = 'redis://127.0.0.1';
let redisHostPort = '6379';
let redisStore = 'redis://127.0.0.1';
let redisStorePort = '6379';
let redisSubscription = 'redis://127.0.0.1';
let redisSubscriptionPort = '6379';

let NATSServer = ['nats://localhost:4222', 'nats://localhost:4223'];

let adminOrigin = 'https://localhost:' + env.PLUSMAR_ADMIN_PORT;
// GET from .dev.sh script auto generate .env files
let backendUrl = env.BACKEND_URL || 'http://localhost:3333';
let webViewUrl = env.WEB_VIEW_URL || 'http://localhost:3333';

let SUBSCRIPTION_THAIPOST_TOPIC = env.SUBSCRIPTION_THAIPOST_TOPIC || 'plusmar-dev-thaipost-dropoff';
let SUBSCRIPTION_PRODUCT_INVENTORY = env.SUBSCRIPTION_PRODUCT_INVENTORY || 'plusmar-dev-product-inventory';

let SUBSCRIPTION_PUPPET_MESSAGE = env.SUBSCRIPTION_PUPPET_MESSAGE || 'puppet-message-dev';
let SUBSCRIPTION_PUPPET_MESSAGE_PAPER_RESPONSE = env.SUBSCRIPTION_PUPPET_MESSAGE_PAPER_RESPONSE || 'puppet-message-paper-response-dev';
let SUBSCRIPTION_MESSAGE_QUEUEING = 'message-queueing-dev';
let SUBSCRIPTION_MESSAGE_CLOSE_REASON = 'message-close-reason-dev';
// facebook app

// payment paypal
let paypalOauthApi = 'https://api.sandbox.paypal.com/v1/oauth2/token/';
let paypalOrderApi = 'https://api.sandbox.paypal.com/v2/checkout/orders/';
let paypalPaymentApi = 'https://api.sandbox.paypal.com/v2/payments/captures/';
// payment 2c2p
let PAYMENT_2C2P_PAYMENT_ACTION = 'https://demo2.2c2p.com/2C2PFrontend/PaymentActionV2/PaymentAction.aspx';
let MERCHANT_AUTH_KEY = '2D21C4547BF806903D9556490CE71DCB1E56ED61644C52C01876717726AB88A2';
let MERCHANT_SHA_KEY = 'E376328D892749F5DD2AD41FB1E140E0FFB7D3B36114AA1DB62782677C99017D';

// logistic
let flashExpressKey = 'ef024543eab9f1105a516b3da7da815cda7e930d42dcfed32f95c9dd0125608b';
let flashExpressApiURL = 'https://open-api-tra.flashexpress.com/';
let jAndTExpressApiURL = 'https://jtpay-uat.jtexpress.co.th/thailand-ifd-web/normal/';
let jAndTCustomerId = 'MORE_COMMERCE';
let jAndTEECCompantId = 'MORE_COMMERCE';
let jAndTKey = '02a900db6c13c8d07a36565bd2fb202c';

// marketplace
let lazadaAppDomainName = backendUrl;
let lazadaAppID = 125021;
let lazadaAppSecret = '2kKXyzGhxxScqTsg7vCKIEuis9JG8KMv';

let shopeeUrl = 'https://partner.shopeemobile.com';
let shopeeAuthRedirectUrl = backendUrl + '/marketplace/shopee/auth';

///'line-secret';
let SUBSCRIPTION_NAME = env.SUBSCRIPTION_NAME;
// let LINE_SUBSCRIPTION_NAME = env.LINE_SUBSCRIPTION_NAME;
let LINE_SUBSCRIPTION_NAME = env.LINESUBSCRIPTION;

let nlpApi = 'http://172.16.10.4:8080/';
const s3Secret = '9876bbf28a87787c57f2bb848d125d1a9853c4a2375fafeb84c4996b3cfefe5b';
const s3AccessKey = '6ee720f549c739ef';
let s3Bucket = 'linestorage-staging';
let webViewKey = 'webViewKey';
let filesServerUpload = env.FILE_SERVER || 'http://localhost:3000/';

const maximumFileSizeFacebook = 26214400;
const cronJobConfig = {
  subtractProductRepeatTimer: 1, // second
  subtractProductMaxRetry: 60, // second
  subtractProductRetryAttempt: 3,
  //
  reservedProductRepeatTimer: 1, // second
  reservedProductMaxRetry: 60, // second
  reservedProductRetryAttempt: 3,
  reservedProductExpireInHour: 12,
  //
  updateCartRepeatTimer: 1, // second
  updateCartMaxRetry: 60, // second
  updateCartRetryAttempt: 3, // second
  //
  updateInventoryRepeatTimer: 1, // second
  updateInventoryMaxRetry: 60, // second
  updateInventoryRetryAttempt: 3,
  //
  redirect2C2PRepeatTimer: 1,
  redirect2C2PMaxRetry: 60,
  redirect2C2PRetryAttempt: 3,
  //
  redirectOmiseRepeatTimer: 1,
  redirectOmiseMaxRetry: 60,
  redirectOmiseRetryAttempt: 3,
  //
  dropOffCheckoutRepeatTimer: 1,
  dropOffCheckoutMaxRetry: 60,
  dropOffCheckoutRetryAttempt: 3,
  //
  paperReportResponseRepeatTimer: 3,
  paperReportResponseMaxRetry: 20,
};

const lineUpdateProfilePictureThreshold = 3;
const facebookUpdateProfileThreshold = 3;
const facebookUpdateProfilePictureThreshold = 3;

//Webhook Match Pattern Message
let SUBSCRIPTION_OPEN_API_MESSAGE = 'plusmar-dev-open-api';

const THAIPOST_USER = 'ITOP';
const THAIPOST_PWD = '12345';
const THAIPOST_VENDOR_ID = '104262';
const THAIPOST_COD_USER = 'Crop_ITP';
const THAIPOST_COD_PWD = '12345';

let TEST_USER_TOKEN = 'eyJhcGl0aGFuYSI6ImJvcmlib29udGhhbmFyYWsifQ';

//================================ CMS ===========================
let CMSRedisHost = 'redis://127.0.0.1';
let CMSRedisHostPort = '6379';
let CMSRedisGeneratorHost = 'redis://127.0.0.1';
let CMSRedisGeneratorHostPort = '6379';
let CMSAdminOrigin = 'https://localhost:' + env.CMS_ADMIN_PORT;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuWNDciAkHYpEx57gmqGT
vChjJuWzvFtqDGHMTCGkx6F5GN1FbHgvdloRElkpOb/JZdhWaUfcVwEY/t+u1Lpn
CfWGXtbcMNgQXwtfLM6+/kjWveBiHdjBtBg0oW3DY3VeRk2J3R3/Qoh3RHA1/HtM
BRAtwHJhopdgvsSQ9aeq2Mc0isxVKAsyPcFwlxDP7erjzf91IMnUp15hvIPH/gPS
cdDuWPowA5ipIVJQYPjXDhOCIgorclh0ECucjn8H6ZZToS/rFcVXbzmD5/orLF4q
T9xNMu0+fgIc9lfskUTEH/RmnrhHzf7gPkUsbG0IwDJIUwjCqOt8BCftiXlNj+8V
ewIDAQAB
-----END PUBLIC KEY-----`;
const CMSPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5Y0NyICQdikTH
nuCaoZO8KGMm5bO8W2oMYcxMIaTHoXkY3UVseC92WhESWSk5v8ll2FZpR9xXARj+
367UumcJ9YZe1tww2BBfC18szr7+SNa94GId2MG0GDShbcNjdV5GTYndHf9CiHdE
cDX8e0wFEC3AcmGil2C+xJD1p6rYxzSKzFUoCzI9wXCXEM/t6uPN/3UgydSnXmG8
g8f+A9Jx0O5Y+jADmKkhUlBg+NcOE4IiCityWHQQK5yOfwfpllOhL+sVxVdvOYPn
+issXipP3E0y7T5+Ahz2V+yRRMQf9GaeuEfN/uA+RSxsbQjAMkhTCMKo63wEJ+2J
eU2P7xV7AgMBAAECggEAGeOCx601XeqxMC8/rlhiCSSatBPfxa3+YTxHC1qnaDlk
b9R2nW8rMZviRm2tFCN0PIS5jHo8iuncU7to7swZF4rx+MyIc0m4/4zW/arhgSEq
29k52nEqm7vFncV2Q61gPPEXD4ng26my/hutblTJiOt5eCaA+/OnzvwkQinn8d2i
rLHnWIAOBYnvhHDT2bJ24X/bDdSRAsZElKu8Gi8xvXxorj0Ue4kRK9KtVBuaGlP0
C5bB8MwFdSyCcgK1PLY1ddhjs7P9p5S+yNqucVgnC5XNtAmxHcGnNdPIVUr1INGj
4bDORjDa8m9iem7hgVKSrKWIE4KM+WXFjH9SQ3myAQKBgQDsVWx6Pd0LupmMlVsF
k/SjZ+uu283L2rP/q28R9Q7SDjyMKFYzsLsTh+rsFnSkU8RC5BztWYVizuHKjQ39
ae7HWrBI1O61uj4632z69nod0Igk+ZSBXiS4kop3h375BJ10FwM0okJZD4FUNA10
0PUP8Y55EWOolOwcp7vpYzAMZQKBgQDI0IwMv+dBNYG1DyCGB2+FqJL5zX+lr179
D7q7PXPF2juYflqCy8X0yobpeM/iczP96XwUtfjvNSZAJRoDWqKQaepU753BKNSe
IrE8Z9ULf2q49KoMlJk5qcLEctr8AhZeTA0+Y0Hd6nKzPwxyXMaBzRu4x5GolTLk
9Uu/ZbLMXwKBgQC7mcfFdYwdPl+bGAgr8lnUyK5unG7NbmtJ/ZTqhUPhfImVnINo
/tZR16elBuJKe3AkxR0tT82xNJZJihTb35Y6y4N6HQTsXs39P9QrlzIyrpEUAMZg
txGhLjoaTgV9uKsgNxBFXLQcLFG2PKed3i1aHZ7B/grFDIos6P0ic6j1fQKBgE2C
sYv6RniU/ou0WwlgtVsRxilFeI+rMS7cc2byQU2M/pPNsYHqxW3G/mv/hb4SWW8Y
QBx+YKd0DF+V8oR452Z2e0xtcKat6+Nd4KtAKKtXcwoQ5dIVSU9IhzTsYDoFVDzx
fesmxLWzWLJ3E4bQ6I4RbTHVVhOMAyj8xVALIQhhAoGBAJNWpSOxgKDOIlE6gUQs
ZaqX+sJdZqfWtR1jmvmG3RSn2HZev/6PZi8zNz4BOfpjY5IeSvOVy6Fo+LH8Q68L
IZJBqXTu0L4QYXYV2g9p3tefmzoL+VPPdR6312GQLAkLPUqvRBPRHtN888B6R9B9
9Ye5XcIEN/RVBX1WWzCYDhkX
-----END PRIVATE KEY-----`;
let parallelMaximumGenerateHtmlPage = 5;
let CMSGenerateContentSubscription = env.CMS_GENERATE_CONTENT;

const runnerNodeKey = 'runnerNode';
const readyNodeKey = 'readyNode';
//=================================================================
//#endregion

// Sentry URL

//#region PRODUCTION
if (IS_PRODUCTION) {
  console.log('IS_PRODUCTION');
  MCPort = 3333; // IGNORE
  CMSPort = 3334; // IGNORE
  CMSAPIPort = 3335; // IGNORE
  mongoDB = env.MONGODB;
  mongoAutodigiDB = env.MONGOAUTODIGIDB;
  mongoAutodigiCosmosDB = env.MONGOAUTODIGIDB_COSMOS;
  PG_URL_READ = env.PG_URL_READ;
  PG_URL_WRITE = env.PG_URL_WRITE;
  redisHost = 'redis://plusmar-redis';
  redisHostPort = '6379';

  redisStore = 'redis://10.148.0.23';
  redisStorePort = '6379';

  NATSServer = ['nats://10.148.0.23:4222', 'nats://10.148.0.23:4223'];

  redisSubscription = 'redis://10.148.0.23';
  redisSubscriptionPort = '6380';

  adminOrigin = env.ADMINORIGIN;

  lazadaAppDomainName = backendUrl;
  lazadaAppID = 125769;
  lazadaAppSecret = 'Gpll7UiJzYSxVboA2UqgVpsiuzZlHxS5';
  paypalOauthApi = 'https://api.paypal.com/v1/oauth2/token/';
  paypalOrderApi = 'https://api.paypal.com/v2/checkout/orders/';
  paypalPaymentApi = 'https://api.paypal.com/v2/payments/captures/';
  flashExpressKey = env.FLASH_EXPRESS_KEY;
  flashExpressApiURL = 'https://open-api.flashexpress.com/';
  jAndTExpressApiURL = 'https://jtpay-uat.jtexpress.co.th/thailand-ifd-web/normal/';
  jAndTCustomerId = 'MORE_COMMERCE';
  jAndTEECCompantId = 'MORE_COMMERCE';
  jAndTKey = env.J_AND_T_KEY;
  PAYMENT_2C2P_PAYMENT_ACTION = 'https://t.2c2p.com/PaymentActionV2/PaymentAction.aspx';
  MERCHANT_AUTH_KEY = 'D24006BA3705733CA5226F4E6A7AA6771A85F7AB4792BE459FB7C0750D86CE72';
  MERCHANT_SHA_KEY = 'D24006BA3705733CA5226F4E6A7AA6771A85F7AB4792BE459FB7C0750D86CE72';
  shopeeAuthRedirectUrl = env.BACKEND_URL + '/marketplace/shopee/auth';
  shopeeUrl = 'https://partner.shopeemobile.com';
  SUBSCRIPTION_NAME = env.SUBSCRIPTION_NAME;
  nlpApi = 'http://10.148.15.192:8080/';
  s3Bucket = 'linestorage';
  SUBSCRIPTION_THAIPOST_TOPIC = 'plusmar-thaipost-dropoff';
  SUBSCRIPTION_PRODUCT_INVENTORY = 'plusmar-product-inventory';
  SUBSCRIPTION_PUPPET_MESSAGE = 'puppet-message';
  SUBSCRIPTION_MESSAGE_QUEUEING = 'message-queueing-production';
  SUBSCRIPTION_MESSAGE_CLOSE_REASON = 'message-close-reason';
  SUBSCRIPTION_PUPPET_MESSAGE_PAPER_RESPONSE = 'puppet-message-paper-response';
  webViewKey = env.WEBVIEWKEY;
  TEST_USER_TOKEN = 'failsafe';
  SUBSCRIPTION_OPEN_API_MESSAGE = 'plusmar-production-open-api';

  //=========================== CMS ====================================
  //TEMPORARILY DISABLE UNTIL WE INVESTIGATE
  // publicKey = readFileSync(path.join(__dirname, '/public.pem')).toString();
  // CMSPrivateKey = readFileSync(path.join(__dirname, './private.pem')).toString();
  CMSRedisHost = 'redis://10.148.0.23';
  CMSRedisHostPort = '6379';
  CMSRedisGeneratorHost = 'redis://10.247.180.89';
  CMSRedisGeneratorHostPort = '6379';
  CMSAdminOrigin = 'https://cms-admin.itopplus.com';
  CMSGenerateContentSubscription = 'cms-generate-content-prod';
  parallelMaximumGenerateHtmlPage = 10;
  //====================================================================
  filesServerUpload = 'http://49.0.193.22:3009/';
} else if (IS_STAGING) {
  console.log('IS_STAGING');
  MCPort = 3333; // IGNORE
  CMSPort = 3334; // IGNORE
  CMSAPIPort = 3335; // IGNORE
  SUBSCRIPTION_NAME = 'plusmar-staging-page6';
  LINE_SUBSCRIPTION_NAME = 'plusmar-line-page6';

  redisHost = 'redis://plusmar-redis';
  redisHostPort = '6379';

  redisStore = 'redis://10.148.0.23';
  redisStorePort = '6379';

  redisSubscription = 'redis://10.148.0.23';
  redisSubscriptionPort = '6380';

  NATSServer = ['nats://10.148.0.23:4222', 'nats://10.148.0.23:4223'];

  adminOrigin = 'https://plusmaradmin.more-commerce.com';
  backendUrl = 'https://plusmarapi.more-commerce.com';
  webViewUrl = 'https://plusmarapi.more-commerce.com';

  shopeeAuthRedirectUrl = backendUrl + '/marketplace/shopee/auth';
  lazadaAppDomainName = backendUrl;
  nlpApi = 'http://10.148.15.192:8080/';
  SUBSCRIPTION_THAIPOST_TOPIC = 'plusmar-staging-thaipost-dropoff';
  SUBSCRIPTION_PRODUCT_INVENTORY = 'plusmar-staging-product-inventory';

  SUBSCRIPTION_MESSAGE_QUEUEING = 'message-queueing-staging';
  SUBSCRIPTION_MESSAGE_CLOSE_REASON = 'message-close-reason-staging';
  SUBSCRIPTION_PUPPET_MESSAGE = 'puppet-message-staging';
  SUBSCRIPTION_PUPPET_MESSAGE_PAPER_RESPONSE = 'puppet-message-paper-response-staging';

  webViewKey = 'C8D2FA922DD109F087FF4A8EEAA48B9F4BF93E0F';
  TEST_USER_TOKEN = 'failsafe';
  SUBSCRIPTION_OPEN_API_MESSAGE = 'plusmar-staging-open-api';

  //============================ CMS =================================
  // CMSPublicKey = ''; Use the same key as Development
  // CMSPrivateKey = ''; Use the same key as Development
  CMSRedisHost = 'redis://10.148.0.23';
  CMSRedisHostPort = '6379';
  CMSRedisGeneratorHost = 'redis://10.247.180.89';
  CMSRedisGeneratorHostPort = '6379';
  CMSAdminOrigin = 'https://cms-admin.more-commerce.com';
  CMSGenerateContentSubscription = 'cms-generate-content-staging';
  parallelMaximumGenerateHtmlPage = 10;
  //==================================================================
  filesServerUpload = 'http://49.0.193.22:3339/';
}
//#endregion
export type IEnvironment = IEnvironmentBackEnd & IEnvironmentFrontend;
export const environmentLib: IEnvironmentBackEnd & IEnvironmentFrontend = {
  ...environmentFrontEnd,
  mongoDB,
  mongoAutodigiDB,
  mongoAutodigiCosmosDB,
  mongoReturnLimit,
  port: 3333,
  MCPort: MCPort,
  CMSPort: CMSPort,
  CMSAPIPort: CMSAPIPort,
  PG_URL_READ,
  PG_URL_WRITE,
  PG_MAX_CON_READ: 20,
  PG_MAX_CON_WRITE: 10,
  THAI_BULK_APP_KEY: '1678787556998166',
  THAI_BULK_APP_SECRET: '94798da48ce34082e700eb108293fe3c',
  PAYMENT_2C2P_PAYMENT_ACTION,
  MERCHANT_AUTH_KEY,
  MERCHANT_SHA_KEY,
  redisHost,
  redisHostPort,
  redisStore,
  redisStorePort,
  redisSubscription,
  redisSubscriptionPort,
  NATSServer,
  backendUrl,
  webViewUrl,
  graphFBVersion: 'v8.0',
  googleCloudUploadBucket: 'resource.more-commerce.com',
  pageKey: '55f9e154604e6dff',
  paperKey: '37a736d7a26871773b0613cfb337a411',
  webViewKey,
  transporterConfig: {
    host: 'smtp.mailchannels.net',
    port: 465,
    secure: true,
    auth: {
      user: 'itopplus',
      pass: '80qboVVatKkYGz1R08PKsObF',
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  adminOrigin,
  tokenKey: "$E'TC}H2(o>X-.+,YG3NxZ^'Q)5f`h[}S6eER>kRk}F=IvQx`\"Gp^g$,tWv64#y",
  cms: {
    ...environmentFrontEnd.cms,
    adminOrigin: CMSAdminOrigin,
    redisHost: CMSRedisHost,
    redisPort: CMSRedisHostPort,
    redisGeneratorHost: CMSRedisGeneratorHost,
    redisGeneratorPort: CMSRedisGeneratorHostPort,
    CMSPrivateKey: CMSPrivateKey,
    generateContentSubscription: CMSGenerateContentSubscription,
    parallelMaximumGenerateHtmlPage: parallelMaximumGenerateHtmlPage,
    runnerNodeKey: runnerNodeKey,
    readyNodeKey: readyNodeKey,
  },
  publicKey,
  lazada: {
    appDomainName: lazadaAppDomainName,
    lazadaAppID,
    lazadaAppSecret,
    lazadaWebUrl: 'https://www.lazada.co.th',
    lazadaAuthUrl: 'https://auth.lazada.com/oauth/authorize',
    lazadaAuthRedirectUrl: '/marketplace/lazada/auth',
    lazadaRestUrl: 'https://auth.lazada.com/rest',
    lazadaApiUrlTH: 'https://api.lazada.co.th/rest',
    lazadaTokenCreateUrl: '/auth/token/create',
    lazadaSignInMethod: 'sha256',
    lazadaProductGet: '/products/get',
    lazadaProductPriceQuantityUpdate: '/product/price_quantity/update',
    lazadaGetSeller: '/seller/get',
    lazadaRefreshAccessTokenPath: '/auth/token/refresh',
    accessTokenExpireInHours: 168,
    refreshTokenExpireInHours: 720,
    lazadaGetOrders: '/orders/get',
    lazadaGetOrder: '/order/get',
    lazadaGetOrderItems: '/order/items/get',
    lazadaGetCategoryTree: '/category/tree/get',
    lazadaGetCateogoryAttributes: '/category/attributes/get',
    lazadaGetCategorySuggestion: '/product/category/suggestion/get',
    lazadaCreateProduct: '/product/create',
    lazadaGetBrand: '/category/brands/query',
    lazadaUpdateProduct: '/product/update',
  },
  shopee: {
    shopeeAppID: 2000601,
    shopeeAppSecret: '2f79bbc3190ce569260c234ae27796900a2007d6d7d6c8dc7c650d2279ecfb2d',
    shopeeUrl, // need to change when go live
    shopeeAuthPath: '/api/v2/shop/auth_partner',
    shopeeAuthRedirectUrl,
    shopeeSignInMethod: 'sha256',
    shopeeAccessTokenPath: '/api/v2/auth/token/get',
    shopeeGetSeller: '/api/v2/shop/get_shop_info',
    shopeeWebUrl: 'https://shopee.co.th',
    shopeeRefreshAccessTokenPath: '/api/v2/auth/access_token/get',
    accessTokenExpireInHours: 4,
    refreshTokenExpireInHours: 720,
    shopeeGetCategoryTree: '/api/v2/product/get_category',
    shopeeGetAttribute: '/api/v2/product/get_attributes',
    shopeeGetLogistics: '/api/v2/logistics/get_channel_list',
    shopeeGetBrands: '/api/v2/product/get_brand_list',
    shopeeCreateProduct: '/api/v2/product/add_item',
    shopeeUpdateProduct: '/api/v2/product/update_item',
    shopeeUploadImage: '/api/v2/media_space/upload_image',
    shopeeAddProductVariants: '/api/v2/product/init_tier_variation',
    shopeeUpdatePriceProduct: '/api/v2/product/update_price',
    shopeeUpdateInventoryProduct: '/api/v2/product/update_stock',
    shopeeUpdateTierVariation: '/api/v2/product/update_tier_variation',
    shopeeGetModelList: '/api/v2/product/get_model_list',
    shopeeGetOrdersList: '/api/v2/order/get_order_list',
    shopeeGetOrderDetails: '/api/v2/order/get_order_detail',
    shopeeGetProductBaseInfo: '/api/v2/product/get_item_base_info',
    shopeeGetProductList: '/api/v2/product/get_item_list',
    shopeeLanguages: [LanguageTypes.ENGLISH, LanguageTypes.THAI],
  },
  paypalOauthApi,
  paypalOrderApi,
  paypalPaymentApi,
  lineSecretKey: '55f9e159994e6dff',
  lineSecretToppic: 'line-secret',
  lineSecretSubscription: 'line-secret-refresh',
  lineMessageAPI: 'https://api.line.me/v2/bot/message',
  FACEBOOK_MESSAGE_ATTACHMENT_URL: 'https://graph.facebook.com/v9.0/me/message_attachments?access_token=',
  flashExpressKey,
  flashExpressApiURL,
  jAndTExpressApiURL,
  jAndTCustomerId,
  jAndTEECCompantId,
  jAndTKey,
  lineliff: 'https://liff.line.me',
  SUBSCRIPTION_NAME,
  LINE_SUBSCRIPTION_NAME,
  nlpApi,
  s3Secret,
  s3AccessKey,
  s3Bucket,
  SUBSCRIPTION_THAIPOST_TOPIC,
  SUBSCRIPTION_PRODUCT_INVENTORY,
  SUBSCRIPTION_PUPPET_MESSAGE,
  SUBSCRIPTION_PUPPET_MESSAGE_PAPER_RESPONSE,
  SUBSCRIPTION_MESSAGE_QUEUEING,
  SUBSCRIPTION_MESSAGE_CLOSE_REASON,
  more_api_key: '6EB92166E84C697D',
  cronJobConfig,
  THAIPOST_USER,
  THAIPOST_PWD,
  THAIPOST_VENDOR_ID,
  THAIPOST_COD_USER,
  THAIPOST_COD_PWD,
  TEST_USER_TOKEN,
  lineUpdateProfilePictureThreshold,
  facebookUpdateProfileThreshold,
  facebookUpdateProfilePictureThreshold,
  SUBSCRIPTION_OPEN_API_MESSAGE,
  filesServerUpload,
  maximumFileSizeFacebook,
};
// #endregion
