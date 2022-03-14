import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTrim',
})
export class TextTrimPipe implements PipeTransform {
  transform(text: string, length: number): string {
    if (text?.length > length) return text.substr(0, length - 3) + '...';
    else return text;
  }
}
