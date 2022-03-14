import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { mediaGalleryList } from '@reactor-room/cms-models-lib';
import { ConfirmDialogComponent, ConfirmDialogModel, ConfirmDialogType } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'cms-next-cms-layout-media-gallery-modal',
  templateUrl: './cms-layout-media-gallery-modal.component.html',
  styleUrls: ['./cms-layout-media-gallery-modal.component.scss'],
})
export class CmsLayoutMediaGalleryModalComponent implements OnInit {
  mediaGalleryList = mediaGalleryList;
  constructor(private dialogRef: MatDialogRef<CmsLayoutMediaGalleryModalComponent>, private dialog: MatDialog) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSelectMediaElement(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Change Pattern Confirm',
        content: 'Are you sure to switch to this pattern?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dialogRef.close(this.mediaGalleryList[index]);
      }
    });
  }
}
