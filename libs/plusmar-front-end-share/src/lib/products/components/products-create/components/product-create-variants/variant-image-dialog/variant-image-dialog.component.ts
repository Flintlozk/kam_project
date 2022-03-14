import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { IMoreImageUrlResponse } from '@reactor-room/model-lib';

@Component({
  selector: 'reactor-room-variant-image-dialog',
  templateUrl: './variant-image-dialog.component.html',
  styleUrls: ['./variant-image-dialog.component.scss'],
})
export class VariantImageDialogComponent implements OnInit {
  imageLimitSize = 2097152;
  isVariantImageLengthError = false;
  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<VariantImageDialogComponent>, @Inject(MAT_DIALOG_DATA) private indexDataFromParent) {}
  variantImages = [] as IMoreImageUrlResponse[];

  ngOnInit(): void {
    const { images } = this.indexDataFromParent;
    if (images?.length > 0) {
      images.map((item) => this.variantImages.push(item));
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSaveImages() {
    this.dialogRef.close({ variantIndex: this.indexDataFromParent.index, variantImages: this.variantImages });
  }

  clearVariantPicture(i: number) {
    this.variantImages.splice(i, 1);
    this.setImageError();
  }

  onFileChange(event) {
    const files = event.target.files;
    const productBigSizeImages = [] as Array<string>;
    if (files.length) {
      for (const file of files) {
        if (file.size > this.imageLimitSize) {
          productBigSizeImages.push(file.name);
          continue;
        }
        const reader = new FileReader();
        (reader.onload = (e: any) => {
          this.variantImages.push({
            file,
            url: e.target.result,
          });
        }),
          (reader.onloadend = () => {
            this.setImageError();
          });

        reader.readAsDataURL(file);
      }
    }
    this.generateBigSizeImagesError(productBigSizeImages);
  }

  setImageError(): void {
    if (this.variantImages?.length > 5) {
      this.isVariantImageLengthError = true;
    } else {
      this.isVariantImageLengthError = false;
    }
  }

  generateBigSizeImagesError(bigImages: Array<string>) {
    if (bigImages?.length > 0) {
      let displayHTML = '<div> <ul class="response-list">';
      bigImages.forEach((image) => {
        displayHTML += `<li class="error-item"> ${image} cannot be uploaded. Image size is more than 2 MB </li>`;
      });
      this.openSuccessDialog({ text: displayHTML, title: 'Error Uploading Some Images' }, true);
    }
  }
  openSuccessDialog(message, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: isError,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }
}
