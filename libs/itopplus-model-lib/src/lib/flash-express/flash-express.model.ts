import { EnumFlashExpressArticleCategory, EnumFlashExpressCommon, EnumFlashExpressExpressCategory } from './flash-express.enum';
//9b02b3bd1900.ngrok.io/purchase?type=COMBINE_LOGISTIC_PAYMENT&psid=2622191497882524&audienceId=1686&fb_iframe_origin=https%3A%2F%2Fwww.facebook.com
// export interface IFlsahExpressMerchant {
//   mchId: string; // merchant No.
//   nonceStr: string; // random nonce string
//   sign: string; // signature : combination of IFlashExpressAccount props
//   outTradeNo: string; // merchant order No.
//   warehouseNo: string; //shipper's warehouse No. It must be the merchant warehouse number
//   queried through the interface getAllWarehouses(http://open-docs.flashexpress.com/#getallwarehouses-warehouses)
// }

export interface IFlashExpressResponse {
  code: number;
  message: string;
}

export interface IFlashExpressCreateOrderResponseData {
  // success
  pno?: string;
  mchId?: string;
  outTradeNo?: string;
  sortCode?: string;
  lineCode?: string;
  sortingLineCode?: string;
  dstStoreName?: string;
  earlyFlightEnabled?: boolean;
  packEnabled?: boolean;
  // error
  weight?: string[];
  // manual
  expandedSortCode?: {
    ext1: string;
    ext2: string;
    ext3: string;
  };
  expandedDstStoreName?: {
    ext1: string;
    ext2: string;
    ext3?: string;
  };
}

export interface IFlashExpressCreateOrderResponse extends IFlashExpressResponse {
  data: IFlashExpressCreateOrderResponseData;
}
export interface IFlashExpressGenerateLabelResponse extends IFlashExpressResponse {
  data: string;
}

export interface IFlashExpressCreateOrderParams {
  // ? required for creating Order
  articleCategory: EnumFlashExpressArticleCategory; // integer	true	Article Category(http://open-docs.flashexpress.com/#article_category)
  codAmount?: number; // integer	false	COD amount(unit: cent) (required if codEnabled = 1)
  codEnabled: EnumFlashExpressCommon; // integer	true	whether COD(1: Yes 0: No)
  dstCityName: string; // string(150)	true	consignee's city name. (Second-level administrative division)
  dstDetailAddress: string; // string(200)	true	consignee's detail address
  dstName: string; // string(50)	true	consignee's name
  dstPhone: string; // string(20)	true	consignee's phone number
  dstPostalCode: number; // string(20)	true	consignee's postal code
  dstProvinceName: string; // string(150)	true	consignee's province name. (first-level administrative division)
  expressCategory: EnumFlashExpressExpressCategory; // integer	true	Express Category(http://open-docs.flashexpress.com/#express_category)
  insureDeclareValue?: number; // integer	false	article declare value for insurance(unit: cent)
  insured: EnumFlashExpressCommon; // 	integer	true	whether to insure(1: Yes 0: No)
  mchId: string; // string(32)	true	merchant No.FIPA
  nonceStr: string; // string(32)	true	random nonce string
  outTradeNo: string; // string(64)	true	merchant order No.
  remark?: string; // string(200)	false	remark
  srcCityName?: string; // string(150)	false	shipper's city name. (Second-level administrative division)
  srcDetailAddress?: string; // string(200)	false	shipper's detail address
  srcName?: string; // string(50)	false	shipper's name
  srcPhone?: string; // 	string(20)	false	shipper's phone number
  srcPostalCode?: number; // 	string(20)	false	shipper's postal code
  srcProvinceName?: string; // 	string(150)	false	shipper's province name. (first-level administrative division)
  weight: number; // integer	true	article weight(unit: gram)
  width?: number; // 	integer	false	article width(unit: cm)
  length?: number; // 	integer	false	article length(unit: cm)
  height?: number; // 	integer	false	article height(unit: cm)
  warehouseNo?: string; // string(32)	false shipper's warehouse No. It must be the merchant warehouse number
}

export interface IFlashExpressCommonParams {
  mchId: string;
  nonceStr: string;
  sign?: string;
}

// export interface IFlashExpressAccountOptional extends IFlashExpressAccount {
//   width?: number; // 	integer	false	article width(unit: cm)
//   length?: number; // 	integer	false	article length(unit: cm)
//   height?: number; // 	integer	false	article height(unit: cm)
//   warehouseNo?: string; // string(32)	false shipper's warehouse No. It must be the merchant warehouse number
// }

export interface IFlashExpressPostData extends IFlashExpressCreateOrderParams {
  sign: string; // string(64)	true	signature : combination of IFlashExpressAccount props
}

export interface IFlashExpressXFormSign {
  xForm: string;
  sign: string;
}

// export const FlashExpressTypeDefs = gql``;
