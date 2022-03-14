import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number, currency = 'THB', code = 'th-TH'): string {
    const checkNumber: boolean = isNaN(value);
    if (checkNumber) {
      return String(value);
    } else {
      return Intl.NumberFormat(code, { style: 'currency', currency: currency }).format(value);
    }
  }
}
