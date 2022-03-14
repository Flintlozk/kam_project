import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProductAttributeErrorMessageType, IProductVariantErrorMessageType, IValidationMessage } from '@reactor-room/cms-models-lib';
import { validationMessages } from './validation-messages';
import { getFormErrorMessages } from '@reactor-room/cms-frontend-helpers-lib';
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent } from '@reactor-room/itopplus-cdk';
import { StatusDialogModel, StatusDialogType } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'cms-next-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  productData = {
    title: 'Michale Korns Michale Korns Michale Korns',
    attributeNumber: 2,
  };

  formAttributeErrorMessage = [] as IProductAttributeErrorMessageType[];
  formVariantErrorMessage = [];

  validationMessages = validationMessages as IValidationMessage[];

  productDetailsForm: FormGroup;

  constructor(private _location: Location, private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.productDetailsForm = this.getProductDetailsFormGroup();
  }

  onBack(): void {
    this._location.back();
  }

  onSave(): void {
    this.formAttributeErrorMessage = [];
    this.formVariantErrorMessage = [];
    if (this.productDetailsForm.valid) {
      this.dialog.open(StatusDialogComponent, {
        data: {
          type: StatusDialogType.SUCCESS,
          title: 'Saved!',
          content: 'Product has been updated successfully',
        } as StatusDialogModel,
      });
    } else {
      this.dialog.open(StatusDialogComponent, {
        data: {
          type: StatusDialogType.ERROR,
          title: 'Invalid!',
          content: 'Recheck all required fields before saving',
        } as StatusDialogModel,
      });
      this.showProductAttributesErrorMessage();
    }
  }

  showProductAttributesErrorMessage(): void {
    const attributesFormArray = this.productDetailsForm.get('productAttributes') as FormArray;
    attributesFormArray.controls.forEach((attributesFormArrayItem: FormGroup, attributesFormIndex) => {
      const formAttributeErrorMessageObj = getFormErrorMessages<IProductAttributeErrorMessageType>(attributesFormArrayItem, this.validationMessages);
      const formAttrErrorObj = { ...formAttributeErrorMessageObj };
      this.formAttributeErrorMessage.push(formAttrErrorObj);
      this.showProductVariantsErrorMessage(attributesFormArrayItem.get('productVariants') as FormArray, attributesFormIndex);
    });
  }

  showProductVariantsErrorMessage(productVariantFormArray: FormArray, attributeFormIndex: number): void {
    const formVariantErrorArr = [];
    productVariantFormArray.controls.forEach((variantFormArrayItem: FormGroup) => {
      const formVariantErrorMessageObj = getFormErrorMessages<IProductVariantErrorMessageType>(variantFormArrayItem, this.validationMessages);
      const formVariantErrorObj = { ...formVariantErrorMessageObj };
      formVariantErrorArr.push(formVariantErrorObj);
    });
    this.formVariantErrorMessage[attributeFormIndex] = formVariantErrorArr;
  }

  getProductDetailsFormGroup(): FormGroup {
    const productDetailsFormGroup = this.fb.group({
      productTitle: [this.productData.title, Validators.required],
      productAttributeNumber: [this.productData.attributeNumber, Validators.required],
    });
    return productDetailsFormGroup;
  }
}
