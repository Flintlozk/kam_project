import {
  CustomerShippingAddress,
  EnumFlashExpressArticleCategory,
  EnumFlashExpressCommon,
  EnumFlashExpressExpressCategory,
  IFlashExpressCommonParams,
  IFlashExpressCreateOrderParams,
  IFlashExpressPostData,
  IFlashExpressXFormSign,
  IPages,
} from '@reactor-room/itopplus-model-lib';
import * as crypto from 'crypto';

export const encryptSha256 = (str: string): string => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

export const generateFlashExpressXFormAndSign = (
  account: IFlashExpressCreateOrderParams | IFlashExpressCommonParams | IFlashExpressPostData,
  key: string,
): IFlashExpressXFormSign => {
  const valueArray = [];

  Object.keys(account).forEach((prop) => valueArray.push(`${prop}=${account[prop]}`));
  valueArray.push(`key=${key}`);

  const sign = encryptSha256(valueArray.join('&'));
  valueArray.push(`sign=${sign.toUpperCase()}`);

  return { xForm: valueArray.join('&'), sign: sign.toUpperCase() };
};

export const getUniqueOrderID = (value: number): string => {
  const orderIdLength = value.toString().length;
  const model = 'OR-0000000000';
  return model.substr(0, model.length - orderIdLength) + value;
};

export const mapFlashExpressAddressForCreateOrder = (pageAddress: IPages, shippingAddress: CustomerShippingAddress): IFlashExpressCreateOrderParams => {
  const { name, phone_number, location } = shippingAddress;
  // Have to order by Alphabet
  // Have to order by Alphabet
  // Have to order by Alphabet
  // Have to order by Alphabet
  return {
    articleCategory: EnumFlashExpressArticleCategory.OTHERS, // default
    codAmount: 0,
    codEnabled: EnumFlashExpressCommon.DISABLED, // ! HARDCODE
    dstCityName: location.city,
    dstDetailAddress: location.address,
    dstName: name,
    dstPhone: phone_number,
    dstPostalCode: Number(location.post_code),
    dstProvinceName: location.province,
    expressCategory: EnumFlashExpressExpressCategory.STANDARD_DELIVERY, // default
    insureDeclareValue: 0,
    insured: EnumFlashExpressCommon.DISABLED, // ! HARDCODE
    mchId: '',
    nonceStr: '',
    outTradeNo: '',
    // remark: '',
    srcCityName: pageAddress.amphoe,
    srcDetailAddress: pageAddress.address,
    srcName: pageAddress.page_name,
    srcPhone: pageAddress.tel,
    srcPostalCode: Number(pageAddress.post_code),
    srcProvinceName: pageAddress.province,
    weight: 0,
  };
};

export const mapFlashExpressCommonAddress = (merchantID: string): IFlashExpressCommonParams => {
  return {
    mchId: merchantID,
    nonceStr: 'RandomStr',
  };
};

export const configFlashExpressCreateOrderByPageConfig = (
  address: IFlashExpressCreateOrderParams,
  orderID: number,
  config: { weight: number; merchantID: string; codAmount: number; insureDeclareValue: number },
): IFlashExpressCreateOrderParams => {
  const randomString = getUniqueOrderID(orderID);
  address.mchId = config.merchantID;
  address.nonceStr = randomString;
  address.outTradeNo = randomString;

  address.codEnabled === EnumFlashExpressCommon.DISABLED ? delete address.codAmount : (address.codAmount = config.codAmount);
  address.insured === EnumFlashExpressCommon.DISABLED ? delete address.insureDeclareValue : (address.insureDeclareValue = config.insureDeclareValue);

  address.weight = config.weight || 1;
  return address;
};
