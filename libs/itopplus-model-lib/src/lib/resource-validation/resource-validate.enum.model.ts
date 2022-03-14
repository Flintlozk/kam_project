export enum EnumResourceValidationError {
  MEMBER_REACHED_LIMIT = 'MEMBER_REACHED_LIMIT',
  AUDIENCE_REACHED_LIMIT = 'AUDIENCE_REACHED_LIMIT',
  ORDER_REACHED_LIMIT = 'ORDER_REACHED_LIMIT',
  PRODUCT_REACHED_LIMIT = 'PRODUCT_REACHED_LIMIT',
}

export enum EnumResourceValidation {
  VALIDATE_MAX_PRODUCTS = 'VALIDATE_MAX_PRODUCTS',
  VALIDATE_MAX_PAGE_MEMBERS = 'VALIDATE_MAX_PAGE_MEMBERS',
  VALIDATE_MAX_ORDERS = 'VALIDATE_MAX_ORDERS',
  VALIDATE_MAX_AUDIENCES = 'VALIDATE_MAX_AUDIENCES',
  VALIDATE_MAX_PAGES = 'VALIDATE_MAX_PAGES',
}