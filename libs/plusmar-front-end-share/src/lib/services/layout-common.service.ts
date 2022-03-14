import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutCommonService {
  private layoutWidth = new BehaviorSubject(0);
  shareLayoutWidth = this.layoutWidth.asObservable();

  private menuStatus = new BehaviorSubject(false);
  shareMenuStatus = this.menuStatus.asObservable();

  private isOutSideMenu = new BehaviorSubject(false);
  sharedIsOutSideMenu = this.isOutSideMenu.asObservable();

  toggleUILoader: Subject<boolean> = new Subject<boolean>();

  setLayoutWidth(width: number) {
    LayoutCommonService;
    this.layoutWidth.next(width);
  }

  setMenuStatus(status: boolean) {
    this.menuStatus.next(status);
  }

  setIsOutSideMenu(status: boolean) {
    this.isOutSideMenu.next(status);
  }

  startLoading() {
    this.toggleUILoader.next(true);
  }
  endLoading() {
    this.toggleUILoader.next(false);
  }

  constructor() {}
}
