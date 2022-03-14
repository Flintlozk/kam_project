import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderId',
})
export class OrderIdPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    const orderIdLength = value.toString().length;
    const model = 'OR-0000000000';
    return model.substr(0, model.length - orderIdLength) + value;
  }
}
