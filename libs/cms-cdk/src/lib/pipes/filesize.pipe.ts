import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filesize' })
export class FileSizePipe implements PipeTransform {
  transform(size: number): string {
    try {
      if (size >= Math.pow(1024, 3)) return +(size / Math.pow(1024, 3)).toFixed(2) + 'GB';
      if (size >= Math.pow(1024, 2)) return +(size / Math.pow(1024, 2)).toFixed(2) + 'MB';
      if (size >= 1024) return +(size / 1024).toFixed(2) + 'KB';
      return size + 'B';
    } catch (error) {
      return '0MB';
    }
  }
}
