import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'limitWords' })
export class LimitWordsPipe implements PipeTransform {
  transform(text: string, limit: number): string {
    const trimmedString = text.substr(0, limit);
    return trimmedString + '...';
  }
}
