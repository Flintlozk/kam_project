import { Pipe, PipeTransform } from '@angular/core';
import { urlify } from '@reactor-room/itopplus-front-end-helpers';

@Pipe({
  name: 'urlify',
})
export class UrlifyPipe implements PipeTransform {
  transform(value: string): unknown {
    return urlify(value);
  }
}
