//import { maxWeightLimitReachedMsg } from './products-create.component';
export const productValidationMessages = [
  {
    control: 'name',
    rules: {
      required: 'Product name is required',
      minlength: 'Product name should have at least two character',
      maxlength: 'Product name should not have more than 255 character',
    },
  },
  {
    control: 'code',
    rules: {
      required: 'Product code is required',
      codeExists: 'Product code already exists',
    },
  },
  {
    control: 'weight',
    rules: {
      required: 'Weight is required',
      maxvaluereached: 'weight_limit_exceed',
    },
  },
  {
    control: 'dimension.length',
    rules: {
      required: 'Length is required',
    },
  },
  {
    control: 'dimension.width',
    rules: {
      required: 'Width is required',
    },
  },
  {
    control: 'dimension.height',
    rules: {
      required: 'Height is required',
    },
  },
  {
    control: 'status',
    rules: {
      required: 'Status is required',
    },
  },
  {
    control: 'tags',
    rules: {
      required: 'Tags are required',
    },
  },
  {
    control: 'categories',
    rules: {
      required: 'Categories are required',
    },
  },
  {
    control: 'images',
    rules: {
      required: 'Images are required',
    },
  },
  {
    control: 'quill.description',
    rules: {
      required: 'Description is required',
    },
  },
];

export const productErrorMessages = {
  nameValidationMessage: null,
  codeValidationMessage: null,
  weightValidationMessage: null,
  statusValidationMessage: null,
  tagsValidationMessage: null,
  lengthValidationMessage: null,
  widthValidationMessage: null,
  heightValidationMessage: null,
  categoriesValidationMessage: null,
  descriptionValidationMessage: null,
  imagesValidationMessage: null,
};
