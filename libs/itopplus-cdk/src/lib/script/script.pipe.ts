import { Pipe, PipeTransform } from '@angular/core';
import { checkScript } from '@reactor-room/itopplus-front-end-helpers';

@Pipe({
  name: 'script',
})
export class ScriptPipe implements PipeTransform {
  transform(value: string): boolean {
    return checkScript(value);
  }
}
