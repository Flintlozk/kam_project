import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FocusModeService {
  private focusMode = new BehaviorSubject(false);
  private wizardMode = new BehaviorSubject(false);
  sharedFocusMode = this.focusMode.asObservable();
  sharedWizardMode = this.wizardMode.asObservable();

  constructor() {}

  setFocusMode(status: boolean): void {
    this.focusMode.next(status);
  }

  setWizardMode(status: boolean): void {
    this.wizardMode.next(status);
  }
}
