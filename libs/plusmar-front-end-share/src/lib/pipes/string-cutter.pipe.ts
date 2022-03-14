import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringCutter',
})
export class StringCutterPipe implements PipeTransform {
  transform(value: string, index: number, limit: number): string {
    if (!limit) limit = 1;
    const spitString = value.split(',');
    const uniq = [...new Set(spitString)];
    if (index > limit) {
      const sliceString = uniq.slice(0, limit);
      return sliceString.join(',') + ` (more+${index - limit})`;
    } else {
      return uniq.join(',');
    }
  }
}
