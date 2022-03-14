export const validationMessages = [
  {
    control: 'first_name',
    rules: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 3 character',
    },
  },
  {
    control: 'last_name',
    rules: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 3 character',
    },
  },
  {
    control: 'nickname',
    rules: {
      required: 'Facebook Name is required',
      minlength: 'Facebook Name cannot be less than 2 character',
    },
  },
  {
    control: 'phone_number',
    rules: {
      required: 'Mobile is required',
      minlength: 'Mobile number should be of 10 digits',
      maxlength: 'Mobile number should be of 10 digits',
      pattern: 'Mobile number can be only numbers',
      phoneinit: 'Mobile should starts with 09 or 08 or 06 ',
    },
  },
  {
    control: 'email',
    rules: {
      required: 'Email is required',
      email: 'Email is not valid',
      pattern: 'Email is incorrect (mail@ex.com)',
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
    control: 'city',
    rules: {
      required: 'City is required',
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
