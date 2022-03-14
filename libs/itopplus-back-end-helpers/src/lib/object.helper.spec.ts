import { removeUndefinedFromArray } from './object.helper';
describe('Object Helper ', () => {
  it('removeEmptyStringAndArray remove undefine and null ', () => {
    const tempObject = ['1', 2, null, 'xxx', '111', undefined];
    const expectedObject = ['1', 2, null, 'xxx', '111'];
    expect(removeUndefinedFromArray(tempObject)).toEqual(expectedObject);
  });

  it('removeEmptyStringAndArray remove undefine and null more item ', () => {
    const tempObject = ['1', 2, null, 5, 4, 'xxx', '111', undefined];
    const expectedObject = ['1', 2, null, 5, 4, 'xxx', '111'];
    expect(removeUndefinedFromArray(tempObject)).toEqual(expectedObject);
  });

  it('removeEmptyStringAndArray all null and undefined', () => {
    const tempObject = [null, null, null, undefined];
    const expectedObject = [null, null, null];
    expect(removeUndefinedFromArray(tempObject)).toEqual(expectedObject);
  });
});
