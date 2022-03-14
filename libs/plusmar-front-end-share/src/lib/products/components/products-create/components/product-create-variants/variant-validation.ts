export const validationMessages = [
  {
    control: 'unitPrice',
    rules: {
      required: 'Unit Price is required',
    },
  },
  {
    control: 'inventory',
    rules: {
      required: 'Inventory is required',
    },
  },
  {
    control: 'status',
    rules: {
      required: 'Status is required',
    },
  },
  {
    control: 'sku',
    rules: {
      required: 'SKU is required',
      skuSpecialChar: 'alpha_numeric_sku',
      skuExists: 'SKU already exists',
      skuUnique: 'SKU is not unique',
    },
  },
];
