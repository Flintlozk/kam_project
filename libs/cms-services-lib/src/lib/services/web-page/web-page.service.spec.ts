import { mock, mongoMockTransactionFn } from '@reactor-room/itopplus-back-end-helpers';
import { WebPageService } from './web-page.service';
import * as data from '../../data/web-page/web-page.data';
import * as configData from '../../data/config/get-config.data';
import * as component from '../../services/component/component.service';
import {
  EBackgroundPosition,
  ElinkType,
  EMegaMenuType,
  IMegaConfigTextImage,
  IMegaFooterConfigTextImage,
  IMegaFooterOptionTextImage,
  IMegaOptionTextImage,
  IUpdateWebPagesHide,
  IWebPage,
  IWebPageDetails,
  IWebPageFromToContainer,
  IWebPageOrderNumber,
  IWebPagePage,
} from '@reactor-room/cms-models-lib';
import * as serviceLib from '@reactor-room/itopplus-services-lib';
import * as mongoose from 'mongoose';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { CRUD_MODE } from '@reactor-room/model-lib';
import * as helper from '../../../../../../libs/itopplus-back-end-helpers/src/lib/mongoose-helpers/createid.helper';
jest.mock('../../data/web-page/web-page.data');
jest.mock('../../data/config/get-config.data');
jest.mock('@reactor-room/itopplus-services-lib');
jest.mock('../../../../../../libs/itopplus-back-end-helpers/src/lib/mongoose-helpers/createid.helper');
mock(mongoose, 'connect', jest.fn().mockResolvedValue({}));
void (async function () {
  PlusmarService.mongoConnector = await mongoose.connect('');
  console.log('serviceLib.PlusmarService: ', serviceLib.PlusmarService.mongoConnector);
  mock(serviceLib.PlusmarService.mongoConnector, 'startSession', jest.fn().mockResolvedValue(mongoMockTransactionFn));
})();

describe('WebPageService removeWebPageFromContainer', () => {
  const webPageService = new WebPageService();
  test('removeWebPageFromContainer Success', async () => {
    const previousWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
    ];
    const oldWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];
    const removePageFromLevel: IWebPage = {
      _id: '1',
      pageID: 222,
      level: 3,
      pages: [],
    };
    const expectedValue = { status: 200, value: true };

    mock(data, 'removePageFromLevel', jest.fn().mockReturnValue(removePageFromLevel));
    mock(data, 'updateWebPageOrderNumbers', jest.fn().mockResolvedValue({}));
    const result = await webPageService.removeWebPageFromContainer(258, previousWebPagePositions, oldWebPageOrderNumbers);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.removePageFromLevel).toBeCalledTimes(previousWebPagePositions.length);
    expect(data.updateWebPageOrderNumbers).toBeCalledTimes(oldWebPageOrderNumbers.length);
  });

  test('removeWebPageFromContainer removePageFromLevel Failed', async () => {
    const previousWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
    ];
    const oldWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];
    const expectedValue = { status: 403, value: 'Error' };

    mock(data, 'removePageFromLevel', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.removeWebPageFromContainer(258, previousWebPagePositions, oldWebPageOrderNumbers);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.removePageFromLevel).toBeCalledTimes(1);
  });

  test('removeWebPageFromContainer updateWebPageOrderNumbers Failed', async () => {
    const previousWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
    ];
    const oldWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];
    const removePageFromLevel: IWebPage = {
      _id: '1',
      pageID: 222,
      level: 3,
      pages: [],
    };
    const expectedValue = { status: 403, value: 'Cannot Update Sites Order Number' };

    mock(data, 'removePageFromLevel', jest.fn().mockReturnValue(removePageFromLevel));
    mock(data, 'updateWebPageOrderNumbers', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.removeWebPageFromContainer(258, previousWebPagePositions, oldWebPageOrderNumbers);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.removePageFromLevel).toBeCalledTimes(previousWebPagePositions.length);
    expect(data.updateWebPageOrderNumbers).toBeCalledTimes(1);
  });
});

describe('WebPageService updateWebPageFromToContainer', () => {
  const webPageService = new WebPageService();
  test('updateWebPageFromToContainer Success', async () => {
    const previousWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
    ];
    const nextWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
    ];
    const oldWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];
    const newWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
    ];
    const getPageByLevel: IWebPagePage = {
      _id: '1',
      parentID: '123',
      orderNumber: 3,
      masterPageID: '123',
      name: '123',
      isHide: false,
      isHomepage: false,
      setting: null,
      permission: null,
      configs: null,
      themeLayoutMode: null,
    };
    const removePageFromLevel: IWebPage = {
      _id: '1',
      pageID: 222,
      level: 3,
      pages: [],
    };
    const addPageFromLevel: IWebPage = {
      _id: '1',
      pageID: 222,
      level: 3,
      pages: [],
    };
    const expectedValue = { status: 200, value: true };

    mock(data, 'getPageByLevel', jest.fn().mockReturnValue(getPageByLevel));
    mock(data, 'removePageFromLevel', jest.fn().mockReturnValue(removePageFromLevel));
    mock(data, 'addPageToLevel', jest.fn().mockReturnValue(addPageFromLevel));
    mock(data, 'updateWebPageOrderNumbers', jest.fn().mockResolvedValue({}));
    const result = await webPageService.updateWebPageFromToContainer(258, previousWebPagePositions, nextWebPagePositions, oldWebPageOrderNumbers, newWebPageOrderNumbers);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.getPageByLevel).toBeCalledTimes(3);
    expect(data.removePageFromLevel).toBeCalledTimes(3);
    expect(data.addPageToLevel).toBeCalledTimes(3);
    expect(data.updateWebPageOrderNumbers).toBeCalledTimes(oldWebPageOrderNumbers.length + newWebPageOrderNumbers.length);
  });

  test('updateWebPageFromToContainer getPageByLevel Failed', async () => {
    const previousWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
    ];
    const nextWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
    ];
    const oldWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];
    const newWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
    ];
    const expectedValue = { status: 403, value: 'Error' };

    mock(data, 'getPageByLevel', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPageFromToContainer(258, previousWebPagePositions, nextWebPagePositions, oldWebPageOrderNumbers, newWebPageOrderNumbers);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.getPageByLevel).toBeCalledTimes(1);
  });

  test('updateWebPageFromToContainer removePageFromLevel Failed', async () => {
    const previousWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
    ];
    const nextWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
    ];
    const oldWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];
    const newWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
    ];
    const getPageByLevel: IWebPagePage = {
      _id: '1',
      parentID: '123',
      orderNumber: 3,
      masterPageID: '123',
      name: '123',
      isHide: false,
      isHomepage: false,
      setting: null,
      permission: null,
      configs: null,
      themeLayoutMode: null,
    };
    const expectedValue = { status: 403, value: 'Error' };

    mock(data, 'getPageByLevel', jest.fn().mockReturnValue(getPageByLevel));
    mock(data, 'removePageFromLevel', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPageFromToContainer(258, previousWebPagePositions, nextWebPagePositions, oldWebPageOrderNumbers, newWebPageOrderNumbers);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.getPageByLevel).toBeCalledTimes(1);
    expect(data.removePageFromLevel).toBeCalledTimes(1);
  });

  test('updateWebPageFromToContainer addPageToLevel Failed', async () => {
    const previousWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
    ];
    const nextWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
    ];
    const oldWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];
    const newWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
    ];
    const getPageByLevel: IWebPagePage = {
      _id: '1',
      parentID: '123',
      orderNumber: 3,
      masterPageID: '123',
      name: '123',
      isHide: false,
      isHomepage: false,
      setting: null,
      permission: null,
      configs: null,
      themeLayoutMode: null,
    };
    const removePageFromLevel: IWebPage = {
      _id: '1',
      pageID: 222,
      level: 3,
      pages: [],
    };
    const expectedValue = { status: 403, value: 'Error' };

    mock(data, 'getPageByLevel', jest.fn().mockReturnValue(getPageByLevel));
    mock(data, 'removePageFromLevel', jest.fn().mockReturnValue(removePageFromLevel));
    mock(data, 'addPageToLevel', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPageFromToContainer(258, previousWebPagePositions, nextWebPagePositions, oldWebPageOrderNumbers, newWebPageOrderNumbers);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.getPageByLevel).toBeCalledTimes(1);
    expect(data.removePageFromLevel).toBeCalledTimes(1);
    expect(data.addPageToLevel).toBeCalledTimes(1);
  });

  test('updateWebPageFromToContainer updateWebPageOrderNumbers Failed', async () => {
    const previousWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
      {
        _id: '1',
        parentID: null,
        level: 1,
      },
    ];
    const nextWebPagePositions: IWebPageFromToContainer[] = [
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
      {
        _id: '1',
        parentID: '33',
        level: 2,
      },
    ];
    const oldWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];
    const newWebPageOrderNumbers: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
    ];
    const getPageByLevel: IWebPagePage = {
      _id: '1',
      parentID: '123',
      orderNumber: 3,
      masterPageID: '123',
      name: '123',
      isHide: false,
      isHomepage: false,
      setting: null,
      permission: null,
      configs: null,
      themeLayoutMode: null,
    };
    const removePageFromLevel: IWebPage = {
      _id: '1',
      pageID: 222,
      level: 3,
      pages: [],
    };
    const addPageFromLevel: IWebPage = {
      _id: '1',
      pageID: 222,
      level: 3,
      pages: [],
    };
    const expectedValue = { status: 403, value: 'Cannot Update Old Sites Order Number' };

    mock(data, 'getPageByLevel', jest.fn().mockReturnValue(getPageByLevel));
    mock(data, 'removePageFromLevel', jest.fn().mockReturnValue(removePageFromLevel));
    mock(data, 'addPageToLevel', jest.fn().mockReturnValue(addPageFromLevel));
    mock(data, 'updateWebPageOrderNumbers', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPageFromToContainer(258, previousWebPagePositions, nextWebPagePositions, oldWebPageOrderNumbers, newWebPageOrderNumbers);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.getPageByLevel).toBeCalledTimes(3);
    expect(data.removePageFromLevel).toBeCalledTimes(3);
    expect(data.addPageToLevel).toBeCalledTimes(3);
    expect(data.updateWebPageOrderNumbers).toBeCalledTimes(1);
  });
});

describe('WebPageService updateWebPageDetails', () => {
  const webPageService = new WebPageService();

  test('updateWebPageDetails Success', async () => {
    const pageDetails: IWebPageDetails = {
      setting: {
        isOpenNewTab: false,
        isMaintenancePage: false,
        isIcon: false,
        pageIcon: '',
        isMega: false,
        mega: {
          primaryType: EMegaMenuType.IMAGE_TEXT,
          footerType: EMegaMenuType.IMAGE_TEXT,
          primaryOption: {
            linkType: ElinkType.URL,
            linkParent: '',
            linkUrl: '',
            image: '',
            imagePosition: EBackgroundPosition.CENTER_CENTER,
            isTopTitle: false,
            textImage: '',
            isHTML: true,
          } as IMegaOptionTextImage,
          footerOption: {
            isFooterHTML: true,
            textImage: '',
          } as IMegaFooterOptionTextImage,
        },
        socialShare: '',
      },
      permission: {
        type: '',
        option: { password: '', onlyPaidMember: false },
      },
      configs: [
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
        },
      ],
    };
    const expectedValue = { status: 200, value: true };

    mock(data, 'updateWebPageDetailsSetting', jest.fn().mockResolvedValue({}));
    mock(data, 'updateWebPageDetailsPermission', jest.fn().mockResolvedValue({}));
    mock(data, 'updateWebPageDetailsConfig', jest.fn().mockReturnValue({}));
    mock(data, 'addWebPageDetailsConfig', jest.fn().mockReturnValue({}));
    const result = await webPageService.updateWebPageDetails(258, '123', pageDetails);
    console.log('result :>> ', result);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageDetailsSetting).toBeCalledTimes(1);
    expect(data.updateWebPageDetailsPermission).toBeCalledTimes(1);
    expect(data.updateWebPageDetailsConfig).toBeCalledTimes(3);
    expect(data.addWebPageDetailsConfig).toBeCalledTimes(2);
  });

  test('updateWebPageDetails Setting Failed', async () => {
    const pageDetails: IWebPageDetails = {
      setting: {
        isOpenNewTab: false,
        isMaintenancePage: false,
        isIcon: false,
        pageIcon: '',
        isMega: false,
        mega: {
          primaryType: EMegaMenuType.IMAGE_TEXT,
          footerType: EMegaMenuType.IMAGE_TEXT,
          primaryOption: {
            linkType: ElinkType.URL,
            linkParent: '',
            linkUrl: '',
            image: '',
            imagePosition: EBackgroundPosition.CENTER_CENTER,
            isTopTitle: false,
            textImage: '',
            isHTML: true,
          } as IMegaOptionTextImage,
          footerOption: {
            isFooterHTML: true,
            textImage: '',
          } as IMegaFooterOptionTextImage,
        },
        socialShare: '',
      },
      permission: {
        type: '',
        option: { password: '', onlyPaidMember: false },
      },
      configs: [
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
        },
      ],
    };
    const expectedValue = { status: 403, value: 'Error' };

    mock(data, 'updateWebPageDetailsSetting', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPageDetails(258, '123', pageDetails);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageDetailsSetting).toBeCalledTimes(1);
  });

  test('updateWebPageDetails Permission Failed', async () => {
    const pageDetails: IWebPageDetails = {
      setting: {
        isOpenNewTab: false,
        isMaintenancePage: false,
        isIcon: false,
        pageIcon: '',
        isMega: false,
        mega: {
          primaryType: EMegaMenuType.IMAGE_TEXT,
          footerType: EMegaMenuType.IMAGE_TEXT,
          primaryOption: {
            linkType: ElinkType.URL,
            linkParent: '',
            linkUrl: '',
            image: '',
            imagePosition: EBackgroundPosition.CENTER_CENTER,
            isTopTitle: false,
            textImage: '',
            isHTML: true,
          } as IMegaOptionTextImage,
          footerOption: {
            isFooterHTML: true,
            textImage: '',
          } as IMegaFooterOptionTextImage,
        },
        socialShare: '',
      },
      permission: {
        type: '',
        option: { password: '', onlyPaidMember: false },
      },
      configs: [
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
        },
      ],
    };
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'updateWebPageDetailsSetting', jest.fn().mockResolvedValue({}));
    mock(data, 'updateWebPageDetailsPermission', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPageDetails(258, '123', pageDetails);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageDetailsPermission).toBeCalledTimes(1);
  });

  test('updateWebPageDetails updateWebPageDetailsConfig Failed', async () => {
    const pageDetails: IWebPageDetails = {
      setting: {
        isOpenNewTab: false,
        isMaintenancePage: false,
        isIcon: false,
        pageIcon: '',
        isMega: false,
        mega: {
          primaryType: EMegaMenuType.IMAGE_TEXT,
          footerType: EMegaMenuType.IMAGE_TEXT,
          primaryOption: {
            linkType: ElinkType.URL,
            linkParent: '',
            linkUrl: '',
            image: '',
            imagePosition: EBackgroundPosition.CENTER_CENTER,
            isTopTitle: false,
            textImage: '',
            isHTML: true,
          } as IMegaOptionTextImage,
          footerOption: {
            isFooterHTML: true,
            textImage: '',
          } as IMegaFooterOptionTextImage,
        },
        socialShare: '',
      },
      permission: {
        type: '',
        option: { password: '', onlyPaidMember: false },
      },
      configs: [
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
        },
      ],
    };
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'updateWebPageDetailsSetting', jest.fn().mockResolvedValue({}));
    mock(data, 'updateWebPageDetailsPermission', jest.fn().mockResolvedValue({}));
    mock(data, 'updateWebPageDetailsConfig', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPageDetails(258, '123', pageDetails);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageDetailsConfig).toBeCalledTimes(1);
  });

  test('updateWebPageDetails addWebPageDetailsConfig Failed', async () => {
    const pageDetails: IWebPageDetails = {
      setting: {
        isOpenNewTab: false,
        isMaintenancePage: false,
        isIcon: false,
        pageIcon: '',
        isMega: false,
        mega: {
          primaryType: EMegaMenuType.IMAGE_TEXT,
          footerType: EMegaMenuType.IMAGE_TEXT,
          primaryOption: {
            linkType: ElinkType.URL,
            linkParent: '',
            linkUrl: '',
            image: '',
            imagePosition: EBackgroundPosition.CENTER_CENTER,
            isTopTitle: false,
            textImage: '',
            isHTML: true,
          } as IMegaOptionTextImage,
          footerOption: {
            isFooterHTML: true,
            textImage: '',
          } as IMegaFooterOptionTextImage,
        },
        socialShare: '',
      },
      permission: {
        type: '',
        option: { password: '', onlyPaidMember: false },
      },
      configs: [
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.EDIT,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
          mode: CRUD_MODE.ADD,
        },
        {
          cultureUI: null,
          displayName: '',
          seo: {
            title: '',
            shortUrl: '',
            description: '',
            keyword: '',
          },
          primaryMega: {
            topTitle: '',
            description: '',
            html: '',
            textImage: '',
          } as IMegaConfigTextImage,
          footerMega: {
            html: '',
            textImage: '',
          } as IMegaFooterConfigTextImage,
        },
      ],
    };
    const expectedValue = { status: 403, value: 'Error' };

    mock(data, 'updateWebPageDetailsSetting', jest.fn().mockResolvedValue({}));
    mock(data, 'updateWebPageDetailsPermission', jest.fn().mockResolvedValue({}));
    mock(data, 'updateWebPageDetailsConfig', jest.fn().mockReturnValue({}));
    mock(data, 'addWebPageDetailsConfig', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPageDetails(258, '123', pageDetails);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageDetailsSetting).toBeCalledTimes(1);
    expect(data.updateWebPageDetailsPermission).toBeCalledTimes(1);
    expect(data.updateWebPageDetailsConfig).toBeCalledTimes(3);
    expect(data.addWebPageDetailsConfig).toBeCalledTimes(1);
  });
});

describe('WebPageService updateWebPageName', () => {
  const webPageService = new WebPageService();

  test('updateWebPageName Success', async () => {
    const expectedValue = { status: 200, value: true };
    mock(data, 'updateWebPageName', jest.fn().mockResolvedValue({}));
    const result = await webPageService.updateWebPageName(258, 'Sample 5', 1, '123');
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageName).toBeCalledTimes(1);
  });

  test('updateWebPageName Failed', async () => {
    const expectedValue = { status: 403, value: 'Error' };
    mock(
      data,
      'updateWebPageName',
      jest.fn().mockImplementation(
        () =>
          new Promise((resolve, reject) => {
            reject(new Error('Error'));
          }),
      ),
    );
    const result = await webPageService.updateWebPageName(258, 'Sample 5', 1, '123');
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageName).toBeCalledTimes(1);
  });
});

describe('WebPageService updateWebPagesHide', () => {
  const webPageService = new WebPageService();

  test('updateWebPagesHide Success', async () => {
    const updateWebPagesHide: IUpdateWebPagesHide[] = [
      { _id: '1', level: 1 },
      { _id: '2', level: 1 },
      { _id: '3', level: 1 },
    ];
    const expectedValue = { status: 200, value: true };

    mock(data, 'updateSiteHide', jest.fn().mockResolvedValue({}));
    const result = await webPageService.updateWebPagesHide(258, updateWebPagesHide, true);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateSiteHide).toBeCalledTimes(updateWebPagesHide.length);
  });

  test('updateWebPagesHide Failed', async () => {
    const updateWebPagesHide: IUpdateWebPagesHide[] = [
      { _id: '1', level: 1 },
      { _id: '2', level: 1 },
      { _id: '3', level: 1 },
    ];
    const expectedValue = { status: 403, value: 'Error' };

    mock(data, 'updateSiteHide', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPagesHide(258, updateWebPagesHide, true);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateSiteHide).toBeCalledTimes(1);
  });
});

describe('WebPageService updateWebPagesHide', () => {
  const webPageService = new WebPageService();
  test('updateWebPageHomepage withPrevious Success', async () => {
    const expectedValue = { status: 200, value: true };

    mock(data, 'updateWebPageHomepage', jest.fn().mockResolvedValue({}));
    const result = await webPageService.updateWebPageHomepage(258, 1, '1', 2, '2');
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageHomepage).toBeCalledTimes(2);
  });

  test('updateWebPageHomepage withoutPrevious Success', async () => {
    const expectedValue = { status: 200, value: true };

    mock(data, 'updateWebPageHomepage', jest.fn().mockResolvedValue({}));
    const result = await webPageService.updateWebPageHomepage(258, null, null, 2, '2');
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageHomepage).toBeCalledTimes(1);
  });

  test('updateWebPageHomepage Failed', async () => {
    const expectedValue = { status: 403, value: 'Error' };

    mock(data, 'updateWebPageHomepage', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await webPageService.updateWebPageHomepage(258, null, null, 2, '2');
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageHomepage).toBeCalledTimes(1);
  });
});

describe('WebPageService updateWebPageOrderNumbers', () => {
  const webPageService = new WebPageService();
  test('updateWebPageOrderNumbers Success', async () => {
    const inputValue: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];

    const expectedValue = { status: 200, value: true };

    mock(data, 'updateWebPageOrderNumbers', jest.fn().mockResolvedValue({}));
    const result = await webPageService.updateWebPageOrderNumbers(258, inputValue);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.updateWebPageOrderNumbers).toBeCalledTimes(inputValue.length);
  });

  test('updateWebPageOrderNumbers Failed', async () => {
    const inputValue: IWebPageOrderNumber[] = [
      {
        level: 2,
        _id: '1',
        orderNumber: 0,
      },
      {
        level: 2,
        _id: '2',
        orderNumber: 1,
      },
      {
        level: 2,
        _id: '3',
        orderNumber: 2,
      },
    ];
    const expectedValue = { status: 403, value: 'Error' };

    mock(
      data,
      'updateWebPageOrderNumbers',
      jest.fn().mockImplementation(
        () =>
          new Promise((resolve, reject) => {
            reject(new Error('Error'));
          }),
      ),
    );
    const result = await webPageService.updateWebPageOrderNumbers(258, inputValue);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
  });
});

describe('WebPageService createWebPage', () => {
  const webPageService = new WebPageService();
  mock(configData, 'getConfigGeneralLanguage', jest.fn().mockReturnValue(258));
  test('createWebPage Success', async () => {
    const expectedValue: IWebPagePage = {
      _id: '123',
      parentID: '456',
      orderNumber: null,
      masterPageID: null,
      name: null,
      isHide: false,
      isHomepage: false,
      setting: null,
      permission: null,
      configs: null,
      themeLayoutMode: null,
    };
    const getPagesByLevel: IWebPagePage[] = [
      {
        _id: '123',
        parentID: '456',
        orderNumber: null,
        masterPageID: null,
        name: null,
        isHide: false,
        isHomepage: false,
        setting: null,
        permission: null,
        configs: null,
        themeLayoutMode: null,
      },
      {
        _id: '123',
        parentID: '456',
        orderNumber: null,
        masterPageID: null,
        name: null,
        isHide: false,
        isHomepage: false,
        setting: null,
        permission: null,
        configs: null,
        themeLayoutMode: null,
      },
    ];
    const addPageToLevel: IWebPage = {
      _id: '123',
      pageID: 222,
      level: 3,
      pages: [],
    };
    mock(data, 'addPageToLevel', jest.fn().mockResolvedValue(addPageToLevel));
    mock(helper, 'createMongooseId', jest.fn().mockReturnValue('123'));
    mock(component, 'createPageComponent', jest.fn().mockResolvedValue(true));
    mock(data, 'getPagesByLevel', jest.fn().mockResolvedValue(getPagesByLevel));
    const result = await webPageService.createWebPage(258, 1, expectedValue);
    expect(result._id).toEqual(expectedValue._id);
    expect(data.addPageToLevel).toBeCalledTimes(1);
    expect(data.getPagesByLevel).toBeCalledTimes(1);
  });

  test('createWebPage addPageToLevel Failed', async () => {
    const expectedValue: IWebPagePage = {
      _id: '123',
      parentID: '456',
      orderNumber: null,
      masterPageID: null,
      name: null,
      isHide: false,
      isHomepage: false,
      setting: null,
      permission: null,
      configs: null,
      themeLayoutMode: null,
    };

    mock(data, 'addPageToLevel', jest.fn().mockRejectedValue(null));
    mock(helper, 'createMongooseId', jest.fn().mockReturnValue('123'));
    mock(component, 'createPageComponent', jest.fn().mockResolvedValue(true));
    const result = await webPageService.createWebPage(258, 1, expectedValue);
    expect(result).toBeNull();
    expect(data.addPageToLevel).toBeCalledTimes(1);
  });

  test('createWebPage getPagesByLevel Failed', async () => {
    const expectedValue: IWebPagePage = {
      _id: '123',
      parentID: '456',
      orderNumber: null,
      masterPageID: null,
      name: null,
      isHide: false,
      isHomepage: false,
      setting: null,
      permission: null,
      configs: null,
      themeLayoutMode: null,
    };
    const addPageToLevel: IWebPage = {
      _id: '123',
      pageID: 222,
      level: 3,
      pages: [],
    };

    mock(data, 'addPageToLevel', jest.fn().mockResolvedValue(addPageToLevel));
    mock(helper, 'createMongooseId', jest.fn().mockReturnValue('123'));
    mock(component, 'createPageComponent', jest.fn().mockResolvedValue(true));
    mock(data, 'getPagesByLevel', jest.fn().mockRejectedValue(null));
    const result = await webPageService.createWebPage(258, 1, expectedValue);
    expect(result).toBeNull();
    expect(data.addPageToLevel).toBeCalledTimes(1);
    expect(data.getPagesByLevel).toBeCalledTimes(1);
  });
});

describe('WebPageService getWebPageByWebPageID', () => {
  const webPageService = new WebPageService();

  test('getWebPagesByPageID Success', async () => {
    const expectedValue: IWebPage[] = [
      {
        _id: '123',
        pageID: 222,
        level: 3,
        pages: [],
      },
      {
        _id: '456',
        pageID: 222,
        level: 3,
        pages: [],
      },
    ];
    const resp = expectedValue;
    mock(data, 'getWebPagesByPageID', jest.fn().mockResolvedValue(resp));
    const result = await webPageService.getWebPagesByPageID(258);
    expect(result).toEqual(expectedValue);
    expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ _id: '123' }), expect.objectContaining({ _id: '456' })]));
    expect(data.getWebPagesByPageID).toBeCalledTimes(1);
  });

  test('getWebPagesByPageID Failed', async () => {
    mock(data, 'getWebPagesByPageID', jest.fn().mockRejectedValue(null));
    const result = await webPageService.getWebPagesByPageID(258);
    expect(result).toBeNull();
    expect(data.getWebPagesByPageID).toBeCalledTimes(1);
  });

  test('getWebPageByWebPageID Success', async () => {
    const expectedValue: IWebPagePage = {
      _id: '123',
      parentID: '123',
      orderNumber: 3,
      masterPageID: '123',
      name: '123',
      isHide: false,
      isHomepage: false,
      setting: null,
      permission: null,
      configs: null,
      themeLayoutMode: null,
    };
    const resp = expectedValue;
    mock(data, 'getWebPageByWebPageID', jest.fn().mockResolvedValue(resp));
    const result = await webPageService.getWebPageByWebPageID(258, '123');
    expect(result).toEqual(expectedValue);
    expect(result).toEqual(expect.objectContaining({ _id: '123' }));
    expect(data.getWebPageByWebPageID).toBeCalledTimes(1);
  });

  test('getWebPageByWebPageID Failed', async () => {
    mock(data, 'getWebPageByWebPageID', jest.fn().mockRejectedValue(null));
    const result = await webPageService.getWebPageByWebPageID(258, '123');
    expect(result).toBeNull();
    expect(data.getWebPageByWebPageID).toBeCalledTimes(1);
  });
});
