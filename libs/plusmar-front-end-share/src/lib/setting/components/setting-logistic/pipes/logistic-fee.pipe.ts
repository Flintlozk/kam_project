import { Pipe, PipeTransform } from '@angular/core';
import { EnumLogisticFeeType } from '@reactor-room/itopplus-model-lib';

@Pipe({
  name: 'logisticFee',
})
export class LogisticFee implements PipeTransform {
  transform(type: EnumLogisticFeeType, cod: boolean): string {
    switch (type) {
      case 'FREE':
        if (cod) return 'Offer free shipping / ฟรีค่าจัดส่ง' + ' (COD)';
        else return 'Offer free shipping / ฟรีค่าจัดส่ง';
        break;
      case 'FLAT_RATE':
        if (cod) return 'Flat rate shipping /กำหนดราคาจัดส่งตายตัว' + ' (COD)';
        else return 'Flat rate shipping / กำหนดราคาจัดส่งตายตัว';
        break;
      default:
        return 'Offer free shipping / ฟรีค่าจัดส่ง';
        break;
    }
  }
}
