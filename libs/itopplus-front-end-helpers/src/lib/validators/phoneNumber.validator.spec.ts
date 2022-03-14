import { PhoneNumberValidators } from './phoneNumber.validator';

describe('phoneInitial : mobile phone', () => {
  test('case pass with 10 number ', () => {
    const phoneNumber = '0999999999';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toBe(null);
  });

  test('case pass with 10 number and - ', () => {
    const phoneNumber = '099-9999999';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });

  test('case fail:  9 number ', () => {
    const phoneNumber = '099999999';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });

  test('case fail:  11 number ', () => {
    const phoneNumber = '00099999999';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });

  test('case fail: 10 character ', () => {
    const phoneNumber = 'helloworld';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });

  test('case fail: 11 character ', () => {
    const phoneNumber = 'helloworld!';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });

  test('case fail: 10 character and number ', () => {
    const phoneNumber = 'hello01234';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });
});

describe('phoneInitial : home phone number', () => {
  test('case pass with 9 numbers', () => {
    const phoneNumber = '053666666';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toBe(null);
  });

  test('case fail:  10 number ', () => {
    const phoneNumber = '0599999999';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });

  test('case fail:  11 number ', () => {
    const phoneNumber = '05099999999';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });

  test('case fail: 9 character and number ', () => {
    const phoneNumber = '05hell012';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });
});

describe('phoneInitial : not phone number', () => {
  test('case fail: null', () => {
    const phoneNumber = null;
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });

  test('case fail: lenght less than 9', () => {
    const phoneNumber = '01234567';
    const validate = PhoneNumberValidators.validatePhone(phoneNumber);
    expect(validate).toStrictEqual({ phoneinit: true });
  });
});
