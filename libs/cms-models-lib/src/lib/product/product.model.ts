import { IMoreImageUrlResponse } from '@reactor-room/model-lib';
export interface IProductAttributeErrorMessageType {
  statusErrorMessage: string;
  priceErrorMessage: string;
  discountErrorMessage: string;
  amountErrorMessage: string;
}

export interface IProductVariantErrorMessageType {
  originalPriceErrorMessage: string;
  salePriceErrorMessage: string;
}

export interface IProductVariantImageTransform {
  data: {
    variantImages: IMoreImageUrlResponse;
    id: number;
  };
  mode: string;
}
