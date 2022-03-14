import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'arrayOfLength' })
export class ArrayOfLengthPipe implements PipeTransform {
  transform(value: number): number[] {
    const res = [];
    for (let i = 0; i < value; i++) {
      res.push(i);
    }
    return res;
  }
}
