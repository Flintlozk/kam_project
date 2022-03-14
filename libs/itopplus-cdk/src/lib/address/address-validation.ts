export const validationMessages = [
  {
    control: 'province',
    rules: {
      required: 'province is required',
      minlength: 'province cannot be less than 5 character',
    },
  },
  {
    control: 'amphoe',
    rules: {
      required: 'amphoe is required',
      minlength: 'amphoe cannot be less than 5 character',
    },
  },
  {
    control: 'city',
    rules: {
      required: 'city is required',
      // minlength: 'city cannot be less than 5 character',
    },
  },
  {
    control: 'district',
    rules: {
      required: 'district is required',
      minlength: 'district cannot be less than 5 character',
    },
  },
  {
    control: 'post_code',
    rules: {
      required: 'post code is required',
      minlength: 'post code cannot be less than 5 character',
    },
  },
];
