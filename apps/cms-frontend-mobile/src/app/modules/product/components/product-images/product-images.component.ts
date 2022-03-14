import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogType } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk';
import { ProductImagesDialogComponent } from '../product-images-dialog/product-images-dialog.component';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'cms-next-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class ProductImagesComponent implements OnInit {
  productDetailsForm: FormGroup;

  imagesData = [
    { imageData: '/assets/images/shared/product-sample.jpg' },
    { imageData: '/assets/images/shared/product-sample.jpg' },
    { imageData: '/assets/images/shared/product-sample.jpg' },
    { imageData: '/assets/images/shared/product-sample.jpg' },
    { imageData: '/assets/images/shared/product-sample.jpg' },
    { imageData: '/assets/images/shared/product-sample.jpg' },
    { imageData: '/assets/images/shared/product-sample.jpg' },
    { imageData: '/assets/images/shared/product-sample.jpg' },
  ];

  imageDataFormArray: FormArray;

  optionToggleLayoutStatus = false;

  constructor(private dialog: MatDialog, private fb: FormBuilder, private parentFormDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.imageDataFormArray = this.getImageDataFormArray();
    this.productDetailsForm = this.parentFormDirective.form;
    this.fetchImageDataToFormArray();
    this.productDetailsForm.addControl('productImages', this.imageDataFormArray);
  }

  getImageDataFormArray(): FormArray {
    const imageDataFormArrayData = this.fb.array([]);
    return imageDataFormArrayData;
  }

  getImageDataItemFormGroup(): FormGroup {
    const imageDataItemFormGroup = this.fb.group({
      imageData: ['', Validators.required],
      activeStatus: [false],
    });
    return imageDataItemFormGroup;
  }

  fetchImageDataToFormArray(): void {
    this.imagesData.forEach((image, index) => {
      const imageDataItemFormGroup = this.getImageDataItemFormGroup();
      imageDataItemFormGroup.get('imageData').patchValue(image.imageData);
      if (index === 0) imageDataItemFormGroup.get('activeStatus').patchValue(true);
      else imageDataItemFormGroup.get('activeStatus').patchValue(false);
      this.imageDataFormArray.push(imageDataItemFormGroup);
    });
  }

  activeImageDataItem(index: number): void {
    this.imageDataFormArray.controls.forEach((item) => {
      item.get('activeStatus').patchValue(false);
    });
    this.imageDataFormArray.controls[index].get('activeStatus').patchValue(true);
    this.scrolltoItem(index);
  }

  scrolltoItem(index: number): void {
    const mainContainer = document.getElementById('main-container') as HTMLElement;
    const subContainer = document.getElementById('sub-container') as HTMLElement;
    const mainImageItem = document.getElementById('mainImage' + index) as HTMLElement;
    const subImageItem = document.getElementById('subImage' + index) as HTMLElement;
    if (mainContainer) mainContainer.scrollLeft = mainImageItem.offsetLeft - 60;
    if (subContainer) subContainer.scrollLeft = subImageItem.offsetLeft - 60;
  }

  onActiveToggleLayout(): void {
    this.optionToggleLayoutStatus = true;
  }
  optionToggleLayoutStatusEvent(status: boolean): void {
    this.optionToggleLayoutStatus = status;
  }

  trackByIndex(index: number): number {
    return index;
  }

  onImageFileManageDialog(): void {
    this.optionToggleLayoutStatus = false;
    const dialogRef = this.dialog.open(ProductImagesDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const imageDataItemFormGroup = this.getImageDataItemFormGroup();
        imageDataItemFormGroup.get('imageData').patchValue(result);
        imageDataItemFormGroup.get('activeStatus').patchValue(false);
        this.imageDataFormArray.push(imageDataItemFormGroup);
        this.optionToggleLayoutStatus = false;
      } else {
        this.optionToggleLayoutStatus = true;
      }
    });
  }

  onRemoveImageConfirmDialog(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Delete Confirm',
        content: 'Are you sure to delete this image?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.imageDataFormArray.removeAt(index);
      }
    });
  }
}
