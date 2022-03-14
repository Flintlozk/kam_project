import { ILazadaEnv, IShopeeEnv } from '@reactor-room/itopplus-model-lib';

export interface IEnvironmentFrontendCMS {
  origin: string;
  backendUrl: string; // CMS-BACKEND
  apiUrl: string; // CMS-API
  themeBucketName: string;
  CMSFileSettingName: string;
  CMS_FRONTEND_COMPONENT_CLASS: string;
}
export interface IEnvironmentFrontend {
  IS_PRODUCTION: boolean;
  production: boolean;
  IS_STAGING: boolean;
  graphFBVersion: string;
  merchantID: string;
  attributeSupported: number;
  PAYMENT_2C2P_VERSION: string;
  PAYMENT_2C2P_REQUEST_3DS: string;
  PAYMENT_2C2P_REDIRECT_API: string;
  facebookAppID: string;
  facebookAppSecret: string;

  origin: string;
  cms: IEnvironmentFrontendCMS;
  filesServer: string;
  backendUrl: string;
  webViewUrl: string;

  facebookLoginScope: string[];
  linewebhook: string;

  gqlUrl: string;
  reportURL: string;
  AUTODIGI_URL: string;
  MAXIMUM_FILESIZE_UPLOAD: number;
}

export interface IEnvironmentBackEndCMS {
  adminOrigin: string;
  CMSPrivateKey: string;
  generateContentSubscription: string;
  parallelMaximumGenerateHtmlPage: number;
  redisHost: string;
  redisPort: string;
  redisGeneratorHost: string;
  redisGeneratorPort: string;
  runnerNodeKey: string;
  readyNodeKey: string;
}

export interface IEnvironmentBackEnd {
  adminOrigin: string;
  mongoDB: string;
  mongoAutodigiDB: string;
  mongoAutodigiCosmosDB: string;
  mongoReturnLimit: number;
  PG_URL_READ: string;
  PG_URL_WRITE: string;
  port: number;
  MCPort: number;
  CMSPort: number;
  CMSAPIPort: number;
  NATSServer: string[];
  PG_MAX_CON_READ: number;
  PG_MAX_CON_WRITE: number;
  THAI_BULK_APP_KEY: string;
  THAI_BULK_APP_SECRET: string;
  MERCHANT_AUTH_KEY: string;
  MERCHANT_SHA_KEY: string;
  PAYMENT_2C2P_PAYMENT_ACTION: string;
  redisHost: string;
  redisHostPort: string;
  redisStore: string;
  redisStorePort: string;
  redisSubscription: string;
  redisSubscriptionPort: string;
  pageKey: string;
  graphFBVersion: string;
  paperKey: string;
  webViewKey: string;
  backendUrl: string;
  webViewUrl: string;
  googleCloudUploadBucket: string;
  transporterConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    tls: {
      rejectUnauthorized: boolean;
    };
  };
  tokenKey: string;
  cms: IEnvironmentBackEndCMS & IEnvironmentFrontendCMS;
  publicKey: string;
  lineSecretKey: string;
  lineSecretToppic: string; // Publish to plusmar-pub
  lineSecretSubscription: string; // When redis empty but UUID and header have value trigger
  lineMessageAPI: string;
  FACEBOOK_MESSAGE_ATTACHMENT_URL: string;
  flashExpressKey: string;
  flashExpressApiURL: string;
  jAndTExpressApiURL: string;
  jAndTCustomerId: string;
  jAndTEECCompantId: string;
  jAndTKey: string;
  lazada: ILazadaEnv;
  shopee: IShopeeEnv;
  s3Secret: string;
  s3AccessKey: string;
  s3Bucket: string;
  SUBSCRIPTION_THAIPOST_TOPIC: string;
  SUBSCRIPTION_PRODUCT_INVENTORY: string;
  SUBSCRIPTION_PUPPET_MESSAGE: string;
  SUBSCRIPTION_PUPPET_MESSAGE_PAPER_RESPONSE: string;
  SUBSCRIPTION_MESSAGE_QUEUEING: string;
  SUBSCRIPTION_MESSAGE_CLOSE_REASON: string;
  more_api_key: string;
  cronJobConfig: {
    subtractProductRepeatTimer: number;
    subtractProductMaxRetry: number;
    subtractProductRetryAttempt: number;
    reservedProductRepeatTimer: number;
    reservedProductMaxRetry: number;
    reservedProductRetryAttempt: number;
    reservedProductExpireInHour: number;
    updateInventoryRepeatTimer: number;
    updateInventoryMaxRetry: number;
    updateInventoryRetryAttempt: number;
    updateCartRepeatTimer: number;
    updateCartMaxRetry: number;
    updateCartRetryAttempt: number;
    redirect2C2PRepeatTimer: number;
    redirect2C2PMaxRetry: number;
    redirect2C2PRetryAttempt: number;
    redirectOmiseRepeatTimer: number;
    redirectOmiseMaxRetry: number;
    redirectOmiseRetryAttempt: number;
    dropOffCheckoutRepeatTimer: number;
    dropOffCheckoutRetryAttempt: number;
    dropOffCheckoutMaxRetry: number;
    paperReportResponseMaxRetry: number;
    paperReportResponseRepeatTimer: number;
  };

  THAIPOST_USER: string;
  THAIPOST_PWD: string;
  THAIPOST_VENDOR_ID: string;
  THAIPOST_COD_USER: string;
  THAIPOST_COD_PWD: string;
  TEST_USER_TOKEN: string;

  paypalOauthApi: string;
  paypalOrderApi: string;
  paypalPaymentApi: string;

  SUBSCRIPTION_NAME: string;
  LINE_SUBSCRIPTION_NAME: string;
  lineliff: string;
  nlpApi: string;

  lineUpdateProfilePictureThreshold: number;
  facebookUpdateProfileThreshold: number;
  facebookUpdateProfilePictureThreshold: number;
  SUBSCRIPTION_OPEN_API_MESSAGE: string;

  filesServerUpload: string;

  maximumFileSizeFacebook: number;
}
