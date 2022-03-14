import {
  CustomerShippingAddress,
  IJAndTJsonAddress,
  IJAndTAddressInfo,
  IJAndAddress,
  IJAndTSenderAndRecieverInfo,
  IPages,
  ShippingAddressLocation,
} from '@reactor-room/itopplus-model-lib';
import * as crypto from 'crypto';
import { JAndTExpressAddressError } from '../../errors';

export const encryptSha256 = (str: string): string => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

export const mapJTExpressAddressForCreateOrder = (
  jtAddress: IJAndTJsonAddress[],
  page: IPages,
  { name, phone_number, location }: CustomerShippingAddress,
): IJAndTSenderAndRecieverInfo => {
  const pageJAndTAddress = validateAddress({ city: page.amphoe, province: page.province, post_code: page.post_code } as ShippingAddressLocation, jtAddress);
  const customerJAndTAddress = validateAddress(location, jtAddress);
  return {
    sender: {
      name: page.page_name,
      postcode: page.post_code,
      mobile: page.tel,
      phone: page.tel,
      city: pageJAndTAddress.city_code,
      area: pageJAndTAddress.area_code,
      address: `${page.address} ${page.district}`,
    } as IJAndTAddressInfo,
    receiver: {
      name: name,
      postcode: location.post_code,
      mobile: phone_number,
      phone: phone_number,
      city: customerJAndTAddress.city_code,
      area: customerJAndTAddress.area_code,
      address: `${location.address} ${location.district}`,
    } as IJAndTAddressInfo,
  } as IJAndTSenderAndRecieverInfo;
};

export const validateAddress = (customerAddress: ShippingAddressLocation, jtAddress: IJAndTJsonAddress[]): IJAndAddress => {
  let city = customerAddress.city;
  if (customerAddress.post_code.substring(0, 2) === '10') {
    city = `เขต${city}`;
  }
  const address = jtAddress.find((x) => x.city === customerAddress.province && x.area === city);
  if (!address) {
    console.log('Error address not match j&t address => ', customerAddress);
    throw new JAndTExpressAddressError('ADDRESS_NOT_CORRECT');
  }
  const newAddress = {
    ...address,
    city_code: address.city_code.toString().padStart(2, '0'),
    area_code: address.area_code.toString().padStart(4, '0'),
  };
  return newAddress;
};

export const createJAndTOrderID = (purchaseOrderID: number, version: number): string => {
  const orderIdLength = purchaseOrderID.toString().length;
  const model = '0000000000';
  const orderID = `${model.substr(0, model.length - orderIdLength) + purchaseOrderID}M${version}`;
  return orderID;
};
