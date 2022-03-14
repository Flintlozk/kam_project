import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EBackground, EMediaSources, IDialogData } from '@reactor-room/cms-models-lib';
import { IFile } from '@reactor-room/itopplus-model-lib';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';

@Component({
  selector: 'cms-next-cms-media-modal',
  templateUrl: './cms-media-modal.component.html',
  styleUrls: ['./cms-media-modal.component.scss'],
})
export class CmsMediaModalComponent implements OnInit {
  isSingleAction = false;
  currentMediaSource = EMediaSources.UPLOAD;
  EMediaSources = EMediaSources;
  selectedMediaList: IFile[] = [];
  selectedMedia: IFile;
  constructor(private dialogRef: MatDialogRef<CmsMediaModalComponent>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: IDialogData) {
    if (this.data?.message === EBackground.IMAGE || this.data?.message === EBackground.VIDEO) {
      this.isSingleAction = true;
    } else {
      this.isSingleAction = false;
    }
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedMediaListEvent(event: IFile[]): void {
    this.selectedMediaList = event;
  }

  selectedMediaEvent(event: IFile): void {
    this.selectedMedia = event;
  }

  currentMediaSourceEvent(event: EMediaSources): void {
    this.currentMediaSource = event;
  }

  onAddMediaToPage(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Update Media Gallery Confirmation',
        content: 'Are you sure to change the media?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dialogRef.close(this.selectedMediaList);
      }
    });
  }

  onSetMediaToPage(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Set Media Confirmation',
        content: 'Are you sure to set this media?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dialogRef.close(this.selectedMedia);
      }
    });
  }
}
