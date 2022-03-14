import { Injectable } from '@angular/core';
import { ECmsEditRenderingMode } from '@reactor-room/cms-models-lib';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CmsEditRenderingService {
  private rederdingMode = new BehaviorSubject(ECmsEditRenderingMode.SITE_MANAGE);
  getRenderingMode = this.rederdingMode.asObservable();

  constructor() {}

  setRenderingMode(mode: ECmsEditRenderingMode): void {
    this.rederdingMode.next(mode);
  }
}
