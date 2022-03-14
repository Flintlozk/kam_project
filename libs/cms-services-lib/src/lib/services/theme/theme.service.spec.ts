/* eslint-disable max-len */
import { IThemeRendering, IThemeAssets, IWebsiteConfig, EmumThemeResourceType } from '@reactor-room/cms-models-lib';
import { mock, mongoMockTransactionFn } from '@reactor-room/itopplus-back-end-helpers';
import * as data from '../../data/theme/theme.data';
import * as getconfigData from '../../data/config/get-config.data';
import * as file from '@reactor-room/itopplus-services-lib';
import { FileService } from '@reactor-room/itopplus-services-lib';
import { ThemeService } from './theme.service';
import { Readable } from 'stream';
import * as domain from '../../domains/angularhtml/angularhtml.domain';
import * as domainValidate from '../../domains/validate/validatehtml.domain';
import * as serviceLib from '@reactor-room/itopplus-services-lib';
import * as mongoose from 'mongoose';
import * as linkedList from '../../domains/linked-list/linked-list.domain';
import { environmentLib } from '@reactor-room/environment-services-backend';
jest.mock('@reactor-room/itopplus-services-lib');
mock(mongoose, 'connect', jest.fn().mockResolvedValue({}));
void (async function () {
  serviceLib.PlusmarService.mongoConnector = await mongoose.connect('');
  mock(serviceLib.PlusmarService.mongoConnector, 'startSession', jest.fn().mockResolvedValue(mongoMockTransactionFn));
  mock(await serviceLib.PlusmarService.mongoConnector.startSession(), 'abortTransaction', jest.fn());
  mock(await serviceLib.PlusmarService.mongoConnector.startSession(), 'commitTransaction', jest.fn());
})();

const subscriptionID = 'subscriptionID';
describe('ThemeService getTotalThemeNumber', () => {
  test('getTotalThemeNumber Success', async () => {
    const expectedValue = 6;
    mock(data, 'getTotalThemeNumber', jest.fn().mockResolvedValue(expectedValue));
    const result = await ThemeService.getTotalThemeNumber();
    expect(result).toEqual(expectedValue);
    expect(data.getTotalThemeNumber).toBeCalledTimes(1);
  });

  test('getTotalThemeNumber Failed', async () => {
    mock(data, 'getTotalThemeNumber', jest.fn().mockRejectedValue(null));
    const result = await ThemeService.getTotalThemeNumber();
    expect(result).toBeNull();
    expect(data.getTotalThemeNumber).toBeCalledTimes(1);
  });
});

describe('ThemeService getThemeByPageId', () => {
  test('getThemeByPageId Success', async () => {
    const expectedValue: IThemeRendering = {
      _id: '1',
      name: '',
      catagoriesID: [],
      image: [],
      html: [],
      javascript: [],
      isActive: false,
      devices: [],
      style: [{ type: EmumThemeResourceType.CSS, url: `${environmentLib.filesServer}asdfasdfasdfasdf/test.css` }],
      themeComponents: [{ themeComponent: [] }],
      themeLayoutLength: 1,
    };
    const getThemeValue: IThemeRendering = {
      _id: '1',
      name: '',
      catagoriesID: [],
      image: [],
      html: [],
      javascript: [],
      isActive: false,
      devices: [],
      style: [{ type: EmumThemeResourceType.CSS, url: 'asdfasdfasdfasdf/test.css' }],
      themeComponents: [{ themeComponent: [] }],
    };
    const getWebsiteConfig: IWebsiteConfig = {
      theme_id: '1;',
    };
    mock(getconfigData, 'getWebsiteConfig', jest.fn().mockReturnValue(getWebsiteConfig));
    mock(data, 'getThemeByThemeId', jest.fn().mockResolvedValue(getThemeValue));
    const result = await ThemeService.getThemeByPageId(258);
    expect(result).toEqual(expectedValue);
    expect(getconfigData.getWebsiteConfig).toBeCalledTimes(1);
    expect(data.getThemeByThemeId).toBeCalledTimes(1);
  });

  test('getThemeByPageId getWebsiteConfig Failed', async () => {
    const expectedValue: IThemeRendering = {
      _id: '1',
      name: '',
      catagoriesID: [],
      image: [],
      html: [],
      javascript: [],
      isActive: false,
      devices: [],
      style: [],
    };
    mock(getconfigData, 'getWebsiteConfig', jest.fn().mockRejectedValue(null));
    mock(data, 'getThemeByThemeId', jest.fn().mockResolvedValue(expectedValue));
    const result = await ThemeService.getThemeByPageId(258);
    expect(result).toBeNull();
    expect(getconfigData.getWebsiteConfig).toBeCalledTimes(1);
    expect(data.getThemeByThemeId).toBeCalledTimes(0);
  });

  test('getThemeByPageId getTheme Failed', async () => {
    const getWebsiteConfig: IWebsiteConfig = {
      theme_id: '1;',
    };
    mock(getconfigData, 'getWebsiteConfig', jest.fn().mockReturnValue(getWebsiteConfig));
    mock(data, 'getThemeByThemeId', jest.fn().mockRejectedValue(null));
    const result = await ThemeService.getThemeByPageId(258);
    expect(result).toBeNull();
    expect(getconfigData.getWebsiteConfig).toBeCalledTimes(1);
    expect(data.getThemeByThemeId).toBeCalledTimes(1);
  });
});

describe('ThemeService getThemesByLimit', () => {
  test('getThemesByLimit Success', async () => {
    const expectedValue: IThemeRendering[] = [
      {
        _id: '1',
        name: '',
        catagoriesID: [],
        image: [],
        html: [],
        javascript: [],
        isActive: false,
        devices: [],

        style: [],
      },
      {
        _id: '2',
        name: '',
        catagoriesID: [],
        image: [],
        html: [],
        javascript: [],
        isActive: false,
        devices: [],

        style: [],
      },
      {
        _id: '3',
        name: '',
        catagoriesID: [],
        image: [],
        html: [],
        javascript: [],
        isActive: false,
        devices: [],

        style: [],
      },
      {
        _id: '4',
        name: '',
        catagoriesID: [],
        image: [],
        html: [],
        javascript: [],
        isActive: false,
        devices: [],

        style: [],
      },
      {
        _id: '5',
        name: '',
        catagoriesID: [],
        image: [],
        html: [],
        javascript: [],
        isActive: false,
        devices: [],

        style: [],
      },
      {
        _id: '6',
        name: '',
        catagoriesID: [],
        image: [],
        html: [],
        javascript: [],
        isActive: false,
        devices: [],

        style: [],
      },
    ];
    mock(data, 'getThemesByLimit', jest.fn().mockResolvedValue(expectedValue));
    const result = await ThemeService.getThemesByLimit(0, 6);
    expect(result).toEqual(expectedValue);
    expect(result.length).toEqual(expectedValue.length);
    expect(data.getThemesByLimit).toBeCalledTimes(1);
  });

  test('getThemesByLimit Failed', async () => {
    mock(data, 'getThemesByLimit', jest.fn().mockRejectedValue(null));
    const result = await ThemeService.getThemesByLimit(0, 6);
    expect(result).toBeNull();
    expect(data.getThemesByLimit).toBeCalledTimes(1);
  });
});

// describe('ThemeService updateSharingTheme', () => {});
describe('ThemeService updateFileToCmsFileServer', () => {
  const theme = {
    type: 'CSS',
    name: 'test',
    style: {
      file: {
        createReadStream: () => {
          console.log('test');
        },
      },
    },
    _id: '124564789426',
  } as IThemeAssets;
  const theme1 = {
    type: 'JS',
    name: 'test',
    javascript: {
      file: {
        createReadStream: () => {
          console.log('test');
        },
      },
    },
    _id: '124564789426',
  } as IThemeAssets;
  const theme2 = {
    type: 'HTML',
    name: 'test',
    plaintext: `<section id="THEME_HEADER">
    <div style="color:red;" data-cmp="THEME_TEXT" data-id='3'>A red paragraph.</div>
    <div style="color:red;" data-cmp="THEME_TEXT" data-id='1' >hello1</div>
  </section>
  <section id="CONTENT">
    <div style="background-color:white" data-cmp="THEME_TEXT" data-id='2' >hello2</div>
  </section>
  <section id="THEME_FOOTER"></section>`,
    _id: '124564789426',
  } as IThemeAssets;
  test('updateFileToCmsFileSever success', async () => {
    mock(Readable, 'from', jest.fn());
    mock(FileService, 'uploadFileToCMSFileServer', jest.fn().mockResolvedValue('https://localhost:3000/asdfasdfasdfasdf/test.css'));
    mock(data, 'updateCssPlainTextByThemeId', jest.fn());
    mock(data, 'updateJavascriptPlainTextByThemeId', jest.fn());
    mock(data, 'updateHTMLPlainTextByThemeId', jest.fn());
    const result = await ThemeService.updateFileToCmsFileServer(theme);
    expect(FileService.uploadFileToCMSFileServer).toBeCalled();
    expect(data.updateCssPlainTextByThemeId).toBeCalled();
    expect(data.updateJavascriptPlainTextByThemeId).not.toBeCalled();
    expect(data.updateHTMLPlainTextByThemeId).not.toBeCalled();
    expect(result).toStrictEqual({ status: 200, value: 'complete' });
  });
  test('updateFileToCmsFileSever success', async () => {
    mock(Readable, 'from', jest.fn());
    mock(FileService, 'uploadFileToCMSFileServer', jest.fn().mockResolvedValue('https://localhost:3000/asdfasdfasdfasdf/test.css'));
    mock(data, 'updateCssPlainTextByThemeId', jest.fn());
    mock(data, 'updateJavascriptPlainTextByThemeId', jest.fn());
    mock(data, 'updateHTMLPlainTextByThemeId', jest.fn());
    const result = await ThemeService.updateFileToCmsFileServer(theme1);
    expect(FileService.uploadFileToCMSFileServer).toBeCalled();
    expect(data.updateJavascriptPlainTextByThemeId).toBeCalled();
    expect(data.updateCssPlainTextByThemeId).not.toBeCalled();
    expect(data.updateHTMLPlainTextByThemeId).not.toBeCalled();
    expect(result).toStrictEqual({ status: 200, value: 'complete' });
  });
  test('updateFileToCmsFileSever success', async () => {
    mock(Readable, 'from', jest.fn());
    mock(domain, 'HTMLtoComponents', jest.fn());
    mock(domainValidate, 'validateSectionOfHTML', jest.fn().mockResolvedValue({ status: 200 }));
    mock(data, 'updateCssPlainTextByThemeId', jest.fn());
    mock(data, 'updateJavascriptPlainTextByThemeId', jest.fn());
    mock(data, 'updateHTMLPlainTextByThemeId', jest.fn());
    const result = await ThemeService.updateFileToCmsFileServer(theme2);
    expect(domain.HTMLtoComponents).toBeCalled();
    expect(data.updateHTMLPlainTextByThemeId).toBeCalled();
    expect(data.updateJavascriptPlainTextByThemeId).not.toBeCalled();
    expect(data.updateCssPlainTextByThemeId).not.toBeCalled();
    expect(result).toStrictEqual({ status: 200, value: 'complete' });
  });
  test('updateFileToCmsFileSever fail', async () => {
    mock(Readable, 'from', jest.fn());
    mock(domain, 'HTMLtoComponents', jest.fn());
    mock(domainValidate, 'validateSectionOfHTML', jest.fn().mockResolvedValue({ status: 403 }));
    mock(data, 'updateCssPlainTextByThemeId', jest.fn());
    mock(data, 'updateJavascriptPlainTextByThemeId', jest.fn());
    mock(data, 'updateHTMLPlainTextByThemeId', jest.fn());
    const result = await ThemeService.updateFileToCmsFileServer(theme2);
    expect(domain.HTMLtoComponents).not.toBeCalled();
    expect(data.updateHTMLPlainTextByThemeId).not.toBeCalled();
    expect(data.updateJavascriptPlainTextByThemeId).not.toBeCalled();
    expect(data.updateCssPlainTextByThemeId).not.toBeCalled();
    expect(result).toStrictEqual({ status: 403 });
  });
});
describe('ThemeService uploadFileToCMSFileServer', () => {
  const theme = {
    type: 'CSS',
    name: 'test',
    style: {
      createReadStream: () => {
        return null;
      },
    },
    _id: '124564789426',
  } as IThemeAssets;
  test('uploadFileToCMSFileServer success', async () => {
    mock(FileService, 'uploadFileToCMSFileServer', jest.fn().mockResolvedValue('https://localhost:3000/asdfasdfasdfasdf/test.css'));
    mock(data, 'updateCssByThemeId', jest.fn());
    mock(file, 'getBufferFromStream', jest.fn().mockResolvedValue([]));
    const result = await ThemeService.uploadFileToCMSFileServer(theme);
    expect(FileService.uploadFileToCMSFileServer).toBeCalled();
    expect(data.updateCssByThemeId).toBeCalled();
    expect(file.getBufferFromStream).toBeCalled();
    expect(result.status).toStrictEqual(200);
  });
  const theme1 = {
    type: 'JS',
    name: 'test',
    javascript: {
      createReadStream: () => {
        return null;
      },
    },
    _id: '124564789426',
  } as IThemeAssets;
  test('uploadFileToCMSFileServer success', async () => {
    mock(FileService, 'uploadFileToCMSFileServer', jest.fn().mockResolvedValue('https://localhost:3000/asdfasdfasdfasdf/test.css'));
    mock(data, 'updateJavascriptByThemeId', jest.fn());
    mock(file, 'getBufferFromStream', jest.fn().mockResolvedValue([]));
    const result = await ThemeService.uploadFileToCMSFileServer(theme1);
    expect(FileService.uploadFileToCMSFileServer).toBeCalled();
    expect(data.updateJavascriptByThemeId).toBeCalled();
    expect(file.getBufferFromStream).toBeCalled();
    expect(result.status).toStrictEqual(200);
  });
  const theme2 = {
    type: 'IMAGE',
    name: 'test',
    image: {
      createReadStream: () => {
        return null;
      },
    },
    _id: '124564789426',
  } as IThemeAssets;
  test('uploadFileToCMSFileServer success', async () => {
    mock(FileService, 'uploadFileToCMSFileServer', jest.fn().mockResolvedValue('https://localhost:3000/asdfasdfasdfasdf/test.css'));
    mock(data, 'updateImageByThemeId', jest.fn());
    mock(file, 'getBufferFromStream', jest.fn().mockResolvedValue([]));
    const result = await ThemeService.uploadFileToCMSFileServer(theme2);
    expect(FileService.uploadFileToCMSFileServer).toBeCalled();
    expect(data.updateImageByThemeId).toBeCalled();
    expect(result.status).toStrictEqual(200);
  });
});

describe('ThemeService getThemeComponents', () => {
  const getThemeGlobal = [
    {
      themeOption: { themeIdentifier: 'THEME_HEADER' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4b',
      componentType: 'cms-next-cms-header-container-rendering',
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecaf',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      orderNumber: 0,
      layoutID: null,
      layoutPosition: null,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_1' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4c',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-header-container-rendering',
      options: { quillHTML: 'helloWorld1' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecba',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 0,
    },
    {
      themeOption: { themeIdentifier: 'CONTENT' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4d',
      componentType: 'cms-next-cms-content-container-rendering',
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecc5',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      orderNumber: 1,
      layoutID: null,
      layoutPosition: null,
    },
    {
      themeOption: { themeIdentifier: 'THEME_FOOTER' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4e',
      componentType: 'cms-next-cms-footer-container-rendering',
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecd0',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      orderNumber: 2,
      layoutID: null,
      layoutPosition: null,
    },
    {
      themeOption: { themeIdentifier: '615ed997d46bfbf0da8aec4f' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4f',
      componentType: 'cms-next-cms-plain-html-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      outterHTML: '<div class="testStyle">\n        testStyle \n    ',
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 1,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_2' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec50',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld1' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecdb',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 2,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_3' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec51',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld2' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aece6',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 3,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_4' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec52',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld3' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecf1',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 4,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_5' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec53',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld4' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecfc',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 5,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_6' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec54',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld5' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aed07',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 6,
    },
  ];
  const sortedPageComponent = [
    {
      themeOption: { themeIdentifier: 'THEME_HEADER' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4b',
      componentType: 'cms-next-cms-header-container-rendering',
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecaf',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      orderNumber: 0,
      layoutID: null,
      layoutPosition: null,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_1' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4c',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-header-container-rendering',
      options: { quillHTML: 'helloWorld1' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecba',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 0,
    },
    {
      themeOption: { themeIdentifier: 'CONTENT' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4d',
      componentType: 'cms-next-cms-content-container-rendering',
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecc5',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      orderNumber: 1,
      layoutID: null,
      layoutPosition: null,
    },
    {
      themeOption: { themeIdentifier: 'THEME_FOOTER' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4e',
      componentType: 'cms-next-cms-footer-container-rendering',
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecd0',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      orderNumber: 2,
      layoutID: null,
      layoutPosition: null,
    },
    {
      themeOption: { themeIdentifier: '615ed997d46bfbf0da8aec4f' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4f',
      componentType: 'cms-next-cms-plain-html-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      outterHTML: '<div class="testStyle">\n        testStyle \n    ',
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 1,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_2' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec50',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld1' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecdb',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 2,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_3' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec51',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld2' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aece6',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 3,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_4' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec52',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld3' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecf1',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 4,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_5' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec53',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld4' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecfc',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 5,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_6' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec54',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld5' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aed07',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 6,
    },
  ];
  const angularHTML =
    '<cms-next-cms-theme-rendering><cms-next-cms-header-container-rendering id="THEME_HEADER" *cmsNextEmbeddedView><cms-next-cms-text-rendering *cmsNextEmbeddedView id="THEME_TEXT_1" column="null"></cms-next-cms-text-rendering></cms-next-cms-header-container-rendering><cms-next-cms-content-container-rendering id="CONTENT" *cmsNextEmbeddedView>[CONTENT]</cms-next-cms-content-container-rendering><cms-next-cms-footer-container-rendering id="THEME_FOOTER" *cmsNextEmbeddedView><div id="615ed997d46bfbf0da8aec4f" column="null" class="testStyle">';
  const filteredPageComponent = [
    {
      themeOption: { themeIdentifier: 'THEME_HEADER' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4b',
      componentType: 'cms-next-cms-header-container-rendering',
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecaf',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      orderNumber: 0,
      layoutID: undefined,
      layoutPosition: null,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_1' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4c',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-header-container-rendering',
      options: { quillHTML: 'helloWorld1' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecba',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutID: null,
      layoutPosition: null,
      orderNumber: 0,
    },
    {
      themeOption: { themeIdentifier: 'CONTENT' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4d',
      componentType: 'cms-next-cms-content-container-rendering',
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecc5',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      orderNumber: 1,
      layoutID: undefined,
      layoutPosition: null,
    },
    {
      themeOption: { themeIdentifier: 'THEME_FOOTER' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec4e',
      componentType: 'cms-next-cms-footer-container-rendering',
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecd0',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      orderNumber: 2,
      layoutID: undefined,
      layoutPosition: null,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_2' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec50',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld1' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecdb',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutID: null,
      layoutPosition: null,
      orderNumber: 2,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_3' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec51',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld2' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aece6',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutID: null,
      layoutPosition: null,
      orderNumber: 3,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_4' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec52',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld3' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecf1',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutID: null,
      layoutPosition: null,
      orderNumber: 4,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_5' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec53',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld4' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aecfc',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      themeLayoutID: null,
      layoutID: null,
      layoutPosition: null,
      orderNumber: 5,
    },
    {
      themeOption: { themeIdentifier: 'THEME_TEXT_6' },
      isActive: true,
      _id: '615ed997d46bfbf0da8aec54',
      componentType: 'cms-next-cms-text-rendering',
      section: 'cms-next-cms-footer-container-rendering',
      options: { quillHTML: 'helloWorld5' },
      commonSettings: {
        _id: '615ed997d46bfbf0da8aed07',
        border: [Object],
        shadow: [Object],
        background: [Object],
        advance: [Object],
        customize: [Object],
        className: null,
      },
      layoutID: null,
      themeLayoutID: null,
      layoutPosition: null,
      orderNumber: 6,
    },
  ];
  test('getConfigAndThemeComponents', async () => {
    mock(getconfigData, 'getConfigTheme', jest.fn().mockResolvedValue({ theme_id: '' }));
    mock(data, 'getThemeComponentsGlobal', jest.fn().mockResolvedValue({}));
    await ThemeService.getConfigAndThemeComponents(602, 0);
    expect(getconfigData.getConfigTheme).toBeCalled();
    expect(data.getThemeComponentsGlobal).toBeCalled();
  });
  test('getThemeComponents', async () => {
    mock(getconfigData, 'getConfigTheme', jest.fn().mockResolvedValue({ theme_id: '60d9684a1b941276e5f61d44' }));
    mock(data, 'getThemeComponentsGlobal', jest.fn().mockResolvedValue([]));
    mock(data, 'getThemeComponentsLocal', jest.fn().mockResolvedValue([]));
    mock(data, 'getThemeComponentsSharing', jest.fn().mockResolvedValue([]));
    mock(getconfigData, 'getWebsiteConfig', jest.fn().mockResolvedValue({ theme_id: '60d9684a1b941276e5f61d44' }));
    mock(linkedList, 'sortLinkedListComponentsWithinSection', jest.fn().mockReturnValue([]));
    mock(domain, 'transformComponentsToAngularHTML', jest.fn().mockResolvedValue([]));
    await ThemeService.getThemeComponents('60d9684a1b941276e5f61d44', 0, 602, subscriptionID);
    expect(getconfigData.getConfigTheme).toBeCalled();
    expect(data.getThemeComponentsGlobal).toBeCalled();
    expect(data.getThemeComponentsLocal).toBeCalled();
    expect(data.getThemeComponentsSharing).toBeCalled();
    expect(linkedList.sortLinkedListComponentsWithinSection).toBeCalled();
    expect(domain.transformComponentsToAngularHTML).toBeCalled();
  });
  test('getThemeComponents', async () => {
    mock(getconfigData, 'getConfigTheme', jest.fn().mockResolvedValue({ theme_id: '60d9684a1b941276e5f61d44' }));
    mock(data, 'getThemeComponentsGlobal', jest.fn().mockResolvedValue(getThemeGlobal));
    mock(data, 'getThemeComponentsLocal', jest.fn().mockResolvedValue([]));
    mock(data, 'getThemeComponentsSharing', jest.fn().mockResolvedValue([]));
    mock(getconfigData, 'getWebsiteConfig', jest.fn().mockResolvedValue({ theme_id: '60d9684a1b941276e5f61d44' }));
    mock(linkedList, 'sortLinkedListComponentsWithinSection', jest.fn().mockReturnValue(sortedPageComponent));
    mock(domain, 'transformComponentsToAngularHTML', jest.fn().mockReturnValue(angularHTML));
    const result = await ThemeService.getThemeComponents('60d9684a1b941276e5f61d44', 0, 602, subscriptionID);
    expect(getconfigData.getConfigTheme).toBeCalled();
    expect(data.getThemeComponentsGlobal).toBeCalled();
    expect(data.getThemeComponentsLocal).toBeCalled();
    expect(data.getThemeComponentsSharing).toBeCalled();
    expect(linkedList.sortLinkedListComponentsWithinSection).toBeCalled();
    expect(domain.transformComponentsToAngularHTML).toBeCalled();
    expect(result.themeComponents).toStrictEqual(filteredPageComponent);
    expect(result.angularHTML).toStrictEqual(angularHTML);
  });
  test('getThemeComponents', async () => {
    mock(getconfigData, 'getConfigTheme', jest.fn().mockResolvedValue({ theme_id: '60d9684a1b941276e5f61d44' }));
    mock(data, 'getThemeComponentsGlobal', jest.fn().mockResolvedValue([]));
    mock(data, 'getThemeComponentsLocal', jest.fn().mockResolvedValue([]));
    mock(data, 'getThemeComponentsSharing', jest.fn().mockResolvedValue([]));
    mock(getconfigData, 'getWebsiteConfig', jest.fn().mockResolvedValue({ theme_id: '60d9684a1b941276e5f61d44' }));
    mock(linkedList, 'sortLinkedListComponentsWithinSection', jest.fn().mockReturnValue([]));
    mock(domain, 'transformComponentsToAngularHTML', jest.fn().mockResolvedValue([]));
    await ThemeService.getThemeComponents('60d9684a1b941276e5f61d44', 0, 602, subscriptionID);
    expect(getconfigData.getConfigTheme).toBeCalled();
    expect(data.getThemeComponentsGlobal).toBeCalled();
    expect(data.getThemeComponentsLocal).toBeCalled();
    expect(data.getThemeComponentsSharing).toBeCalled();
    expect(linkedList.sortLinkedListComponentsWithinSection).toBeCalled();
    expect(domain.transformComponentsToAngularHTML).toBeCalled();
  });
});
