import { compaireEmailAllSystem } from './auth.domain';
describe('Auth Domain Test', () => {
  test('compairEmail Test True Condition', () => {
    expect(compaireEmailAllSystem('tonmanna@gmail.com', 'test@gmail.com', 'tonmanna@gmail.com')).toEqual(true);
    expect(compaireEmailAllSystem('tonmanna@gmail.com', 'test@gmail.com', 'test@gmail.com')).toEqual(true);
    expect(compaireEmailAllSystem('tonmanna@gmail.com', 'tonmanna@gmail.com', 'tonmanna@gmail.com')).toEqual(true);
    expect(compaireEmailAllSystem('tonmanna@gmail.com', '', 'tonmanna@gmail.com')).toEqual(true);
    expect(compaireEmailAllSystem('', 'tonmanna@gmail.com', 'tonmanna@gmail.com')).toEqual(true);
  });

  test('compairEmail Test False Condition', () => {
    expect(compaireEmailAllSystem('tonmanna@gmail.com', 'test@gmail.com', 'todayisagood@gmail.com')).toEqual(false);
    expect(compaireEmailAllSystem('', '', '')).toEqual(false);
    expect(compaireEmailAllSystem('', '', 'todayisagood@gmail.com')).toEqual(false);
    expect(compaireEmailAllSystem(undefined, '', undefined)).toEqual(false);
    expect(compaireEmailAllSystem(undefined, null, null)).toEqual(false);
  });
});
