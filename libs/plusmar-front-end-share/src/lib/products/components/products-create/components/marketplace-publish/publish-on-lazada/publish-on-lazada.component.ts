import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { deepCopy, getFormErrorMessages, isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { ICreateProductMarketPlaceResponse, IHTTPResult, INameObject, ITextTitle, IValidationMessage, LanguageTypes } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import {
  ICategorySelectedEmitter,
  ICatSubCatHolder,
  IErrorMessagesForm,
  IKeyValueIcon,
  ILazadaCategories,
  ILazadaCategoryAttribute,
  ILazadaCreateProductPayload,
  IMarketPlaceTogglerInput,
  IProductByID,
  IProductMarketPlaceCategoryTree,
  LazadaCategoryAttributeFormGroupTypes,
  LazadaCategoryAttributeType,
  MarketPlaceErrorType,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { differenceWith, intersectionWith, isEmpty, remove } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ProductMarketPlaceService } from '../../../../../services/product-marketplace.service';
import { PublishMarketPlaceCommon } from '../publishMarketPlaceCommon';
import { validationMessages } from './validation';

@Component({
  selector: 'reactor-room-publish-on-lazada',
  templateUrl: './publish-on-lazada.component.html',
  styleUrls: ['./publish-on-lazada.component.scss'],
})
export class PublishOnLazadaComponent implements OnInit, OnDestroy {
  togglerHeaderIcon = 'assets/img/social/lazada-heart-icon.svg';
  loadingText = this.translate.instant('Please wait creating product on Lazada');
  headingTitle = this.translate.instant('Create Product On Lazada');
  routeTitle = this.translate.instant('Products/Create Lazada Product');
  @ViewChild('skuFieldRef') skuFieldRef: ElementRef;
  @ViewChild('categorySelectorContainer') categorySelectorContainer!: ElementRef;

  categoryLevels = [] as {
    [key: number]: IProductMarketPlaceCategoryTree[];
  }[];
  productDetails = [] as IKeyValueIcon[];

  moreProduct: IProductByID;

  categorySuggestions: ILazadaCategories[];
  productPublishForm: FormGroup;
  categories: ICatSubCatHolder[];
  isCategorySuggestionShow = false;
  categoryAttributeFormGroupNames = LazadaCategoryAttributeFormGroupTypes;
  categoryAttributeFormGroupList = [
    LazadaCategoryAttributeFormGroupTypes.NORMAL_ATTRIBUTE_REQUIRED,
    LazadaCategoryAttributeFormGroupTypes.NORMAL_ATTRIBUTE_NOT_REQUIRED,
    LazadaCategoryAttributeFormGroupTypes.SKU_ATTRIBUTE_NOT_REQUIRED,
    LazadaCategoryAttributeFormGroupTypes.SKU_ATTRIBUTE_REQUIRED,
  ];
  packageSKUAttributeRequiredList = ['package_weight', 'package_length', 'package_height', 'package_width'];
  normalAttribute = [] as ILazadaCategoryAttribute[];
  skuAttributes = [] as ILazadaCategoryAttribute[];

  normalAttributeRequired = [] as ILazadaCategoryAttribute[];
  normalAttributeNotRequired = [] as ILazadaCategoryAttribute[];
  skuAttributeRequired = [] as ILazadaCategoryAttribute[];
  skuAttributeNotRequired = [] as ILazadaCategoryAttribute[];

  isRequired = true;
  isNotRequired = false;
  isLazadaSupportVariant: boolean;
  isMoreCommerceProductHaveVariants: boolean;
  isShowLazadaVariantWarning = false;
  isCreateMultipleProduct = false;
  commonAttributeSKURequired: ILazadaCategoryAttribute[];
  packageAttributeSKURequired = [] as ILazadaCategoryAttribute[];
  skuSaleAttributeRequired: ILazadaCategoryAttribute[];
  moreCommerceIcon = this.marketPlaceService.marketPlaceIconObj[SocialTypes.MORE_COMMERCE];
  isVariantAvailableToPublish = false;

  brandInputName = 'brand';
  togglerInputs: IMarketPlaceTogglerInput[] = [
    {
      id: 'basic_field',
      title: 'Basic Field',
      toggleStatus: true,
      icon: this.togglerHeaderIcon,
      requiredForm: {
        attributes: this.normalAttributeRequired,
        groupName: LazadaCategoryAttributeFormGroupTypes.NORMAL_ATTRIBUTE_REQUIRED,
      },
      notRequiredForm: {
        attributes: this.normalAttributeNotRequired,
        groupName: LazadaCategoryAttributeFormGroupTypes.NORMAL_ATTRIBUTE_NOT_REQUIRED,
      },
    },
    {
      id: 'sku_field',
      title: 'SKU Field',
      toggleStatus: true,
      icon: this.togglerHeaderIcon,
      requiredForm: {
        attributes: this.skuAttributeRequired,
        groupName: LazadaCategoryAttributeFormGroupTypes.SKU_ATTRIBUTE_REQUIRED,
      },
      notRequiredForm: {
        attributes: this.skuAttributeNotRequired,
        groupName: LazadaCategoryAttributeFormGroupTypes.SKU_ATTRIBUTE_NOT_REQUIRED,
      },
    },
    {
      id: 'package_field',
      title: 'Package Field',
      toggleStatus: true,
      icon: this.togglerHeaderIcon,
      requiredForm: {
        attributes: this.packageAttributeSKURequired,
        groupName: LazadaCategoryAttributeFormGroupTypes.SKU_PACKAGE_ATTRIBUTE_REQUIRED,
      },
      notRequiredForm: null,
    },
  ];

  skuChecked = [] as boolean[];

  filterSaleAttributeRequired = [] as ILazadaCategoryAttribute[];
  validationMessages = validationMessages as IValidationMessage[];

  errorMessages = {};
  errorTitle = this.translate.instant('Error');

  marketPlaceErrorType = MarketPlaceErrorType;

  destroy$ = new Subject();
  skuSaleValueSet = [] as string[];
  saleItemSameValueIndex = [] as number[];
  filterBrandOptions = of([]) as Observable<INameObject[]>;
  isSelectedCategoryLeaf = false;
  isCategorySelectedBySuggestion = false;
  language = LanguageTypes.ENGLISH;
  marketPlaceType = SocialTypes.LAZADA;
  publishMarketPlaceCommon = new PublishMarketPlaceCommon(this.router, this.translate, this.toastr, this.productCommon);
  currentLanguage = 'en';
  skuError: string;
  pageThirdParty$ = this.pageService.getPageThirdPartyByPageType(SocialTypes.LAZADA);

  get getSKUAttributeRequiredFormArray(): FormArray {
    return this.productPublishForm.get(LazadaCategoryAttributeFormGroupTypes.SKU_ATTRIBUTE_REQUIRED) as FormArray;
  }

  get getBrandFormControl(): FormControl {
    const brandControlName = `${LazadaCategoryAttributeFormGroupTypes.NORMAL_ATTRIBUTE_REQUIRED}.${this.brandInputName}`;
    return this.productPublishForm.get(brandControlName) as FormControl;
  }

  constructor(
    public marketPlaceService: ProductMarketPlaceService,
    private route: ActivatedRoute,
    public productService: ProductsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    public translate: TranslateService,
    public dialog: MatDialog,
    private pageService: PagesService,
    public productCommon: ProductCommonService,
  ) {}

  ngOnInit(): void {
    this.pageThirdParty$
      .pipe(
        tap((page) => {
          if (page.id) {
            this.getProductDetails();
          } else {
            const errMessage = this.translate.instant('Please connect lazada marketplace');
            this.toastr.error(errMessage, this.errorTitle);
            void this.router.navigate(['/pages/edit']);
          }
        }),
        catchError((err) => {
          this.publishMarketPlaceCommon.errorOnRequesting();
          throw err;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  getProductDetails(): void {
    this.route.params
      .pipe(
        switchMap((param) => {
          const { id } = param || null;
          if (!id) {
            this.publishMarketPlaceCommon.goToListProduct();
            return EMPTY;
          }
          return this.productService.getProductByID({ id: +id });
        }),
        tap((product) => this.initLazadaForm(product)),
        catchError((err) => {
          this.publishMarketPlaceCommon.errorOnRequesting();
          throw err;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  categorySelectedFromSelector({ showCategorySelector, selectedCategory, selectCategory, categoryLevels }: ICategorySelectedEmitter): void {
    this.publishMarketPlaceCommon.showCategorySelector = showCategorySelector;
    this.isCategorySuggestionShow = false;
    this.publishMarketPlaceCommon.selectedCategory = selectedCategory;
    this.publishMarketPlaceCommon.selectCategory = selectCategory;
    this.categoryLevels = categoryLevels;
  }

  initLazadaForm(product: IProductByID[]): void {
    this.moreProduct = product[0];
    const { images } = this.moreProduct;
    if (images?.length) {
      const { variants } = this.moreProduct;
      this.publishMarketPlaceCommon.redirectProductLinkedToMarketPlace(variants, SocialTypes.LAZADA);
      this.isMoreCommerceProductHaveVariants = this.moreProduct?.variants[0]?.variantAttributes[0]?.name ? true : false;
      isEmpty(this.moreProduct) && this.publishMarketPlaceCommon.errorOnRequesting();
      this.productDetails = this.publishMarketPlaceCommon.setProductDetails(this.moreProduct);
      this.initProductPublishForm();
      this.getSuggestedCategories();
      this.subscribeToLazadaCategory();
      this.setCategorySelected();
    } else {
      const title = this.translate.instant('Error');
      const text = this.translate.instant('Product Image not available please upload image before publishing to marketplace');
      const isError = true;
      this.openDialog({ title, text }, isError);
    }
  }

  isProductImageExists(): boolean {
    const { images } = this.moreProduct;
    return images?.length ? true : false;
  }

  onCategoryInputClick(): void {
    console.log('onCategoryInputClick');
    this.publishMarketPlaceCommon.showCategorySelector = true;
  }

  subscribeToLazadaCategory(): void {
    this.productPublishForm
      .get('category')
      .valueChanges.pipe(
        startWith(1),
        tap((category) => (category?.length ? (this.publishMarketPlaceCommon.isCategoryExists = true) : (this.publishMarketPlaceCommon.isCategoryExists = false))),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  initProductPublishForm(): void {
    const { name, categories } = this.moreProduct;
    this.categories = categories;
    this.productPublishForm = this.fb.group({
      name: [name, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      category: ['', [Validators.required]],
      categoryID: [null, [Validators.required]],
    });
  }

  getSuggestedCategories(): void {
    const { name, categories } = this.moreProduct;
    const keywords = [name, categories[0].name];
    this.marketPlaceService
      .getLazadaSuggestedCategories(keywords)
      .pipe(
        tap((categorySuggestions) => (this.categorySuggestions = categorySuggestions)),
        map((categorySuggestions) =>
          categorySuggestions.map((cate) => {
            cate.categoryPath = cate.categoryPath.replace(/>/g, ' > ');
            return cate;
          }),
        ),
        finalize(() => (this.isCategorySuggestionShow = true)),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.log('~ error', error);
          const errorText = this.translate.instant('error_connecting_lazada');
          this.publishMarketPlaceCommon.showMarketPlaceApiError(errorText);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  selectCategorySuggestion(category: ILazadaCategories): void {
    this.publishMarketPlaceCommon.selectCategory = [];
    this.isCategorySuggestionShow = false;
    this.publishMarketPlaceCommon.selectedCategory = category;
    const { categoryId, categoryPath } = category;
    this.marketPlaceService.setFormCategorySelected$.next({ categoryId, categoryPath });
    this.isCategorySelectedBySuggestion = true;
  }

  setCategorySelected(): void {
    this.marketPlaceService.setFormCategorySelected$
      .pipe(
        tap(({ categoryId, categoryPath }) => {
          this.productPublishForm.get('category').setValue(categoryPath);
          this.productPublishForm.get('categoryID').setValue(categoryId);
          this.getLazadaCategoryAttribute(categoryId, this.marketPlaceType, this.currentLanguage);
        }),
      )
      .subscribe();
  }

  getLazadaCategoryAttribute(categoryID: number, marketPlaceType: SocialTypes, lang: string): void {
    if (!categoryID) return;
    this.marketPlaceService
      .getLazadaCategoryAttribute(categoryID, marketPlaceType, lang)
      .pipe(
        tap((attributes) => {
          this.checkLazadaSupportVariants(attributes);
          if (this.isMoreCommerceProductHaveVariants && !this.isLazadaSupportVariant) {
            this.isShowLazadaVariantWarning = true;
            this.isCreateMultipleProduct = true;
          }
          this.isShowLazadaVariantWarning ? this.showLazadaVariantWarning(attributes) : this.manageCategoryAttribute(attributes);
        }),
        catchError((error) => {
          console.log('~ error', error);
          const errorText = this.translate.instant('error_connecting_lazada');
          this.publishMarketPlaceCommon.showMarketPlaceApiError(errorText);
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  showLazadaVariantWarning(attributes: ILazadaCategoryAttribute[]): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('Warning'),
        text: this.translate.instant('lazada_not_support_variant_warning'),
      } as ITextTitle,
    });
    dialogRef
      .afterClosed()
      .pipe(
        tap((data) => {
          data ? this.manageCategoryAttribute(attributes) : this.publishMarketPlaceCommon.goToListProduct();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  manageCategoryAttribute(attributes: ILazadaCategoryAttribute[]): void {
    this.categoryAttributeFormGroupList.map((formGroupName) => this.productPublishForm.removeControl(formGroupName));
    this.normalAttribute = this.getCategoryAttributeFilter(attributes, 'attribute_type', LazadaCategoryAttributeType.NORMAL);

    this.skuAttributes = this.getCategoryAttributeFilter(attributes, 'attribute_type', LazadaCategoryAttributeType.SKU);

    this.setNormalAttributeFormGroup();
    this.setSKUAttributeFormGroup();
    this.setSKUPackageAttributeRequiredFormGroup();
    this.patchPackageAttributeSKUValues();
    this.addValidationRules();
    this.subscribeToBrandInput();
  }

  toggleSkuCheckbox(i: number): void {
    const skuRequiredFormGroup = this.getSKUAttributeRequiredFormArray.at(i) as FormGroup;
    this.skuChecked[i] ? skuRequiredFormGroup.disable() : skuRequiredFormGroup.enable();
  }

  subscribeToBrandInput(): void {
    const brandAttribute = this.normalAttributeRequired.find(({ name }) => name === this.brandInputName);
    if (!isEmpty(brandAttribute)) {
      this.filterBrandOptions = this.getBrandFormControl.valueChanges.pipe(
        debounceTime(800),
        distinctUntilChanged(),
        startWith(''),
        switchMap((brandInput) => {
          return brandInput ? this.marketPlaceService.getMarketPlaceBrandSuggestions(brandInput, SocialTypes.LAZADA) : of([]);
        }),
        catchError(() => of([])),
      );
    }
  }

  validateBrandExists(): void {
    const isNotSuggestion = false;
    setTimeout(() => {
      this.getBrandFormControl.value &&
        this.marketPlaceService
          .getMarketPlaceBrandSuggestions(this.getBrandFormControl.value, SocialTypes.LAZADA, isNotSuggestion)
          .pipe(
            tap((brand) => {
              if (!brand.length) {
                const warningTitle = this.translate.instant('Warning');
                const warningText = `${this.getBrandFormControl.value} ${this.translate.instant('option_not_present_error')}`;
                this.getBrandFormControl.setValue(null);
                this.toastr.warning(warningText, warningTitle);
              }
            }),
          )
          .subscribe();
    }, 800);
  }

  setSaleAttributeSameValidation(): void {
    const skuAttrArray = this.getSKUAttributeRequiredFormArray;
    skuAttrArray?.controls.forEach((skuAttrGroup: FormGroup) => {
      const saleAttrArray = skuAttrGroup.get('saleAttribute') as FormArray;
      saleAttrArray?.controls?.forEach((saleAttrGroup: FormGroup) => {
        for (const saleControlName in saleAttrGroup.controls) {
          const saleFormControl = saleAttrGroup?.controls[saleControlName] as FormControl;
          saleFormControl.setErrors({ sameSaleValue: true });
        }
      });
    });
  }

  addValidationRules(): void {
    this.validationMessages = [];
    const requiredRules: IValidationMessage[] = [...this.normalAttributeRequired, ...this.skuSaleAttributeRequired].map((attr) => {
      const { name, label } = attr;
      return {
        control: name,
        rules: {
          required: `${label} ${this.publishMarketPlaceCommon.isRequiredText}`,
        },
      };
    });
    this.validationMessages = [...validationMessages, ...requiredRules];
  }

  setSKUAttributeFormGroup(): void {
    this.skuAttributeRequired = this.getCategoryAttributeFilter(this.skuAttributes, 'is_mandatory', 1);
    this.packageAttributeSKURequired = intersectionWith(this.skuAttributeRequired, this.packageSKUAttributeRequiredList, (a, b) => a.name === b);
    this.skuAttributeRequired = differenceWith(this.skuAttributeRequired, this.packageSKUAttributeRequiredList, (a, b) => a.name === b);
    this.skuAttributeNotRequired = this.getCategoryAttributeFilter(this.skuAttributes, 'is_mandatory', 0);
    this.skuSaleAttributeRequired = this.getCategoryAttributeFilter(this.skuAttributeNotRequired, 'is_sale_prop', 1);
    this.filterSaleAttributeRequired = deepCopy(this.skuSaleAttributeRequired);
    this.skuAttributeNotRequired = this.getCategoryAttributeFilter(this.skuAttributeNotRequired, 'is_sale_prop', 0);
    this.setAttributeFormGroup(LazadaCategoryAttributeFormGroupTypes.SKU_ATTRIBUTE_REQUIRED, this.skuAttributeRequired, this.isRequired, true);
    this.setAttributeFormGroup(LazadaCategoryAttributeFormGroupTypes.SKU_ATTRIBUTE_NOT_REQUIRED, this.skuAttributeNotRequired, this.isNotRequired);
    this.togglerInputs[1].requiredForm.attributes = this.skuAttributeRequired;
    this.togglerInputs[1].notRequiredForm.attributes = this.skuAttributeNotRequired;
  }

  filterSaleAttributeDropDown(index: number, controlName: string, formGroupType: LazadaCategoryAttributeFormGroupTypes, skuSaleRequired: ILazadaCategoryAttribute): void {
    const storedFilterList = this.filterSaleAttributeRequired.find(({ name }) => name === controlName);
    if (!storedFilterList?.options.length) return;
    skuSaleRequired.options = storedFilterList.options;
    const selectedSaleFormControl = this.getSelectedSaleAttributeFormControl(index, controlName, formGroupType);
    selectedSaleFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((searchString: string) => {
      skuSaleRequired.options = storedFilterList?.options?.filter((option) => option?.name?.toLowerCase().includes(searchString?.toLowerCase()));
    });
  }

  onSaleAttributeBlur(index: number, controlName: string, formGroupType: LazadaCategoryAttributeFormGroupTypes): void {
    setTimeout(() => {
      const selectedSaleFormControl = this.getSelectedSaleAttributeFormControl(index, controlName, formGroupType);
      const selectedSaleFormControlValue = selectedSaleFormControl.value;
      if (!selectedSaleFormControlValue) return;
      const storedFilterList = this.filterSaleAttributeRequired.find(({ name }) => name === controlName);
      if (!storedFilterList?.options.length) return;
      const saleSKUOptionList = storedFilterList?.options;
      const selectedFoundInList = saleSKUOptionList?.find(({ name }) => name === selectedSaleFormControlValue)?.name;
      if (!selectedFoundInList) {
        const optionNotPresentError = this.translate.instant('option_not_present_error');
        const warningMessage = `"${selectedSaleFormControlValue}" ${optionNotPresentError}`;
        const warningTitle = `${storedFilterList.label} not valid`;
        this.toastr.warning(warningMessage, warningTitle);
        selectedSaleFormControl.setValue(null);
      }
    }, 800);
  }

  getSelectedSaleAttributeFormControl(index: number, controlName: string, formGroupType: LazadaCategoryAttributeFormGroupTypes): FormControl {
    const saleSKUFormArray = this.productPublishForm.get(formGroupType) as FormArray;
    const saleSKUFormGroup = saleSKUFormArray.at(index) as FormGroup;
    const saleFormArray = saleSKUFormGroup.get('saleAttribute') as FormArray;
    const saleFormGroup = saleFormArray.controls.find((groupForm: FormGroup) => groupForm.get(controlName));
    return saleFormGroup.get(controlName) as FormControl;
  }

  patchPackageAttributeSKUValues(): void {
    const { weight, dimension } = this.moreProduct;
    const { height, length, width } = dimension;
    const packageAttributeValues = [weight, length, height, width];
    this.packageSKUAttributeRequiredList.forEach((attr, index) => {
      const packageControlName = `${LazadaCategoryAttributeFormGroupTypes.SKU_PACKAGE_ATTRIBUTE_REQUIRED}.${attr}`;
      this.productPublishForm.get(packageControlName).setValue(packageAttributeValues[index]);
    });
    this.togglerInputs[2].requiredForm.attributes = this.packageAttributeSKURequired;
  }

  checkLazadaSupportVariants(attributes: ILazadaCategoryAttribute[]): void {
    const isSalePropCount = attributes?.filter(({ is_sale_prop }) => is_sale_prop === 1)?.length || 0;
    this.isLazadaSupportVariant = isSalePropCount ? true : false;
  }

  getCategoryAttributeFilter(attributes: ILazadaCategoryAttribute[], key: string, value: string | number): ILazadaCategoryAttribute[] {
    return attributes?.filter((attribute) => attribute[key] === value) || [];
  }

  setNormalAttributeFormGroup(): void {
    const normalAttributeRequiredWithName = this.getCategoryAttributeFilter(this.normalAttribute, 'is_mandatory', 1);
    remove(normalAttributeRequiredWithName, { name: 'name' });
    this.normalAttributeRequired = normalAttributeRequiredWithName;
    this.normalAttributeNotRequired = this.getCategoryAttributeFilter(this.normalAttribute, 'is_mandatory', 0);
    this.normalAttributeNotRequired = this.normalAttributeNotRequired?.filter(({ name }) => name !== 'description');
    this.setAttributeFormGroup(LazadaCategoryAttributeFormGroupTypes.NORMAL_ATTRIBUTE_REQUIRED, this.normalAttributeRequired, this.isRequired);
    this.setAttributeFormGroup(LazadaCategoryAttributeFormGroupTypes.NORMAL_ATTRIBUTE_NOT_REQUIRED, this.normalAttributeNotRequired, this.isNotRequired);
    this.togglerInputs[0].requiredForm.attributes = this.normalAttributeRequired;
    this.togglerInputs[0].notRequiredForm.attributes = this.normalAttributeNotRequired;
  }

  setSKUPackageAttributeRequiredFormGroup(): void {
    this.productPublishForm.addControl(LazadaCategoryAttributeFormGroupTypes.SKU_PACKAGE_ATTRIBUTE_REQUIRED, new FormGroup({}));
    const packageFormGroup = this.productPublishForm.get(LazadaCategoryAttributeFormGroupTypes.SKU_PACKAGE_ATTRIBUTE_REQUIRED) as FormGroup;
    this.packageSKUAttributeRequiredList.map((packageControl) => {
      packageFormGroup.addControl(packageControl, new FormControl({ value: null }, [Validators.required]));
    });
  }

  setAttributeFormGroup(formGroupName: string, attributes: ILazadaCategoryAttribute[], isRequired: boolean, isSKU = false): void {
    if (!isSKU) {
      const attrFormGroup = this.getAttributeNewFormGroup(attributes, isRequired);
      this.productPublishForm.addControl(formGroupName, attrFormGroup);
    } else {
      this.productPublishForm.addControl(formGroupName, this.fb.array([]));
      const mainFormGroup = this.productPublishForm.get(formGroupName) as FormArray;
      this.moreProduct.variants.map((variant): void => {
        const attrFormGroup = this.getAttributeNewFormGroup(attributes, isRequired);
        const { variantSKU, variantInventory, variantUnitPrice, variantImages, variantMarketPlaceMerged } = variant;
        const variantImagesFormArray = new FormArray([]);
        variantImages?.map((image) => {
          const imageURL = image?.mediaLink;
          variantImagesFormArray.push(new FormControl(imageURL));
        });
        const formControlSKU = 'SellerSku';
        const formControlQuantity = 'quantity';
        const formControlPrice = 'price';
        const isSkuAlreadyPublishedOnMarketPlace = this.publishMarketPlaceCommon.getIsVariantPublishOnMarketPlace(variantMarketPlaceMerged, SocialTypes.LAZADA);
        Object.assign(this.publishMarketPlaceCommon.skuAlreadyPublishedStatusObj, { [variantSKU]: isSkuAlreadyPublishedOnMarketPlace });
        attrFormGroup.addControl('Images', new FormGroup({ Image: variantImagesFormArray }));
        attrFormGroup.get(formControlSKU).setValue(variantSKU);
        attrFormGroup.get(formControlQuantity).setValue(variantInventory);
        attrFormGroup.get(formControlPrice).setValue(variantUnitPrice);
        attrFormGroup.addControl('saleAttribute', this.getSKUSalePropertyRequired());
        isSkuAlreadyPublishedOnMarketPlace && attrFormGroup.disable();
        mainFormGroup.push(attrFormGroup);
        this.skuChecked.push(!isSkuAlreadyPublishedOnMarketPlace);
      });
    }
  }

  getAttributeNewFormGroup(attributes: ILazadaCategoryAttribute[], isRequired: boolean): FormGroup {
    const attrFormGroup = new FormGroup({});
    attributes.map((attribute) => {
      attrFormGroup.addControl(attribute.name, new FormControl(null, isRequired && Validators.required));
    });
    return attrFormGroup;
  }

  getSKUSalePropertyRequired(): FormArray {
    const saleAttrFormArray = new FormArray([]);
    this.skuSaleAttributeRequired?.map((saleAttr) => {
      const saleFormGroup = new FormGroup({
        [saleAttr.name]: new FormControl('', [Validators.required]),
      });
      saleAttrFormArray.push(saleFormGroup);
    });
    return saleAttrFormArray;
  }

  showToast({ title, text, isError }: ITextTitle): void {
    isError ? this.toastr.error(title, text) : this.toastr.success(title, text);
  }

  onClickSaveProductLazada(): void {
    const mainFormControlErrMsg = getFormErrorMessages<IErrorMessagesForm>(this.productPublishForm, this.validationMessages);
    this.setNormalRequiredErrMsg(mainFormControlErrMsg);
    this.setSKUSaleRequiredErrMsg();
    this.validateSameSaleAttribute();
    this.createProductOnLazada();
  }

  validateSameSaleAttribute(): void {
    const saleItemSetValue = this.skuSaleValueSet;
    this.saleItemSameValueIndex = saleItemSetValue.map((e, i) => {
      const slicedArray = saleItemSetValue.slice(i + 1);
      return slicedArray.findIndex((item) => item === e);
    });
    const skuReqFormArray = this.getSKUAttributeRequiredFormArray;
    this.saleItemSameValueIndex?.forEach((saleIndexIndex, index) => {
      const saleAttrGroup = skuReqFormArray.at(index).get('saleAttribute') as FormGroup;
      for (const saleControlName in saleAttrGroup.controls) {
        const saleFormGroup = saleAttrGroup.controls[saleControlName] as FormGroup;
        this.skuSaleAttributeRequired?.map(({ name }) => {
          if (saleIndexIndex !== -1) {
            saleFormGroup.get(name)?.value && saleFormGroup.get(name)?.setErrors({ sameSaleValue: true });
          } else {
            if (saleFormGroup.get(name)?.value) {
              saleFormGroup.get(name)?.setErrors(null);
              saleFormGroup.get(name)?.updateValueAndValidity();
            }
          }
        });
      }
    });
  }

  createProductOnLazada(): void {
    const isSKUSelected = this.getIsSkuFieldValid();
    const isValid = this.productPublishForm.valid;
    if (isValid && isSKUSelected) {
      const createProductParams = this.getCreateProductLazadaParams();
      this.publishMarketPlaceCommon.isLoading = true;
      this.loadingText = `${this.translate.instant('Please wait')}. ${this.translate.instant('Publishing product on Lazada')} `;

      this.marketPlaceService
        .publishProductOnLazada(createProductParams)
        .pipe(
          tap((result) => this.handleCreateProductOnLazadaResult(result)),
          finalize(() => (this.publishMarketPlaceCommon.isLoading = false)),
          takeUntil(this.destroy$),
          catchError((error) => {
            this.publishMarketPlaceCommon.errorOnRequesting();
            throw error;
          }),
        )
        .subscribe();
    } else {
      const errorText = this.translate.instant('Form invalid please fix errors');
      this.toastr.error(errorText, this.publishMarketPlaceCommon.errorTitle);
    }
  }

  handleCreateProductOnLazadaResult(result: IHTTPResult[]): void {
    const isCreateProductSuccess = result.every(({ status }) => status === 200);
    if (isCreateProductSuccess) {
      this.successPublishProductOnLazada(result);
    } else {
      this.errorPublishProductOnLazada(result);
    }
  }

  errorPublishProductOnLazada(errorResult: IHTTPResult[]): void {
    const isError = true;
    if (!this.isCreateMultipleProduct) {
      const [errorResponse] = errorResult;
      const { value: errorHTTPResult } = errorResponse;
      const errorDetailJSON = JSON.parse(errorHTTPResult) as ICreateProductMarketPlaceResponse;
      const { errorCode, value: productName } = errorDetailJSON;
      const errorText = this.getLazadaCreateProductError(errorCode, errorDetailJSON);
      this.openDialog({ title: this.publishMarketPlaceCommon.errorTitle, text: `${productName} ${errorText}` }, isError);
    } else {
      const text = this.getErrorSuccessTextOfMutipleProduct(errorResult);
      this.openDialog({ title: this.publishMarketPlaceCommon.errorTitle, text }, isError);
    }
  }

  getErrorSuccessTextOfMutipleProduct(lazadaResponse: IHTTPResult[]): string {
    let errorTextAll = '';
    lazadaResponse
      ?.filter(({ status }) => status === 200)
      ?.map((errorResponse) => {
        const { value: successHTTPResult } = errorResponse;
        const successDetailJSON = JSON.parse(successHTTPResult) as ICreateProductMarketPlaceResponse;
        const { value: productName } = successDetailJSON;
        const successSingleText = this.translate.instant('published to marketplace successfully');
        const successText = `${productName || this.translate.instant('Error')}} - ${successSingleText} <br>`;
        errorTextAll += successText;
      });
    lazadaResponse
      ?.filter(({ status }) => status !== 200)
      ?.map((errorResponse) => {
        const { value: errorHTTPResult } = errorResponse;
        const errorDetailJSON = JSON.parse(errorHTTPResult) as ICreateProductMarketPlaceResponse;
        const { errorCode, value: productName } = errorDetailJSON;
        const errorText = this.getLazadaCreateProductError(errorCode, errorDetailJSON);
        errorTextAll += `${productName || this.translate.instant('Error')} - ${errorText} <br>`;
      });
    return errorTextAll;
  }

  getLazadaCreateProductError(errorCode: string, errorDetailJSON: ICreateProductMarketPlaceResponse): string {
    if (errorCode !== this.marketPlaceErrorType.ERROR_500) {
      const errorTranslateCode = this.marketPlaceErrorType[errorCode] ? this.marketPlaceErrorType[errorCode] : this.marketPlaceErrorType.ERROR_CREATE_PRODUCT_RECHECK_MARKET;
      const errorMessage = this.translate.instant(errorTranslateCode);
      return errorMessage;
    } else {
      const isProductAlreadyExists = errorDetailJSON.errorJSON.includes('already exists');
      const lazadaErrorMessage = this.getLazadaErrorMessage(errorDetailJSON);
      const errorMessage = isProductAlreadyExists
        ? this.translate.instant(this.marketPlaceErrorType.MARKETPLACE_PRODUCT_ALREADY_EXISTS)
        : this.translate.instant(this.marketPlaceErrorType.ERROR_CREATE_PRODUCT_RECHECK_MARKET);
      return `${errorMessage} <br> ${lazadaErrorMessage}`.trim();
    }
  }
  getLazadaErrorMessage(errorDetailJSON: ICreateProductMarketPlaceResponse): string {
    const errorMsgJSON = JSON.parse(errorDetailJSON?.errorJSON);
    return isEmpty(errorMsgJSON) ? '' : `${errorMsgJSON?.message} ${errorMsgJSON?.detail[0]?.message}` || '';
  }

  successPublishProductOnLazada(result: IHTTPResult[]): void {
    if (!this.isCreateMultipleProduct) {
      const successSingleText = this.translate.instant('published to marketplace successfully');
      const text = `${this.moreProduct.name} ${successSingleText} `;
      this.openDialog({ title: this.publishMarketPlaceCommon.successTitle, text });
    } else {
      const successMultipleText = this.translate.instant('Products published to marketplace successfully');
      const productNames = result.map(({ value }) => JSON.parse(value).value).join(', ');
      const text = `${productNames} ${successMultipleText}`;
      this.openDialog({ title: this.publishMarketPlaceCommon.successTitle, text });
    }
  }

  openDialog(message: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: isError,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe(() => {
      this.publishMarketPlaceCommon.goToListProduct();
    });
  }

  getIsSkuFieldValid(): boolean {
    const isSkuSelected = this.skuChecked.some((checked) => checked);
    this.skuError = !isSkuSelected ? this.translate.instant('Please select at least 1 variant') : null;
    !isSkuSelected && this.skuFieldRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    return isSkuSelected;
  }

  getCreateProductLazadaParams(): ILazadaCreateProductPayload {
    const { name, id: productID } = this.moreProduct;
    const isCreateMultipleProduct = this.isCreateMultipleProduct;
    if (isCreateMultipleProduct) {
      this.productPublishForm.value.skuAttributeRequired.map((skuRequired) => delete skuRequired?.Images);
    }

    const formValue = { productID, ...this.productPublishForm.value, isCreateMultipleProduct } as ILazadaCreateProductPayload;
    const { categoryID } = formValue;
    let payload = {};
    const attributeForm = [...this.categoryAttributeFormGroupList, 'skuPackageAttributeRequired'];
    attributeForm.map((value) => Object.assign(payload, { [value]: formValue[value] ? formValue[value] : null }));
    payload = { ...payload, name };
    return {
      productID,
      categoryID,
      isCreateMultipleProduct,
      payload: JSON.stringify(payload),
    };
  }

  setSKUSaleRequiredErrMsg(): void {
    const skuReqFormArray = this.getSKUAttributeRequiredFormArray;
    this.skuSaleValueSet = [];
    const skuSaleErrMsg = skuReqFormArray?.controls?.map((skuAttrGroup: FormGroup) => {
      const saleAttrFormArray = skuAttrGroup.get('saleAttribute') as FormArray;
      const skuAttrErrMsg = {};
      const saleAttrValue = [];
      saleAttrFormArray?.controls?.map((saleAttrGroup: FormGroup) => {
        for (const saleControlName in saleAttrGroup.controls) {
          const saleControlValue = saleAttrGroup.controls[saleControlName].value;
          saleAttrValue.push(saleControlValue);
        }
        const errMsg = getFormErrorMessages(saleAttrGroup, this.validationMessages);
        Object.assign(skuAttrErrMsg, errMsg);
      });
      this.skuSaleValueSet.push(saleAttrValue.join(':'));
      return skuAttrErrMsg;
    });
    this.errorMessages = { ...this.errorMessages, ...skuSaleErrMsg };
  }

  setNormalRequiredErrMsg(mainFormControlErrMsg: IErrorMessagesForm): void {
    const normalRequiredFormGroup = this.productPublishForm.get(LazadaCategoryAttributeFormGroupTypes.NORMAL_ATTRIBUTE_REQUIRED) as FormGroup;
    const normalRequiredErrMsg = normalRequiredFormGroup ? getFormErrorMessages<IErrorMessagesForm>(normalRequiredFormGroup, this.validationMessages) : {};
    this.errorMessages = { ...mainFormControlErrMsg, ...normalRequiredErrMsg };
  }

  onToggle(toggleID: string): void {
    const toggleInput = this.togglerInputs.find(({ id }) => id === toggleID);
    toggleInput.toggleStatus = !toggleInput.toggleStatus;
  }

  clickOutsideSuggestionEvent(isOutside: boolean): void {
    this.isCategorySuggestionShow = !isOutside;
  }

  onCancelCategorySuggestion(): void {
    this.publishMarketPlaceCommon.showCategorySelector = false;
    console.log('3');
  }

  noBrandClick(): void {
    this.getBrandFormControl.setValue('No Brand');
  }

  getSaleAttributeErrorMessage(index: number, saleControlName: string): string {
    return this.errorMessages?.[index]?.[saleControlName + 'ErrorMessage'];
  }

  ngOnDestroy(): void {
    this.destroy$?.next(null);
    this.destroy$?.unsubscribe();
  }
}
