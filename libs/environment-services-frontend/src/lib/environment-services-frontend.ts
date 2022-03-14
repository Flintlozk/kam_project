import { env } from 'process';
import { IEnvironmentFrontend, IEnvironmentFrontendCMS, plusmarProductionHostName, plusmarStagingHostName } from '@reactor-room/environment-services';
let URL = '';
try {
  URL = window?.location?.hostname;
} catch {
  console.log('URL Empty');
}

const IS_PRODUCTION = plusmarProductionHostName.includes(URL) || env.NODE_ENV === 'production';
const IS_STAGING = plusmarStagingHostName.includes(URL) || env.NODE_ENV === 'staging';

//#region DEFAULT (DEVELOPMENT)

let origin = 'https://localhost:' + env.PLUSMAR_PORT;
// GET from .dev.sh script auto generate .env files
let backendUrl = env.BACKEND_URL || 'http://localhost:3333';
let apiUrl = env.API_URL || 'http://localhost:3335';
let webViewUrl = env.WEB_VIEW_URL || 'http://localhost:3333';

let gqlUrl = 'http://localhost:3333/graphql';
let reportURL = 'http://localhost:3214';

// facebook app
let facebookAppID = '1569132056623655';
let facebookAppSecret = 'dfed3ed6fc36eaebc40de5f2be67902f';

let PAYMENT_2C2P_REQUEST_3DS = 'N';
let PAYMENT_2C2P_REDIRECT_API = 'https://demo2.2c2p.com/2C2PFrontEnd/RedirectV3/payment';

//================================ CMS ===========================
let CMSBackendUrl = 'http://localhost:3334';
let CMSOrigin = 'https://localhost:' + env.CMS_PORT;
let CMSThemeBucketName = 'cms-theme-storage-staging';
let filesServer = env.FILE_SERVER || 'http://localhost:3000/';
const CMSFileSettingName = 'site.css';
const CMS_FRONTEND_COMPONENT_CLASS = 'cms-component';
//=================================================================
//========================== AUTODIGI ================================
let AUTODIGI_URL = 'https://localhost:4202';
//====================================================================
const MAXIMUM_FILESIZE_UPLOAD = 25000000;
//#endregion

//#region PRODUCTION
if (IS_PRODUCTION) {
  console.log('IS_PRODUCTION');
  origin = env.ORIGIN;
  facebookAppID = '2893585627427837';
  facebookAppSecret = '402eaa905f993ae8e5d3b08cccdc2ec5';
  PAYMENT_2C2P_REQUEST_3DS = 'Y';
  PAYMENT_2C2P_REDIRECT_API = 'https://t.2c2p.com/RedirectV3/payment';
  gqlUrl = 'https://api.more-commerce.com/graphql';
  reportURL = 'https://paperengine.more-commerce.com';
  backendUrl = 'https://api.more-commerce.com';
  apiUrl = '/api';
  //=========================== CMS ====================================
  CMSThemeBucketName = 'cms-theme-storage-production';
  filesServer = 'https://itp1.itopfile.com/cms-image/';
  CMSOrigin = 'https://cms.itopplus.com';
  CMSBackendUrl = 'https://cms-api.itopplus.com';

  //====================================================================
  //========================== AUTODIGI ================================
  AUTODIGI_URL = 'https://backend.autodigi.net';
  //====================================================================
} else if (IS_STAGING) {
  console.log('IS_STAGING');

  origin = 'https://plusmarweb.more-commerce.com';
  backendUrl = 'https://plusmarapi.more-commerce.com';
  apiUrl = '/api';
  webViewUrl = 'https://plusmarapi.more-commerce.com';
  gqlUrl = 'https://plusmarapi.more-commerce.com/graphql';
  reportURL = 'https://plusmarpaperengine.more-commerce.com';
  //============================ CMS =================================
  filesServer = 'https://itp1.itopfile.com/cms-test/';
  CMSOrigin = 'https://cms.more-commerce.com';
  CMSBackendUrl = 'https://cms-api.more-commerce.com';
  //==================================================================
  //========================== AUTODIGI ================================
  AUTODIGI_URL = 'https://backendtest.autodigi.net';
  //====================================================================
}
//#endregion

const cms: IEnvironmentFrontendCMS = {
  origin: CMSOrigin,
  backendUrl: CMSBackendUrl,
  apiUrl: apiUrl,
  themeBucketName: CMSThemeBucketName,
  CMSFileSettingName: CMSFileSettingName,
  CMS_FRONTEND_COMPONENT_CLASS: CMS_FRONTEND_COMPONENT_CLASS,
};

export type IEnvironment = IEnvironmentFrontend;
export const environmentLib: IEnvironmentFrontend = {
  IS_PRODUCTION,
  production: IS_PRODUCTION || IS_STAGING,
  IS_STAGING,
  merchantID: '764764000004096',
  PAYMENT_2C2P_VERSION: '8.5',
  PAYMENT_2C2P_REQUEST_3DS,
  PAYMENT_2C2P_REDIRECT_API,
  facebookAppID,
  facebookAppSecret,
  attributeSupported: 2,
  origin,
  cms,
  filesServer,
  graphFBVersion: 'v8.0',
  backendUrl,
  webViewUrl,
  facebookLoginScope: [
    'email', // Get user email
    'public_profile', // Get user profile image
    'pages_show_list', // Get user email this permission will live after review approve and live
    /* Facebook Permission */
    'pages_messaging' /* [✓]
      The pages_messaging permission allows your app to manage and access Page conversations in Messenger.    
        [✓] Create interactive experiences initiated by a user.
        [✓] Confirm customer interactions such as purchases, orders and bookings.
        [✓] Send customer support messages. */,
    'pages_manage_metadata' /* [✓] 
      Permission allows your app to subscribe and receive webhooks about activity on the Page.
        [✓] Subscribe to receive webhooks of your Page.
      */,
    'pages_read_user_content' /* [✓]
      Permission allows your app to read user generated content on the Page, such as posts, comments, 
        [✓] Get user generated content on your Page.
        [✓] Get posts that your Page is tagged in.
        [✓] Delete comments posted by users on your Page.
      */,
    'pages_manage_engagement' /* [✓]
      Permission allows your app to create, edit and delete comments posted on the Page.
        [✓] Publish a comment on a Page post.
        [✓] Update your comment on a Page post.
        [✓] Delete a comment on a Page post.
        [✓] Like a Page post or remove your Like from a Page post.
      */,
    'pages_read_engagement' /* [✓]
      Permission allows your app to read content (posts, photos, videos, events) posted by the Page
        [✓] Get content posted by your Page.
        [✓] Get names, PSIDs, and profile pictures of your Page followers.
        [✓] Get metadata about your Page.
    */,
  ],
  linewebhook: 'https://linewebhook.more-commerce.com/linewebhook',
  gqlUrl,
  reportURL,
  AUTODIGI_URL,
  MAXIMUM_FILESIZE_UPLOAD,
};
