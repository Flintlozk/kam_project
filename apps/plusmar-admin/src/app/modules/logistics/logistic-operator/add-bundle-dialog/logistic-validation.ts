export const validationMessages = [
  {
    control: 'logisticName',
    rules: {
      required: 'Logistic name is required',
    },
  },
  {
    control: 'deliveryFee',
    rules: {
      required: 'Delivery fee is required',
      pattern: 'Delivery fee can be only numbers such as 15 or 15.00',
    },
  },
  {
    control: 'country',
    rules: {
      required: 'Country is required',
    },
  },
  {
    control: 'deliveryDays',
    rules: {
      pattern: 'Delivery days can be only numbers',
    },
  },
  {
    control: 'trackingStartNumbers',
    rules: {
      pattern: 'Tracking numbers must start with one capital letters and follow by 8 number',
    },
  },
  {
    control: 'trackingEndNumbers',
    rules: {
      required: 'Tracking number is required ',
      pattern: 'Tracking numbers must start with one capital letters and follow by 8 number',
    },
  },
  {
    control: 'trackingStartandEndNumbers',
    rules: {
      required: 'Tracking number is required ',
      pattern: 'Tracking number must have the same capital letters ',
      minlength: 'Tracking numbers must start with one capital letters and follow by 8 number',
      maxlength: 'Tracking numbers must start with one capital letters and follow by 8 number',
    },
  },
  {
    control: 'walletID',
    rules: {
      required: 'Wallet ID is required ',
    },
  },
  {
    control: 'merchantID',
    rules: {
      pattern: 'merchantID must start with two capital letters and follow by 4 number',
      required: 'merchantID is required',
    },
  },
  {
    control: 'shopId',
    rules: {
      required: 'Shop ID is required ',
    },
  },
  {
    control: 'shopName',
    rules: {
      required: 'Shop name is required ',
    },
  },
];
