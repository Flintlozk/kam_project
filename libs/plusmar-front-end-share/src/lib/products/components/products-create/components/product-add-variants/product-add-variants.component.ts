import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CrudType } from '@reactor-room/crm-models-lib';
import {
  EnumAuthScope,
  IKeyValueIcon,
  IProductAddVariants,
  IProductAttributeForm,
  IProductAttributeList,
  IProductByID,
  IProductStatus,
  IVariantsOfProductByID,
  ProductRouteTypes,
} from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { IDropDown, ITransformDropdown } from '@reactor-room/plusmar-front-end-share/app.model';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { isEqual, orderBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TableForProducts } from '../../../product-table-header';
import { ProductsAttributesDialogComponent } from '../../../products-attributes-dialog/products-attributes-dialog.component';
import { PublishMarketPlaceCommon } from '../marketplace-publish/publishMarketPlaceCommon';
@Component({
  selector: 'reactor-room-product-add-variants',
  templateUrl: './product-add-variants.component.html',
  styleUrls: ['./product-add-variants.component.scss'],
})
export class ProductAddVariantsComponent implements OnInit, OnDestroy {
  productID: number;
  destroy$ = new Subject();
  addVariantForm: FormGroup = this.fb.group({});
  loadingText = this.translate.instant('Please wait');
  headingTitle = this.translate.instant('Add Edit Variants');
  routeTitle = 'Add / Edit Variation';
  publishMarketPlaceCommon = new PublishMarketPlaceCommon(this.router, this.translate, this.toastr, this.productCommonService);
  projectScope: EnumAuthScope;
  productDetails = [] as IKeyValueIcon[];
  product: IProductByID;
  noImage = 'assets/img/image-icon.svg';
  storedAttributeData: { attributes: IProductAttributeForm[] };
  formMode: CrudType;
  productStatus: IDropDown[];
  patchVariantData: IVariantsOfProductByID[];
  toastPosition = 'toast-bottom-right';
  errorTitle = this.translate.instant('Error');
  successTitle = this.translate.instant('Success');
  tableForProduct = new TableForProducts();
  isNoAttribute = false;
  isSingleAttribute = false;
  doubleAttribute = false;
  productAttributeList = [] as IProductAttributeList[];
  productAttribute1 = null as IProductAttributeList;
  productAttribute2 = null as IProductAttributeList;
  attributeIndex1 = 0;
  attributeIndex2 = 1;
  isMultipleVariants = false;
  disableSKUs = [];
  cancelButtons = [false, false];
  isAddingVariants = true;
  isShowVariants = true;
  noAttributeID = -1;
  rawVariantData = [
    {
      attributeID: this.noAttributeID,
      attributeName: '',
      subAttributes: [{ id: this.noAttributeID, name: '', currentIndex: 0 }],
    },
  ];

  get variantFormArray(): FormArray {
    return this.addVariantForm.get('variants') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private productService: ProductsService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private commonMethodsService: CommonMethodsService,
    private productCommonService: ProductCommonService,
    private location: Location,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.setProjectScope();
    this.getProductDetails();
    this.getProductStatusData();
  }

  getProductDetails(): void {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          this.productID = +params['id'];
          if (this.productID) {
            return this.productService.getProductByID({ id: this.productID });
          } else {
            this.publishMarketPlaceCommon.goToListProduct();
            return EMPTY;
          }
        }),
        tap(([product]) => {
          this.product = product;
          this.setProductAttributeDetails();
          this.initAddVariantForm();
        }),
        catchError((err) => {
          this.publishMarketPlaceCommon.errorOnRequesting();
          throw err;
        }),
      )
      .subscribe();
  }

  initAddVariantForm(): void {
    const variantIDs = this.product.variants.map((variant) => variant.variantID);
    this.addVariantForm.addControl(
      'product',
      this.fb.group({
        productID: this.productID,
        isNoAttribute: this.isNoAttribute,
        variantIDs: this.fb.array(variantIDs),
      }),
    );
  }

  setProductAttributeDetails(): void {
    this.productDetails = this.publishMarketPlaceCommon.setProductDetails(this.product);
    this.isNoAttribute = this.product.variants[0].variantAttributes[0].id === this.noAttributeID;
    if (!this.isNoAttribute) {
      this.isMultipleVariants = true;
      const isSingleAttribute = this.product.variants[0].variantAttributes.length === 1;
      if (isSingleAttribute) {
        this.isSingleAttribute = true;
        this.cancelButtons[this.attributeIndex1] = true;
        this.cancelButtons[this.attributeIndex2] = false;
      } else {
        this.doubleAttribute = true;
        this.cancelButtons[this.attributeIndex1] = true;
        this.cancelButtons[this.attributeIndex2] = true;
      }
      this.getProductAttributes();
    } else {
      setTimeout(() => {
        this.variantFormArray.clear();
        this.productCommonService.productAddVariantProcessAttribute$.next(null);
      }, 100);
    }
  }

  getProductAttributes(): void {
    this.productService
      .getAttributesByProductID(this.productID)
      .pipe(
        tap((attributeList) => {
          this.productAttributeList = attributeList;
          this.productAttribute1 = this.productAttributeList[0];
          this.productAttribute2 = this.productAttributeList[1];
          this.buildPatchVariants();
        }),
        catchError((error) => {
          this.showErrorToast();
          throw error;
        }),
      )
      .subscribe();
  }

  onClickCancelButtons(attribIndex: number): void {
    if (attribIndex === this.attributeIndex1) {
      this.productAttribute1 = null;
      this.cancelButtons[this.attributeIndex1] = false;
    }

    if (attribIndex === this.attributeIndex2) {
      this.productAttribute2 = null;
      this.cancelButtons[this.attributeIndex2] = false;
    }

    if (!this.isNoAttribute && this.cancelButtons.every((status) => !status)) {
      this.variantFormArray.clear();
      this.assignStoredAttributeData({ attributes: this.rawVariantData }, this.attributeIndex1);
      this.buildVariants();
      this.enableAllSKUs();
    } else {
      this.buildPatchVariants();
    }
  }

  buildPatchVariants(): void {
    if (!this.isNoAttribute) {
      this.buildVariants();
      this.patchVariants();
    }
  }

  patchVariants(): void {
    this.enableAllSKUs();
    const currentVariantIDs = this.product.variants.map(({ variantAttributes }) => variantAttributes.map(({ id }) => id));
    const formVariantsIDs = this.variantFormArray?.value?.map(({ attributes }, index) => ({
      formAttributeIDs: attributes.map(({ id }) => id),
      formAttributeIndex: index,
    }));
    for (let index = 0; index < currentVariantIDs?.length; index++) {
      const currentVariant = currentVariantIDs[index];
      const variant = this.product.variants[index];
      const formVariant = formVariantsIDs.find(({ formAttributeIDs }) => isEqual(orderBy(formAttributeIDs), orderBy(currentVariant)));
      if (formVariant) {
        const variantFormGroup = this.variantFormArray.at(formVariant.formAttributeIndex) as FormGroup;

        variantFormGroup.patchValue({
          variantID: variant.variantID,
          variantImages: variant.variantImages,
          sku: variant.variantSKU,
          unitPrice: variant.variantUnitPrice,
          inventory: variant.variantInventory,
          status: variant.variantStatus,
        });
        setTimeout(() => {
          document.getElementById('variantRow' + formVariant.formAttributeIndex).classList.add('disable-variant-row');
          variantFormGroup.get('sku').disable({ onlySelf: true });
        }, 250);
        this.attachFormArrayToVariantForm(variant.variantImages, variantFormGroup, 'variantImages');
      }
    }
  }

  attachFormArrayToVariantForm<T>(arrayItem: T[], formGroup: FormGroup, controlName: string): void {
    const attribFormArray = formGroup.controls[controlName] as FormArray;
    arrayItem?.forEach((items) => {
      attribFormArray.push(new FormControl(items));
    });
  }

  enableAllSKUs(): void {
    for (let index = 0; index < this.variantFormArray?.length; index++) {
      const variantFormGroup = this.variantFormArray.at(index) as FormGroup;
      setTimeout(() => {
        document.getElementById('variantRow' + index).classList.remove('disable-variant-row');
        variantFormGroup.get('sku').enable({ onlySelf: true });
      }, 200);
    }
  }

  openAttributeDialog(attribute: IProductAttributeList, index: number): void {
    const storedAttributeData = attribute ? this.getStoredAttributeData(attribute) : null;
    const dialogRef = this.dialog.open(ProductsAttributesDialogComponent, {
      width: '100%',
      data: {
        storedAttribute: storedAttributeData,
        crudType: CrudType.EDIT,
        attributeIndex: index + 1,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => {
          if (result !== false) {
            this.addVariantForm.get('variants').markAsDirty();
            const isSameAttribute = this.validateSecondAttribute(result, index);
            if (isSameAttribute) {
              const errMsg = this.translate.instant('Cannot have same attribute. Please select another attribute');
              this.toastr.error(errMsg, this.errorTitle, { positionClass: this.toastPosition });
            } else {
              this.assignStoredAttributeData(result, index);
              this.buildVariants();
              this.patchVariants();
              this.variantFormArray.markAsDirty();
            }
          }
        }),
      )
      .subscribe();
  }

  validateSecondAttribute(result: { attributes: IProductAttributeForm[] }, index: number): boolean {
    if (index === this.attributeIndex1) return false;
    return result.attributes[0].attributeID === this.productAttribute1.attributeID ? true : false;
  }

  buildVariants(): void {
    const attrib1 = this.productAttribute1 ? this.getStoredAttributeData(this.productAttribute1) : null;
    const attrib2 = this.productAttribute2 ? this.getStoredAttributeData(this.productAttribute2) : null;
    const attribFormArray = [...(attrib1?.attributes || []), ...(attrib2?.attributes || [])];
    this.productCommonService.productAddVariantProcessAttribute$.next({ attributes: attribFormArray });
  }

  assignStoredAttributeData(storedAttributeData: { attributes: IProductAttributeForm[] }, index: number): void {
    const { attributeID, attributeName, subAttributes } = storedAttributeData.attributes[0];
    if (attributeID !== this.noAttributeID) this.cancelButtons[index] = true;
    const attributeList: IProductAttributeList = {
      attributeID,
      attributeName,
      subAttributes: subAttributes.map(({ id, name }) => ({
        subAttributeID: id,
        subAttributeName: name,
      })),
    };
    if (this.attributeIndex1 === index) {
      this.productAttribute1 = attributeList;
    }
    if (this.attributeIndex2 === index) {
      this.productAttribute2 = attributeList;
    }
  }

  getStoredAttributeData({ attributeID, attributeName, subAttributes }: IProductAttributeList): { attributes: IProductAttributeForm[] } {
    const attributes: IProductAttributeForm[] = [
      {
        attributeID,
        attributeName,
        currentIndex: 0,
        subAttributes: subAttributes.map((subAttr) => ({
          id: subAttr.subAttributeID,
          name: subAttr.subAttributeName,
          currentIndex: 0,
        })),
      },
    ];
    return { attributes };
  }

  setProjectScope(): void {
    this.projectScope = this.router.url.includes('dashboard/') ? EnumAuthScope.CMS : null;
    this.productCommonService.projectScope = this.projectScope;
  }

  goToProduct(): void {
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.PRODUCT);
    void this.router.navigate([routerInit, this.productID]);
  }

  saveVariations(): void {
    const saveButtonClicked = true;
    const isFormValid = this.addVariantForm.valid && this.variantFormArray?.length && this.variantFormArray.dirty;
    this.productCommonService.isProductSaveClicked.next(saveButtonClicked);
    if (isFormValid) {
      let addVariant = this.addVariantForm.value as IProductAddVariants;
      addVariant = {
        ...addVariant,
        variants: addVariant.variants.map((variant) => {
          delete variant.withhold;
          return { ...variant, variantImages: variant.variantImages.map(({ file }) => file), unitPrice: +variant.unitPrice };
        }),
      };
      this.tableForProduct.isLoading = true;
      this.productService
        .addProductVariants(addVariant)
        .pipe(
          takeUntil(this.destroy$),
          tap((result) => {
            this.saveVariantionResult(result);
          }),
          catchError((error) => {
            this.showErrorToast();
            throw error;
          }),
        )
        .subscribe();
    } else {
      if (!this.variantFormArray?.length) {
        const errMessage = this.translate.instant('Please add variants by clicking attribute button');
        this.toastr.error(errMessage, this.errorTitle, { positionClass: this.toastPosition });
      } else {
        const errMessage = this.translate.instant('Please add values to input');
        this.toastr.error(errMessage, this.errorTitle, { positionClass: this.toastPosition });
      }
    }
  }

  saveVariantionResult({ status }: IHTTPResult): void {
    if (status === 200) {
      const successMessage = this.translate.instant('Variants added successfully');
      this.toastr.success(successMessage, this.successTitle, { positionClass: this.toastPosition });
      this.goToProduct();
    } else {
      this.showErrorToast();
    }
    this.tableForProduct.isLoading = false;
  }

  getProductStatusData(): void {
    this.productService
      .getProductStatus()
      .pipe(
        takeUntil(this.destroy$),
        tap((result: IProductStatus[]) => {
          if (result?.length) {
            const productStatusDropdownKeys: ITransformDropdown = {
              labelKey: 'name',
              valueKey: 'id',
            };
            this.productStatus = this.commonMethodsService.convertToDropDown(result, productStatusDropdownKeys);
          } else {
            this.showErrorToast();
          }
        }),
        catchError((error) => {
          this.showErrorToast();
          throw error;
        }),
      )
      .subscribe();
  }

  showErrorToast(): void {
    const errMessage = this.translate.instant('Error Please try again later');
    this.toastr.error(errMessage, this.errorTitle, { positionClass: this.toastPosition });
    this.tableForProduct.isLoading = false;
    this.goToProduct();
  }

  // goBack(): void {
  //   this.location.back();
  // }

  ngOnDestroy(): void {
    this.variantFormArray.clear();
    this.productCommonService.productAddVariantProcessAttribute$.next(null);
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
