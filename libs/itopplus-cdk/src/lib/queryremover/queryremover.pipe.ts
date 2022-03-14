import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'queryRemover',
})
export class QueryRemoverPipe implements PipeTransform {
  transform(url: string): string {
    if (url && typeof url === 'string') {
      const urlFormat = new URL(url);
      if (urlFormat.hostname.search('linestorage.more-commerce.com') !== -1) {
        urlFormat.search = '';
        return urlFormat.href;
      }
      return urlFormat.href;
    } else {
      return null;
    }
  }
}
