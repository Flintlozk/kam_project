import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { IFileUpload } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-next-cms-media-info',
  templateUrl: './cms-media-info.component.html',
  styleUrls: ['./cms-media-info.component.scss'],
})
export class CmsMediaInfoComponent implements OnInit, OnDestroy {
  data: IFileUpload;
  mediaInfo: FormGroup;
  destroy$ = new Subject();
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  constructor(
    private dialogRef: MatDialogRef<CmsMediaInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: IFileUpload,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.data = this.dialogData;
    this.mediaInfo = this.getMediaInfoForm();
    this.mediaInfo.patchValue(this.data);
  }

  ngOnInit(): void {}

  tagsEvent(event: string[]): void {
    this.data.tags = event;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getMediaInfoForm(): FormGroup {
    const formGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    return formGroup;
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    this.data.name = this.mediaInfo.get('name').value;
    this.data.description = this.mediaInfo.get('description').value;
    if (this.mediaInfo.valid) this.dialogRef.close(this.data);
    else {
      this.snackBar.openFromComponent(StatusSnackbarComponent, {
        data: {
          type: StatusSnackbarType.ERROR,
          message: 'Please Check All Required Fields',
        } as StatusSnackbarModel,
      });
    }
  }
}
