import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EPreviewMode } from '../shared/cms-preview.model';

@Injectable({
  providedIn: 'root',
})
export class CmsPreviewService {
  private isPreviewMode = new BehaviorSubject(false);
  getIsPreviewMode = this.isPreviewMode.asObservable();

  private previewMode = new BehaviorSubject(EPreviewMode.DESKTOP);
  getPreviewMode = this.previewMode.asObservable();

  private previewElementRef = new BehaviorSubject(null);
  getPreviewElementRef = this.previewElementRef.asObservable();

  constructor() {}

  updateIsPreviewMode(status: boolean): void {
    this.isPreviewMode.next(status);
  }

  updatePreviewMode(mode: EPreviewMode): void {
    this.previewMode.next(mode);
  }

  updatePreviewElementRef(elementRef: ElementRef): void {
    this.previewElementRef.next(elementRef);
  }
}
