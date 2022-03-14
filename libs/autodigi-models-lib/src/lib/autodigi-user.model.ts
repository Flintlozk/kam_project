export interface IAutodigiBusiness {
  business_id: string;
  business_type_id: number;
  business_type_name: string;
  business_title_id: number;
  business_title_name: string;
  business_name: string;
  business_telephone: string;
  business_mobile: string;
  business_country: string;
  business_address: string;
  business_district: string;
  business_sub_district: string;
  business_postal_code: string;
  business_latitude: number;
  business_longitude: number;
  business_pin_color: string;
  business_province: string;
}

export interface IAutodigiUserCredential {
  user_id: string;
  email: string;
  password: string;
  name: string;
  picture: string;
  mobile: string;
  register_date: Date;
  activated: boolean;
  xid: string;
  bEnable: boolean;
}
export interface IAutodigiUserOAuthThirdParty {
  _id: string;
  uid: string;
  email: string;
  register_date: Date;
}
export interface IAutodigiUserOAuth {
  facebook: IAutodigiUserOAuthThirdParty;
  line: IAutodigiUserOAuthThirdParty;
  google: IAutodigiUserOAuthThirdParty;
}
export interface IAutodigiUser {
  _id: string;
  user_credential: IAutodigiUserCredential;
  business_info: IAutodigiBusiness;
  oauth: IAutodigiBusiness;
  latest_login: Date;
  more_commerce_subscription_id: string;
}
