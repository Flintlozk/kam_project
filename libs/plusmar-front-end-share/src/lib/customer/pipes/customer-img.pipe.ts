import { Pipe, PipeTransform } from '@angular/core';
import { environmentLib } from '@reactor-room/environment-services-frontend';

@Pipe({
  name: 'customerImg',
})
export class CustomerImgPipe implements PipeTransform {
  transform(value: string, base64String?: string): string {
    if (base64String) {
      return base64String;
    } else {
      return environmentLib.backendUrl + '/images/' + value + '.jpg';
    }
  }
}
