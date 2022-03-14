export const validationMessages = [
  {
    control: 'merchantID',
    rules: {
      required: 'Merchant ID is required',
      minlength: 'Merchant ID should be 15 character',
      maxlength: 'Merchant ID should be 15 character',
    },
  },
  {
    control: 'secretKey',
    rules: {
      required: 'Key is required',
      minlength: 'Key ID should not be less than 40 character',
    },
  },
];
