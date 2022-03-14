import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'customnumber',
})
export class CustomnumberPipe extends DecimalPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const checkNumber: boolean = Number.isNaN(value);
    if (checkNumber) {
      return new Intl.NumberFormat('th-TH').format(Number(value));
    } else {
      let decimalTransform = super.transform(value);
      if (args.indexOf('percent') != -1) {
        decimalTransform = `${decimalTransform} %`;
      } else if (args.indexOf('perDay') != -1) {
        decimalTransform = `฿${decimalTransform}/day`;
      } else if (args.indexOf('preBaht') != -1) {
        decimalTransform = `฿${decimalTransform}`;
      } else {
        decimalTransform = new Intl.NumberFormat('th-TH').format(parseInt(decimalTransform));
      }

      return decimalTransform;
    }
  }
}
