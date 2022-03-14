import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ITextTitle } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { getProductStatusLinkedToMarketPlace } from '@reactor-room/plusmar-front-end-helpers';
import {
  IKeyValueIcon,
  ILazadaCategories,
  IProductByID,
  IProductMarketPlaceCategoryTree,
  IVariantMarketPlaceMerged,
  IVariantsOfProductByID,
  ProductRouteTypes,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';

export class PublishMarketPlaceCommon {
  isCategoryExists = false;
  showCategorySelector = false;
  selectedCategory: ILazadaCategories;
  selectCategory = [] as IProductMarketPlaceCategoryTree[];
  isLoading = false;
  isRequiredText = this.translate.instant('is required');
  skuAlreadyPublishedStatusObj = {} as { [key: string]: boolean };
  successTitle = this.translate.instant('Success');
  errorTitle = this.translate.instant('Error');

  constructor(public router: Router, public translate: TranslateService, private toastr: ToastrService, private productCommonService: ProductCommonService) {}

  errorOnRequesting(): void {
    const title = this.errorTitle;
    const text = this.translate.instant('Error in getting response');
    this.showToast({ title, text, isError: true });
    this.goToListProduct();
  }

  showToast({ title, text, isError }: ITextTitle): void {
    isError ? this.toastr.error(title, text) : this.toastr.success(title, text);
  }

  goToListProduct(): void {
    const firstPage = 1;
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.PRODUCT_LIST);
    void this.router.navigate([routerInit, firstPage]);
  }

  setProductDetails(moreProduct: IProductByID): [IKeyValueIcon, IKeyValueIcon, IKeyValueIcon] {
    const nameDetail: IKeyValueIcon = {
      id: 'name',
      key: 'Product Name',
      value: moreProduct.name,
      icon: 'assets/img/icon_product.png',
    };
    const categoryDetails: IKeyValueIcon = {
      id: 'cateory',
      key: 'Categories',
      value: moreProduct.categories?.map((cat) => cat.name).join(', '),
      icon: 'assets/img/icon_category.png',
    };
    const imageDetails: IKeyValueIcon = {
      id: 'image',
      key: 'Image',
      value: moreProduct.images[0]?.mediaLink,
      icon: 'assets/img/icon_image.png',
    };
    return [nameDetail, categoryDetails, imageDetails];
  }

  clickOutsideSelectorEvent(isOutside: boolean): void {
    this.showCategorySelector = !isOutside;
  }

  showMarketPlaceApiError(errText: string): void {
    this.toastr.error(errText, this.errorTitle);
    this.goToListProduct();
  }

  redirectProductLinkedToMarketPlace(variants: IVariantsOfProductByID[], marketPlaceType: SocialTypes): void {
    const marketPlaceStatus = getProductStatusLinkedToMarketPlace(variants);
    const marketPlaceTypeStatus = marketPlaceStatus[marketPlaceType];
    if (marketPlaceTypeStatus) {
      const errText = this.translate.instant('Product already exists on marketplace');
      this.showMarketPlaceApiError(errText);
    }
  }

  getIsVariantPublishOnMarketPlace(variantMarketPlaceMerged: IVariantMarketPlaceMerged[], socialType: SocialTypes): boolean {
    return variantMarketPlaceMerged?.filter(({ marketPlaceVariantType }) => marketPlaceVariantType === socialType)?.length ? true : false;
  }
}
