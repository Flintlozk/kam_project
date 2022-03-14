// export enum EnumThaiPostMessageStatus {
//   PENDING = 'PENDING',
//   RUNNING = 'RUNNING',
//   SUCCESS = 'SUCCESS',
//   FAILED = 'FAILED',
// }
// export enum EnumThaiPostMessageType {
//   REQUEST = 'REQUEST',
// }

export enum EnumThaiPostOrderType {
  DROP_OFF = 'D',
  LEX = 'L',
  WAREHOUSE = 'W',
  CROSS_BORDER = 'C',
  INTERNATIONAL = 'I',
  // 'D' = บริการ Drop off
  // 'L' = Lex
  // 'W' = Warehouse
  // 'C' = Crossborder
  // 'I' = R ต่างประเทศ
}

export enum EnumThaiPostCreateOrderResponse {
  SUCCESS = '000',
  INVALID_USER_PWD = '001', // Invalid Username and Password.
  INVALID_INPUT = '002', // Invalid Input.
  BARCODE_NOT_SUPPORT = '004', // Barcode not support this service.
  PLEASE_CHECK_BARCODE = '017', // Please check your input Zipcode or Prodinbox or Barcode.
  EMPTY_INFORMATION = '019', // Order information is null.
  //   '027', // Parameter {0} must not be null or blank value.
  //   '077', // Service code is null or empty.
  //   '078', // Quantity is null or empty.
  //   '079', // Item type is null or empty.
  //   '016', // Weight Over!
  //   '018', // Duplicate Barcode : {0}.
  //   '029', // Product price Over!
  //   '030', // Order Type {0} out of range.
  //   '031', // Create Order Fail !
  //   '071', // barcode status receive already.
  //   '073', // Postcode {0} ยังไม่เปิดให้ใช้บริการ.
  //   '023', // Vendor ID {0} not found.
  //   '028', // Merchant id : {1} does not match Vendor id : {0}.
  //   '070', // merchantId {0} not found.
  //   '072', // Vendor postcode is null.
  //   '083', // Vendor Defalt Postcode is null.
  //   '084', // Source province or Destination province not found.
  //   '069', // VendorId {0} and StorelocationNo {1} Not Found.
}
