import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generateFilePreview',
})
export class GenerateFilePreviewPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    try {
      const params = value.split('?');
      const filePath = params[0].split('/');
      const fileName = filePath[filePath.length - 1];
      return decodeURI(fileName);
    } catch (err) {
      return 'File uploading .....';
    }
  }
}
