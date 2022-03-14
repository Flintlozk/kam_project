import { Pipe, PipeTransform } from '@angular/core';
import { IUpdatedLotNumber } from '@reactor-room/itopplus-model-lib';

@Pipe({
  name: 'LotNumberPipe',
})
export class LotNumberPipe implements PipeTransform {
  transform(item: IUpdatedLotNumber, condition: string): string {
    if (condition === 'from') return `${item.prefix}${item.from} x ${item.suffix}`;
    if (condition === 'to') return `${item.prefix}${item.to} x ${item.suffix}`;
  }
}
