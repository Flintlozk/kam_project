import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogType } from '@reactor-room/itopplus-cdk';
import { Router } from '@angular/router';
@Injectable()
export class SettingGeneralService {
  formGroup: FormGroup;
  currentSection = 0;
  saveActionSubject = new Subject<void>();
  UnsavedSectionSubject = new Subject<string[]>();
  isTabChanging = false;
  oldIndex = 0;
  selectedCurrency = [];
  constructor(private dialog: MatDialog, private router: Router) {}

  unsavedDialog(value: string[]): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Unsaved Changes Detection',
        content: 'Please confirm to save current change',
      } as ConfirmDialogModel,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (!this.isTabChanging) {
        this.isTabChanging = true;
        const nextRoute = value;
        if (result) {
          this.saveAction();
          void this.router.navigate(nextRoute);
          setTimeout(() => {
            this.isTabChanging = false;
          }, 1000);
        } else {
          this.currentSection = this.oldIndex;
          this.isTabChanging = false;
        }
      }
    });
  }

  getUnsaveDialog(): Observable<string[]> {
    return this.UnsavedSectionSubject;
  }
  triggerUnsaveAction(nextRoute: string[]): void {
    this.UnsavedSectionSubject.next(nextRoute);
  }
  saveAction(): void {
    this.saveActionSubject.next(null);
  }
  getSaveAction(): Observable<void> {
    return this.saveActionSubject;
  }
  setCurrentSection(sectionIndex: number) {
    this.currentSection = sectionIndex;
  }
  getCurrentSection(): number {
    return this.currentSection;
  }
  setOriginalForm(form: FormGroup): void {
    this.formGroup = form;
  }
  getOriginalForm(): FormGroup {
    return this.formGroup;
  }

  dirtyStateCheck(form: any, toFinalEdit: FormGroup, concatString?: string): FormGroup {
    if (concatString === undefined || concatString === null) concatString = '';
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).dirty) {
        if (form.get(key) instanceof FormGroup) {
          this.dirtyStateCheck(form.get(key), toFinalEdit, concatString === '' ? concatString + key : concatString + '.' + key);
        } else {
          if (form.get(key) instanceof FormArray) {
            this.dirtyStateCheck(form.get(key), toFinalEdit, concatString === '' ? concatString + key : concatString + '.' + key);
          } else {
            const path = concatString + '.' + key;
            if (this.getOriginalForm().get(path) && form.get(key)) {
              if (_.isEqual(this.getOriginalForm().get(path).value, form.get(key).value)) {
                toFinalEdit.get(path).reset(form.get(key).value);
              }
            }
          }
        }
      }
    });

    return toFinalEdit;
  }

  getDirtyValues(form: any) {
    let dirtyValues = {};
    if (form instanceof FormControl) {
      if (form.dirty) {
        dirtyValues = form.value;
      }
    } else {
      Object.keys(form.controls).forEach((key) => {
        const currentControl = form.controls[key];
        if (currentControl.dirty) {
          if (currentControl.controls) {
            dirtyValues[key] = this.getDirtyValues(currentControl);
          } else {
            dirtyValues[key] = currentControl.value;
          }
        }
      });
    }

    return dirtyValues;
  }
}
