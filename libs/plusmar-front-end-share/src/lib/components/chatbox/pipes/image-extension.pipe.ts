import { Pipe, PipeTransform } from '@angular/core';

import { Image } from '@reactor-room/itopplus-model-lib';
@Pipe({
  name: 'imageExtesnion',
})
export class ImageExtensionPipe implements PipeTransform {
  transform(image: Image): string {
    switch (image.extension.toLowerCase()) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        return image.url;
      case 'pdf':
        return 'assets/img/shortcut/pdf-icon.svg';
      case 'docx':
        return 'assets/img/shortcut/docx-icon.svg';
      case 'ppt':
        return 'assets/img/shortcut/ppt-icon.svg';
      case 'zip':
        return 'assets/img/shortcut/zip-icon.svg';
      case 'xlsx':
        return 'assets/img/shortcut/xlsx-icon.svg';
      default:
        return 'assets/img/shortcut/other-icon.svg';
    }
  }
}
