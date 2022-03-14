import { Schema } from 'mongoose';

// Start : User Schema
const thirdpartyAccount_Object = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  uid: {
    type: String,
  },
  email: {
    type: String,
  },
  register_date: Date,
});

const businessInfo_Object = new Schema({
  business_id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  business_type_id: Number,
  business_type_name: String,
  business_title_id: Number,
  business_title_name: String,
  business_name: String,
  business_telephone: String,
  business_mobile: String,
  business_country: String,
  business_address: String,
  business_district: String,
  business_sub_district: String,
  business_postal_code: String,
  business_latitude: Number,
  business_longitude: Number,
  business_pin_color: String,
  business_province: String,
});

const userSchema = {
  user_credential: {
    user_id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    name: String,
    picture: String,
    mobile: String,
    register_date: Date,
    activated: Boolean,
    xid: String,
    bEnable: Boolean,
  },
  business_info: businessInfo_Object,
  oauth: {
    facebook: thirdpartyAccount_Object,
    line: thirdpartyAccount_Object,
    google: thirdpartyAccount_Object,
  },
  more_commerce_subscription_id: String,
  latest_login: Date,
};
// End : User Schema

// Start : Webstat Schema
const statsDeviceStatus = new Schema({
  new: Number,
  old: Number,
});

const deviceStatus = new Schema({
  mobile: [statsDeviceStatus],
  tablet: [statsDeviceStatus],
  desktop: [statsDeviceStatus],
  unknown: [statsDeviceStatus],
});

const statsStatus = new Schema({
  new: Number,
  old: Number,
  device: deviceStatus,
});

const typeStatsDetail = new Schema({
  line: [statsStatus],
  messenger: [statsStatus],
  form: [statsStatus],
  call: [statsStatus],
  visitor: [statsStatus],
  location: [statsStatus],
  click_campaign: [statsStatus],
  cost_campaign: [statsStatus],
});

const typeStats = new Schema({
  name: String,
  stats_detail: [typeStatsDetail],
  category: String,
});

const daysStats = new Schema({
  day: Number,
  stats: [typeStats],
  createdate: Date,
  lastupdate: Date,
});

const webStats = {
  website_id: Schema.Types.ObjectId,
  stats: [daysStats],
  month: Number,
  year: Number,
  createdate: Date,
  lastupdate: Date,
};
// End : Webstat Schema

const thirdPartyGoogleAds = {
  id: String,
  descriptiveName: String,
  isActivate: Boolean,
  createdate: Date,
  lastupdate: Date,
};
const thirdPartyFacebook = {
  fanpageID: String,
  adAccountID: String,
  fanpageName: String,
  fanpagePicture: String,
  adAccountName: String,
  isActivate: Boolean,
  createdate: Date,
  lastupdate: Date,
};
const thirdPartyAnalytic = {
  viewID: String,
  viewName: String,
  accountID: String,
  accountName: String,
  webPropertyID: String,
  webPropertyName: String,
  isActivate: Boolean,
  createdate: Date,
  lastupdate: Date,
};

const thirdPartyId = {
  id: String,
  isActivate: Boolean,
  createdate: Date,
  lastupdate: Date,
};

const linkAccount = {
  googleAds: thirdPartyGoogleAds,
  googleAnalytic: thirdPartyAnalytic,
  facebookAds: thirdPartyFacebook,
  line: thirdPartyId,
};

const user = new Schema({
  user_id: Schema.Types.ObjectId,
  isOwner: Boolean,
  accessLevel: String,
  createdate: Date,
});

const facebookFanpages = new Schema({
  id: String,
  name: String,
  picture: String,
  isPrimary: Boolean,
});
const facebookAdAccount = new Schema({
  id: String,
  name: String,
  businessId: String,
  businessName: String,
  isPrimary: Boolean,
});

const facebookAccess = new Schema({
  fanpage: [facebookFanpages],
  adaccount: [facebookAdAccount],
});

const websiteSchema = {
  name: String,
  owner_id: Schema.Types.ObjectId, // Old config
  users: [user],
  business_info: businessInfo_Object,
  linkAccount: linkAccount,
  createdate: Date,
  lastupdate: Date,
  cid: String, // Old config
  ga_viewid: String, // Old config
  reportTemplate_id: Schema.Types.ObjectId, // Old config
  facebook: facebookAccess, // Old config
  websiteProtocal: String,
  more_commerce_page_id: Number,
};

export const AutodigiUserSchema = new Schema(userSchema);
export const AutodigiWebsiteSchema = new Schema(websiteSchema);
export const AutodigiWebstatSchema = new Schema(webStats);
