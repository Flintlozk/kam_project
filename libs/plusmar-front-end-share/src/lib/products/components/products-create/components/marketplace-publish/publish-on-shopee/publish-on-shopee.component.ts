import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { getFormErrorMessages, isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult, IKeyValuePair, IValidationMessage } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import {
  BRAND_ID,
  ICategorySelectedEmitter,
  ICatSubCatHolder,
  IErrorMessagesForm,
  IKeyValueIcon,
  IMarketPlaceTogglerInput,
  IProductByID,
  IProductDimension,
  IProductMarketPlaceCategoryTree,
  IShopeeAttributes,
  IShopeeBrandList,
  IShopeeBrandResponse,
  IShopeeCreateProductPayload,
  IShopeeLogistics,
  IShopeeLogisticsItemMaxDimension,
  ShopeeAttributeType,
  ShopeeCategoryAttributeFormGroupTypes,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, forkJoin, Subject } from 'rxjs';
import { catchError, finalize, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ProductMarketPlaceService } from '../../../../../services/product-marketplace.service';
import { PublishMarketPlaceCommon } from '../publishMarketPlaceCommon';

@Component({
  selector: 'reactor-room-publish-on-shopee',
  templateUrl: './publish-on-shopee.component.html',
  styleUrls: ['./publish-on-shopee.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PublishOnShopeeComponent implements OnInit, OnDestroy {
  @ViewChild('logisticFieldRef') logisticFieldRef: ElementRef;
  @ViewChild('skuFieldRef') skuFieldRef: ElementRef;
  categoryLevels = [] as {
    [key: number]: IProductMarketPlaceCategoryTree[];
  }[];
  togglerHeaderIcon = 'assets/img/social/shopee-orange-icon.svg';
  shopeeWhiteIcon = 'assets/img/social/shopee-white.svg';
  loadingText = this.translate.instant('Please wait creating product on Shopee');
  headingTitle = this.translate.instant('Create Product On Shopee');
  routeTitle = this.translate.instant('Products/Create Shopee Product');
  isMoreCommerceProductHaveVariants: boolean;
  moreProduct: IProductByID;
  destroy$ = new Subject();
  productDetails = [] as IKeyValueIcon[];
  productPublishForm: FormGroup;
  categories: ICatSubCatHolder[];
  errorMessages = {};
  marketPlaceType = SocialTypes.SHOPEE;
  isCategorySelectedBySuggestion = false;
  moreCommerceIcon = this.marketPlaceService.marketPlaceIconObj[SocialTypes.MORE_COMMERCE];
  currentLanguage = 'en';
  shopeeAttributeType = ShopeeAttributeType;
  packageDetails = [
    {
      key: 'Package Weight',
      value: null,
    },
    {
      key: 'Package Length (cm)',
      value: null,
    },
    {
      key: 'Package Height (cm)',
      value: null,
    },
    {
      key: 'Package Width (cm)',
      value: null,
    },
  ] as IKeyValuePair[];
  skuChecked = [] as boolean[];
  publishMarketPlaceCommon = new PublishMarketPlaceCommon(this.router, this.translate, this.toastr, this.productCommon);

  isAddVariant = false;

  logistics: IShopeeLogistics[];
  attributes: IShopeeAttributes[];
  requiredAttributes = [] as IShopeeAttributes[];
  notRequiredAttributes = [] as IShopeeAttributes[];
  packageAttributeSKURequired = [] as IShopeeAttributes[];
  shopeeCustomFormGroupNames = ShopeeCategoryAttributeFormGroupTypes;
  logisticSelected = [] as IShopeeLogistics[];
  togglerInputs: IMarketPlaceTogglerInput[] = [
    {
      id: 'basic_field',
      title: 'Basic Field',
      toggleStatus: true,
      icon: this.togglerHeaderIcon,
      requiredForm: {
        attributes: [],
        groupName: ShopeeCategoryAttributeFormGroupTypes.NORMAL_ATTRIBUTE_REQUIRED,
      },
      notRequiredForm: {
        attributes: [],
        groupName: null,
      },
    },
    {
      id: 'attribute_field',
      title: 'Attribute Field',
      toggleStatus: true,
      icon: this.togglerHeaderIcon,
      requiredForm: {
        attributes: [],
        groupName: ShopeeCategoryAttributeFormGroupTypes.ATTRIBUTE_REQUIRED,
      },
      notRequiredForm: {
        attributes: [],
        groupName: ShopeeCategoryAttributeFormGroupTypes.ATTRIBUTE_NOT_REQUIRED,
      },
    },
    {
      id: 'logistics_field',
      title: 'Logistics Field',
      toggleStatus: true,
      icon: this.togglerHeaderIcon,
      requiredForm: {
        attributes: [],
        groupName: ShopeeCategoryAttributeFormGroupTypes.LOGISTICS_REQUIRED,
      },
      notRequiredForm: null,
    },
    {
      id: 'sku_field',
      title: 'Sku Field',
      toggleStatus: true,
      icon: this.togglerHeaderIcon,
      requiredForm: {
        attributes: [],
        groupName: ShopeeCategoryAttributeFormGroupTypes.SKU_ATTRIBUTE_REQUIRED,
      },
      notRequiredForm: null,
    },
  ];
  skuError: string;
  logisticError: string;
  categoryError: string;
  validationMessages: IValidationMessage[];
  brands = [] as IShopeeBrandList[];
  pageThirdParty$ = this.pageService.getPageThirdPartyByPageType(SocialTypes.SHOPEE);
  errorTitle = this.translate.instant('Error');

  get getAttributeRequired(): FormGroup {
    return this.productPublishForm?.get(ShopeeCategoryAttributeFormGroupTypes.ATTRIBUTE_REQUIRED) as FormGroup;
  }

  get getAttributeNotRequired(): FormGroup {
    return this.productPublishForm?.get(ShopeeCategoryAttributeFormGroupTypes.ATTRIBUTE_NOT_REQUIRED) as FormGroup;
  }

  constructor(
    public router: Router,
    public translate: TranslateService,
    private route: ActivatedRoute,
    public marketPlaceService: ProductMarketPlaceService,
    public productService: ProductsService,
    private pageService: PagesService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public productCommon: ProductCommonService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.pageThirdParty$
      .pipe(
        tap((page) => {
          if (page.id) {
            this.getProductDetails();
          } else {
            const errMessage = this.translate.instant('Please connect shopee marketplace');
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
        tap((product) => this.initShopeeForm(product)),
        catchError((err) => {
          this.publishMarketPlaceCommon.errorOnRequesting();
          throw err;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  initShopeeForm(product: IProductByID[]): void {
    this.moreProduct = product[0];
    const { images } = this.moreProduct;
    if (images?.length) {
      const { variants } = this.moreProduct;
      this.publishMarketPlaceCommon.redirectProductLinkedToMarketPlace(variants, SocialTypes.SHOPEE);
      this.isMoreCommerceProductHaveVariants = this.moreProduct?.variants[0]?.variantAttributes[0]?.name ? true : false;
      isEmpty(this.moreProduct) && this.publishMarketPlaceCommon.errorOnRequesting();
      this.productDetails = this.publishMarketPlaceCommon.setProductDetails(this.moreProduct);
      this.populateSKUCheckbox();
      if (!this.isAddVariant) {
        this.initProductPublishForm();
        this.publishMarketPlaceCommon.showCategorySelector = true;
        this.subscribeToShopeeCategory();
        this.setCategorySelected();
        this.setPackageDetails();
      }
    } else {
      const title = this.translate.instant('Error');
      const text = this.translate.instant('Product Image not available please upload image before publishing to marketplace');
      const isError = true;
      const isNoImage = true;
      this.openDialog({ title, text }, isError, isNoImage);
    }
  }

  populateSKUCheckbox(): void {
    this.skuChecked = [];
    this.moreProduct.variants.forEach((variant) => {
      const { variantSKU, variantMarketPlaceMerged } = variant;
      const isSkuAlreadyPublishedOnMarketPlace = this.publishMarketPlaceCommon.getIsVariantPublishOnMarketPlace(variantMarketPlaceMerged, SocialTypes.SHOPEE);
      Object.assign(this.publishMarketPlaceCommon.skuAlreadyPublishedStatusObj, { [variantSKU]: isSkuAlreadyPublishedOnMarketPlace });
      this.skuChecked.push(!isSkuAlreadyPublishedOnMarketPlace);
      if (isSkuAlreadyPublishedOnMarketPlace) this.isAddVariant = true;
    });
  }

  subscribeToShopeeCategory(): void {
    this.productPublishForm
      .get('category')
      .valueChanges.pipe(
        startWith(1),
        tap((category) => (category?.length ? (this.publishMarketPlaceCommon.isCategoryExists = true) : (this.publishMarketPlaceCommon.isCategoryExists = false))),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  getLogistics(): void {
    this.publishMarketPlaceCommon.isLoading = true;
    this.loadingText = 'Please wait, Getting Shopee Logistics';
    this.marketPlaceService
      .getShopeeLogistics()
      .pipe(
        tap((logistics) => {
          this.logisticError = null;
          this.skuError = null;
          const shopeeLogistics = JSON.parse(logistics.text) as IShopeeLogistics[];
          this.logistics = this.getLogisticsWithAllowedFlag(shopeeLogistics);
          this.productPublishForm.addControl(ShopeeCategoryAttributeFormGroupTypes.LOGISTICS_REQUIRED, new FormArray([]));
          const logisticFormArr = this.productPublishForm.get(ShopeeCategoryAttributeFormGroupTypes.LOGISTICS_REQUIRED) as FormArray;
          this.logistics.map((logistic) => {
            const { enabled } = logistic;
            logisticFormArr.push(new FormControl({ value: false, disabled: !enabled }));
            if (enabled) {
              this.logisticSelected.push(logistic);
            }
          });
        }),
        finalize(() => (this.publishMarketPlaceCommon.isLoading = false)),
        catchError((err) => {
          console.log('err --> ', err);
          this.publishMarketPlaceCommon.errorOnRequesting();
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  getLogisticsWithAllowedFlag(logistics: IShopeeLogistics[]): IShopeeLogistics[] {
    const { weight, dimension } = this.moreProduct;
    const logisticsWithoutCustom = logistics.filter((logistic) => logistic.fee_type !== 'CUSTOM_PRICE');
    const logisticWithAllowedFlag = logisticsWithoutCustom.map((logistic) => {
      const { weight_limit, item_max_dimension } = logistic;
      const { item_min_weight, item_max_weight } = weight_limit;
      if (+weight >= item_min_weight && +weight <= item_max_weight) {
        if (!item_max_dimension) return { ...logistic, is_allowed: true };
        const isAllowedDimension = this.getShopeeLogisticPackageDimensionAllowed(dimension, item_max_dimension);
        return isAllowedDimension ? { ...logistic, is_allowed: true } : { ...logistic, is_allowed: false };
      } else {
        return { ...logistic, is_allowed: false };
      }
    });
    return logisticWithAllowedFlag;
  }

  getShopeeLogisticPackageDimensionAllowed(dimension: IProductDimension, item_max_dimension: IShopeeLogisticsItemMaxDimension): boolean {
    let isAllowedDimension = true;
    for (const [key, value] of Object.entries(dimension)) {
      const itemDimensionValue = item_max_dimension[key];
      if (value > itemDimensionValue) isAllowedDimension = false;
    }
    return isAllowedDimension;
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

  onCategoryInputClick(): void {
    this.publishMarketPlaceCommon.showCategorySelector = true;
  }

  onToggle(toggleID: string): void {
    const toggleInput = this.togglerInputs.find(({ id }) => id === toggleID);
    toggleInput.toggleStatus = !toggleInput.toggleStatus;
  }

  categorySelectedFromSelector({ showCategorySelector, selectedCategory, selectCategory, categoryLevels }: ICategorySelectedEmitter): void {
    this.publishMarketPlaceCommon.showCategorySelector = showCategorySelector;
    this.publishMarketPlaceCommon.selectedCategory = selectedCategory;
    this.publishMarketPlaceCommon.selectCategory = selectCategory;
    this.categoryLevels = categoryLevels;
  }

  setCategorySelected(): void {
    this.marketPlaceService.setFormCategorySelected$
      .pipe(
        tap(({ categoryId, categoryPath }) => {
          this.productPublishForm.get('category').setValue(categoryPath);
          this.productPublishForm.get('categoryID').setValue(categoryId);
          this.getShopeeCategoryAttribute(categoryId, this.marketPlaceType, this.currentLanguage);
          this.getLogistics();
          this.setPackageDetails();
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  getShopeeCategoryAttribute(categoryID: number, marketPlaceType: SocialTypes, lang: string): void {
    if (!categoryID) return;
    const attributes$ = this.marketPlaceService.getShopeeCategoryAttribute(categoryID, marketPlaceType, lang);
    const brands$ = this.marketPlaceService.getShopeeBrands(categoryID);
    forkJoin([attributes$, brands$])
      .pipe(
        tap(([attributes, brands]) => {
          this.manageShopeeAttributes(attributes, brands);
        }),
        catchError((error) => {
          console.log('~ error', error);
          const isAccessTokenExpire = error?.message?.includes('access_token');
          const errorText = !isAccessTokenExpire ? this.translate.instant('error_connecting_shopee') : this.translate.instant('Access token please reconnect shopee');
          this.publishMarketPlaceCommon.showMarketPlaceApiError(errorText);
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  manageShopeeAttributes(attributes: IShopeeAttributes[], { brandList, isMandatory }: IShopeeBrandResponse): void {
    const isRequired = true;
    this.brands = brandList;
    this.attributes = attributes;
    this.requiredAttributes = attributes.filter(({ is_mandatory }) => is_mandatory);
    this.notRequiredAttributes = attributes.filter(({ is_mandatory }) => !is_mandatory);
    const brandToAttribute = this.getBrandAttribute(brandList, isMandatory);
    if (isMandatory) {
      this.requiredAttributes.push(brandToAttribute);
    } else {
      this.notRequiredAttributes.push(brandToAttribute);
    }
    const requireAttributeFormGroup = this.getAttributeNewFormGroup(this.requiredAttributes, isRequired);
    const notRequireAttributeFormGroup = this.getAttributeNewFormGroup(this.notRequiredAttributes, !isRequired);
    this.productPublishForm.addControl(ShopeeCategoryAttributeFormGroupTypes.ATTRIBUTE_REQUIRED, requireAttributeFormGroup);
    this.productPublishForm.addControl(ShopeeCategoryAttributeFormGroupTypes.ATTRIBUTE_NOT_REQUIRED, notRequireAttributeFormGroup);
    if (this.requiredAttributes?.length) {
      this.togglerInputs[1].requiredForm.attributes = this.requiredAttributes;
    } else {
      this.togglerInputs[1].requiredForm = null;
    }
    if (this.notRequiredAttributes?.length) {
      this.togglerInputs[1].notRequiredForm.attributes = this.notRequiredAttributes;
    } else {
      this.togglerInputs[1].notRequiredForm = null;
    }
    this.addValidationRules();
  }

  getBrandAttribute(brandList: IShopeeBrandList[], is_mandatory: boolean): IShopeeAttributes {
    return {
      attribute_id: BRAND_ID,
      original_attribute_name: 'Brand',
      display_attribute_name: 'Brand',
      is_mandatory,
      attribute_value_list:
        brandList?.map((brand) => ({
          value_id: brand.brand_id,
          display_value_name: brand.display_brand_name,
          original_value_name: brand.original_brand_name,
        })) || [],
    };
  }

  addValidationRules(): void {
    this.validationMessages = [];
    const requiredRules: IValidationMessage[] = this.requiredAttributes?.map((attr) => {
      const { attribute_id, original_attribute_name } = attr;
      return {
        control: attribute_id + '',
        rules: {
          required: `${original_attribute_name} ${this.publishMarketPlaceCommon.isRequiredText}`,
        },
      };
    });
    this.validationMessages = requiredRules;
  }

  getAttributeNewFormGroup(attributes: IShopeeAttributes[], isRequired: boolean): FormGroup {
    const attrFormGroup = new FormGroup({});
    attributes.map((attribute) => {
      const { attribute_id } = attribute;
      attrFormGroup.addControl(`${attribute_id}`, new FormControl(null, isRequired && Validators.required));
      attrFormGroup.addControl('attribute_id', new FormControl(attribute_id, isRequired && Validators.required));
    });
    return attrFormGroup;
  }
  setPackageDetails(): void {
    const { weight, dimension } = this.moreProduct;
    const { height, length, width } = dimension;
    const packageAttributeValues = [weight, length, height, width];
    this.packageDetails.forEach((detail, index) => (detail.value = packageAttributeValues[index]));
  }

  getIsPublishFormIsValid(): boolean {
    const isCategoryValid = this.getIsCategoryValid();
    const isAttributeValid = this.getIsAttributeValid();
    const isSkuSelected = this.getIsSkuFieldValid();
    const isLogisticSelected = this.getIsLogisticFieldValid();
    const isValidForSubmit = [isCategoryValid, isSkuSelected, isLogisticSelected, isAttributeValid].every((isValid) => isValid);
    return isValidForSubmit;
  }

  getIsAttributeValid(): boolean {
    const attributeControlErrMsg = getFormErrorMessages<IErrorMessagesForm>(this.getAttributeRequired, this.validationMessages);
    this.errorMessages = attributeControlErrMsg;
    return isEmpty(this.errorMessages) ? true : false;
  }

  getIsCategoryValid(): boolean {
    const categoryFormControlValid = this.productPublishForm.get('category').valid;
    this.categoryError = categoryFormControlValid ? null : this.translate.instant('Please select category');
    return categoryFormControlValid;
  }

  getIsSkuFieldValid(): boolean {
    const isSkuSelected = this.skuChecked.some((checked) => checked);
    this.skuError = !isSkuSelected ? this.translate.instant('Please select at least 1 variant') : null;
    !isSkuSelected && this.skuFieldRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    return isSkuSelected;
  }

  getIsLogisticFieldValid(): boolean {
    const logisticValue = this.productPublishForm.get(this.shopeeCustomFormGroupNames.LOGISTICS_REQUIRED)?.value;
    const isLogisticSelected = logisticValue?.length ? logisticValue?.some((checked) => checked) : false;
    !isLogisticSelected && this.logisticFieldRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    this.logisticError = !isLogisticSelected ? this.translate.instant('Please select at least 1 logistics') : null;
    return isLogisticSelected;
  }

  //we are stringifying some of the fields because of its dynamic nature
  getPublishToShopeePayload(): IShopeeCreateProductPayload {
    const { id: productID } = this.moreProduct;
    const logisticFormArray = this.productPublishForm.get(ShopeeCategoryAttributeFormGroupTypes.LOGISTICS_REQUIRED);
    const logisticFormValue = logisticFormArray.value;
    const selectedLogistics = this.logistics.filter((logistic, index) => logisticFormValue[index] && logistic);
    const attributeRequiredValue = this.getAttributeRequired.value;
    const attributeNotRequiredValue = this.getAttributeNotRequired.value;
    const attributeObj = { ...attributeRequiredValue, ...attributeNotRequiredValue };
    const attributeArray = [attributeRequiredValue, attributeNotRequiredValue];
    const brandID = attributeObj[BRAND_ID];
    const selectedBrand = this.brands.find((brand) => brand.brand_id === brandID);
    const attributes = JSON.stringify(attributeArray);
    const variantIDs = this.getSelectedVariantsIDs();
    const categoryID = this.productPublishForm.get('categoryID').value;
    const logistics = JSON.stringify(selectedLogistics);
    const brand = selectedBrand?.original_brand_name || null;
    return { productID, categoryID, variantIDs, logistics, attributes, brand };
  }

  getSelectedVariantsIDs(): number[] {
    const variants = this.moreProduct.variants.filter((variant, index) => this.skuChecked[index] && variant);
    return variants.map(({ variantID }) => variantID);
  }

  onClickSaveProductShopee(): void {
    if (!this.isAddVariant) {
      this.publishProductOnShopee();
    } else {
      this.publishVariantOnShopee();
    }
  }

  publishVariantOnShopee(): void {
    const isSkuSelected = this.getIsSkuFieldValid();
    if (isSkuSelected) {
      this.publishMarketPlaceCommon.isLoading = true;
      this.loadingText = this.translate.instant('Please wait creating product on Shopee');
      const variantIDs = this.getSelectedVariantsIDs();
      const { id: productID } = this.moreProduct;
      this.marketPlaceService
        .publishVariantToShopeeProduct(productID, variantIDs)
        .pipe(
          tap((result) => {
            this.showPublishResponseDialog(result);
          }),
          finalize(() => (this.publishMarketPlaceCommon.isLoading = false)),
          catchError((err) => {
            console.log('err in publish variant', err);
            return EMPTY;
          }),
          takeUntil(this.destroy$),
        )
        .subscribe();
    } else {
      this.showFormSubmitError();
    }
  }

  publishProductOnShopee(): void {
    this.checkHiddenVariants();
    const isValid = this.getIsPublishFormIsValid();
    if (isValid && this.productPublishForm.valid) {
      this.loadingText = this.translate.instant('Please wait creating product on Shopee');
      this.publishMarketPlaceCommon.isLoading = true;
      this.marketPlaceService
        .publishProductOnShopee(this.getPublishToShopeePayload())
        .pipe(
          tap((result) => {
            this.showPublishResponseDialog(result);
          }),
          finalize(() => (this.publishMarketPlaceCommon.isLoading = false)),
          catchError((err) => {
            console.log('err in publish product', err);
            return EMPTY;
          }),
          takeUntil(this.destroy$),
        )
        .subscribe();
    } else {
      this.showFormSubmitError();
    }
  }

  checkHiddenVariants(): void {
    const { variants } = this.moreProduct;
    this.skuChecked = variants.map(() => true);
  }

  showPublishResponseDialog(result: IHTTPResult[]): void {
    const text = result.map(({ value }) => this.translate.instant(value)).join('<br>');
    const isAnyError = result.some(({ status }) => status === 403);
    const title = isAnyError ? this.publishMarketPlaceCommon.errorTitle : this.publishMarketPlaceCommon.successTitle;
    this.openDialog({ text, title }, isAnyError);
  }

  showFormSubmitError(): void {
    const title = this.translate.instant('Form is not valid');
    const text = this.publishMarketPlaceCommon.errorTitle;
    const isError = true;
    this.publishMarketPlaceCommon.showToast({ title, text, isError });
  }

  openDialog(message: { text: string; title: string }, isError = false, isNoImage = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: isError,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe(() => {
      if (!isError) this.publishMarketPlaceCommon.goToListProduct();
      if (isNoImage) this.publishMarketPlaceCommon.goToListProduct();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
