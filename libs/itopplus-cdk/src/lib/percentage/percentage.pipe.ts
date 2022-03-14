import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
})
export class PercentagePipe implements PipeTransform {
  transform(number: number, total: number): string {
    return String(Math.round((number / total) * 100));
  }
}
