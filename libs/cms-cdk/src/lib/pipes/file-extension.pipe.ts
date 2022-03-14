import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileExtension' })
export class FileExtensionPipe implements PipeTransform {
  transform(extension: string, type?: string): boolean {
    try {
      if (type === 'image' || !type) {
        switch (extension.toLowerCase()) {
          case 'jpg':
          case 'jpeg':
          case 'gif':
          case 'png':
            return true;
          default:
            return false;
        }
      } else if (type === 'video') {
        switch (extension) {
          case 'mp4':
            return true;
          default:
            return false;
        }
      }
    } catch (error) {
      return false;
    }
  }
}
