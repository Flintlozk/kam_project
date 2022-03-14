import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
import { pageThirdPartyPageAllResponseValidate } from './pages-third-model';
Joi.extend(JoiDate);

export const PagesObjectValidate = {
  id: Joi.string().required(),
  pageName: Joi.string().required(),
  createdAt: Joi.string(),
  updatedAt: Joi.string(),
};

export const PageFeeInfoObjectValidate = {
  flat_status: Joi.boolean(),
  delivery_fee: Joi.number(),
};

export const getUserPhone = {
  tel: Joi.string(),
};
export const getShopDetail = {
  id: Joi.number(),
  page_name: Joi.string(),
  tel: Joi.string().allow('').allow(null),
  email: Joi.string(),
  address: Joi.string().allow('').allow(null),
  option: Joi.object().keys({
    access_token: Joi.string(),
  }),
  fb_page_id: Joi.string(),
  language: Joi.string().allow(null).allow(''),
  currency: Joi.string().allow(null).allow(''),
  firstname: Joi.string().allow('').allow(null),
  lastname: Joi.string().allow('').allow(null),
  flat_status: Joi.boolean(),
  delivery_fee: Joi.string(),
  district: Joi.string().allow('').allow(null),
  province: Joi.string().allow('').allow(null),
  post_code: Joi.string().allow('').allow(null),
  country: Joi.string().allow(null).allow(''),
  amphoe: Joi.string().allow('').allow(null),
  shop_picture: Joi.string().allow('').allow(null),
  social_facebook: Joi.string().allow(null).allow(''),
  social_line: Joi.string().allow(null).allow(''),
  social_shopee: Joi.string().allow(null).allow(''),
  social_lazada: Joi.string().allow(null).allow(''),
};

export const companyInfoResponse = {
  company_name: Joi.string(),
  company_logo: Joi.string().allow(null).allow(''),
  branch_name: Joi.string(),
  branch_id: Joi.string(),
  tax_identification_number: Joi.string().allow(null).allow(''),
  tax_id: Joi.number().allow(null).allow(''),
  phone_number: Joi.string(),
  email: Joi.string(),
  fax: Joi.string().allow(null).allow(''),
  address: Joi.string().allow(null).allow(''),
  post_code: Joi.string(),
  sub_district: Joi.string(),
  district: Joi.string(),
  province: Joi.string(),
  country: Joi.string(),
};

export const shopOwnerProfile = {
  id: Joi.number(),
  page_name: Joi.string(),
  page_role: Joi.string(),
  tel: Joi.string(),
  email: Joi.string(),
  address: Joi.string(),
  option: Joi.object().keys({
    access_token: Joi.string(),
  }),
  fb_page_id: Joi.string(),
  language: Joi.string(),
  currency: Joi.string(),
  firstname: Joi.string(),
  lastname: Joi.string(),
  flat_status: Joi.boolean(),
  delivery_fee: Joi.string(),
  district: Joi.string(),
  province: Joi.string(),
  post_code: Joi.string(),
  country: Joi.string().allow(null).allow(''),
  amphoe: Joi.string(),
  shop_picture: Joi.string(),
  socialFacebook: Joi.string().allow(null).allow(''),
  socialLine: Joi.string().allow(null).allow(''),
  socialShopee: Joi.string().allow(null).allow(''),
  socialLazada: Joi.string().allow(null).allow(''),
};
export const pageValidate = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNo: Joi.string().allow('').allow(null),
  email: Joi.string(),
  shopName: Joi.string(),
  facebookid: Joi.string(),
  facebookpic: Joi.string(),
  access_token: Joi.string(),
  address: Joi.string(),
  location: Joi.object().keys({
    city: Joi.string(),
    district: Joi.string(),
    post_code: Joi.string(),
    province: Joi.string(),
  }),
  country: Joi.string().allow(null).allow(''),
  currency: Joi.object().keys({
    currencyImgUrl: Joi.string().allow(null).allow(''),
    currencyTitle: Joi.string().allow(null).allow(''),
  }),
  language: Joi.object().keys({
    languageImgUrl: Joi.string().allow(null).allow(''),
    languageTitle: Joi.string().allow(null).allow(''),
  }),
  socialFacebook: Joi.string().allow(null).allow(''),
  socialLine: Joi.string().allow(null).allow(''),
  socialShopee: Joi.string().allow(null).allow(''),
  socialLazada: Joi.string().allow(null).allow(''),
  basicid: Joi.string().allow(null).allow(''),
  channelid: Joi.number().allow(null).allow(''),
  channelsecret: Joi.string().allow(null).allow(''),
  channeltoken: Joi.string().allow(null).allow(''),
  premiumid: Joi.string().allow(null).allow(''),
  userid: Joi.string().allow(null).allow(''),
  pictureurl: Joi.string().allow(null).allow(''),
  displayname: Joi.string().allow(null).allow(''),
  is_type_edit: Joi.boolean(),
};

export const settinSubscriptionDetail = {
  package: Joi.string(),
  pagelimit: Joi.string(),
  pageusing: Joi.number(),
  daysRemaining: Joi.number(),
  expiredDate: Joi.string(),
};

export const settinPageMember = {
  memberlimit: Joi.number(),
  memberusing: Joi.number(),
};

export const socialConnect = {
  facebook: Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    username: Joi.string().allow(null).required(),
    tasks: Joi.string().allow(null),
    category: Joi.string().allow(null),
    access_token: Joi.string().required(),
    picture: Joi.string().required(),
    category_list: Joi.optional(),
  }),
  line: Joi.object().keys({
    name: Joi.string().allow(null),
    picture: Joi.string().allow(null),
    id: Joi.string().allow(null),
  }),
  shopee: pageThirdPartyPageAllResponseValidate,
  lazada: pageThirdPartyPageAllResponseValidate,
};

export const pageFlatStatusWithFeeValidate = {
  flatInput: Joi.object({
    flatStatus: Joi.boolean(),
    fee: Joi.number(),
  }),
};
export const lineResponse = {
  id: Joi.string().allow(null),
  name: Joi.string(),
  picture: Joi.string().allow(null),
};

export const lineSettingRequest = {
  basicid: Joi.string().required(),
  channelid: Joi.number().required(),
  channelsecret: Joi.string().required(),
  channeltoken: Joi.string().required(),
  is_type_edit: Joi.boolean().required(),
};

export const lineSettingResponse = {
  basicid: Joi.string().allow(null).required(),
  channelid: Joi.number().allow(null).required(),
  channelsecret: Joi.string().allow(null).required(),
  channeltoken: Joi.string().allow(null).required(),
  id: Joi.number().allow(null).required(),
  uuid: Joi.string().allow(null).required(),
};

export const verifyLineSettingResponse = {
  displayname: Joi.string().required(),
  pictureurl: Joi.string().allow(null).required(),
  premiumid: Joi.string().allow(null).required(),
  userid: Joi.string().required(),
};

export const socialConnectRequest = {
  pageID: Joi.number().required(),
  ID: Joi.string().required(),
  accessToken: Joi.string().required(),
  page: Joi.object().keys({
    fb_page_id: Joi.string().required(),
  }),
};

export const pageWithOwnerInfoValidate = {
  user_email: Joi.string().required(),
  page_id: Joi.number().required(),
  page_name: Joi.string().required(),
};

export const cartMessageValidate = {
  message18: Joi.string().required(),
  message19: Joi.string().required(),
};

export const facebookPageWithBindedPageStatusValidate = {
  facebook_page: Joi.any(),
  is_binded: Joi.boolean().required(),
  email: Joi.string().required().allow(''),
};

const FacebookCredentialValidate = {
  ID: Joi.string().required(),
  pageID: Joi.string().optional(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  accessToken: Joi.string().required(),
  profileImg: Joi.string().required(),
};

export const credentialAndPageIDValidate = {
  credential: FacebookCredentialValidate,
  pageID: Joi.number().required(),
};

export const fbPageIDValidate = {
  fbPageID: Joi.string().required(),
};

export const currentStepValidate = {
  currentStep: Joi.string().required(),
};

export const pageIndexValidate = {
  pageIndex: Joi.number().required(),
};

export const facebookFanPageId = {
  page: Joi.object().keys({
    fb_page_id: Joi.string(),
  }),
};
export const trackingType = {
  delivery_type: Joi.string().allow(null),
  tracking_type: Joi.string().allow(null),
  cod_status: Joi.boolean().allow(null),
};
