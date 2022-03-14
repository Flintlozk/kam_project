import { transformResizeImageURLToNormalUrl } from './imageurl.helper';
describe('transformResizeImageURLToNormalUrl', () => {
  test('transformResizeImageURLToNormalUrl test1', () => {
    const urlResize =
      'http://localhost:3000/resize/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/system/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/products/1243/ไทยรูปxxxxxxxxxx=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx32mz1265276805283.jpg?width=2d46c73dbcf23e99&height=74b122297b29d963';
    const expectedResult =
      'http://localhost:3000/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/system/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/products/1243/%E0%B9%84%E0%B8%97%E0%B8%A2%E0%B8%A3%E0%B8%B9%E0%B8%9Bxxxxxxxxxx=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx32mz1265276805283.jpg';
    const urlNormal = transformResizeImageURLToNormalUrl(urlResize);
    expect(urlNormal).toBe(expectedResult);
  });
  test('transformResizeImageURLToNormalUrl test2', () => {
    const urlResize =
      'http://localhost:3000/resize/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg?width=2d46c73dbcf23e99&height=74b122297b29d963';
    const expectedResult =
      'http://localhost:3000/cf82c8a3-1673-4f41-bbc3-5be2455d9d4e/assets/d6a243a3-c326-4cce-b0d7-dfaa17866eb2/271760051_306607114900026_413636752089460664_n1iqtf816690721723.jpg';
    const urlNormal = transformResizeImageURLToNormalUrl(urlResize);
    expect(urlNormal).toBe(expectedResult);
  });
});
