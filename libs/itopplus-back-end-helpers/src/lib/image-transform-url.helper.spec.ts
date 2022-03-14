import { environmentLib } from '@reactor-room/environment-services-frontend';
import { decodeFileName, transformImageURlFormat, transformMediaLinkString } from './image-transform-url.helper';

describe('image-transform-url', () => {
  test('test encodefileName', () => {
    const mockFileName =
      'https://resource.more-commerce.com/production/4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0/ไทย_4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0_1628581638965_1628581638966.jpg';
    const mockMessageObj = {
      type: 'image',
      originalContentUrl: mockFileName,
      previewImageUrl: mockFileName,
    };
    const mockMessageResult = {
      originalContentUrl:
        'https://resource.more-commerce.com/production/4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0/%E0%B9%84%E0%B8%97%E0%B8%A2_4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0_1628581638965_1628581638966.jpg',
      previewImageUrl:
        'https://resource.more-commerce.com/production/4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0/%E0%B9%84%E0%B8%97%E0%B8%A2_4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0_1628581638965_1628581638966.jpg',
      type: 'image',
    };
    const validFilename = decodeFileName(mockMessageObj);
    expect(validFilename).toStrictEqual(mockMessageResult);
  });
  test('test encodefileName2', () => {
    const mockFileName2 =
      'https://resource.more-commerce.com/production/4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0/Screenshot from 2021-07-20 19-27-05_4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0_1627023809091_1627023809091.png';
    const mockMessageObj2 = {
      type: 'image',
      originalContentUrl: mockFileName2,
      previewImageUrl: mockFileName2,
    };
    const mockMessageResult2 = {
      originalContentUrl:
        'https://resource.more-commerce.com/production/4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0/Screenshot%20from%202021-07-20%2019-27-05_4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0_1627023809091_1627023809091.png',
      previewImageUrl:
        'https://resource.more-commerce.com/production/4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0/Screenshot%20from%202021-07-20%2019-27-05_4fab6ccf-45ca-4408-bc90-0a5d2f44c2e0_1627023809091_1627023809091.png',
      type: 'image',
    };
    const validFilename = decodeFileName(mockMessageObj2);
    expect(validFilename).toStrictEqual(mockMessageResult2);
  });
});

describe('transformImageURlFormat', () => {
  test('transformImageURlFormat link1', () => {
    const fullURl =
      'http://localhost:3000/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/system/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/products/1243/%E0%B9%84%E0%B8%97%E0%B8%A2%E0%B8%A3%E0%B8%B9%E0%B8%9Bxxxxxxxxxx=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx32mz1265276805283.jpg';
    const pathUrl = transformImageURlFormat(fullURl);
    const expectedResult =
      'system/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/products/1243/%E0%B9%84%E0%B8%97%E0%B8%A2%E0%B8%A3%E0%B8%B9%E0%B8%9Bxxxxxxxxxx=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx32mz1265276805283.jpg';
    expect(pathUrl).toBe(expectedResult);
  });
  test('transformImageURlFormat link2', () => {
    const fullURl =
      'http://localhost:3000/resize/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg?width=2d46c73dbcf23e99&height=74b122297b29d963';
    const pathUrl = transformImageURlFormat(fullURl);
    const expectedResult = 'assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg';
    expect(pathUrl).toBe(expectedResult);
  });

  test('transformImageURlFormat link3', () => {
    const fullURl =
      'http://localhost:3000/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg';
    const pathUrl = transformImageURlFormat(fullURl);
    const expectedResult = 'assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg';
    expect(pathUrl).toBe(expectedResult);
  });
  test('transformImageURlFormat link4', () => {
    const fullURl =
      'http://localhost:3000/resize/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/system/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/products/1243/ไทยรูปxxxxxxxxxx=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx32mz1265276805283.jpg?width=2d46c73dbcf23e99&height=74b122297b29d963';
    const pathUrl = transformImageURlFormat(fullURl);
    const expectedResult = 'system/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/products/1243/ไทยรูปxxxxxxxxxx=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx32mz1265276805283.jpg';
    expect(pathUrl).toBe(expectedResult);
  });
});

describe('transformMediaLinkString', () => {
  const subscriptionID = 'cf82c8a3-1673-4f41-bbc3-5be2455d9d4e';
  test('transformMediaLinkString link1', () => {
    const pathUrl = 'system/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/products/1243/ไทยรูปxxxxxxxxxx=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx32mz1265276805283.jpg';
    const fullUrl = transformMediaLinkString(pathUrl, environmentLib.filesServer, subscriptionID);
    const expectedResult =
      'http://localhost:3000/resize/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/system/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/products/1243/ไทยรูปxxxxxxxxxx=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx32mz1265276805283.jpg?width=2d46c73dbcf23e99&height=74b122297b29d963';
    expect(fullUrl).toBe(expectedResult);
  });
  test('transformMediaLinkString link2', () => {
    const pathUrl = 'assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg';
    const fullUrl = transformMediaLinkString(pathUrl, environmentLib.filesServer, subscriptionID, false);
    const expectedResult =
      'http://localhost:3000/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg';
    expect(fullUrl).toBe(expectedResult);
  });
  test('transformMediaLinkString link3', () => {
    const pathUrl = 'assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg';
    const fullUrl = transformMediaLinkString(pathUrl, environmentLib.filesServer, subscriptionID);
    const expectedResult =
      'http://localhost:3000/resize/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg?width=2d46c73dbcf23e99&height=74b122297b29d963';
    expect(fullUrl).toBe(expectedResult);
  });
});
