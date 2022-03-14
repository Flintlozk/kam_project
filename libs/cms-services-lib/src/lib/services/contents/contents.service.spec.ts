import {
  EContentEditorComponentType,
  EContentSectionType,
  EnumLanguageCultureUI,
  IContentEditor,
  IContentEditorComponentText,
  IContentEditorWithLength,
} from '@reactor-room/cms-models-lib';
import { mock } from '@reactor-room/itopplus-back-end-helpers';
import { ITableFilter } from '@reactor-room/model-lib';
import * as data from '../../data/contents/contents.data';
import { ContentsService } from './contents.service';

jest.mock('../../data/contents/contents.data');
let contentsResquest: IContentEditor = {
  _id: '1',
  pageID: 1,
  language: [],
  categories: [],
  tags: [],
  authors: [],
  isPin: false,
  priority: 0,
  startDate: 'ANY DATE',
  isEndDate: false,
  endDate: '',
  coverImage: '',
  views: 0,
  sections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
        },
      ],
    },
  ],
  isPublish: true,
  customCSS: '',
  name: '',
  draftSections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
        },
      ],
    },
  ],
};

let contentsNoColumnResquest: IContentEditor = {
  _id: '1',
  pageID: 1,
  language: [],
  categories: [],
  tags: [],
  authors: [],
  isPin: false,
  priority: 0,
  startDate: 'ANY DATE',
  isEndDate: false,
  endDate: '',
  coverImage: '',
  views: 0,
  sections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [],
    },
  ],
  isPublish: true,
  customCSS: '',
  name: '',
  draftSections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
        },
      ],
    },
  ],
};

let contentsNoComponentResquest: IContentEditor = {
  _id: '1',
  pageID: 1,
  language: [],
  categories: [],
  tags: [],
  authors: [],
  isPin: false,
  priority: 0,
  startDate: 'ANY DATE',
  isEndDate: false,
  endDate: '',
  coverImage: '',
  views: 0,
  sections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: '[]',
        },
      ],
    },
  ],
  isPublish: true,
  customCSS: '',
  name: '',
  draftSections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
        },
      ],
    },
  ],
};

let contentsResponse: IContentEditor = {
  _id: '1',
  pageID: 1,
  language: [],
  categories: [],
  tags: [],
  authors: [],
  isPin: false,
  priority: 0,
  startDate: 'ANY DATE',
  isEndDate: false,
  endDate: '',
  coverImage: '',
  views: 0,
  sections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: [
            {
              type: EContentEditorComponentType.TEXT,
              quillHTMLs: [
                {
                  cultureUI: EnumLanguageCultureUI.TH,
                  quillHTML: 'abc',
                },
              ],
            } as IContentEditorComponentText,
          ],
        },
      ],
    },
  ],
  isPublish: true,
  customCSS: '',
  name: '',
  draftSections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
        },
      ],
    },
  ],
};

let contentsNoColumnResponse: IContentEditor = {
  _id: '1',
  pageID: 1,
  language: [],
  categories: [],
  tags: [],
  authors: [],
  isPin: false,
  priority: 0,
  startDate: 'ANY DATE',
  isEndDate: false,
  endDate: '',
  coverImage: '',
  views: 0,
  sections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [],
    },
  ],
  isPublish: true,
  customCSS: '',
  name: '',
  draftSections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
        },
      ],
    },
  ],
};

let contentsNoComponentResponse: IContentEditor = {
  _id: '1',
  pageID: 1,
  language: [],
  categories: [],
  tags: [],
  authors: [],
  isPin: false,
  priority: 0,
  startDate: 'ANY DATE',
  isEndDate: false,
  endDate: '',
  coverImage: '',
  views: 0,
  sections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: [],
        },
      ],
    },
  ],
  isPublish: true,
  customCSS: '',
  name: '',
  draftSections: [
    {
      type: EContentSectionType.FR_1_1,
      gap: 10,
      columns: [
        {
          gap: 10,
          components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
        },
      ],
    },
  ],
};

describe('ContentsService addContents', () => {
  beforeEach(() => {
    contentsResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoColumnResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoComponentResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[]',
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [
                {
                  type: EContentEditorComponentType.TEXT,
                  quillHTMLs: [
                    {
                      cultureUI: EnumLanguageCultureUI.TH,
                      quillHTML: 'abc',
                    },
                  ],
                } as IContentEditorComponentText,
              ],
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoColumnResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoComponentResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [],
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };
  });
  test('addContents Success', async () => {
    const expectedValue = { status: 200, value: contentsResponse._id };
    mock(data, 'addContents', jest.fn().mockResolvedValueOnce(contentsResponse));
    const result = await ContentsService.addContents(258, contentsResquest);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.addContents).toBeCalledTimes(1);
  });

  test('addContents NoColumn Success', async () => {
    const expectedValue = { status: 200, value: contentsNoColumnResponse._id };
    mock(data, 'addContents', jest.fn().mockResolvedValueOnce(contentsNoColumnResponse));
    const result = await ContentsService.addContents(258, contentsNoColumnResquest);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.addContents).toBeCalledTimes(1);
  });

  test('addContents NoComponent Success', async () => {
    const expectedValue = { status: 200, value: contentsNoComponentResponse._id };
    mock(data, 'addContents', jest.fn().mockResolvedValueOnce(contentsNoComponentResponse));
    const result = await ContentsService.addContents(258, contentsNoComponentResquest);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.addContents).toBeCalledTimes(1);
  });

  test('addContents Failed', async () => {
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'addContents', jest.fn().mockRejectedValueOnce(null));
    const result = await ContentsService.addContents(258, contentsResquest);
    expect(result.value).toBeUndefined;
    expect(result.status).toEqual(expectedValue.status);
  });
});

describe('ContentsService updateContents', () => {
  beforeEach(() => {
    contentsResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoColumnResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoComponentResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[]',
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [
                {
                  type: EContentEditorComponentType.TEXT,
                  quillHTMLs: [
                    {
                      cultureUI: EnumLanguageCultureUI.TH,
                      quillHTML: 'abc',
                    },
                  ],
                } as IContentEditorComponentText,
              ],
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoColumnResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoComponentResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [],
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };
  });
  test('updateContents Success', async () => {
    const expectedValue = { status: 200, value: true };
    mock(data, 'updateContents', jest.fn().mockResolvedValueOnce(expectedValue));
    const result = await ContentsService.updateContents(1, '1', contentsResquest, false);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateContents).toBeCalledTimes(1);
  });

  test('updateContents NoColumn Success', async () => {
    const expectedValue = { status: 200, value: true };
    mock(data, 'updateContents', jest.fn().mockResolvedValueOnce(expectedValue));
    const result = await ContentsService.updateContents(1, '1', contentsNoColumnResquest, false);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateContents).toBeCalledTimes(1);
  });

  test('updateContents NoComponent Success', async () => {
    const expectedValue = { status: 200, value: true };
    mock(data, 'updateContents', jest.fn().mockResolvedValueOnce(expectedValue));
    const result = await ContentsService.updateContents(1, '1', contentsNoComponentResquest, false);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateContents).toBeCalledTimes(1);
  });

  test('updateContents Failed', async () => {
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'updateContents', jest.fn().mockRejectedValueOnce(null));
    const result = await ContentsService.updateContents(1, '1', contentsResquest, false);
    expect(result.value).toBeUndefined;
    expect(result.status).toEqual(expectedValue.status);
  });
});

describe('ContentsService getContentsByCategories', () => {
  const contentList: IContentEditor[] = [
    {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [
                {
                  type: EContentEditorComponentType.TEXT,
                  quillHTMLs: [
                    {
                      cultureUI: EnumLanguageCultureUI.TH,
                      quillHTML: 'abc',
                    },
                  ],
                } as IContentEditorComponentText,
              ],
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [
                {
                  type: EContentEditorComponentType.TEXT,
                  quillHTMLs: [
                    {
                      cultureUI: EnumLanguageCultureUI.TH,
                      quillHTML: 'abc',
                    },
                  ],
                } as IContentEditorComponentText,
              ],
            },
          ],
        },
      ],
    },
  ];
  const categories = [];
  const categoriesWithValue = ['332323'];

  test('getContentsByCategories getContentsByLimit Success', async () => {
    mock(data, 'getContentsByLimit', jest.fn().mockResolvedValueOnce(contentList));
    mock(data, 'getContentsByCategories', jest.fn().mockResolvedValueOnce(contentList));
    const result = await ContentsService.getContentsByCategories(258, categories, 10);
    expect(result).toEqual(contentList);
    expect(data.getContentsByLimit).toBeCalledTimes(1);
    expect(data.getContentsByCategories).toBeCalledTimes(0);
  });

  test('getContentsByCategories getContentsByCategories Success', async () => {
    mock(data, 'getContentsByLimit', jest.fn().mockResolvedValueOnce(contentList));
    mock(data, 'getContentsByCategories', jest.fn().mockResolvedValueOnce(contentList));
    const result = await ContentsService.getContentsByCategories(258, categoriesWithValue, 10);
    expect(result).toEqual(contentList);
    expect(data.getContentsByLimit).toBeCalledTimes(0);
    expect(data.getContentsByCategories).toBeCalledTimes(1);
  });

  test('getContentsByCategories Failed', async () => {
    try {
      mock(data, 'getContentsByCategories', jest.fn().mockRejectedValueOnce(new Error('Error')));
      await ContentsService.getContentsByCategories(258, categories, 0);
    } catch (error) {
      expect(error.message).toEqual('Error: Error');
    }
  });
});

describe('ContentsService getContentsList', () => {
  const contentList: IContentEditorWithLength = {
    total_rows: 0,
    contents: [
      {
        _id: '1',
        pageID: 1,
        language: [],
        categories: [],
        tags: [],
        authors: [],
        isPin: false,
        priority: 0,
        startDate: 'ANY DATE',
        isEndDate: false,
        endDate: '',
        coverImage: '',
        views: 0,
        sections: [
          {
            type: EContentSectionType.FR_1_1,
            gap: 10,
            columns: [
              {
                gap: 10,
                components: [
                  {
                    type: EContentEditorComponentType.TEXT,
                    quillHTMLs: [
                      {
                        cultureUI: EnumLanguageCultureUI.TH,
                        quillHTML: 'abc',
                      },
                    ],
                  } as IContentEditorComponentText,
                ],
              },
            ],
          },
        ],
        isPublish: true,
        customCSS: '',
        name: '',
        draftSections: [
          {
            type: EContentSectionType.FR_1_1,
            gap: 10,
            columns: [
              {
                gap: 10,
                components: [
                  {
                    type: EContentEditorComponentType.TEXT,
                    quillHTMLs: [
                      {
                        cultureUI: EnumLanguageCultureUI.TH,
                        quillHTML: 'abc',
                      },
                    ],
                  } as IContentEditorComponentText,
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  test('getContentsList Success', async () => {
    const tableFilter: ITableFilter = {
      search: null,
      currentPage: null,
      pageSize: null,
      orderBy: null,
      orderMethod: null,
    };
    mock(data, 'getContentsList', jest.fn().mockResolvedValueOnce(contentList));
    const result = await ContentsService.getContentsList(258, tableFilter);
    expect(result).toEqual(contentList);
    expect(data.getContentsList).toBeCalledTimes(1);
  });

  test('getContentsList Failed', async () => {
    const tableFilter: ITableFilter = {
      search: null,
      currentPage: null,
      pageSize: null,
      orderBy: null,
      orderMethod: null,
    };
    mock(data, 'getContentsList', jest.fn().mockRejectedValueOnce(null));
    const result = await ContentsService.getContentsList(258, tableFilter);
    expect(result).toBeNull;
    expect(data.getContentsList).toBeCalledTimes(1);
  });
});

describe('ContentsService getContents', () => {
  beforeEach(() => {
    contentsResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoColumnResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoComponentResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[]',
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [
                {
                  type: EContentEditorComponentType.TEXT,
                  quillHTMLs: [
                    {
                      cultureUI: EnumLanguageCultureUI.TH,
                      quillHTML: 'abc',
                    },
                  ],
                } as IContentEditorComponentText,
              ],
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoColumnResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoComponentResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [],
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };
  });
  test('getContents Success', async () => {
    mock(data, 'getContents', jest.fn().mockResolvedValueOnce(contentsResponse));
    const result = await ContentsService.getContents(258, '1');
    expect(result).toEqual(contentsResponse);
    expect(data.getContents).toBeCalledTimes(1);
  });

  test('getContents Failed', async () => {
    mock(data, 'getContents', jest.fn().mockRejectedValueOnce(null));
    const result = await ContentsService.getContents(258, '1');
    expect(result).toBeNull;
    expect(data.getContents).toBeCalledTimes(1);
  });
});

describe('ContentsService getContentsHTML', () => {
  beforeEach(() => {
    contentsResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoColumnResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoComponentResquest = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[]',
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [
                {
                  type: EContentEditorComponentType.TEXT,
                  quillHTMLs: [
                    {
                      cultureUI: EnumLanguageCultureUI.TH,
                      quillHTML: 'abc',
                    },
                  ],
                } as IContentEditorComponentText,
              ],
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoColumnResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };

    contentsNoComponentResponse = {
      _id: '1',
      pageID: 1,
      language: [],
      categories: [],
      tags: [],
      authors: [],
      isPin: false,
      priority: 0,
      startDate: 'ANY DATE',
      isEndDate: false,
      endDate: '',
      coverImage: '',
      views: 0,
      sections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: [],
            },
          ],
        },
      ],
      isPublish: true,
      customCSS: '',
      name: '',
      draftSections: [
        {
          type: EContentSectionType.FR_1_1,
          gap: 10,
          columns: [
            {
              gap: 10,
              components: '[{"quillHTMLs":[{"cultureUI":"TH","quillHTML":"abc"}]}]',
            },
          ],
        },
      ],
    };
  });
  test('getContentsHTML Success', async () => {
    const expectedValue =
      '<cms-next-cms-content-editor-rendering><cms-next-cms-content-section-rendering *cmsNextEmbeddedView><cms-next-cms-content-column-rendering *cmsNextEmbeddedView></cms-next-cms-content-column-rendering></cms-next-cms-content-section-rendering></cms-next-cms-content-editor-rendering>';
    mock(data, 'getContents', jest.fn().mockResolvedValueOnce(contentsResponse));
    const result = await ContentsService.getContentsHTML(258, '1');
    expect(result).toEqual(expectedValue);
    expect(data.getContents).toBeCalledTimes(1);
  });

  test('getContentsHTML Success', async () => {
    const expectedValue = `<cms-next-cms-content-editor-rendering></cms-next-cms-content-editor-rendering>`;
    mock(data, 'getContents', jest.fn().mockRejectedValueOnce(null));
    const result = await ContentsService.getContentsHTML(258, '1');
    expect(result).toEqual(expectedValue);
    expect(data.getContents).toBeCalledTimes(1);
  });
});
