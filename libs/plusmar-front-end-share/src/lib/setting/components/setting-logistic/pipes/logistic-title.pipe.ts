import { Pipe, PipeTransform } from '@angular/core';
import { EnumLogisticType } from '@reactor-room/itopplus-model-lib';

@Pipe({
  name: 'logisticTitle',
})
export class LogisticTitle implements PipeTransform {
  transform(type: EnumLogisticType, name: string): string {
    switch (type) {
      case 'DOMESTIC_INTERNATIONAL':
        return name + ' (Domestic & International)';
        break;
      case 'DOMESTIC':
        return name + ' (Domestic)';
        break;
      case 'INTERNATIONAL':
        return name + ' (International)';
        break;
      default:
        return name;
        break;
    }
  }
}
