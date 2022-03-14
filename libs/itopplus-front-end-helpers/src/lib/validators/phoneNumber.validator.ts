import { ValidatorFn } from '@angular/forms';

export class PhoneNumberValidators {
  public static phoneInitial(): ValidatorFn {
    return (c: { value: string }): { [key: string]: boolean } | null => {
      const { value } = c;
      if (value === '' || value === null) {
        return;
      } else {
        return PhoneNumberValidators.validatePhone(value);
      }
    };
  }

  public static validatePhone(value: string): { phoneinit: boolean } | null {
    const regExp = new RegExp('^[0-9]+$');
    if (!regExp.test(value)) return { phoneinit: true };
    if (value !== null && value.length >= 9) {
      const firstDigit = value.substring(0, 1);
      const infrontNumber = value.substring(0, 2);
      const isHomeNumber = infrontNumber === '02' || infrontNumber === '03' || infrontNumber === '04' || infrontNumber === '05' || infrontNumber === '07';
      const checkLength = value.replace(/[^0-9]/g, '').length;
      if (isHomeNumber) {
        if (checkLength === 9) {
          return null;
        } else {
          return { phoneinit: true };
        }
      } else {
        if (checkLength === 10 && +firstDigit === 0) {
          return null;
        } else {
          return { phoneinit: true };
        }
      }
    } else {
      return { phoneinit: true };
    }
  }
}

export const validatePhone = (value: string): boolean => {
  const regExp = new RegExp('^[0-9]+$');
  if (!regExp.test(value)) return false;
  if (value !== null && value.length >= 9) {
    const firstDigit = value.substring(0, 1);
    const infrontNumber = value.substring(0, 2);
    const isHomeNumber = infrontNumber === '02' || infrontNumber === '03' || infrontNumber === '04' || infrontNumber === '05' || infrontNumber === '07';
    const checkLength = value.replace(/[^0-9]/g, '').length;
    if (isHomeNumber) {
      if (checkLength === 9) {
        return true;
      } else {
        return false;
      }
    } else {
      if (checkLength === 10 && +firstDigit === 0) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};
