import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogModel, ConfirmDialogType } from '@reactor-room/itopplus-cdk';
import { FadeAnimate } from '@reactor-room/animation';
import { ProductImagesDialogComponent } from '../product-images-dialog/product-images-dialog.component';
import { IProductAttributeErrorMessageType } from '@reactor-room/cms-models-lib';
import { IProductAttributesDataItem, IProductVariantSale } from './product-attributes.model';

@Component({
  selector: 'cms-next-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class ProductAttributesComponent implements OnInit {
  @Input() formAttributeErrorMessage = [] as IProductAttributeErrorMessageType[];
  @Input() formVariantErrorMessage = [];

  currencySign = '฿';
  productAttributesFormArray: FormArray;
  productDetailsForm: FormGroup;

  productStatusData = [
    {
      value: 'outofstock',
      title: 'Out of Stock',
    },
    {
      value: 'instock',
      title: 'In Stock',
    },
  ];

  productAttributesData = [
    {
      sku: 'TNF-1231',
      image: null,
      status: 'instock',
      price: 119.0,
      discount: 0.0,
      amount: 3,
      productVariants: [
        {
          title: 'TNT-White-1',
          originalPrice: 42.0,
          salePrice: 27.0,
        },
        {
          title: 'TNT-Black-2',
          originalPrice: 32.0,
          salePrice: 22.0,
        },
      ],
    },
    {
      sku: 'TNF-1232',
      image: '/assets/images/shared/product-sample.jpg',
      status: 'outofstock',
      price: 119.0,
      discount: 0.0,
      amount: 10,
      productVariants: [
        {
          title: 'TNT-White-3',
          originalPrice: 42.0,
          salePrice: 27.0,
        },
        {
          title: 'TNT-Black-4',
          originalPrice: 32.0,
          salePrice: 22.0,
        },
      ],
    },
  ] as IProductAttributesDataItem[];

  constructor(private fb: FormBuilder, private parentFormDirective: FormGroupDirective, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.productAttributesFormArray = this.getProductAttributesFormArray();
    this.patchValuesProductAttributesFormArray();

    this.productDetailsForm = this.parentFormDirective.form;
    this.productDetailsForm.addControl('productAttributes', this.productAttributesFormArray);
  }

  onImageFileManageDialog(index: number): void {
    this.productAttributesFormArray.controls[index].get('productImageStatus').patchValue(false);
    const dialogRef = this.dialog.open(ProductImagesDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const productAttributeImageItem = this.productAttributesFormArray.controls[index].get('image');
        productAttributeImageItem.patchValue(result);
        this.productAttributesFormArray.controls[index].get('productImageStatus').patchValue(false);
      } else {
        this.productAttributesFormArray.controls[index].get('productImageStatus').patchValue(true);
      }
    });
  }

  onRemoveImageAttribute(index: number): void {
    this.productAttributesFormArray.controls[index].get('productImageStatus').patchValue(false);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Delete Confirm',
        content: 'Are you sure to delete this image?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const productAttributeImageItem = this.productAttributesFormArray.controls[index].get('image');
        productAttributeImageItem.patchValue(null);
        this.productAttributesFormArray.controls[index].get('productImageStatus').patchValue(false);
      } else {
        this.productAttributesFormArray.controls[index].get('productImageStatus').patchValue(true);
      }
    });
  }

  onActiveToggleLayout(index: number): void {
    this.productAttributesFormArray.controls.forEach((productAttributesFormArrayItem) => {
      productAttributesFormArrayItem.get('productImageStatus').patchValue(false);
    });
    const productImageStatus = this.productAttributesFormArray.controls[index].get('productImageStatus');
    productImageStatus.patchValue(true);
  }

  optionToggleLayoutStatusEvent(status: boolean, index: number): void {
    const productImageStatus = this.productAttributesFormArray.controls[index].get('productImageStatus');
    productImageStatus.patchValue(status);
  }

  toggleVariantStatus(index: number): void {
    const productVariantStatus = this.productAttributesFormArray.controls[index].get('productVariantStatus');
    productVariantStatus.patchValue(!productVariantStatus.value);
  }

  substractProductAmount(index: number): void {
    let currentAmount = this.productAttributesFormArray.controls[index].get('amount').value;
    if (currentAmount <= 0) this.productAttributesFormArray.controls[index].get('amount').patchValue(0);
    else {
      currentAmount--;
      this.productAttributesFormArray.controls[index].get('amount').patchValue(currentAmount);
    }
  }

  addProductAmount(index: number): void {
    let currentAmount = this.productAttributesFormArray.controls[index].get('amount').value;
    if (currentAmount < 0) this.productAttributesFormArray.controls[index].get('amount').patchValue(0);
    else {
      currentAmount++;
      this.productAttributesFormArray.controls[index].get('amount').patchValue(currentAmount);
    }
  }

  patchValuesProductAttributesFormArray(): void {
    this.productAttributesData.forEach((productAttributesDataItem) => {
      this.productAttributesFormArray.push(this.patchValuesProductAttributesFormGroup(productAttributesDataItem));
    });
  }

  patchValuesProductAttributesFormGroup(productAttributesDataItem: IProductAttributesDataItem): FormGroup {
    const productAttributesFormGroup = this.getProductAttributesFormGroup();
    productAttributesFormGroup.get('sku').patchValue(productAttributesDataItem.sku);
    productAttributesFormGroup.get('image').patchValue(productAttributesDataItem.image);
    productAttributesFormGroup.get('status').patchValue(productAttributesDataItem.status);
    productAttributesFormGroup.get('price').patchValue(productAttributesDataItem.price);
    productAttributesFormGroup.get('discount').patchValue(productAttributesDataItem.discount);
    productAttributesFormGroup.get('amount').patchValue(productAttributesDataItem.amount);
    const productVariantsFormArray = productAttributesFormGroup.get('productVariants') as FormArray;
    this.patchValuesProductVariantsFormArray(productAttributesDataItem, productVariantsFormArray);
    return productAttributesFormGroup;
  }

  patchValuesProductVariantsFormArray(productAttributesDataItem: IProductAttributesDataItem, productVariantsFormArray: FormArray): void {
    productAttributesDataItem.productVariants.forEach((productVariantsItem) => {
      productVariantsFormArray.push(this.patchValuesProductVariantsFormGroup(productVariantsItem));
    });
  }
  patchValuesProductVariantsFormGroup(productVariantsItem: IProductVariantSale): FormGroup {
    const productVariantsFormGroup = this.getProductVariantsFormGroup();
    productVariantsFormGroup.get('title').patchValue(productVariantsItem.title);
    productVariantsFormGroup.get('originalPrice').patchValue(productVariantsItem.originalPrice);
    productVariantsFormGroup.get('salePrice').patchValue(productVariantsItem.salePrice);
    return productVariantsFormGroup;
  }

  getProductAttributesFormArray(): FormArray {
    const productAttributesFormArray = this.fb.array([]);
    return productAttributesFormArray;
  }

  getProductAttributesFormGroup(): FormGroup {
    const productAttributesFormGroup = this.fb.group({
      sku: ['', Validators.required],
      image: [''],
      status: ['', Validators.required],
      price: [0.0, Validators.required],
      discount: [0.0, Validators.required],
      amount: [0, Validators.required],
      productVariants: this.getProductVariantsFormArray(),
      productVariantStatus: false,
      productImageStatus: false,
    });
    return productAttributesFormGroup;
  }

  getProductVariantsFormArray(): FormArray {
    const productsAttributesFormArray = this.fb.array([]);
    return productsAttributesFormArray;
  }

  getProductVariantsFormGroup(): FormGroup {
    const productVariantsFormGroup = this.fb.group({
      title: ['', Validators.required],
      originalPrice: ['', Validators.required],
      salePrice: ['', Validators.required],
    });
    return productVariantsFormGroup;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
