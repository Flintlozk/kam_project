import { ILanguage, EnumLanguageCultureUI } from '@reactor-room/cms-models-lib';
import { mock } from '@reactor-room/itopplus-back-end-helpers';
import * as data from '../../data/language/language.data';
import { LanguageService } from './language.service';

describe('LanguageService getLanguages', () => {
  const languageService = new LanguageService();
  test('getLanguages Success', async () => {
    const expectedValue: ILanguage[] = [
      {
        _id: '123',
        name: '123',
        localName: '123',
        icon: '123',
        cultureUI: EnumLanguageCultureUI.EN,
      },
      {
        _id: '456',
        name: '123',
        localName: '123',
        icon: '123',
        cultureUI: EnumLanguageCultureUI.TH,
      },
    ];
    mock(data, 'getLanguages', jest.fn().mockResolvedValue(expectedValue));
    const result = await languageService.getLanguages();
    expect(result).toEqual(expectedValue);
    expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ _id: '123' }), expect.objectContaining({ _id: '456' })]));
    expect(data.getLanguages).toBeCalledTimes(1);
  });

  test('getLanguages Failed', async () => {
    mock(data, 'getLanguages', jest.fn().mockRejectedValue(null));
    const result = await languageService.getLanguages();
    expect(result).toEqual(null);
    expect(data.getLanguages).toBeCalledTimes(1);
  });
});
