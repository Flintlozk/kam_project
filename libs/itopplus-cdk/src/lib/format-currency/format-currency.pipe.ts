import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency',
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: string | number): string {
    return new Intl.NumberFormat('th-TH').format(Number(value));
  }
}
