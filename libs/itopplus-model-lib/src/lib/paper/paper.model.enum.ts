export enum PaperSize {
  'SIZE_A4' = 'SIZE_A4',
  'A4' = 'SIZE_A4',
  'SIZE_100x150' = 'SIZE_100x150',
  '100x150' = 'SIZE_100x150',
}

export enum PaperType {
  RECEIPT = 'receipt',
  RECEIPT_COD = 'receipt-cod',
  LABEL = 'label',
  LABEL_COD = 'label-cod',
  receipt = 'receipt',
  receipt_cod = 'receipt-cod',
  label = 'label',
  label_cod = 'label-cod',
}

export enum PaperMessageType {
  PLUSMAR_LABEL = 'PLUSMAR_LABEL',
  PLUSMAR_RECEIPT = 'PLUSMAR_RECEIPT',
}

export enum PaperMessageTypeConverter {
  RECEIPT = 'PLUSMAR_RECEIPT',
  RECEIPT_COD = 'PLUSMAR_RECEIPT',
  receipt = 'PLUSMAR_RECEIPT',
  receipt_cod = 'PLUSMAR_RECEIPT',
  LABEL = 'PLUSMAR_LABEL',
  LABEL_COD = 'PLUSMAR_LABEL',
  label = 'PLUSMAR_LABEL',
  label_cod = 'PLUSMAR_LABEL',
}

export enum PaperFileStatus {
  READY = 'READY',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}
