import {
  IWebsiteConfigGeneral,
  IWebsiteConfigGeneralLanguage,
  EnumLanguageCultureUI,
  IWebsiteConfigTheme,
  IWebsiteConfigCSS,
  IWebsiteConfigDataPrivacy,
  IWebsiteConfigMeta,
  IWebsiteConfigSEO,
} from '@reactor-room/cms-models-lib';
import { getDefaultConfigData } from '@reactor-room/cms-services-lib';
import { mock } from '@reactor-room/itopplus-back-end-helpers';
import * as data from '../../data/config/set-config.data';
import * as getData from '../../data/config/get-config.data';
import * as langData from '../../data/language/language.data';
import { ConfigService } from './config.service';

describe('ConfigService saveConfigTheme', () => {
  const configService = new ConfigService();
  test('saveConfigTheme Success', async () => {
    const configTheme: IWebsiteConfigTheme = {
      theme_id: '1',
      updatedAt: '3',
    };
    const expectedValue = { status: 200, value: true };
    mock(data, 'saveConfigTheme', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigTheme(258, configTheme);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigTheme).toBeCalledTimes(1);
  });

  test('saveConfigTheme Failed', async () => {
    const configTheme: IWebsiteConfigTheme = {
      theme_id: '1',
      updatedAt: '3',
    };
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'saveConfigTheme', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await configService.saveConfigTheme(258, configTheme);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigTheme).toBeCalledTimes(1);
  });
});

describe('ConfigService saveConfigShortcuts', () => {
  const configService = new ConfigService();
  test('saveConfigShortcuts Success', async () => {
    const configShortcuts = ['111', '222'];
    const expectedValue = { status: 200, value: true };
    mock(data, 'saveConfigShortcuts', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigShortcuts(258, configShortcuts);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigShortcuts).toBeCalledTimes(1);
  });

  test('saveConfigShortcuts Failed', async () => {
    const configShortcuts = ['111', '222'];
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'saveConfigShortcuts', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await configService.saveConfigShortcuts(258, configShortcuts);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigShortcuts).toBeCalledTimes(1);
  });
});

describe('ConfigService saveConfigGeneral', () => {
  const configService = new ConfigService();
  test('saveConfigGeneral Success', async () => {
    const configGeneral: IWebsiteConfigGeneral = {
      language: {
        defaultCultureUI: EnumLanguageCultureUI.EN,
        selectedCultureUIs: [EnumLanguageCultureUI.TH],
      },
    };
    const expectedValue = { status: 200, value: true };
    mock(data, 'saveConfigGeneral', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigGeneral(258, configGeneral);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigGeneral).toBeCalledTimes(1);
  });

  test('saveConfigGeneral Failed', async () => {
    const configGeneral: IWebsiteConfigGeneral = {
      language: {
        defaultCultureUI: EnumLanguageCultureUI.EN,
        selectedCultureUIs: [EnumLanguageCultureUI.TH],
      },
    };
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'saveConfigGeneral', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await configService.saveConfigGeneral(258, configGeneral);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigGeneral).toBeCalledTimes(1);
  });
});
//SEO
describe('ConfigService saveConfigSEO', () => {
  const configService = new ConfigService();
  test('saveConfigSEO Success (Full) ', async () => {
    const configSEO = {
      culture_ui: 'TH',
      title: 'mocked page',
      keyword: ['keyword 1', 'keyword 2'],
      description: 'this is mocked page',
    };

    const expectedStatus = { status: 200, value: true };
    mock(data, 'saveConfigSEO', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigSEO(258, configSEO);
    expect(result.status).toEqual(expectedStatus.status);
    expect(result.value).toEqual(expectedStatus.value);
    expect(data.saveConfigSEO).toBeCalledTimes(1);
  });

  test('saveConfigSEO Success (Partial) ', async () => {
    const configSEO: IWebsiteConfigSEO = {
      title: 'mocked page',
      keyword: ['keyword 1', 'keyword 2'],
      description: 'this is mocked page',
    };

    const expectedStatus = { status: 200, value: true };
    mock(data, 'saveConfigSEO', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigSEO(258, configSEO);
    expect(result.status).toEqual(expectedStatus.status);
    expect(result.value).toEqual(expectedStatus.value);
    expect(data.saveConfigSEO).toBeCalledTimes(1);
  });

  test('saveConfigSEO failed', async () => {
    const configSEO: IWebsiteConfigSEO = {
      title: 'mocked page',
      keyword: ['keyword 1', 'keyword 2'],
      description: 'this is mocked page',
    };
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'saveConfigSEO', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await configService.saveConfigSEO(258, configSEO);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigSEO).toBeCalledTimes(1);
  });
});

describe('ConfigService getConfigSEO', () => {
  const configService = new ConfigService();
  test('getConfigSEO Success (Full) ', async () => {
    const configSEO = {
      culture_ui: 'TH',
      title: 'mocked page',
      keyword: ['keyword 1', 'keyword 2'],
      description: 'this is mocked page',
    };

    mock(getData, 'getConfigSEO', jest.fn().mockResolvedValue(configSEO));
    const result = await configService.getConfigSEO(258);
    expect(result).toEqual(configSEO);
    expect(getData.getConfigSEO).toBeCalledTimes(1);
  });

  test('getConfigSEO Success (Partial) ', async () => {
    const configSEO: IWebsiteConfigSEO = {
      title: 'mocked page',
      keyword: ['keyword 1', 'keyword 2'],
      description: 'this is mocked page',
    };

    const expectedResult: IWebsiteConfigSEO = {
      culture_ui: 'TH',
      title: 'mocked page',
      keyword: ['keyword 1', 'keyword 2'],
      description: 'this is mocked page',
    };

    mock(getData, 'getConfigSEO', jest.fn().mockResolvedValue(configSEO));
    const result = await configService.getConfigSEO(258);
    expect(result).toEqual(expectedResult);
    expect(getData.getConfigSEO).toBeCalledTimes(1);
  });

  test('getConfigSEO get default value ', async () => {
    const expectedResult: IWebsiteConfigSEO = {
      culture_ui: 'TH',
      title: '',
      keyword: [],
      description: '',
    };

    mock(getData, 'getConfigSEO', jest.fn().mockResolvedValue(undefined));
    const result = await configService.getConfigSEO(258);
    expect(result).toEqual(expectedResult);
    expect(getData.getConfigSEO).toBeCalledTimes(1);
  });
});

//END SEO

//CSS
describe('ConfigService saveConfigCSS', () => {
  const configService = new ConfigService();
  test('saveConfigCSS Success', async () => {
    const configCSS: IWebsiteConfigCSS = {
      global: 'testing text',
      css_with_language: [{ language: 'TH', stylesheet: 'display:inline-block' }],
    };
    const expectedValue = { status: 200, value: true };
    mock(data, 'saveConfigCSS', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigCSS(258, configCSS);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigCSS).toBeCalledTimes(1);
  });

  test('saveConfigCSS failed', async () => {
    const configCSS: IWebsiteConfigCSS = {
      global: 'testing text',
      css_with_language: [{ language: 'TH', stylesheet: 'display:inline-block' }],
    };
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'saveConfigCSS', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await configService.saveConfigCSS(258, configCSS);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigCSS).toBeCalledTimes(1);
  });
});

describe('ConfigService getConfigCSS', () => {
  const configService = new ConfigService();
  const languageResults = [
    {
      _id: '6108ee47791b766895c25fe8',
      name: 'Thai',
      localName: 'ภาษาไทย',
      icon: 'assets/lang/th.svg',
      cultureUI: 'TH',
      __v: 0,
    },
    {
      _id: '6108eeed791b766895c25fee',
      name: 'English',
      localName: 'ภาษาอังกฤษ',
      icon: 'assets/lang/en.svg',
      cultureUI: 'EN',
      __v: 0,
    },
    {
      _id: '6108eef8791b766895c25ff0',
      name: 'Japanese',
      localName: 'ภาษาญี่ปุ่น',
      icon: 'assets/lang/jp.svg',
      cultureUI: 'JP',
      __v: 0,
    },
  ];
  test('getConfigCSS got default value', async () => {
    const expectedResult = {
      global: '',
      css_with_language: [
        {
          language: 'TH',
          stylesheet: '/*************TH Thai *************/',
        },
        {
          language: 'EN',
          stylesheet: '/*************EN English *************/',
        },
        {
          language: 'JP',
          stylesheet: '/*************JP Japanese *************/',
        },
      ],
    };
    mock(getData, 'getConfigCSS', jest.fn().mockResolvedValue(undefined));
    mock(langData, 'getLanguages', jest.fn().mockResolvedValue(languageResults));
    const result = await configService.getConfigCSS(258);
    expect(result).toEqual(expectedResult);
    expect(getData.getConfigCSS).toBeCalledTimes(1);
    expect(langData.getLanguages).toBeCalledTimes(1);
  });

  test('getConfigCSS filled partial value', async () => {
    const configCSS: IWebsiteConfigCSS = {
      css_with_language: [{ language: 'TH', stylesheet: 'display:inline-block' }],
    };
    const expectedConfig: IWebsiteConfigCSS = {
      global: '',
      css_with_language: [
        { language: 'TH', stylesheet: 'display:inline-block' },
        {
          language: 'EN',
          stylesheet: '/*************EN English *************/',
        },
        {
          language: 'JP',
          stylesheet: '/*************JP Japanese *************/',
        },
      ],
    };

    mock(getData, 'getConfigCSS', jest.fn().mockResolvedValue(configCSS));
    mock(langData, 'getLanguages', jest.fn().mockResolvedValue(languageResults));
    const result = await configService.getConfigCSS(258);
    expect(result).toEqual(expectedConfig);
    expect(getData.getConfigCSS).toBeCalledTimes(1);
  });
});

//END CSS
//META TAG
describe('ConfigService saveConfigMeta', () => {
  const configService = new ConfigService();
  test('saveConfigMetaTag Success (Partial)', async () => {
    const configMetaTagInput: IWebsiteConfigMeta = {
      meta_tag: '<meta http-equiv=”Content-Type” content=”text/html; charset=utf-8″ />',
      body_tag: '<p>mocked body tag</p>',
    };
    const mockedStatus = { status: 200, value: true };
    mock(data, 'saveConfigMeta', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigMeta(258, configMetaTagInput);
    expect(result.status).toEqual(mockedStatus.status);
    expect(result.value).toEqual(mockedStatus.value);
  });

  test('saveConfigMetaTag Success (Full)', async () => {
    const configMetaTagInput: IWebsiteConfigMeta = {
      meta_tag: '<meta http-equiv=”Content-Type” content=”text/html; charset=utf-8″ />',
      body_tag: '<p>mocked body tag</p>',
      javascript: 'const test = "test"',
    };
    const mockedStatus = { status: 200, value: true };
    mock(data, 'saveConfigMeta', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigMeta(258, configMetaTagInput);
    expect(result.status).toEqual(mockedStatus.status);
    expect(result.value).toEqual(mockedStatus.value);
  });

  test('saveConfigMeta Failed', async () => {
    const errorStatus = {
      status: 403,
      value: 'error',
    };
    const configDataMeta: IWebsiteConfigMeta = {
      meta_tag: '<meta http-equiv=”Content-Type” content=”text/html; charset=utf-8″ />',
      body_tag: '<p>mocked body tag</p>',
      javascript: 'const test = "test"',
    };

    mock(data, 'saveConfigMeta', jest.fn().mockRejectedValue(new Error('error')));
    const result = await configService.saveConfigMeta(258, configDataMeta);
    expect(result.value).toEqual(errorStatus.value);
    expect(result.status).toEqual(errorStatus.status);
  });
});

describe('ConfigService getConfigMeta', () => {
  const configService = new ConfigService();
  test('getConfigMeta got default value (Full)', async () => {
    const expectedResult: IWebsiteConfigMeta = {
      meta_tag: '',
      body_tag: '',
      javascript: '',
    };

    mock(getData, 'getConfigMeta', jest.fn().mockResolvedValue(undefined));
    const result = await configService.getConfigMeta(258);
    expect(result).toEqual(expectedResult);
  });

  test('getConfigMeta got default value (Partial)', async () => {
    const mockedInput: IWebsiteConfigMeta = {
      meta_tag: 'mocked meta',
      javascript: 'mocked javascript',
    };
    const expectedResult: IWebsiteConfigMeta = {
      meta_tag: 'mocked meta',
      body_tag: '',
      javascript: 'mocked javascript',
    };

    mock(getData, 'getConfigMeta', jest.fn().mockResolvedValue(mockedInput));
    const result = await configService.getConfigMeta(258);
    expect(result).toEqual(expectedResult);
  });
  test('getConfigMeta failed', async () => {
    mock(getData, 'getConfigMeta', jest.fn().mockRejectedValue(new Error('error')));
    const result = await configService.getConfigMeta(258);
    expect(result).toEqual(null);
  });
});
//END META TAG

//DATA PRIVACY
describe('ConfigService saveConfigDataPrivacy', () => {
  const configService = new ConfigService();

  test('saveConfigDataPrivacy Success (Partial)', async () => {
    const expectedResult = {
      status: 200,
      value: true,
    };
    const configDataPrivacy: IWebsiteConfigDataPrivacy = {
      is_active: true,
    };
    mock(data, 'saveConfigDataPrivacy', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigDataPrivacy(258, configDataPrivacy);
    expect(result.value).toEqual(expectedResult.value);
    expect(result.status).toEqual(expectedResult.status);
  });

  test('saveConfigDataPrivacy Success (Full)', async () => {
    const expectedResult = {
      status: 200,
      value: true,
    };
    const configDataPrivacy: IWebsiteConfigDataPrivacy = {
      is_active: true,
      data_use: 'mock data data_use',
      privacy_policy: 'mock data privacy_policy',
    };
    mock(data, 'saveConfigDataPrivacy', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigDataPrivacy(258, configDataPrivacy);
    expect(result.value).toEqual(expectedResult.value);
    expect(result.status).toEqual(expectedResult.status);
  });

  test('saveConfigDataPrivacy Failed', async () => {
    const errorStatus = {
      status: 403,
      value: 'error',
    };
    const configDataPrivacy: IWebsiteConfigDataPrivacy = {
      is_active: true,
    };

    mock(data, 'saveConfigDataPrivacy', jest.fn().mockRejectedValue(new Error('error')));
    const result = await configService.saveConfigDataPrivacy(258, configDataPrivacy);
    expect(result.value).toEqual(errorStatus.value);
    expect(result.status).toEqual(errorStatus.status);
  });
});
describe('ConfigService getConfigDataPrivacy', () => {
  const configService = new ConfigService();
  test('getConfigDataPrivacy got default value (Full)', async () => {
    const expectedResult: IWebsiteConfigDataPrivacy = { is_active: false, data_use: 'DATA USE', privacy_policy: 'PRIVACY POLICY' };

    mock(getData, 'getConfigDataPrivacy', jest.fn().mockResolvedValue(undefined));
    const result = await configService.getConfigDataPrivacy(258);
    expect(result).toEqual(expectedResult);
  });

  test('getConfigDataPrivacy got default value (Partial)', async () => {
    const mockedInput: IWebsiteConfigDataPrivacy = {
      is_active: true,
      data_use: 'mocked data_use',
    };
    const expectedResult: IWebsiteConfigDataPrivacy = { is_active: true, data_use: 'mocked data_use', privacy_policy: 'PRIVACY POLICY' };
    mock(getData, 'getConfigDataPrivacy', jest.fn().mockResolvedValue(mockedInput));
    const result = await configService.getConfigDataPrivacy(258);
    expect(result).toEqual(expectedResult);
  });
  test('getConfigDataPrivacy failed', async () => {
    mock(getData, 'getConfigDataPrivacy', jest.fn().mockRejectedValue(new Error('error')));
    const result = await configService.getConfigDataPrivacy(258);
    expect(result).toEqual(null);
  });
});

//END DATA PRIVACY

describe('ConfigService saveConfigStyle', () => {
  const configService = new ConfigService();
  test('saveConfigStyle Success', async () => {
    const style = '#template123{}';
    const expectedValue = { status: 200, value: true };
    mock(data, 'saveConfigStyle', jest.fn().mockResolvedValue({}));
    const result = await configService.saveConfigStyle(258, style);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigStyle).toBeCalledTimes(1);
  });

  test('saveConfigStyle Failed', async () => {
    const style = '#template123{}';
    const expectedValue = { status: 403, value: 'Error' };
    mock(data, 'saveConfigStyle', jest.fn().mockRejectedValue(new Error('Error')));
    const result = await configService.saveConfigStyle(258, style);
    expect(result.value).toEqual(expectedValue.value);
    expect(result.status).toEqual(expectedValue.status);
    expect(data.saveConfigStyle).toBeCalledTimes(1);
  });
});

describe('ConfigService getConfigTheme', () => {
  const configService = new ConfigService();
  test('getConfigTheme Success', async () => {
    const config: IWebsiteConfigTheme = {
      theme_id: '1111',
      updatedAt: '3232323',
    };
    const expectedValue = config;
    mock(getData, 'getConfigTheme', jest.fn().mockResolvedValue(expectedValue));
    const result = await configService.getConfigTheme(258);
    expect(result).toEqual(expectedValue);
    expect(getData.getConfigTheme).toBeCalledTimes(1);
  });

  test('getConfigTheme Failed', async () => {
    mock(getData, 'getConfigTheme', jest.fn().mockRejectedValue(null));
    const result = await configService.getConfigTheme(258);
    expect(result).toEqual(null);
    expect(getData.getConfigTheme).toBeCalledTimes(1);
  });
});

describe('ConfigService getConfigShortcuts', () => {
  const configService = new ConfigService();
  test('getConfigShortcuts Success', async () => {
    const expectedValue = ['111', '222'];
    mock(getData, 'getConfigShortcuts', jest.fn().mockResolvedValue(expectedValue));
    const result = await configService.getConfigShortcuts(258);
    expect(result).toEqual(expectedValue);
    expect(result.length).toEqual(expectedValue.length);
    expect(getData.getConfigShortcuts).toBeCalledTimes(1);
  });

  test('getConfigShortcuts Failed', async () => {
    mock(getData, 'getConfigShortcuts', jest.fn().mockRejectedValue(null));
    const result = await configService.getConfigShortcuts(258);
    expect(result).toBeNull();
    expect(getData.getConfigShortcuts).toBeCalledTimes(1);
  });
});

describe('ConfigService getConfigStyle', () => {
  const configService = new ConfigService();
  test('getConfigStyle Success', async () => {
    const style = '#template123{}';
    const expectedValue = style;
    mock(getData, 'getConfigStyle', jest.fn().mockResolvedValue(expectedValue));
    const result = await configService.getConfigStyle(258);
    expect(result).toEqual(expectedValue);
    expect(getData.getConfigStyle).toBeCalledTimes(1);
  });

  test('getConfigStyle Failed', async () => {
    mock(getData, 'getConfigStyle', jest.fn().mockRejectedValue(null));
    const result = await configService.getConfigStyle(258);
    expect(result).toEqual(null);
    expect(getData.getConfigStyle).toBeCalledTimes(1);
  });
});

describe('ConfigService getConfigGeneral', () => {
  const configService = new ConfigService();
  test('getConfigGeneral Success', async () => {
    const configGeneral: IWebsiteConfigGeneral = {
      language: {
        defaultCultureUI: EnumLanguageCultureUI.EN,
        selectedCultureUIs: [EnumLanguageCultureUI.TH],
      },
    };
    const expectedValue = configGeneral;
    mock(getData, 'getConfigGeneral', jest.fn().mockResolvedValue(expectedValue));
    const result = await configService.getConfigGeneral(258);
    expect(result).toEqual(expectedValue);
    expect(result).toEqual(expect.objectContaining({ ...configGeneral }));
    expect(getData.getConfigGeneral).toBeCalledTimes(1);
  });

  test('getConfigGeneral get default value', async () => {
    mock(getData, 'getConfigGeneral', jest.fn().mockResolvedValue(null));
    const result = await configService.getConfigGeneral(258);
    const defaultData = getDefaultConfigData();
    expect(result).toEqual(defaultData);
    expect(getData.getConfigGeneral).toBeCalledTimes(1);
  });
});

describe('ConfigService getConfigGeneralLanguage', () => {
  const configService = new ConfigService();
  test('getConfigGeneralLanguage Success', async () => {
    const configGeneralLanguage: IWebsiteConfigGeneralLanguage = {
      defaultCultureUI: EnumLanguageCultureUI.EN,
      selectedCultureUIs: [EnumLanguageCultureUI.TH],
    };
    const expectedValue = configGeneralLanguage;
    mock(getData, 'getConfigGeneralLanguage', jest.fn().mockResolvedValue(expectedValue));
    const result = await configService.getConfigGeneralLanguage(258);
    expect(result).toEqual(expectedValue);
    expect(result).toEqual(expect.objectContaining({ ...configGeneralLanguage }));
    expect(getData.getConfigGeneralLanguage).toBeCalledTimes(1);
  });

  test('getConfigGeneralLanguage Failed', async () => {
    mock(getData, 'getConfigGeneralLanguage', jest.fn().mockResolvedValue(null));
    const result = await configService.getConfigGeneralLanguage(258);
    expect(result).toEqual(null);
    expect(getData.getConfigGeneralLanguage).toBeCalledTimes(1);
  });
});
