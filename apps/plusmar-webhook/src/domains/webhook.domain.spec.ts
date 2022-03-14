import { WebHookHelpers } from './webhook.domain';
describe('Entry Checker', () => {
  it('Domain for webhook Entry', () => {
    const wh = new WebHookHelpers();
    const mock = {
      entry: [
        {
          _id: '6213064bc90a35989c53ff4d',
          mid: null,
        },
      ],
    };
    const result = wh.geteEntryMessage(mock);
    expect(result).toEqual(true);
  });
  it('Domain for webhook Entry false', () => {
    const wh = new WebHookHelpers();
    const mock = {
      entry: [],
    };
    const result = wh.geteEntryMessage(mock);
    expect(result).toEqual(false);
  });
  it('Domain for webhook Entry entry false', () => {
    const wh = new WebHookHelpers();
    const mock = {
      entry: undefined,
    };
    const result = wh.geteEntryMessage(mock);
    expect(result).toEqual(false);
  });
  it('Domain for webhook Entry webhook false', () => {
    const wh = new WebHookHelpers();
    const mock = undefined;
    const result = wh.geteEntryMessage(mock);
    expect(result).toEqual(false);
  });
});
