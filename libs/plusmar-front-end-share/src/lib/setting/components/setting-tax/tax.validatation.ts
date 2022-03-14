export const validationMessages = [
  {
    control: 'taxID',
    rules: {
      required: 'Tax ID is required',
      minlength: 'Tax ID should be 13 number',
      maxlength: 'Tax ID should be 13 number',
      pattern: 'Tax ID can be only numbers',
    },
  },
  {
    control: 'taxValue',
    rules: {
      required: 'Tax is required',
      pattern: 'Tax can be only numbers such as 15 or 15.00',
    },
  },
];
