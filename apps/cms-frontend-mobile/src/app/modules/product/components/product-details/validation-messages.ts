import { IValidationMessage } from '@reactor-room/cms-models-lib';

export const validationMessages: IValidationMessage[] = [
  {
    control: 'status',
    rules: {
      required: 'Product Status is required',
    },
  },
  {
    control: 'price',
    rules: {
      required: 'Product Price is required',
    },
  },
  {
    control: 'discount',
    rules: {
      required: 'Product Discount is required',
    },
  },
  {
    control: 'amount',
    rules: {
      required: 'Product Amount is required',
    },
  },
  {
    control: 'originalPrice',
    rules: {
      required: 'Original Price is required',
    },
  },
  {
    control: 'salePrice',
    rules: {
      required: 'Sale Price is required',
    },
  },
];
