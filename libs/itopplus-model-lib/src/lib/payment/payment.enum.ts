export enum EnumPaymentType {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  QR_PAYMENT_KBANK = 'QR_PAYMENT_KBANK',
  PAYPAL = 'PAYPAL',
  PAYMENT_2C2P = 'PAYMENT_2C2P',
  PAY_SOLUTION = 'PAY_SOLUTION',
  OMISE = 'OMISE',
}

export enum EnumOmisePaymentType {
  PROMPT_PAY = 'PROMPT_PAY',
  CREDIT_CARD = 'CREDIT_CARD',
  INTERNET_BANKING = 'INTERNET_BANKING',
}

export enum EnumOmiseChargeStatus {
  EXPIRED = 'EXPIRED',
  ALREADY_PAID = 'ALREADY_PAID',
  VALID = 'VALID',
  INVALID = 'INVALID',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum EnumPaymentName {
  BANK_ACCOUNT = 'Bank Account',
  CASH_ON_DELIVERY = 'Cash on delivery',
  QR_PAYMENT_KBANK = 'QR Payment KBank',
  PAYPAL = 'Paypal',
  PAYMENT_2C2P = '2C2P',
  PAY_SOLUTION = 'Pay Solution',
  OMISE = 'Omise',
}
export enum EnumBankAccountType {
  KBANK = 'KBANK', // KBANK 004 ธนาคารกสิกรไทย จากัด (มหาชน)
  SCB = 'SCB', //  SCB 014 ธนาคารไทยพาณิชย จากัด (มหาชน)
  KTB = 'KTB', // KTB 006 ธนาคารกรุงไทย จากัด (มหาชน)
  BBL = 'BBL', // BBL 002 ธนาคารกรุงเทพ จากัด (มหาชน)
  TMB = 'TMB', // TMB 011 ธนาคารทหารไทย จากัด (มหาชน)
  GSB = 'GSB', // GSB 030 ธนาคารออมสิน
  BAY = 'BAY', // BAY 025 ธนาคารกรุงศรีอยุธยา จากัด (มหาชน)
}

export enum EnumOmiseChargeWatchType {
  PENDING = 'PENDING',
  ALREADY_PAID = 'ALREADY_PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

export enum EnumPaymentOmiseError {
  NO_TOKEN = 'NO_TOKEN',
  NO_SOURCE = 'NO_SOURCE',
}
