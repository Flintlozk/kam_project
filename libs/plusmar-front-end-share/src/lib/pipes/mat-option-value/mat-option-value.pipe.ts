import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matOptionValue',
})
export class MatOptionValuePipe implements PipeTransform {
  transform(value: unknown, arg: string): unknown {
    return value[arg] === true;
  }
}
