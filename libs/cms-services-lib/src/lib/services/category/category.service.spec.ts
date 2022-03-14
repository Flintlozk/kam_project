import { ICategory, ICategoryWithLength } from '@reactor-room/cms-models-lib';
import * as data from '../../data/category/category.data';
import { mock } from '@reactor-room/itopplus-back-end-helpers';
import { ITableFilter } from '@reactor-room/model-lib';
import { EnumLanguageCultureUI } from '@reactor-room/cms-models-lib';
import { CategoryService } from './category.service';

const allCategoriesParents: ICategoryWithLength = {
  categories: [
    {
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
      createdAt: 2,
      updatedAt: 2,
    },
    {
      _id: '2',
      pageID: 630,
      name: 'jerry',
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
      createdAt: 1,
      updatedAt: 1,
    },
  ],
  total_rows: 2,
};
const allSubCategoriesOfParents: ICategory[] = [
  {
    _id: '11',
    pageID: 630,
    name: 'req11',
    featuredImg: '',
    language: [
      {
        cultureUI: EnumLanguageCultureUI.TH,
        name: 'lan12',
        slug: 'slug12',
        description: 'desc12',
      },
    ],
    parentId: '1',
    status: true,
    createdAt: 12,
    updatedAt: 12,
  },
];
const allCategoriesWithSubResponseDesc: ICategoryWithLength = {
  categories: [
    {
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
      subCategories: [
        {
          _id: '11',
          pageID: 630,
          name: 'req11',
          featuredImg: '',
          language: [
            {
              cultureUI: EnumLanguageCultureUI.TH,
              name: 'lan12',
              slug: 'slug12',
              description: 'desc12',
            },
          ],
          parentId: '1',
          status: true,
          createdAt: 12,
          updatedAt: 12,
        },
      ],
      createdAt: 2,
      updatedAt: 2,
    },
    {
      _id: '2',
      pageID: 630,
      name: 'jerry',
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
      subCategories: [],
      createdAt: 1,
      updatedAt: 1,
    },
  ],
  total_rows: 2,
};
const allCategoriesNoSubResponse: ICategoryWithLength = {
  categories: [
    {
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
      subCategories: [],
      createdAt: 2,
      updatedAt: 2,
    },
    {
      _id: '2',
      pageID: 630,
      name: 'jerry',
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
      subCategories: [],
      createdAt: 1,
      updatedAt: 1,
    },
  ],
  total_rows: 2,
};
const allCategoriesRequestDesc: ITableFilter = {
  search: '',
  currentPage: 0,
  pageSize: 10,
  orderBy: ['updatedAt'],
  orderMethod: 'desc',
};

describe('CategoryService getAllCategories', () => {
  test('getAllCategories With SubCategory Successful', async () => {
    const expectedValue = allCategoriesWithSubResponseDesc;
    mock(data, 'getAllCategories', jest.fn().mockResolvedValueOnce(allCategoriesParents));
    mock(data, 'getAllSubCategories', jest.fn().mockResolvedValueOnce(allSubCategoriesOfParents));
    const result = await CategoryService.getAllCategories(630, allCategoriesRequestDesc);
    expect(expectedValue).toEqual(result);
    expect(data.getAllCategories).toBeCalledTimes(1);
    expect(data.getAllSubCategories).toBeCalledTimes(1);
  });
  test('getAllCategories Without SubCategory Successful', async () => {
    const expectedValue = allCategoriesNoSubResponse;
    mock(data, 'getAllCategories', jest.fn().mockResolvedValueOnce(allCategoriesParents));
    mock(data, 'getAllSubCategories', jest.fn().mockResolvedValueOnce(null));
    const result = await CategoryService.getAllCategories(630, allCategoriesRequestDesc);
    expect(expectedValue).toEqual(result);
    expect(data.getAllCategories).toBeCalledTimes(1);
    expect(data.getAllSubCategories).toBeCalledTimes(1);
  });
  test('getAllCategories Category Failed', async () => {
    const expectedValue = { categories: [], total_rows: 0 };
    mock(data, 'getAllCategories', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'getAllSubCategories', jest.fn().mockResolvedValueOnce([]));
    const result = await CategoryService.getAllCategories(630, allCategoriesRequestDesc);
    expect(expectedValue).toEqual(result);
    expect(data.getAllCategories).toBeCalledTimes(1);
    expect(data.getAllSubCategories).toBeCalledTimes(1);
  });
  test('getAllCategories Sub Category Failed', async () => {
    const expectedValue = allCategoriesNoSubResponse;
    mock(data, 'getAllCategories', jest.fn().mockResolvedValueOnce(allCategoriesParents));
    mock(data, 'getAllSubCategories', jest.fn().mockResolvedValueOnce(null));
    const result = await CategoryService.getAllCategories(630, allCategoriesRequestDesc);
    expect(expectedValue).toEqual(result);
    expect(data.getAllCategories).toBeCalledTimes(1);
    expect(data.getAllSubCategories).toBeCalledTimes(1);
  });

  test('getAllCategories All null', async () => {
    const expectedValue = { categories: [], total_rows: 0 };
    mock(data, 'getAllCategories', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'getAllSubCategories', jest.fn().mockResolvedValueOnce(null));
    const mockINput: ITableFilter = {
      search: null,
      currentPage: null,
      pageSize: null,
      orderBy: null,
      orderMethod: null,
    };

    const result = await CategoryService.getAllCategories(630, mockINput);
    expect(expectedValue).toEqual(result);
    expect(data.getAllCategories).toBeCalledTimes(1);
    expect(data.getAllSubCategories).toBeCalledTimes(1);
  });
  test('getAllCategories Failed! Error', async () => {
    const expectedValue = 'Error: Unable to Connect to backend';
    try {
      mock(
        data,
        'getAllCategories',
        jest.fn().mockImplementation(() => {
          throw new Error('Unable to Connect to backend');
        }),
      );
      mock(data, 'getAllSubCategories', jest.fn().mockResolvedValueOnce(null));
      await CategoryService.getAllCategories(630, allCategoriesRequestDesc);
    } catch (error) {
      expect(expectedValue).toEqual(error?.message?.toString());
    }

    expect(data.getAllCategories).toBeCalledTimes(1);
    expect(data.getAllSubCategories).toBeCalledTimes(0);
  });
});
