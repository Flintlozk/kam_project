import { EnumLanguageCultureUI, ICategory } from '@reactor-room/cms-models-lib';
import { mock } from '@reactor-room/itopplus-back-end-helpers';
import * as data from '../../data/contents/categories.data';
import { CategoriesService } from './categories.service';

jest.mock('../../data/category/category.data');
const categoryNoLanguageRequest: ICategory = {
  _id: null,
  pageID: 630,
  name: 'req1',
  featuredImg: '',
  language: [],
  parentId: null,
  status: true,
};
const categoryNoLanguageResponse: ICategory = {
  _id: '1',
  pageID: 630,
  name: 'req1',
  featuredImg: '',
  language: [
    {
      cultureUI: EnumLanguageCultureUI.TH,
      name: 'lan1',
      slug: 'slug1',
      description: 'desc1',
    },
  ],
  parentId: null,
  status: true,
  createdAt: 12,
  updatedAt: 12,
};
const categoryWithLanguageResponse: ICategory = {
  _id: '1',
  pageID: 630,
  name: 'req1',
  featuredImg: '',
  language: [
    {
      cultureUI: EnumLanguageCultureUI.TH,
      name: 'lan1',
      slug: 'slug1',
      description: 'desc1',
    },
  ],
  parentId: null,
  status: true,
  createdAt: 12,
  updatedAt: 12,
};
const categoryWithLanguageRequest: ICategory = {
  _id: null,
  pageID: 630,
  name: 'req1',
  featuredImg: '',
  language: [
    {
      cultureUI: EnumLanguageCultureUI.TH,
      name: 'lan1',
      slug: 'slug1',
      description: 'desc1',
    },
  ],
  parentId: null,
  status: true,
};
const idsToBeDeleted = ['1', '2', '3'];
describe('CategoriesService addContentCategory', () => {
  test('addContentCategory Successful', async () => {
    const expectedValue = { status: 200, value: categoryNoLanguageResponse._id };
    mock(data, 'addContentCategory', jest.fn().mockResolvedValueOnce(categoryNoLanguageResponse));
    const result = await CategoriesService.addContentCategory(630, categoryNoLanguageRequest);
    expect(expectedValue).toEqual(result);
    expect(data.addContentCategory).toBeCalledTimes(1);
  });
  test('addContentCategory Failed', async () => {
    const expectedValue = { status: 403, value: "Cannot read properties of null (reading '_id')" };
    mock(data, 'addContentCategory', jest.fn().mockResolvedValueOnce(null));
    const result = await CategoriesService.addContentCategory(630, categoryNoLanguageResponse);
    expect(result.status).toEqual(expectedValue.status);
    expect(result.value).toEqual(expectedValue.value);
    expect(data.addContentCategory).toBeCalledTimes(1);
  });
  test('addContentCategory Error', async () => {
    const expectedValue = { status: 403, value: 'Error Occured' };
    mock(
      data,
      'addContentCategory',
      jest.fn().mockImplementation(() => {
        throw new Error('Error Occured');
      }),
    );
    const result = await CategoriesService.addContentCategory(630, categoryNoLanguageResponse);
    expect(expectedValue).toEqual(result);
    expect(data.addContentCategory).toBeCalledTimes(1);
  });
});

describe('CategoriesService checkCategoryNameExist', () => {
  test('checkCategoryNameExist Successful Name exists', async () => {
    const expectedValue = { status: 200, value: true };
    mock(data, 'checkCategoryNameExist', jest.fn().mockResolvedValueOnce(categoryWithLanguageResponse));
    const result = await CategoriesService.checkCategoryNameExist(630, 'req1', '2');
    expect(expectedValue).toEqual(result);
    expect(data.checkCategoryNameExist).toBeCalledTimes(1);
  });
  test('checkCategoryNameExist Failed Name does not exists', async () => {
    const expectedValue = { status: 200, value: false };
    mock(data, 'checkCategoryNameExist', jest.fn().mockResolvedValueOnce(null));
    const result = await CategoriesService.checkCategoryNameExist(630, 'req2', null);
    expect(expectedValue).toEqual(result);
    expect(data.checkCategoryNameExist).toBeCalledTimes(1);
  });
  test('checkCategoryNameExist Error', async () => {
    const expectedValue = { status: 403, value: 'Error Occured' };
    mock(
      data,
      'checkCategoryNameExist',
      jest.fn().mockImplementation(() => {
        throw new Error('Error Occured');
      }),
    );
    const result = await CategoriesService.checkCategoryNameExist(630, 'req2', '1');
    expect(expectedValue).toEqual(result);
    expect(data.checkCategoryNameExist).toBeCalledTimes(1);
  });
});

describe('CategoriesService updateCategoryNameByID', () => {
  test('updateCategoryNameByID Successful', async () => {
    const expectedValue = { status: 200, value: true };
    mock(data, 'updateCategoryNameByID', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'updateParentModified', jest.fn().mockResolvedValueOnce(null));
    const result = await CategoriesService.updateCategoryNameByID(630, categoryWithLanguageRequest);
    expect(expectedValue).toEqual(result);
    expect(data.updateCategoryNameByID).toBeCalledTimes(1);
    expect(data.updateParentModified).toBeCalledTimes(0);
  });
  test('updateCategoryNameByID Error', async () => {
    const expectedValue = { status: 403, value: 'Error Occured' };
    mock(
      data,
      'updateCategoryNameByID',
      jest.fn().mockImplementation(() => {
        throw new Error('Error Occured');
      }),
    );
    mock(data, 'updateParentModified', jest.fn().mockResolvedValueOnce(null));
    const result = await CategoriesService.updateCategoryNameByID(630, categoryNoLanguageResponse);
    expect(expectedValue).toEqual(result);
    expect(data.updateCategoryNameByID).toBeCalledTimes(1);
    expect(data.updateParentModified).toBeCalledTimes(0);
  });
});

describe('CategoriesService deleteCategoryByID', () => {
  test('deleteCategoryByID Successful', async () => {
    const expectedValue = { status: 200, value: true };
    mock(data, 'deleteCategoryByID', jest.fn().mockResolvedValueOnce(null));
    const result = await CategoriesService.deleteCategoryByID(630, '1');
    expect(expectedValue).toEqual(result);
    expect(data.deleteCategoryByID).toBeCalledTimes(1);
  });
  test('deleteCategoryByID Error', async () => {
    const expectedValue = { status: 403, value: 'Error Occured' };
    mock(
      data,
      'deleteCategoryByID',
      jest.fn().mockImplementation(() => {
        throw new Error('Error Occured');
      }),
    );
    const result = await CategoriesService.deleteCategoryByID(630, '1');
    expect(expectedValue).toEqual(result);
    expect(data.deleteCategoryByID).toBeCalledTimes(1);
  });
});

describe('CategoriesService deleteCategoriesByID', () => {
  test('deleteCategoriesByID Successful', async () => {
    const expectedValue = { status: 200, value: true };
    mock(data, 'deleteCategoriesByID', jest.fn().mockResolvedValueOnce(null));
    const result = await CategoriesService.deleteCategoriesByID(630, idsToBeDeleted);
    expect(expectedValue).toEqual(result);
    expect(data.deleteCategoriesByID).toBeCalledTimes(1);
  });
  test('deleteCategoriesByID Error', async () => {
    const expectedValue = { status: 403, value: 'Error Occured' };
    mock(
      data,
      'deleteCategoriesByID',
      jest.fn().mockImplementation(() => {
        throw new Error('Error Occured');
      }),
    );
    const result = await CategoriesService.deleteCategoriesByID(630, idsToBeDeleted);
    expect(expectedValue).toEqual(result);
    expect(data.deleteCategoriesByID).toBeCalledTimes(1);
  });
});
