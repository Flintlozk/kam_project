import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent } from '@reactor-room/itopplus-cdk';
import { StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'cms-next-product-images-dialog',
  templateUrl: './product-images-dialog.component.html',
  styleUrls: ['./product-images-dialog.component.scss'],
})
export class ProductImagesDialogComponent implements OnInit {
  imagesData = [
    { imageData: '/assets/images/shared/product-sample.jpg', activeStatus: false },
    { imageData: '/assets/images/shared/product-sample.jpg', activeStatus: false },
    { imageData: '/assets/images/shared/product-sample.jpg', activeStatus: false },
    { imageData: '/assets/images/shared/product-sample.jpg', activeStatus: false },
    { imageData: '/assets/images/shared/product-sample.jpg', activeStatus: false },
    { imageData: '/assets/images/shared/product-sample.jpg', activeStatus: false },
    { imageData: '/assets/images/shared/product-sample.jpg', activeStatus: false },
    { imageData: '/assets/images/shared/product-sample.jpg', activeStatus: false },
    { imageData: '/assets/images/shared/product-sample.jpg', activeStatus: false },
  ];

  constructor(private dialogRef: MatDialogRef<ProductImagesDialogComponent>, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  onSelectImageItem(index: number): void {
    this.imagesData.forEach((item) => {
      item.activeStatus = false;
    });
    this.imagesData[index].activeStatus = true;
    this.scrolltoItem(index);
  }

  scrolltoItem(index: number): void {
    const mainContainer = document.getElementById('images-dialog-container') as HTMLElement;
    const mainImageItem = document.getElementById('image-dialog-item' + index) as HTMLElement;
    if (mainContainer) mainContainer.scrollTop = mainImageItem.offsetTop - mainImageItem.offsetHeight - 60;
  }

  onConfirmSelection(): void {
    const itemSelected = this.imagesData.find((item) => item.activeStatus === true);
    if (itemSelected) {
      this.dialogRef.close(itemSelected.imageData);
    } else {
      this.onNoItemSelectionNotification();
    }
  }

  onCancelSelection(): void {
    this.dialogRef.close();
  }

  trackByIndex(index: number): number {
    return index;
  }

  onNoItemSelectionNotification(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.WARNING,
        message: 'Please select an image!',
      } as StatusSnackbarModel,
    });
  }
}
