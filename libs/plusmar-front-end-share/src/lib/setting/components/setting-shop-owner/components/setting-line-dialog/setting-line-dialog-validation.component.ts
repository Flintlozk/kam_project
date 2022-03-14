export const lineSettingValidationMessages = [
  {
    control: 'basicid',
    rules: {
      required: 'Basic ID is required',
      minlength: 'Basic ID should have at least three character',
      pattern: 'Basic ID should be start with @',
    },
  },
  {
    control: 'channelid',
    rules: {
      required: 'Channel ID is required',
      minlength: 'Channel ID should have at least five character',
      pattern: 'Channel ID should be a number',
    },
  },
  {
    control: 'channelsecret',
    rules: {
      required: 'Channel Secret is required',
      minlength: 'Channel Secret should have at least ten character',
    },
  },
  {
    control: 'channeltoken',
    rules: {
      required: 'Channel Access Token is required',
      minlength: 'Channel Access Token should have at least ten character',
    },
  },
];

export const lineSettingErrorMessages = {
  basicidValidationMessage: null,
  channelidValidationMessage: null,
};
