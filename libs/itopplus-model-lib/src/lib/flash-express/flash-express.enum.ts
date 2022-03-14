export enum EnumFlashExpressCommon {
  ENABLED = 1,
  DISABLED = 0,
}

export enum EnumFlashExpressArticleCategory {
  //   0 = 'File',
  //   1 = 'Dry food',
  //   2 = 'Commodity',
  //   3 = 'Digital Products',
  //   4 = 'Clothes',
  //   5 = 'Books',
  //   6 = 'Auto parts',
  //   7 = 'Shoes and bags',
  //   8 = 'Sports equipment',
  //   9 = 'Cosmetics',
  //   10 = 'Household',
  //   11 = 'Fruit',
  //   99 = 'Others',
  FILE = 0,
  DRY_FOOD = 1,
  COMMODITY = 2,
  DIGITAL_PRODUCTS = 3,
  CLOTHES = 4,
  BOOKS = 5,
  AUTO_PARTS = 6,
  SHOES_AND_BAGS = 7,
  SPORTS_EQUIPMENT = 8,
  COSMETICS = 9,
  HOUSEHOLD = 10,
  FRUIT = 11,
  OTHERS = 99,
}

export enum EnumFlashExpressExpressCategory {
  // 1 =	Standard delivery
  // 2 =	Speed delivery
  STANDARD_DELIVERY = 1,
  SPEED_DELIVERY = 2,
}

export const EnumFlashExpressResponseCode = {
  '1': 'success',
  '0': 'internal server error',
  '1000': 'Failed to submit',
  '1001': 'customer not found',
  '1002': 'invalid signature',
  '1003': 'order already exists',
  '1004': "shipper's address not match",
  '1005': 'destination not match',
  '1006': 'order not found',
  '1007': 'warehouse not found',
  '1008': 'COD service not subscribed',
  '1009': 'COD can not be < 0',
  '1010': 'The current customer has unfinished package notice, no need to send notice',
  '1015': 'order has been picked up,can not be canceled',
  '1018': "shipper's address and warehouse No. could not both be empty",
  '1019': 'pno and mchId not match',
  '1020': 'Insured declare value can not be < 0',
  '1021': "shipper's postal code only be a 5 digit number",
  '1022': "shipper's address not available",
};
