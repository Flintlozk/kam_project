import { EnumLanguageCultureUI, ILanguage } from '@reactor-room/cms-models-lib';
import * as _ from 'lodash';
import * as config from './config.domain';
describe('getDepthPath test', () => {
  const objectInput = {
    test1: 'mockeditem',
    deeptest21: {
      test2: 'mockeditem2',
      deeptest22: {
        test3: {
          deeptest23: {
            test5: 'mockeditem3',
            test6: 'mockeditem4',
          },
        },
      },
    },
    deeptest31: {
      test1: 'mockeditem5',
      test2: 'mockeditem6',
    },
  };
  const expectedResult = [
    'test1',
    'deeptest21.test2',
    'deeptest21.deeptest22.test3.deeptest23.test5',
    'deeptest21.deeptest22.test3.deeptest23.test6',
    'deeptest31.test1',
    'deeptest31.test2',
  ];
  test('getDepthPath success (1 parameter)', () => {
    const result = config.getDepthPath(objectInput);
    expect(result).toEqual(expectedResult);
  });
  test('getDepthPath success (2 parameters)', () => {
    const result = config.getDepthPath(objectInput, '');
    expect(result).toEqual(expectedResult);
  });

  test('getDepthPath success (all parameters)', () => {
    const result = config.getDepthPath(objectInput, '', []);
    expect(result).toEqual(expectedResult);
  });

  test('getDepthPath success (non empty string concatString parameter)', () => {
    const result = config.getDepthPath(objectInput, 'string');
    const expectedResult = [
      'stringtest1',
      'stringdeeptest21.test2',
      'stringdeeptest21.deeptest22.test3.deeptest23.test5',
      'stringdeeptest21.deeptest22.test3.deeptest23.test6',
      'stringdeeptest31.test1',
      'stringdeeptest31.test2',
    ];
    expect(result).toEqual(expectedResult);
  });

  test('getDepthPath success (non empty array recurringlist parameter)', () => {
    const result = config.getDepthPath(objectInput, '', ['d']);
    const expectedResult = [
      'd',
      'test1',
      'deeptest21.test2',
      'deeptest21.deeptest22.test3.deeptest23.test5',
      'deeptest21.deeptest22.test3.deeptest23.test6',
      'deeptest31.test1',
      'deeptest31.test2',
    ];
    expect(result).toEqual(expectedResult);
  });

  test('getDepthPath success (empty object)', () => {
    const result = config.getDepthPath({});
    const expectedResult = [];
    expect(result).toEqual(expectedResult);
  });

  test('getDepthPath failed (undefined object)', () => {
    const result = config.getDepthPath(undefined);
    const expectedResult = [];
    expect(result).not.toEqual(expectedResult);
  });

  test('getDepthPath failed (null object)', () => {
    const result = config.getDepthPath(null);
    const expectedResult = [];
    expect(result).not.toEqual(expectedResult);
  });
});

describe('patchLanguageFromDefault test', () => {
  const languages: ILanguage[] = [
    {
      _id: '6108ee47791b766895c25fe8',
      name: 'Thai',
      localName: 'ภาษาไทย',
      icon: 'assets/lang/th.svg',
      cultureUI: EnumLanguageCultureUI.TH,
    },

    {
      _id: '6108eeed791b766895c25fee',
      name: 'English',
      localName: 'ภาษาอังกฤษ',
      icon: 'assets/lang/en.svg',
      cultureUI: EnumLanguageCultureUI.EN,
    },

    {
      _id: '6108eef8791b766895c25ff0',
      name: 'Japanese',
      localName: 'ภาษาญี่ปุ่น',
      icon: 'assets/lang/jp.svg',
      cultureUI: EnumLanguageCultureUI.JP,
    },
  ];
  const defaultConfigCSS = {
    global: '',
    css_with_language: [],
  };
  test('patchLanguageFromDefault success', () => {
    const queried_data = {
      global: '',
      css_with_language: [],
    };
    const expectedResult = {
      global: '',
      css_with_language: [
        { language: 'TH', stylesheet: '/*************TH Thai *************/' },
        { language: 'EN', stylesheet: '/*************EN English *************/' },
        { language: 'JP', stylesheet: '/*************JP Japanese *************/' },
      ],
    };
    const result = config.patchLanguageFromDefault(languages, defaultConfigCSS, queried_data);
    expect(result).toEqual(expectedResult);
  });

  test('patchLanguageFromDefault failed (default value empty object)', () => {
    const queried_data = {
      global: '',
      css_with_language: [],
    };
    expect(() => {
      config.patchLanguageFromDefault(languages, {}, queried_data);
    }).toThrow();
  });

  test('patchLanguageFromDefault success (language empty array)', () => {
    const queried_data = {
      global: '',
      css_with_language: [],
    };
    const result = config.patchLanguageFromDefault([], defaultConfigCSS, queried_data);
    expect(result).toEqual(queried_data);
  });

  test('patchLanguageFromDefault failed (queried data empty object)', () => {
    expect(() => {
      config.patchLanguageFromDefault(languages, defaultConfigCSS, {});
    }).toThrow();
  });
});

describe('flatenArrayObject test', () => {
  test('flatenArrayObject success', () => {
    const pathArray = [{ a: 1 }, { b: 2 }, { c: 3 }];
    const expectedResult = {
      a: 1,
      b: 2,
      c: 3,
    };
    const result = config.flatenArrayObject(pathArray);
    expect(result).toEqual(expectedResult);
  });

  test('flatenArrayObject success (with null value)', () => {
    const pathArray = [{ a: 1 }, { b: 2 }, null];
    const expectedResult = {
      a: 1,
      b: 2,
    };
    const result = config.flatenArrayObject(pathArray);
    expect(result).toEqual(expectedResult);
  });

  test('flatenArrayObject failed (undefined)', () => {
    expect(() => {
      config.flatenArrayObject(undefined);
    }).toThrow();
  });
});

describe('getPathWithValue test', () => {
  test('getPathWithValue success', () => {
    const allPaths = ['meta_tag'];
    const expectedResult = [{ 'meta_tags.meta_tag': 'testMeta' }];
    const result = config.getPathWithValue(allPaths, { meta_tag: 'testMeta' }, 'meta_tags');
    expect(result).toEqual(expectedResult);
  });

  test('getPathWithValue success (random prefix name)', () => {
    const allPaths = ['meta_tag'];
    const expectedResult = [{ 'random_name.meta_tag': 'testMeta' }];
    const result = config.getPathWithValue(allPaths, { meta_tag: 'testMeta' }, 'random_name');
    expect(result).toEqual(expectedResult);
  });

  test('getPathWithValue success (empty data)', () => {
    const allPaths = ['meta_tag'];
    const result = config.getPathWithValue(allPaths, {}, 'meta_tags');
    expect(result).toEqual([]);
  });
});
