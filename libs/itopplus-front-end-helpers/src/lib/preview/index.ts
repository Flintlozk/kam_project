import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageHelper {
  constructor() {}

  preview(file: File, defaultPath: string): Observable<string> {
    return new Observable<string>((observer) => {
      const mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        observer.next(defaultPath);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        observer.next(reader.result.toString());
      };
    });
  }
}
