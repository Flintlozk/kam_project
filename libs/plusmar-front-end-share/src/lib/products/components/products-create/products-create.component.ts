import { Clipboard } from '@angular/cdk/clipboard';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { FormArrayValidators, isMobile, maxValueValidator } from '@reactor-room/itopplus-front-end-helpers';
import {
  EnumAuthError,
  EnumAuthScope,
  EnumSubscriptionFeatureType,
  ICatSubCatHolder,
  IEditProductCategory,
  IEditProductImages,
  IEditProductTag,
  IEditProductVariant,
  IEditProductVariantImages,
  INameValuePair,
  IProduct,
  IProductByID,
  IProductCategory,
  IProductStatus,
  IProductTag,
  IProductVariant,
  IProductVariantImageChange,
  IVariantsOfProductByID,
  ProductMarketPlaceUpdateTypes,
  ProductRouteTypes,
  PRODUCT_TRANSLATE_MSG,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { CRUD_MODE, IHTTPResult, IMoreImageUrlResponse } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { IDropDown, INameIDPair, ITransformDropdown } from '@reactor-room/plusmar-front-end-share/app.model';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { differenceWith, forOwn, isEmpty, isEqual } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, forkJoin, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ProductMarketPlaceService } from '../../services/product-marketplace.service';
import { ProductCodeExistsValidator } from './product-code-exists.validator';
import { productErrorMessages, productValidationMessages } from './product-validation-messges';

interface IProductEditChangeItem {
  name: string;
  dirty: boolean;
}
@Component({
  selector: 'reactor-room-products-create',
  templateUrl: './products-create.component.html',
  styleUrls: ['./products-create.component.scss'],
  providers: [ProductCodeExistsValidator],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsCreateComponent implements OnInit, OnDestroy, AfterViewChecked {
  editProduct: IProductByID;
  isMarketPlaceExists: boolean;
  isMarketPlaceMultipleProduct: boolean;
  get productImageFormArray(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  get productImageError(): ValidationErrors {
    return this.productForm.controls?.images?.errors;
  }

  constructor(
    private productCommonService: ProductCommonService,
    private productService: ProductsService,
    private commonMethodsService: CommonMethodsService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private clipboard: Clipboard,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private productCodeExistsValidator: ProductCodeExistsValidator,
    public translate: TranslateService,
    private subscriptionService: SubscriptionService,
    private marketPlaceService: ProductMarketPlaceService,
  ) {
    this.initProductForm();
  }
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  destroy$ = new Subject<boolean>();
  productStatusData: IProductStatus[];
  productTagData: IProductTag[];
  tagSearchData: string[];
  removedChipOfSelector: INameIDPair;
  removeChipOnError: INameIDPair;
  maintainTagData = [] as INameIDPair[];
  productForm: FormGroup;
  loadingText = this.translate.instant('Please wait...Adding your Product');
  isLoading = false;
  validationMessages = productValidationMessages;
  productErrorMessages = productErrorMessages;
  removedChipOfCategory: ICatSubCatHolder;
  productStatus: IDropDown[];
  categoriesData: IProductCategory;
  tagsData = [] as INameIDPair[];
  tagsFromInput = [] as INameIDPair[];
  tagDataFromSelector: INameIDPair | null;
  categoryDataFromSelector: ICatSubCatHolder[];
  categoryCreateStatus = false;
  tagCreateStatus = false;
  addedTag: INameIDPair;
  styleToolbarStatus = false;
  marketPlaceIconObj = this.marketPlaceService.marketPlaceIconObj;
  productStatusSubscription: Subscription;
  productTagSearchSubscription: Subscription;
  productCategoryChipDataSubscription: Subscription;
  productTagChipDataSubscription: Subscription;

  maxWeight = 1000000;
  imageLimitSize = 2097152;
  formMode: string;
  headingTitle = this.translate.instant('Create New Product');
  routeTitle = this.translate.instant('Products / Create New Product');
  storedCopyOfEditData: IProductByID;

  productTagKeys: ITransformDropdown = {
    labelKey: 'name',
    valueKey: 'id',
  };
  userIdParam: number;
  patchTagData: INameIDPair[];
  patchCategoryData: ICatSubCatHolder[];
  patchCategoryFlag = false;
  patchVariantData: IVariantsOfProductByID[];
  catSubCatSubscription: Subscription;
  productChangedItem = [] as IProductEditChangeItem[];

  editTagMaintain = [] as IEditProductTag[];
  editCategoryMaintain = [] as IEditProductCategory[];
  editVariantMaintain = [] as IEditProductVariant[];
  editImageMainMaintain = [] as IEditProductImages[];
  editVariantImageMaintain: IEditProductVariantImages[];
  sharedLink: string;
  fbPageID: string;
  isDisableCode = false;
  errorTitle = this.translate.instant('Error');
  errorSavingProduct = this.translate.instant('Error saving Product try again later');
  toastPosition = 'toast-bottom-right';
  isVariantInventoryZero = true;
  socialTypes = SocialTypes;
  crudMode = CRUD_MODE;
  projectScope: EnumAuthScope;

  marketplaceUpdateTypes = [] as ProductMarketPlaceUpdateTypes[];

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.projectScope = this.router.url.includes('dashboard/') ? EnumAuthScope.CMS : null;
    this.productCommonService.projectScope = this.projectScope;
    this.getIsSubscriptionBusiness();
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.route.params.subscribe((params) => {
      this.userIdParam = +params['id'];
      if (!isNaN(this.userIdParam)) {
        this.formMode = CRUD_MODE.EDIT;
        this.productForm.controls['code'].disable();
        this.headingTitle = this.translate.instant('Edit Product');
        this.routeTitle = this.translate.instant('Products / Edit Product');
        this.initiateEditProducts(this.userIdParam);
      }
    });

    this.productCommonService.shareCatgoriesData.subscribe((category) => {
      if (category) {
        this.categoriesData = category;
      }
    });

    this.getProductStatusData();
    this.subscribeToMethods();
    this.validateCategoryData();
    this.validateTagsData();
  }

  getIsSubscriptionBusiness(): void {
    this.subscriptionService.$subscriptionLimitAndDetail.pipe(takeUntil(this.destroy$)).subscribe((subscriptionLimit) => {
      if (subscriptionLimit.featureType === EnumSubscriptionFeatureType.BUSINESS) {
        void this.router.navigateByUrl(`/follows?err=${EnumAuthError.PACKAGE_INVALID}`);
      }
      this.isLoading = false;
    });
  }

  getProductStatusData(): void {
    this.productStatusSubscription = this.productService.getProductStatus().subscribe(
      (result: IProductStatus[]) => {
        if (result) {
          this.productStatusData = result;
          const productStatusDropdownKeys: ITransformDropdown = {
            labelKey: 'name',
            valueKey: 'id',
          };
          this.productStatus = this.commonMethodsService.convertToDropDown(result, productStatusDropdownKeys);
        }
      },
      () => {
        this.toastr.error('Error fetching your product', 'Error', { positionClass: this.toastPosition });
      },
    );
  }

  initProductForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      code: ['', [Validators.required], [this.productCodeExistsValidator]],
      weight: [null, [Validators.required, maxValueValidator(this.maxWeight)]],
      dimension: this.getDimensionForm(),
      dangerous: new FormControl(false),
      status: [1, [Validators.required]],
      categories: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      images: new FormArray([], [Validators.required, FormArrayValidators.maxLengthArray(5)]),
    });
  }

  initiateEditProducts(id: number): void {
    try {
      this.isLoading = true;
      this.loadingText = this.translate.instant('Please wait fetching your Product');
      const productData = { id };
      this.productService
        .getProductByID(productData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async (product: IProductByID[]) => {
            if (!product) window.history.go(-1);
            else {
              this.editProduct = product[0];
              this.checkProductMarketPlaceExists();
              this.patchProductForm(product[0]);
              this.storedCopyOfEditData = product[0];
              await this.getFBPageID(product[0].ref);
              this.isLoading = false;
              setTimeout(() => {
                this.patchTagData = undefined;
              }, 200);
            }
          },
          (err) => {
            console.log('Error fetching product for edit', err);
            this.processGetProductbyIDError();
          },
        );
    } catch (error) {
      console.log('error :>> ', error);
      this.processGetProductbyIDError();
    }
  }

  checkProductMarketPlaceExists(): void {
    const { marketPlaceProducts } = this.editProduct || {};
    this.isMarketPlaceExists = marketPlaceProducts?.length ? true : false;
    this.isMarketPlaceMultipleProduct = marketPlaceProducts?.length > 1 ? true : false;
  }

  processGetProductbyIDError(): void {
    this.isLoading = false;
    const errorMsg = this.translate.instant('Error fetching your product', { positionClass: this.toastPosition });
    this.toastr.error(errorMsg, this.errorTitle);
    window.history.go(-1);
  }

  async getFBPageID(ref: string): Promise<void> {
    await this.productService.getCurrentFBPageID().subscribe((result) => {
      this.fbPageID = result.fb_page_id;
      this.sharedLink = this.sharedLink = this.productService.generateProductShareableLink(this.fbPageID, ref);
    });
  }

  copyRefLinkToClipboard(): void {
    this.clipboard.copy(this.sharedLink);
    const sharableLink = this.translate.instant('Shareable Link Copied');
    const copiedText = this.translate.instant('Copied');
    this.toastr.success(sharableLink, copiedText, { positionClass: this.toastPosition });
  }

  patchProductForm(result: IProductByID): void {
    try {
      const tempVariant = result.variants;
      this.patchProductBasicInfo(result);
      this.patchTagData = result.tags;
      this.productCommonService.patchTags = result.tags;
      this.patchCategoryData = result.categories;
      this.patchCategoryToChip();
      this.patchVariantToList(tempVariant);
      this.totalVariantInventroy(tempVariant);
      this.patchProductImages(result.images);
    } catch (error) {
      console.log('Error -> Error filling product form', error);
    }
  }

  totalVariantInventroy(tempVariant: IVariantsOfProductByID[]): void {
    if (tempVariant.length) {
      const variantInventoryTotal = tempVariant.reduce((variantAcc, variantCurr) => variantAcc + variantCurr.variantInventory, 0);
      variantInventoryTotal <= 0 ? (this.isVariantInventoryZero = true) : (this.isVariantInventoryZero = false);
    }
  }

  patchProductBasicInfo(result: IProductByID): void {
    try {
      const { name, code, weight, dangerous, description, dimension, status } = result;
      this.productForm.get('name').setValue(name);
      this.productForm.get('code').setValue(code);
      this.productForm.get('weight').setValue(Number(weight) * 1000); // Kg -> g
      this.productForm.get('dangerous').setValue(dangerous);
      this.productForm.get('status').setValue(status);
      this.productForm.get('quill').setValue({ description });
      const dimensionForm = this.productForm.get('dimension');
      dimensionForm.get('length').setValue(dimension?.length);
      dimensionForm.get('width').setValue(dimension?.width);
      dimensionForm.get('height').setValue(dimension?.height);
    } catch (error) {
      console.log('Error -> Error filling product basic info', error);
    }
  }

  patchInitControlFlags(): void {
    this.productChangedItem = [];
    const productFormControls = this.productForm.controls;
    Object.keys(productFormControls).forEach((item) => {
      const currentControl = this.productForm.controls[item];
      const { dirty } = currentControl;
      this.productChangedItem.push({
        name: item,
        dirty,
      });
    });
  }

  patchProductImages(images: IMoreImageUrlResponse[]): void {
    images?.map((image) => {
      this.productImageFormArray.push(new FormControl(image));
    });
  }

  patchVariantToList(variants: IVariantsOfProductByID[]): void {
    this.patchVariantData = variants;
  }

  subscribeToMethods(): void {
    this.subscribeToTagDataFromDb();
    this.subscribeTagDataFromSelector();
    this.subscribeCategoryDataFromSelector();
    this.subscribeToTagCategoryData();
    this.subscribeToChipCategoryData();
  }

  subscribeToTagCategoryData(): void {
    this.productTagChipDataSubscription = this.productCommonService.getChipTagDataObs.subscribe((value: INameIDPair[]) => {
      if (value) {
        const tagFormControl = this.productForm.get('tags');
        tagFormControl.patchValue(value);
      }
    });
  }

  subscribeToChipCategoryData(): void {
    this.productCategoryChipDataSubscription = this.productCommonService.getChipCategoryDataObs.subscribe((value: ICatSubCatHolder[]) => {
      if (value) {
        const categoryFormControl = this.productForm.get('categories');
        categoryFormControl.patchValue(value);
      }
    });
  }

  getDimensionForm(): FormGroup {
    return this.formBuilder.group({
      length: [null, [Validators.required]],
      width: [null, [Validators.required]],
      height: [null, [Validators.required]],
    });
  }

  subscribeToTagDataFromDb(): void {
    this.productCommonService.getTagsDataObs.subscribe((value: INameIDPair[]) => {
      this.tagsData = value;
    });
  }

  subscribeTagDataFromSelector(): void {
    this.productCommonService.getTagFromSelector.subscribe((value: INameIDPair) => {
      this.tagDataFromSelector = value;
      this.tagsFromInput.push(value);
      this.maintainTagData.push(value);
    });
  }

  subscribeCategoryDataFromSelector(): void {
    this.catSubCatSubscription = this.productCommonService.getCatSubCatSelector.subscribe((value: ICatSubCatHolder[]) => {
      this.categoryDataFromSelector = value;
    });
  }

  cancelCreateAction(): void {
    this.reloadProductForm();
  }

  styleToolbarToogle(): void {
    this.styleToolbarStatus = !this.styleToolbarStatus;
  }

  categoryActive(): void {
    this.categoryCreateStatus = true;
    if (this.formMode) {
      if (!this.patchCategoryFlag) this.patchCategoriesToChip();
    }
  }

  patchCategoriesToChip(): void {
    this.patchCategoryData.map((cat) => {
      if (cat.subCatID === null) {
        const catID = `catInputID${cat.id}`;
        const catCheckBoc = document.getElementById(catID) as HTMLInputElement;
        catCheckBoc.checked = true;
      } else {
        const subCatID = `subCatInputID${cat.subCatID}`;
        const subCatCheckBoc = document.getElementById(subCatID) as HTMLInputElement;
        subCatCheckBoc.checked = true;
      }
    });

    this.patchCategoryFlag = true;
  }

  patchCategoryToChip(): void {
    this.patchCategoryData.map((cat) => {
      this.productCommonService.setCatSubCatSeletor(cat.id, cat.name, cat.subCatID, cat.mainID);
    });
  }

  tagActive(): void {
    this.tagCreateStatus = true;
  }

  clickOutsideCatEvent(event: boolean): void {
    if (event) {
      if (this.categoryCreateStatus) {
        this.validateCategoryData();
      }
      this.categoryCreateStatus = false;
    }
  }

  clickOutsideTagEvent(event: boolean): void {
    if (event) {
      if (this.tagCreateStatus) {
        this.validateTagsData();
      }
      this.tagCreateStatus = false;
    }
  }

  validateCategoryData(): void {
    const categoryFormControl = this.productForm.get('categories');
    categoryFormControl.valueChanges.pipe(debounceTime(1500)).subscribe((data) => {
      if (data?.length === 0) {
        if (this.categoryCreateStatus) this.setCatTagErrorMessage(categoryFormControl, 'categories');
      } else {
        this.productErrorMessages['categoriesValidationMessage'] = '';
      }
    });
  }

  validateTagsData(): void {
    const tagsFormControl = this.productForm.get('tags');
    tagsFormControl.valueChanges.pipe(debounceTime(2000)).subscribe((data) => {
      if (data?.length === 0) {
        if (this.tagCreateStatus) this.setCatTagErrorMessage(tagsFormControl, 'tags');
      } else {
        this.productErrorMessages['tagsValidationMessage'] = '';
      }
    });
  }

  tagSearch(event): void {
    const searchString: string = event;
    this.productTagSearchSubscription = this.productService.getProductTagSearch(searchString).subscribe((tags: IProductTag[]) => {
      if (tags?.length > 0) {
        this.tagSearchData = tags.map((tag) => tag.name);
      }
    });
  }

  tagDataFromInput(event): void {
    if (event.type === 'add') {
      const addedTag = event.chips.slice(-1)[0];
      const checkExistsAtDb = this.tagsData?.find(({ name }) => name === addedTag?.name);
      if (checkExistsAtDb) {
        this.productCommonService.tagExistsAtDB.next(checkExistsAtDb);
      }
    } else {
      this.tagActive();
      setTimeout(() => {
        const removeChip: INameIDPair = event.chips;
        this.productCommonService.removedTagFromInput.next(removeChip);
        const removedChipFromInput: INameIDPair[] = this.tagsFromInput.filter((tag) => tag !== removeChip);
        this.tagsFromInput = removedChipFromInput;
        this.removedChipOfSelector = removeChip;
        this.maintainTagData = this.maintainTagData.filter((tag) => tag.name !== removeChip.name);
        this.tagDataFromSelector = null;
      }, 300);
    }
  }

  categoryDataFromInput(event): void {
    if (event.type === 'remove' && event.chips) {
      this.categoryActive();
      setTimeout(() => {
        this.removedChipOfCategory = event.chips;
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.resetForm();
    this.productCommonService.clearCatSubCatSelector();
    this.productStatusSubscription.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  resetForm(): void {
    this.productForm.get('categories').setValue('');
    this.clearErrorMessages();
  }

  clearErrorMessages(): void {
    forOwn(this.productErrorMessages, (value, key) => {
      this.productErrorMessages[key] = null;
    });
  }

  saveProductForm(): void {
    this.productCommonService.isProductSaveClicked.next(true);
    if (this.formMode === CRUD_MODE.EDIT) {
      this.saveEditProduct();
    } else {
      this.saveNewProduct();
    }
  }

  saveNewProduct(): void {
    const productFormValid: boolean = this.productForm.valid;
    try {
      if (productFormValid) {
        this.isLoading = true;
        const productFormValue: IProduct = this.prepareProductFormData(this.productForm.value);
        this.productService.addProduct(productFormValue).subscribe(
          (result: IHTTPResult[]) => {
            if (result) {
              this.productForm.markAsPristine();
              this.productForm.markAsUntouched();
              this.loadingText = this.translate.instant('Redirecting Please wait') + '...';
              const addProductTitle = this.translate.instant('Add Product');
              this.showProductResponse(result, addProductTitle);
            }
          },
          (err) => {
            if (err.message.indexOf('PRODUCT_REACHED_LIMIT') !== -1) {
              const text = this.translate.instant('You have reached a limit to create product');
              const title = this.translate.instant('Cant add new product');
              this.openSuccessDialog({ text, title }, true);
              this.isLoading = false;
            } else {
              this.openSuccessDialog({ text: this.errorSavingProduct, title: this.errorTitle }, true);
              this.isLoading = false;
            }
          },
        );
      } else {
        this.showProductFormErrors();
        this.isLoading = false;
      }
    } catch (error) {
      this.openSuccessDialog({ text: this.errorSavingProduct, title: this.errorTitle }, true);
      this.isLoading = false;
    }
  }

  showProductResponse(response: IHTTPResult[], title: string): void {
    let successFlag = true;
    if (response) {
      let displayHTML = '<div> <ul class="response-list">';
      response.forEach((data) => {
        const { status } = data;
        const value = this.translate.instant(data.value);
        if (status === 200) {
          displayHTML += `<li class="success-item"> ${value}</li>`;
        } else {
          displayHTML += `<li class="error-item"> ${value}</li>`;
          successFlag = false;
        }
      });

      this.openSuccessDialog({ text: displayHTML, title: successFlag ? title : 'Error' }, !successFlag);
      displayHTML += '</ul> <div>';
    }
  }

  prepareProductFormData(product: IProduct): IProduct {
    const productJson: IProduct = {
      ...product,
      weight: +product.weight / 1000, // kg -> g
      dimension: {
        length: +product.dimension.length,
        width: +product.dimension.width,
        height: +product.dimension.height,
      },
      variants: product.variants.map((variant) => ({ ...variant, variantImages: variant.variantImages.map(({ file }) => file), unitPrice: +variant.unitPrice })),
      images: product.images.map(({ file }) => file),
    };
    return productJson;
  }

  openSuccessDialog(message: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: isError,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe(() => {
      this.isLoading = false;
      this.goToListProduct();
    });
  }

  eventLookUpOnFocus(controlName: string): void {
    const productFormControl = this.productForm.get(controlName);
    productFormControl.valueChanges.pipe(debounceTime(2000)).subscribe(() => {
      if (controlName === 'categories' || controlName === 'tags') {
        this.setCatTagErrorMessage(productFormControl, controlName);
      }
      this.setErrorMessage(productFormControl, controlName);
    });
  }

  setErrorMessageOnSubmit(c: AbstractControl, controlName: string): void {
    if (c.errors) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      this.showErrorMessage(controlName, errorMessage);
    }
  }

  setCatTagErrorMessage(c: AbstractControl, controlName: string): void {
    const validationData = this.validationMessages.find((validation) => validation.control === controlName);
    const validationRules = validationData.rules;

    const errorMessage = Object.keys(c.errors)
      .map((key) => validationRules[key])
      .join('<br>');

    this.showErrorMessage(controlName, errorMessage);
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    switch (controlName) {
      case 'dimension.length':
        controlName = 'length';
        break;
      case 'dimension.width':
        controlName = 'width';
        break;
      case 'dimension.height':
        controlName = 'height';
        break;
      case 'quill.description':
        controlName = 'description';
        break;
      default:
        break;
    }
    const translateDynamicData = controlName === 'weight' ? { maxWeight: this.maxWeight } : {};
    const errorProperty = `${controlName}ValidationMessage`;
    this.productErrorMessages[errorProperty] = this.translate.instant(errorMessage, translateDynamicData);
  }

  onFileChange(event): void {
    const files = event.target.files;
    const productBigSizeImages = [] as Array<string>;
    if (files.length) {
      for (const file of files) {
        if (file.size > this.imageLimitSize) {
          productBigSizeImages.push(file.name);
          continue;
        }
        const reader = new FileReader();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (reader.onload = (e: any) => {
          this.productImageFormArray.push(
            this.createItem({
              file,
              url: e.target.result,
            }),
          );
        }),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          (reader.onloadend = () => {});

        reader.readAsDataURL(file);
      }
      this.generateBigSizeImagesError(productBigSizeImages);
    }
  }

  generateBigSizeImagesError(bigImages: Array<string>): void {
    if (bigImages?.length > 0) {
      let displayHTML = '<div> <ul class="response-list">';
      bigImages.forEach((image) => {
        displayHTML += `<li class="error-item"> ${image} ` + this.translate.instant('cannot be uploaded. Image size is more than 2 MB') + '</li>';
      });
      const title = this.translate.instant('Error Uploading Some Images');
      this.openSuccessDialog({ text: displayHTML, title }, true);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createItem(data: { file: any; url: string }): FormGroup {
    return this.formBuilder.group(data);
  }

  clearProductPicture(index: number): void {
    this.productImageFormArray.removeAt(index);
  }

  updateProductVariantImages(): Observable<IHTTPResult> {
    if (this.editVariantImageMaintain.length > 0) {
      const storedVariantImageData = this.storedCopyOfEditData.variants.map((item) => ({
        id: item.variantID,
        variantImages: item.variantImages,
      }));
      this.marketplaceUpdateTypes.push(ProductMarketPlaceUpdateTypes.VARIANT_IMAGES);
      return this.productService.updateProductVariantImages(this.userIdParam, storedVariantImageData, this.editVariantImageMaintain);
    }
  }

  updateProductMainImages(): Observable<IHTTPResult> {
    const isMainImageChanged = this.productChangedItem.filter((item) => item.name === 'images')[0];
    if (isMainImageChanged.dirty) {
      this.marketplaceUpdateTypes.push(ProductMarketPlaceUpdateTypes.PRODUCT_IMAGES);
      const storedImageData: IMoreImageUrlResponse[] = this.storedCopyOfEditData.images;
      return this.productService.updateProductMainImages(this.userIdParam, storedImageData, this.editImageMainMaintain);
    }
  }

  updateProductVariants(): Observable<IHTTPResult> {
    const isVariantChanged = this.productChangedItem.filter((item) => item.name === 'variants')[0];
    if (isVariantChanged.dirty) {
      this.marketplaceUpdateTypes.push(ProductMarketPlaceUpdateTypes.VARIANT);
      return this.productService.updateProductVariants(this.userIdParam, this.editVariantMaintain);
    }
  }

  updateProductCategories(): Observable<IHTTPResult> {
    const isCategoryChanged = this.productChangedItem.filter((item) => item.name === 'categories')[0];
    if (isCategoryChanged.dirty) {
      return this.productService.updateProductCategories(this.userIdParam, this.editCategoryMaintain);
    }
  }

  updateProductTags(): Observable<IHTTPResult> {
    const isTagChanged = this.productChangedItem.filter((item) => item.name === 'tags')[0];
    if (isTagChanged.dirty) {
      return this.productService.updateProductTags(this.userIdParam, this.editTagMaintain);
    }
  }

  updateProductMain(): Observable<IHTTPResult> {
    const keys = ['categories', 'images', 'tags', 'variants'];
    const filterMainFlags = this.productChangedItem.filter((item) => !keys.includes(item.name));
    const changedControls = filterMainFlags.filter(({ dirty }) => dirty === true);
    if (changedControls.length > 0) {
      const changedData = this.getProductMainChangeData(changedControls);
      this.marketplaceUpdateTypes.push(ProductMarketPlaceUpdateTypes.PRODUCT_MAIN);
      return this.productService.updateProductMain(this.userIdParam, changedData);
    }
  }

  getProductMainChangeData(changedControls: IProductEditChangeItem[]): INameValuePair[] {
    return changedControls.map((item) => {
      switch (item.name) {
        case 'quill':
          return { name: 'description', value: this.productForm.get(item.name).value.description };
        case 'dimension':
          return { name: 'dimension', value: JSON.stringify(this.productForm.get(item.name).value) };
        default:
          return { name: item.name, value: this.productForm.get(item.name).value.toString() };
      }
    });
  }

  checkEditTagControl(): void {
    const storedTagData = this.storedCopyOfEditData.tags;
    const currentTagData = this.productForm.get('tags').value;
    let changeFlag = false;
    let insertedTag = differenceWith(currentTagData, storedTagData, isEqual);
    let detetedTag = differenceWith(storedTagData, currentTagData, isEqual);
    detetedTag = this.manageEditTags(detetedTag, 'DELETE');
    insertedTag = this.manageEditTags(insertedTag, 'ADD');
    this.editTagMaintain = [...detetedTag, ...insertedTag];
    if (this.editTagMaintain?.length > 0) changeFlag = true;
    const tagItem = this.productChangedItem.find(({ name }) => name === 'tags');
    tagItem.dirty = changeFlag;
  }

  checkEditVariantControl(): void {
    const currentVariantData = this.productForm.get('variants').dirty;
    const variantItem = this.productChangedItem.find(({ name }) => name === 'variants');
    variantItem.dirty = currentVariantData;
    if (variantItem.dirty) {
      const variantArrayControls = this.productForm.get('variants') as FormArray;
      const editVariants: IProductVariant[] = variantArrayControls.controls
        .map((fmGroup) => {
          if (fmGroup.dirty) {
            const variantValue: IProductVariant = fmGroup.value;
            delete variantValue.variantImages;
            const variantData = {
              ...variantValue,
              unitPrice: +variantValue.unitPrice,
              inventory: +variantValue.inventory,
            };
            return variantData;
          }
        })
        .filter((el) => el);
      this.editVariantMaintain = this.manageEditVariant(editVariants, 'UPDATE');
    }
  }

  checkEditCategoryControl(): void {
    const storedCategoryData = this.storedCopyOfEditData.categories;
    const currentCategoryData = this.productForm.get('categories').value;
    let changeFlag = false;
    let insertedCategory = differenceWith(currentCategoryData, storedCategoryData, isEqual);
    let detetedCategory = differenceWith(storedCategoryData, currentCategoryData, isEqual);
    detetedCategory = this.manageEditCategory(detetedCategory, 'DELETE');
    insertedCategory = this.manageEditCategory(insertedCategory, 'ADD');
    this.editCategoryMaintain = [...detetedCategory, ...insertedCategory];
    if (this.editCategoryMaintain?.length > 0) changeFlag = true;
    const categoryItem = this.productChangedItem.find(({ name }) => name === 'categories');
    categoryItem.dirty = changeFlag;
  }

  checkEditImageControl(): void {
    const currentImageData = this.productImageFormArray.value;
    const storedImageData = this.storedCopyOfEditData.images;
    let changeFlag = false;
    let insertedImages = differenceWith(currentImageData, storedImageData, isEqual);
    let detetedImages = differenceWith(storedImageData, currentImageData, isEqual);
    insertedImages = insertedImages.map((item) => ({ file: item.file }));
    insertedImages = insertedImages.map((data: IMoreImageUrlResponse) => ({ data, mode: 'ADD' }));
    detetedImages = detetedImages.map((data: IMoreImageUrlResponse) => ({ data, mode: 'DELETE' }));
    this.editImageMainMaintain = [...insertedImages, ...detetedImages];
    if (this.editImageMainMaintain?.length > 0) changeFlag = true;
    const imageItem = this.productChangedItem.find(({ name }) => name === 'images');
    imageItem.dirty = changeFlag;
  }

  checkVariantImageControl(): void {
    const currentVariants = this.productForm.get('variants') as FormArray;
    const currentImageData: IProductVariantImageChange[] = currentVariants.controls.map((variant: FormGroup) => {
      const variantID: number = variant.value.variantID;
      const variantImagesArray = variant.get('variantImages') as FormArray;
      const variantImages: IMoreImageUrlResponse[] = variantImagesArray.controls.map((image) => image.value);
      return { id: variantID, variantImages };
    });
    const storedImagesData: IProductVariantImageChange[] = this.storedCopyOfEditData.variants.map((item) => ({
      id: item.variantID,
      variantImages: item.variantImages,
    }));

    this.editVariantImageMaintain = this.prepareVariantImageUpdateData(storedImagesData, currentImageData);
  }

  prepareVariantImageUpdateData(storedImagesData: IProductVariantImageChange[], currentImageData: IProductVariantImageChange[]): IEditProductVariantImages[] {
    const variantIDs = storedImagesData.map((item) => item.id);
    const updatedVariantImageHolder = [] as IEditProductVariantImages[];
    if (variantIDs?.length) {
      variantIDs.map((id) => {
        const currentImages = currentImageData.find((image) => image.id === id);
        const storedImages = storedImagesData.find((image) => image.id === id);
        const insertedImages = differenceWith(currentImages.variantImages, storedImages.variantImages, isEqual);
        const insertedImagesFile: IMoreImageUrlResponse[] = insertedImages.map((item) => ({ file: item.file }));
        const deletedImages: IMoreImageUrlResponse[] = differenceWith(storedImages.variantImages, currentImages.variantImages, isEqual);
        const insertedImagesValue = this.getVariantImageTransformValues(insertedImagesFile, id, 'ADD');
        const deletedImagesValue = this.getVariantImageTransformValues(deletedImages, id, 'DELETE');
        if (insertedImagesValue?.length) updatedVariantImageHolder.push(...insertedImagesValue);
        if (deletedImagesValue?.length) updatedVariantImageHolder.push(...deletedImagesValue);
      });
    }
    return updatedVariantImageHolder;
  }

  getVariantImageTransformValues(
    imageData: IMoreImageUrlResponse[],
    id: number,
    mode: string,
  ): {
    data: {
      variantImages: IMoreImageUrlResponse;
      id: number;
    };
    mode: string;
  }[] {
    return imageData.map((data) => {
      const objSub = {
        variantImages: data,
        id,
      };
      return { data: objSub, mode };
    });
  }

  checkPatchChanges(): void {
    this.checkEditImageControl();
    this.checkEditCategoryControl();
    this.checkEditTagControl();
    this.checkEditVariantControl();
    this.checkVariantImageControl();
  }

  saveEditProduct(): void {
    if (this.productForm.valid) {
      this.loadingText = this.translate.instant('Please wait Updating your product');
      this.patchInitControlFlags();
      this.checkPatchChanges();
      const isProductFormChanged = this.productChangedItem.find(({ dirty }) => dirty === true);
      isProductFormChanged === undefined ? this.showNoEditChangesAlert() : this.processEditProductUpdate();
    } else {
      this.showProductFormErrors();
      this.isLoading = false;
    }
  }

  processEditProductUpdate(): void {
    const updateProductMain$ = this.updateProductMain();
    const updateVariant$ = this.updateProductVariants();
    const updateTag$ = this.updateProductTags();
    const updateCategory$ = this.updateProductCategories();
    const updateMainImages$ = this.updateProductMainImages();
    const updateVariantImages$ = this.updateProductVariantImages();
    const updateProduct$ = [updateProductMain$, updateVariant$, updateTag$, updateCategory$, updateMainImages$, updateVariantImages$];
    this.executeEditProducts(updateProduct$);
  }

  executeEditProducts(updateObservables: Observable<IHTTPResult>[]): void {
    const httpResult = [] as IHTTPResult[];
    updateObservables = updateObservables.filter((item) => Boolean(item));
    if (updateObservables?.length > 0) {
      this.isLoading = true;
      forkJoin(updateObservables)
        .pipe(
          switchMap((result: IHTTPResult[]) => {
            httpResult.push(...result);
            return this.isMarketPlaceExists ? this.marketPlaceService.updateProductOnMarketPlaces(this.userIdParam, this.marketplaceUpdateTypes) : of([]);
          }),
          tap((marketUpdateResult: IHTTPResult[]) => {
            if (!isEmpty(marketUpdateResult)) httpResult.push(...marketUpdateResult);
            this.productForm.markAsPristine();
            this.productForm.markAsUntouched();
            this.loadingText = this.translate.instant('Redirecting Please wait') + '...';
            this.showProductResponse(httpResult, this.translate.instant('Update Product'));
          }),
          catchError(() => {
            this.isLoading = false;
            const errText = this.translate.instant(PRODUCT_TRANSLATE_MSG.pro_update_error);
            this.toastr.error(errText, this.errorTitle);
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  showProductFormErrors(): void {
    const warningTitle = this.translate.instant('Product Form Incomplete') + '!';
    const warningText = this.translate.instant('Items in red require your attention') + '.';
    this.toastr.warning(warningText, warningTitle, { positionClass: this.toastPosition });
    const productControls = this.productForm.controls;

    forOwn(productControls, (control, key) => {
      if (control instanceof FormGroup) {
        const childFormGroup = control as FormGroup;
        const childFormControls = childFormGroup.controls;
        forOwn(childFormControls, (childFormControl, childKey) => {
          const childFormControlName = `${key}.${childKey}`;
          this.setErrorMessageOnSubmit(childFormControl, childFormControlName);
        });
      } else {
        this.setErrorMessageOnSubmit(control, key);
      }
    });
  }

  setErrorMessage(c: AbstractControl, controlName: string): void {
    const errorProperty = `${controlName}ValidationMessage`;
    this.productErrorMessages[errorProperty] = null;
    if (c.errors && (c.touched || c.dirty)) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      this.showErrorMessage(controlName, errorMessage);
    }
  }

  showNoEditChangesAlert(): void {
    const warningTitle = this.translate.instant('Warning');
    const warningText = this.translate.instant('Product not yet edited') + '!';
    this.toastr.warning(warningText, warningTitle, { positionClass: this.toastPosition });
  }

  manageEditVariant(variant: IProductVariant[], mode: string): IEditProductVariant[] {
    return variant.map((cat) => ({ data: cat, mode }));
  }

  manageEditTags(tags: INameIDPair[], mode: string): IEditProductTag[] {
    return tags.map((tag) => ({ data: tag, mode }));
  }

  manageEditCategory(category: ICatSubCatHolder[], mode: string): IEditProductTag[] {
    return category.map((cat) => ({ data: cat, mode }));
  }

  reloadProductForm(): void {
    window.location.reload();
  }

  goToListProduct(): void {
    const firstPage = 1;
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.PRODUCT_LIST);
    void this.router.navigate([routerInit, firstPage]);
  }
}
