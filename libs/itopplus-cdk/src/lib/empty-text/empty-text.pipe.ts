import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyText',
})
export class EmptyTextPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    return emptyText(value);
  }
}

export const emptyText = (value: string): string => {
  if (value === null || value === undefined || value === 'null') return '';
  else return value;
};
