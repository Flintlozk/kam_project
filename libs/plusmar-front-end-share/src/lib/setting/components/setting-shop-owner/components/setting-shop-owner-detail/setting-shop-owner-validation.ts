export const validationMessages = [
  {
    control: 'phoneNo',
    rules: {
      phoneinit: 'Please enter the correct telephone number',
    },
  },
  {
    control: 'email',
    rules: {
      email: 'Email is not valid',
    },
  },
  {
    control: 'shopName',
    rules: {
      required: 'Shop name is required',
    },
  },
  {
    control: 'address',
    rules: {
      required: 'Address is required',
    },
  },
  {
    control: 'district',
    rules: {
      required: 'District is required',
    },
  },
  {
    control: 'province',
    rules: {
      required: 'Provience is required',
    },
  },
  {
    control: 'post_code',
    rules: {
      required: 'Postal Code is required',
      pattern: 'Postal Code can be only numbers',
    },
  },
  {
    control: 'country',
    rules: {
      required: 'Country is required',
    },
  },
];
