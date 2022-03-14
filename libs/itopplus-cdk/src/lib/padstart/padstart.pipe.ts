import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padstart',
})
export class PadstartPipe implements PipeTransform {
  transform(value: number): string {
    return String(Math.abs(value)).padStart(2, '0');
  }
}
