import { IContentManagementGeneralPattern } from '@reactor-room/cms-models-lib';
import { mock } from '@reactor-room/itopplus-back-end-helpers';
import * as data from '../../data/content-patterns/content-patterns.data';
import * as ContentsDomain from '../../domains/contents/contents.domain';
import { ContentPatternsService } from './content-patterns.service';
jest.mock('../../data/content-patterns/content-patterns.data');

describe('ContentPatternsService getTotalPattern', () => {
  test('getTotalPattern Success', async () => {
    mock(data, 'getTotalPattern', jest.fn().mockResolvedValueOnce(3));
    const result = await ContentPatternsService.getTotalPattern();
    expect(result).toEqual(3);
    expect(data.getTotalPattern).toBeCalledTimes(1);
  });

  test('getTotalPattern Failed', async () => {
    try {
      mock(data, 'getTotalPattern', jest.fn().mockRejectedValueOnce(new Error('Error')));
      await ContentPatternsService.getTotalPattern();
    } catch (error) {
      expect(error.message).toEqual('Error: Error');
    }
  });
});

describe('ContentPatternsService getContentPatterns', () => {
  const patterns: IContentManagementGeneralPattern[] = [
    { _id: '1', patternName: '1', patternUrl: '1', patternStyle: null },
    { _id: '1', patternName: '1', patternUrl: '1', patternStyle: null },
    { _id: '1', patternName: '1', patternUrl: '1', patternStyle: null },
  ];
  test('getContentPatterns Success', async () => {
    mock(data, 'getContentPatterns', jest.fn().mockResolvedValueOnce(patterns));
    const result = await ContentPatternsService.getContentPatterns(0, 3);
    expect(result).toEqual(patterns);
    expect(result.length).toEqual(3);
    expect(data.getContentPatterns).toBeCalledTimes(1);
  });

  test('getContentPatterns Failed', async () => {
    try {
      mock(data, 'getContentPatterns', jest.fn().mockRejectedValueOnce(new Error('Error')));
      await ContentPatternsService.getContentPatterns(0, 3);
    } catch (error) {
      expect(error.message).toEqual('Error: Error');
    }
  });
});

describe('ContentPatternsService getContentPattern', () => {
  const pattern: IContentManagementGeneralPattern = { _id: '1', patternName: '1', patternUrl: '1', patternStyle: null };
  test('getContentPattern Success', async () => {
    mock(data, 'getContentPattern', jest.fn().mockResolvedValueOnce(pattern));
    const result = await ContentPatternsService.getContentPattern('1');
    expect(result).toEqual(pattern);
    expect(data.getContentPattern).toBeCalledTimes(1);
  });

  test('getContentPattern Failed', async () => {
    try {
      mock(data, 'getContentPattern', jest.fn().mockRejectedValueOnce(new Error('Error')));
      await ContentPatternsService.getContentPattern('1');
    } catch (error) {
      expect(error.message).toEqual('Error: Error');
    }
  });
});

describe('ContentPatternsService addContentPattern', () => {
  const toaddPattern: IContentManagementGeneralPattern = {
    _id: '#tempPattern',
    patternName: '1',
    patternUrl: '1',
    patternStyle: {
      container: null,
      primary: null,
      secondary: null,
      css: `#tempPattern{}`,
    },
  };
  const addedPattern: IContentManagementGeneralPattern = {
    _id: '1111',
    patternName: '1',
    patternUrl: '1',
    patternStyle: {
      container: null,
      primary: null,
      secondary: null,
      css: `#tempPattern{}`,
    },
  };

  test('addContentPattern Success', async () => {
    mock(data, 'addContentPattern', jest.fn().mockResolvedValueOnce(addedPattern));
    mock(data, 'updateContentPattern', jest.fn().mockResolvedValueOnce({}));
    const result = await ContentPatternsService.addContentPattern(toaddPattern);
    expect(result.status).toEqual(200);
    expect(result.value).toEqual('1111');
    expect(data.addContentPattern).toBeCalledTimes(1);
  });

  test('addContentPattern updatePatternCSS Success', async () => {
    mock(data, 'addContentPattern', jest.fn().mockResolvedValueOnce(addedPattern));
    mock(data, 'updateContentPattern', jest.fn().mockResolvedValueOnce({}));
    const result = await ContentPatternsService.addContentPattern(toaddPattern);
    const updateResult = ContentsDomain.updatePatternCSS(addedPattern);
    expect(updateResult.patternStyle.css).toEqual(`[id="1111"]{}`);
    expect(result.status).toEqual(200);
    expect(result.value).toEqual('1111');
    expect(data.addContentPattern).toBeCalledTimes(1);
  });

  test('addContentPattern Failed', async () => {
    try {
      mock(data, 'addContentPattern', jest.fn().mockRejectedValueOnce(new Error('Error')));
      await ContentPatternsService.addContentPattern(toaddPattern);
    } catch (error) {
      expect(error.message).toEqual('Error: Error');
    }
  });
});

describe('ContentPatternsService updateContentPattern', () => {
  const toupdatePattern: IContentManagementGeneralPattern = {
    _id: '#tempPattern',
    patternName: '1',
    patternUrl: '1',
    patternStyle: {
      container: null,
      primary: null,
      secondary: null,
      css: `#tempPattern{}`,
    },
  };
  test('updateContentPattern Success', async () => {
    mock(data, 'updateContentPattern', jest.fn().mockResolvedValueOnce({}));
    const result = await ContentPatternsService.updateContentPattern(toupdatePattern);
    expect(result.status).toEqual(200);
    expect(result.value).toEqual(true);
    expect(data.updateContentPattern).toBeCalledTimes(1);
  });

  test('updateContentPattern Failed', async () => {
    try {
      mock(data, 'updateContentPattern', jest.fn().mockRejectedValueOnce(new Error('Error')));
      await ContentPatternsService.updateContentPattern(toupdatePattern);
    } catch (error) {
      expect(error.message).toEqual('Error: Error');
    }
  });
});
