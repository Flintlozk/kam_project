import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'currency',
})
export class CurrencyPipe extends DecimalPipe implements PipeTransform {
  transform(value: any, currency = 'THB', code = 'th-TH', ...args: any[]): any {
    const checkNumber: boolean = isNaN(value);
    if (checkNumber) {
      return value;
    } else {
      return Intl.NumberFormat(code, { style: 'currency', currency: currency }).format(value);
    }
  }
}
