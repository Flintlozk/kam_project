import { getUTCDayjs } from '@reactor-room/itopplus-back-end-helpers';
import { CustomerAddress, PurchaseOrderCustomerDetail } from '@reactor-room/itopplus-model-lib';

export const createAliasPOID = (orderAmount = 0): string => {
  const date = getUTCDayjs().format('YYMMDD');
  const orderId = orderAmount + 1;
  const orderIdLength = orderId.toString().length;
  const model = '00000';
  const orderID = `OR-${date}${model.substr(0, model.length - orderIdLength) + orderId}`;
  return orderID;
};

export const getCustomerDestination = (shippingAddress: CustomerAddress, isConfirm: boolean): PurchaseOrderCustomerDetail => {
  const { name, phone_number, location, first_name, last_name } = shippingAddress;
  const fullname = last_name === null ? first_name : `${first_name} ${last_name}`;
  const detail: PurchaseOrderCustomerDetail = {
    name: name === null ? fullname : name,
    phoneNumber: phone_number,
    location: null,
    isConfirm: isConfirm,
  };
  if (location?.address) {
    detail.location = {
      postCode: location.post_code,
      district: location.district,
      city: location.city,
      province: location.province,
      address: location.address,
      country: location.country,
    };
  }
  return detail;
};
