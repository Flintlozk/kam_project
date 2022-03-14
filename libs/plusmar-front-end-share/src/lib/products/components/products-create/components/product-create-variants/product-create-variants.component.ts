import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CrudType } from '@reactor-room/crm-models-lib';
import {
  INameIDPair,
  IProductAttributeForm,
  IProductAttributeFormProcessResult,
  IProductVariant,
  IVariantsOfProductByID,
  ProductRouteTypes,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { CRUD_MODE } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { generateVariants } from '@reactor-room/plusmar-front-end-helpers';
import { IDropDown, ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { forOwn } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { ProductsAttributesDialogComponent } from '../../../products-attributes-dialog/products-attributes-dialog.component';

import { SKUExistsValidator } from './sku-exists.validator';
import { VariantImageDialogComponent } from './variant-image-dialog/variant-image-dialog.component';
import { validationMessages } from './variant-validation';
import { isEmpty } from '@reactor-room/itopplus-front-end-helpers';

function skuSpecialCharValidation(): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    const regex = /^[a-zA-Z0-9-_/]+$/;
    const strValue = c.value;
    if (strValue?.search(regex) === -1) {
      return { skuSpecialChar: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'reactor-room-product-create-variants',
  templateUrl: './product-create-variants.component.html',
  styleUrls: ['./product-create-variants.component.scss'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class ProductCreateVariantsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() productStatus: IDropDown[];
  @Input() patchVariantData: IVariantsOfProductByID[];
  @Input() formMode: string;
  @Input() productID: number;
  @Input() isAddingVariants = false;
  @Input() isMultipleVariants = false;

  rawVariantData = [] as IProductAttributeForm[];
  variantsData = [] as INameIDPair[][];
  variantForm: FormGroup;
  storedAttributeData: { attributes: IProductAttributeForm[] };
  noDataMessage = 'To create Product Variants, Please click Attribute button ';
  inventoryValue = [] as Array<number>;
  private validationMessages = validationMessages;
  unitPriceValidationMessage = [] as Array<string>;
  statusValidationMessage = [] as Array<string>;
  skuValidationMessage = [] as Array<string>;
  inventoryValidationMessage = [] as Array<string>;
  parentForm: FormGroup;
  clearVariantSubscription: Subscription;
  ////:: marketplace functionality commenting now
  //marketPlaceIconObj = this.productMarketPlaceService.marketPlaceIconObj;
  marketPlaceTypes = SocialTypes;
  tableHeader: ITableHeader[] = [
    { sort: false, title: this.translate.instant('Image'), key: null },
    ////:: marketplace functionality commenting now
    //{ sort: false, title: this.translate.instant('MarketPlace'), key: null },
    { sort: false, title: this.translate.instant('SKU'), key: null },
    { sort: false, title: this.translate.instant('Unit Price'), key: null },
    { sort: false, title: this.translate.instant('Inventory'), key: null },
    { sort: false, title: this.translate.instant('Withhold'), key: null },
    { sort: false, title: this.translate.instant('Status'), key: null },
  ];
  tableColSpan = this.tableHeader.length;
  destroy$ = new Subject();

  get variantsFormArray(): FormArray {
    return this.variantForm.controls.variants as FormArray;
  }

  get variantImageFormArray(): FormArray {
    return this.variantForm.get('variants') as FormArray;
  }

  constructor(
    private dialog: MatDialog,
    private productCommonService: ProductCommonService,
    private skuExistValidator: SKUExistsValidator,
    private variantFormBuilder: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private translate: TranslateService,
    ////:: marketplace functionality commenting now
    //private productMarketPlaceService: ProductMarketPlaceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.parentForm = this.parentFormDirective.form;
    this.generateEmptyVariant();
    if (this.isAddingVariants) {
      this.variantsFormArray.clear();
    }
    this.subscribeToEvents();
  }

  subscribeToEvents(): void {
    this.productCommonService.getIsProductSaveClicked
      .pipe(
        takeUntil(this.destroy$),
        tap((value) => {
          if (value) {
            this.initiateVariantFormValidation();
          }
        }),
      )
      .subscribe();

    this.productCommonService.productAddVariantProcessAttribute$
      .pipe(
        takeUntil(this.destroy$),
        tap((attribForm) => {
          if (!isEmpty(attribForm)) this.processAttributes(attribForm);
        }),
      )
      .subscribe();
  }

  initiateVariantFormValidation(): void {
    this.validateSKUUnique();
    const variantFormArray = this.parentForm.get('variants') as FormArray;
    variantFormArray.controls.map((formArrayItem, i) => {
      const formGroup = formArrayItem as FormGroup;
      forOwn(formGroup.controls, (control, key) => {
        this.setErrorMessageOnSubmit(control, key, i);
      });
    });
  }

  validateSKUUnique(): void {
    const variantFormArray = this.parentForm.get('variants') as FormArray;
    const skuValueArr = [];
    variantFormArray.controls.map((variant: FormGroup, index) => {
      const skuControl = variant.get('sku');
      if (skuControl.enabled) {
        const skuValue = skuControl.value;
        const isDuplicate = skuValueArr?.find((sku) => sku === skuValue);
        if (isDuplicate) skuControl.setErrors({ skuUnique: true });
        if (skuValue) skuValueArr.push(skuValue);
      } else {
        skuControl.setErrors(null);
        this.skuValidationMessage[index] = null;
      }
    });
  }

  setErrorMessageOnSubmit(c: AbstractControl, controlName: string, i: number): void {
    if (c.errors) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');

      this.showErrorMessage(controlName, errorMessage, i);
    }
  }

  ngOnChanges(): void {
    if (this.patchVariantData) {
      this.inventoryValue = [];
      this.processPatchingVariant();
    } else {
      this.parentForm?.addControl('variants', this.variantForm.controls.variants);
    }
  }

  processPatchingVariant(): void {
    this.parentForm.removeControl('variants');
    const tranformedVariant = this.transformPatchedVariant();
    this.generateVariantForm();
    this.getVariantFormGroup();
    this.patchVariantForm(tranformedVariant);
    this.parentForm.addControl('variants', this.variantForm.controls.variants);
    this.subscribeToImageChanges();
  }

  patchVariantForm(tranformedVariant: IProductVariant[]): void {
    const control = this.variantForm.controls.variants as FormArray;
    tranformedVariant.forEach((variant, index) => {
      this.inventoryValue.push(variant.inventory);
      control.push(this.getVariantFormGroup());
      const variantFormGroup = control.controls[index] as FormGroup;
      variantFormGroup.controls['variantID'].setValue(variant.variantID);
      variantFormGroup.controls['inventory'].setValue(this.inventoryValue[index]);
      variantFormGroup.controls['currentInventory'].setValue(this.inventoryValue[index]);
      variantFormGroup.controls['withhold'].setValue(variant.withhold);
      variantFormGroup.controls['sku'].setValue(variant.sku);
      variantFormGroup.controls['unitPrice'].setValue(variant.unitPrice);
      variantFormGroup.controls['status'].setValue(variant.status);
      this.attachFormArrayToVariantForm(variant.attributes, variantFormGroup, 'attributes');
      this.attachFormArrayToVariantForm(variant.variantImages, variantFormGroup, 'variantImages');
      this.attachFormArrayToVariantForm(variant.mergedVariants, variantFormGroup, 'mergedVariants');
    });
  }

  attachFormArrayToVariantForm<T>(arrayItem: T[], formGroup: FormGroup, controlName: string): void {
    const attribFormArray = formGroup.controls[controlName] as FormArray;
    arrayItem?.forEach((items) => {
      attribFormArray.push(new FormControl(items));
    });
  }

  transformPatchedVariant(): IProductVariant[] {
    return this.patchVariantData.map((variant) => ({
      variantID: variant.variantID,
      variantImages: variant.variantImages,
      sku: variant.variantSKU,
      unitPrice: variant.variantUnitPrice,
      inventory: variant.variantInventory,
      currentInventory: variant.variantInventory,
      withhold: variant.variantReserved,
      status: variant.variantStatus,
      attributes: variant.variantAttributes,
      mergedVariants: variant?.variantMarketPlaceMerged,
    }));
  }

  subscribeToImageChanges(): void {
    this.parentForm
      .get('variants')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.parentForm.get('variants').markAsDirty();
        }),
      )
      .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProductsAttributesDialogComponent, {
      width: '100%',
      data: {
        storedAttribute: this.storedAttributeData,
        crudType: CrudType.ADD,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result !== false) {
          this.processAttributes(result);
        } else {
          this.storedAttributeData = null;
        }
      });
  }

  processAttributes(result: IProductAttributeFormProcessResult): void {
    const isAttribExists = result?.attributes[0]?.attributeID;
    const isSubAttribExists = result?.attributes[0]?.subAttributes?.length;
    if (isAttribExists && isSubAttribExists) {
      this.parentForm.removeControl('variants');
      this.rawVariantData = result?.attributes;
      this.storedAttributeData = result;
      this.variantsData = [];
      this.generateChipArray();
      this.generateVariantForm();
      this.setVariantFormGroup();
      this.parentForm.addControl('variants', this.variantForm.controls.variants);
    } else {
      this.storedAttributeData = null;
      this.generateEmptyVariant();
    }
  }

  generateEmptyVariant(): void {
    this.rawVariantData = [
      {
        attributeID: -1,
        attributeName: '',
        subAttributes: [{ id: -1, name: '', currentIndex: 0 }],
      },
    ];

    this.generateChipArray();
    this.generateVariantForm();
    this.setVariantFormGroup();
  }

  generateVariantForm(): void {
    this.variantForm = this.variantFormBuilder.group({
      variants: new FormArray([]),
    });
  }

  getVariantFormGroup(): FormGroup {
    let skuRandom = '';
    if (this.formMode !== 'EDIT') skuRandom = this.getRandomSKU();
    const variantFormGroup = this.variantFormBuilder.group({
      variantID: [null],
      variantImages: new FormArray([]),
      sku: [{ value: skuRandom, disabled: this.formMode === CRUD_MODE.EDIT ? true : false }, [Validators.required, skuSpecialCharValidation()], [this.skuExistValidator]],
      unitPrice: [0, [Validators.required]],
      inventory: [null, [Validators.required]],
      currentInventory: [null, [Validators.required]],
      // increaseTo: [0, [Validators.required]],
      // decreaseTo: [0, [Validators.required]],
      withhold: [{ value: null, disabled: true }],
      status: [1, [Validators.required]],
      attributes: new FormArray([]),
      mergedVariants: new FormArray([]),
    });
    return variantFormGroup;
  }

  setVariantFormGroup(): void {
    if (this.variantsData) {
      const control = this.variantForm.controls.variants as FormArray;
      this.variantsData.forEach((attribute, index) => {
        this.inventoryValue.push(0);
        control.push(this.getVariantFormGroup());
        const variantFormGroup = control.controls[index] as FormGroup;
        variantFormGroup.controls['inventory'].patchValue(0);
        variantFormGroup.controls['currentInventory'].patchValue(0);
        variantFormGroup.controls['withhold'].patchValue(0);
        attribute.forEach((items) => {
          const attribFormArray = variantFormGroup.controls['attributes'] as FormArray;
          attribFormArray.push(new FormControl(items));
        });
        this.fillErrorVariables();
      });
    }
  }

  fillErrorVariables(): void {
    this.unitPriceValidationMessage.push(null);
    this.statusValidationMessage.push(null);
    this.skuValidationMessage.push(null);
  }

  generateChipArray(): void {
    if (this.rawVariantData) {
      let k = 0;
      for (let i = 0; i < this.rawVariantData.length; i++) {
        this.variantsData[k] = this.rawVariantData[i].subAttributes;
        k++;
      }
      this.variantsData = generateVariants(this.variantsData);
    }
  }

  minusFunc(i: number): void {
    if (this.inventoryValue[i] > 0) {
      const inventory = this.getInventoryControl(i);
      this.inventoryValue[i]--;
      inventory.patchValue(this.inventoryValue[i]);
      inventory.markAsDirty();
    }
  }

  plusFunc(i: number): void {
    this.variantForm.markAsDirty();
    const inventory = this.getInventoryControl(i);
    this.inventoryValue[i]++;
    inventory.patchValue(this.inventoryValue[i]);
    inventory.markAsDirty();
  }

  getInventoryControl(i: number): FormControl {
    const variantFormGroup = this.variantsFormArray.controls[i] as FormGroup;
    const inventoryControl = variantFormGroup.controls['inventory'] as FormControl;
    return inventoryControl;
  }

  eventLookUpOnFocus(i: number, controlName: string): void {
    const variantFormGroup = this.variantsFormArray.controls[i] as FormGroup;
    const formControl = variantFormGroup.get(controlName);
    formControl.valueChanges.pipe(debounceTime(1500)).subscribe(() => this.setErrorMessage(formControl, controlName, i));
  }

  setErrorMessage(c: AbstractControl, controlName: string, i: number): void {
    if (c.errors && (c.touched || c.dirty)) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');

      this.showErrorMessage(controlName, errorMessage, i);
    }
  }

  showErrorMessage(controlName: string, errorMessage: string, i: number): void {
    switch (controlName) {
      case 'unitPrice':
        this.unitPriceValidationMessage[i] = this.translate.instant(errorMessage);
        break;
      case 'status':
        this.statusValidationMessage[i] = this.translate.instant(errorMessage);
        break;
      case 'sku':
        this.skuValidationMessage[i] = this.translate.instant(errorMessage);
        break;
      case 'inventory':
        this.inventoryValidationMessage[i] = this.translate.instant(errorMessage);
        break;
      default:
        break;
    }
  }

  openVariantImageDialog(i: number): void {
    const variantFormArray = this.variantImageFormArray;
    const variantItem = variantFormArray.at(i).get('variantImages').value;
    const dialogRef = this.dialog.open(VariantImageDialogComponent, {
      width: '100%',
      data: { index: i, images: variantItem },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          const { variantIndex, variantImages } = result;
          this.setImagesToForm(variantIndex, variantImages);
        }
      });
  }

  setImagesToForm(variantIndex: number, variantImages: any[]): void {
    const variantFormArray = this.variantImageFormArray;
    const variantItem = variantFormArray.at(variantIndex).get('variantImages') as FormArray;
    variantItem.clear();
    if (variantImages?.length > 0) {
      variantImages.map((images) => variantItem.push(new FormControl(images)));
    } else {
      variantItem.clear();
    }
  }

  getRandomSKU(): string {
    const randomNumber = String(Date.now() * Math.random());
    return 'SKU-' + parseInt(randomNumber, 0);
  }

  toggleExpandItem(index: number): void {
    const expandItemID = `expandItem${index}`;
    const expandItemElement = document.getElementById(expandItemID) as HTMLElement;
    if (!expandItemElement.classList.contains('collapse')) {
      expandItemElement.classList.add('collapse');
    } else expandItemElement.classList.remove('collapse');
  }

  trackBy(index: number): number {
    return index;
  }

  openAddVariation(): void {
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.VARIANTS);
    void this.router.navigate([routerInit, this.productID]);
  }

  ngOnDestroy(): void {
    this.variantsData = null;
    this.productCommonService.productAddVariantProcessAttribute$.next(null);
    this.storedAttributeData = null;
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
