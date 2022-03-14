import { FormArrayValidators } from './formarray.validator';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

describe('FormArrayValidators', () => {
  describe('minLengthArray(2)', () => {
    const validator = FormArrayValidators.minLengthArray(2);
    test('should return null when using with formControl', () => {
      const control = new FormControl();
      const validate = validator(control);
      expect(validate).toBeUndefined();
    });
    test('should return null when using with formGroup', () => {
      const group = new FormGroup({});
      const validate = validator(group);
      expect(validate).toBeUndefined();
    });
    test('should pass validate when formArray including 2 controls', () => {
      const array = new FormArray([new FormControl(), new FormControl()]);
      const validate = validator(array);
      expect(validate).toBe(null);
    });

    test('should fail validate when formArray including 1 controls', () => {
      const array = new FormArray([new FormControl()]);
      const validate = validator(array)?.minLengthArray;
      expect(validate).toBe(true);
    });
  });
  describe('maxLengthArray(2)', () => {
    const validator = FormArrayValidators.maxLengthArray(2);
    test('should return null when using with formControl', () => {
      const control = new FormControl();
      const validate = validator(control);
      expect(validate).toBeUndefined();
    });
    test('should return null when using with formGroup', () => {
      const group = new FormGroup({});
      const validate = validator(group);
      expect(validate).toBeUndefined();
    });
    test('should pass validate when formArray including 2 controls', () => {
      const array = new FormArray([new FormControl(), new FormControl()]);
      const validate = validator(array);
      expect(validate).toBe(null);
    });

    test('should pass validate when formArray including 3 controls', () => {
      const array = new FormArray([new FormControl(), new FormControl(), new FormControl()]);
      const validate = validator(array)?.maxArrayLength;
      expect(validate).toBe(true);
    });
  });
});
