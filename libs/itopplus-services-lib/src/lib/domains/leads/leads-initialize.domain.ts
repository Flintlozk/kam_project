import { ILeadFormControlTranslation, ILeadFormControlValidation } from '@reactor-room/itopplus-model-lib';

export const nameLabelTranslation = (): ILeadFormControlTranslation[] => {
  return [
    {
      langID: 'th',
      langValue: 'ชื่อ*',
      langName: 'Thai',
      default: true,
    },
    {
      langID: 'en',
      langValue: 'Name*',
      langName: 'English',
      default: false,
    },
  ];
};

export const phoneLabelTranslation = (): ILeadFormControlTranslation[] => {
  return [
    {
      langID: 'th',
      langValue: 'หมายเลขโทรศัพท์*',
      langName: 'Thai',
      default: true,
    },
    {
      langID: 'en',
      langValue: 'Phone No*',
      langName: 'English',
      default: false,
    },
  ];
};

export const nameControlValidation = (): ILeadFormControlValidation[] => {
  return [
    {
      rules: 'required',
      errorMessage: 'Name is required',
      translation: [
        {
          langID: 'th',
          langName: 'Thai',
          langValue: 'ต้องระบุชื่อ',
        },
        {
          langID: 'en',
          langName: 'English',
          langValue: 'Name is required',
        },
      ],
    },
  ];
};

export const phoneNumberControlValidation = (): ILeadFormControlValidation[] => {
  return [
    {
      rules: 'required',
      errorMessage: 'Phone number is required',
      translation: [
        {
          langID: 'th',
          langName: 'Thai',
          langValue: 'ต้องระบุหมายเลขโทรศัพท์',
        },
        {
          langID: 'en',
          langName: 'English',
          langValue: 'Phone number is required',
        },
      ],
    },
    {
      rules: 'phoneinit',
      errorMessage: 'Home Phone should have format 000000000 (9 digit) and Mobile Phone have format 0000000000 (10 digit)',
      translation: [
        {
          langID: 'th',
          langValue: 'โทรศัพท์บ้านควรมีรูปแบบ 000000000 (9 หลัก) และโทรศัพท์มือถือมีรูปแบบ 0000000000 (10 หลัก)',
          langName: 'Thai',
        },
        {
          langID: 'en',
          langValue: 'Home Phone should have format 000000000 (9 digit) and Mobile Phone have format 0000000000 (10 digit)',
          langName: 'English',
        },
      ],
    },
  ];
};
