import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent, SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import {
  EnumResourceValidation,
  IProductAllList,
  IProductCategoryList,
  IProductList,
  IVariantsOfProduct,
  MergeMarketUpdatePriceInventoryResultType,
  ProductRouteTypes,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { IDObject, IHTTPResult, ITextTitle } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { fadeInOutFasterAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { IDropDown, ITransformDropdown } from '@reactor-room/plusmar-front-end-share/app.model';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { ResourceValidationService } from '@reactor-room/plusmar-front-end-share/services/resource-validation/resource-validation.service';
import { flatten, intersectionBy, isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { TableForProducts } from '../product-table-header';
@Component({
  selector: 'reactor-room-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInOutFasterAnimation],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  tableForProduct = new TableForProducts();
  destroy$: Subject<boolean> = new Subject<boolean>();
  tableData = [] as IProductAllList[];
  storedTableData = [] as IProductList[];
  totalRows = 0;
  searchField: FormControl;
  categoryData = [] as IProductCategoryList[];
  categoryDropdown = [] as IDropDown[];
  loaderText = this.translate.instant('Loading. Please wait');
  categoryDefault = '-1';
  categoryDialogDefault: IDropDown = { label: this.translate.instant('Categories'), value: '-1' };
  mergeProductVariant$ = new Subject<number>();
  ////:: marketplace functionality commenting now
  // moreCommerceType = SocialTypes.MORE_COMMERCE as string;
  noImage = 'assets/img/image-icon.svg';
  ////:: marketplace functionality commenting now
  //marketPlaceIconObj = this.marketPlaceService.marketPlaceIconObj;
  toggleStatus = [] as Array<boolean>;
  tableFilters = this.tableForProduct.commonTableFilters;
  fbPageID: string;
  toastPosition = 'toast-bottom-right';
  variantMergeProductID: number;
  variantMergeMarketIDs: number[];
  moreCommerceMergeVariant: IVariantsOfProduct;
  lazadaMergeVariant: IVariantsOfProduct;
  socialTypes = SocialTypes;

  moreOptionData = [
    { imgUrl: 'assets/img/copy-icon.png', title: this.translate.instant('Copy Link'), id: 'copy' },
    { imgUrl: 'assets/img/trash-icon.svg', title: this.translate.instant('Delete'), id: 'delete' },
    ////:: marketplace functionality commenting now
    // { imgUrl: 'assets/icons/merge-product.svg', title: this.translate.instant('Merge Product'), id: 'merge_product' },
    // { imgUrl: 'assets/icons/unmerge-product.svg', title: this.translate.instant('UnMerge Product'), id: 'unmerge_product' },
    //{ imgUrl: this.marketPlaceIconObj[SocialTypes.LAZADA], title: this.translate.instant('Publish on Lazada'), id: SocialTypes.LAZADA },
    //{ imgUrl: this.marketPlaceIconObj[SocialTypes.SHOPEE], title: this.translate.instant('Publish on Shopee'), id: SocialTypes.SHOPEE },
  ];

  constructor(
    private productListService: ProductsService,
    private commonMethodsService: CommonMethodsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private resourceValidationService: ResourceValidationService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    public translate: TranslateService,
    ////:: marketplace functionality commenting now
    //private marketPlaceService: ProductMarketPlaceService,
    private productCommonService: ProductCommonService,
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.searchField = new FormControl();
    this.tableForProduct.isLoading = true;

    this.searchField.valueChanges.pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((value) => {
      this.searchByName(value);
    });
    this.getCurrentFBPageID();
    this.getCategoryData();
    this.getProductListData();
  }

  getProductListData(): void {
    this.tableForProduct.isLoading = true;
    this.loaderText = this.translate.instant('Loading your products. Please wait');
    this.productListService
      .getProductAllList(this.tableFilters)
      .pipe(
        takeUntil(this.destroy$),
        tap((productList) => (productList?.length ? this.processReceivedProductList(productList) : this.processNoProductList())),
        catchError((err) => {
          console.log(' err => ', err);
          this.processNoProductList();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  goToProductCreate(): void {
    const requestValidations: EnumResourceValidation[] = [EnumResourceValidation.VALIDATE_MAX_PRODUCTS];
    this.resourceValidationService
      .validateResources(requestValidations)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => void this.router.navigate(['product-new'], { relativeTo: this.route.parent }),
        (err) => {
          if (err.message.indexOf('PRODUCT_REACHED_LIMIT') !== -1) {
            const title = this.translate.instant('Cant add new product');
            const text = this.translate.instant('You have reached a limit to create product');
            this.openResponseDialog({ text, title }, true);
          } else {
            console.log('err', err);
            const text = this.translate.instant('Something went wrong');
            const title = this.translate.instant('Error');
            this.openResponseDialog({ text, title }, true);
          }
        },
      );
  }

  goToProduct(id: number): void {
    void this.router.navigate([id], { relativeTo: this.route.parent });
  }

  getCurrentFBPageID(): void {
    this.productListService
      .getCurrentFBPageID()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.fbPageID = result.fb_page_id;
      });
  }

  moreOptionClick(moreOptionID: string, product: IProductAllList): void {
    ////:: marketplace functionality commenting now
    // const lazadaRouterInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.PUBLISH_LAZADA);
    // const shopeeRouterInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.PUBLISH_SHOPEE);

    const moreOptionObj = {
      copy: () => this.copyRefLinkToClipboard(product.ref, product.inventory),
      delete: () => this.deleteSingleProduct(product.id),
      ////:: marketplace functionality commenting now
      // merge_product: () => this.mergeProductDialog(product),
      // unmerge_product: () => this.unMergeProductDialog(product),
      // [SocialTypes.LAZADA]: () => void this.router.navigate([`${lazadaRouterInit}/${product.id}`]),
      // [SocialTypes.SHOPEE]: () => void this.router.navigate([`${shopeeRouterInit}/${product.id}`]),
    };
    moreOptionObj[moreOptionID]();
  }

  openVariantResponseDialog(mergeResponse: IHTTPResult, marketPlaceType: SocialTypes): void {
    if (mergeResponse?.status === 200) {
      let dialogText = '';
      let dialogTitle = '';
      let dialogError = false;
      if (!isEmpty(this.lazadaMergeVariant)) {
        const [dialogData, dialogStatus] = this.mergeVariantResultDetails(mergeResponse, marketPlaceType);
        const { text, title } = dialogData;
        dialogText += text;
        dialogTitle += title;
        dialogError = dialogStatus;
      }
      this.openMergeDialog({ title: dialogTitle, text: dialogText || this.translate.instant('Product Variant Merged Successfully') }, dialogError);
      this.getProductVariantList(this.variantMergeProductID, this.variantMergeMarketIDs);
    } else if (!isEmpty(mergeResponse)) {
      const title = this.translate.instant('Error');
      const errorMessage = this.translate.instant('Error merging product variant');
      const dialogText = `${errorMessage} ${mergeResponse?.value ? mergeResponse?.value : ''}`;
      this.openMergeDialog({ title, text: dialogText }, true);
    }
  }

  mergeVariantResultDetails(mergeVariantResponse: IHTTPResult, marketPlaceType: SocialTypes): [ITextTitle, boolean] {
    const { variantAttributes: moreCommerceAttribute } = this.moreCommerceMergeVariant;
    let dialogText = `<b> Variant Update: ${moreCommerceAttribute} </b>`;
    switch (mergeVariantResponse?.expiresAt) {
      case MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS: {
        const isError = false;
        const mergeDialogResponse = this.mergeMarketUpdatePriceInventroyDialogLazadaResponse(dialogText, isError, marketPlaceType);
        return [mergeDialogResponse, isError];
      }
      case MergeMarketUpdatePriceInventoryResultType.MARKET_UPDATE_SUCCESS_VARIANT_UPDATE_FAIL: {
        const isError = true;
        const mergeDialogResponse = this.mergeMarketUpdatePriceInventroyDialogLazadaResponse(dialogText, isError, marketPlaceType);
        return [mergeDialogResponse, isError];
      }
      default: {
        const marketPlaceTypeName = marketPlaceType.toString().toUpperCase();
        const successMessage = marketPlaceTypeName + ' ' + this.translate.instant('Product Variant Merged Successfully');
        dialogText += successMessage;
        const dialogTitle = 'Success';
        const dialogError = false;
        return [{ title: dialogTitle, text: dialogText }, dialogError];
      }
    }
  }

  mergeMarketUpdatePriceInventroyDialogLazadaResponse(text: string, isError: boolean, marketPlaceType: SocialTypes): ITextTitle {
    const { variantInventory: moreInventory, variantUnitPrice: morePrice } = this.moreCommerceMergeVariant;
    const { variantInventory: marketLazadaInventory, variantUnitPrice: marketLazadaPrice } = this.lazadaMergeVariant;
    if (!isError) {
      text += `
            <br>
            ${marketPlaceType?.toUpperCase()}
            MarketPlace Product Variant Update -  <br>
            Inventory Update: ${marketLazadaInventory} -> ${moreInventory}  <br>
            Price Update: ${marketLazadaPrice} -> ${morePrice}  <br>
            `;

      const title = 'Success';
      return { title, text };
    } else {
      text += `
                <br>
                ${marketPlaceType?.toUpperCase()}
                MarketPlace Product Variant Update -  <br>
                Inventory Update: ${marketLazadaInventory} -> ${moreInventory}  <br> <br>
                Price Update: ${marketLazadaPrice} -> ${morePrice}  <br>
                
                Error Merging Lazada variant to More-commerce variant, try again later<br>
      `;
      const title = 'Error';
      return { title, text };
    }
  }

  openMergeDialog(message: ITextTitle, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: isError,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  mergeProductResult(response: IHTTPResult): Observable<IHTTPResult> {
    if (response?.status === 200) {
      this.getProductListData();
      const successMessage = this.translate.instant('Product Merged Successfully');
      this.toastr.success(successMessage);
      const closeAllToggleVariant = false;
      this.variantListButtonToggle(closeAllToggleVariant);
    } else {
      this.mergeProductErrorToast();
    }
    return of(response);
  }

  mergeProductErrorToast(): void {
    const errorMessage = this.translate.instant('Error merging products');
    this.toastr.error(errorMessage);
  }

  deleteSingleProduct(id: number): void {
    this.tableForProduct.addID(String(id));
    this.openDeleteConfirmDialog();
  }

  copyRefLinkToClipboard(ref: string, inventory: number): void {
    if (inventory <= 0) {
      const copiedError = this.translate.instant('Inventory is 0 for this product');
      const copiedTitle = this.translate.instant('Error copying');
      this.toastr.error(copiedError, copiedTitle, { positionClass: this.toastPosition });
      return;
    }
    const link = this.productListService.generateProductShareableLink(this.fbPageID, ref);
    this.clipboard.copy(link);
    const sharableLink = this.translate.instant('Shareable Link Copied');
    const copiedText = this.translate.instant('Copied');
    this.toastr.success(sharableLink, copiedText, { positionClass: this.toastPosition });
  }

  getCategoryData(): void {
    this.productListService
      .getProductCategoryList()
      .pipe(
        takeUntil(this.destroy$),
        tap((catList) => (catList?.length ? this.createCategoryDropdown(catList) : this.categoryDropdown.push(this.categoryDialogDefault))),
        catchError(() => {
          this.categoryDropdown.unshift(this.categoryDialogDefault);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  createCategoryDropdown(catList: IProductCategoryList[]): void {
    this.categoryData = catList;
    const categoryDropdownKeys: ITransformDropdown = {
      labelKey: 'category',
      valueKey: 'categoryID',
    };
    const categoryDropDown = catList.map((cat) => ({
      ...cat,
      categoryID: String(cat.categoryID),
    }));
    this.categoryDropdown = this.commonMethodsService.convertToDropDown(categoryDropDown, categoryDropdownKeys);
    this.categoryDropdown.unshift(this.categoryDialogDefault);
  }

  processReceivedProductList(productList: IProductAllList[]): void {
    ////:: marketplace functionality commenting now
    //this.tableData = this.mapProductWithMetaData(productList);
    this.tableData = productList;
    this.storedTableData = productList;
    this.totalRows = this.tableData[0]?.totalrows;
    this.tableForProduct.isLoading = false;
    this.tableForProduct.isNoData = false;
    this.tableForProduct.storedSelectedIDs = this.tableData?.map(({ id }) => String(id));
    this.tableForProduct.marketPlaceNotMergedIds = this.tableData.filter(({ marketPlaceID }) => marketPlaceID)?.map(({ id }) => String(id));
    this.fillToggleFlags();
  }

  processNoProductList(): void {
    this.tableData = [];
    this.tableForProduct.isLoading = false;
    this.tableForProduct.isNoData = true;
    this.totalRows = 0;
  }

  fillToggleFlags(): void {
    this.tableData.map(() => this.toggleStatus.push(false));
  }

  sortTableData(event: { type: string; index: number }): void {
    const { type, index } = event;
    this.tableFilters.orderBy = [this.tableForProduct.productTableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getProductListData();
  }

  searchByName(value: string): void {
    this.tableFilters.search = value;
    this.goToFirstPage();
    this.getProductListData();
  }

  toggleVariantButton(i: number, product: IProductAllList): void {
    this.toggleStatus[i] = !this.toggleStatus[i];
    if (this.toggleStatus[i]) {
      let marketProductIDs = [];
      if (product?.mergedProductData) {
        marketProductIDs = product.mergedProductData?.map(({ mergedMarketPlaceID }) => mergedMarketPlaceID) || [];
      } else {
        marketProductIDs = product.id ? [product.id] : [];
      }
      this.getProductVariantList(product.id, marketProductIDs);
    }
  }

  variantListButtonToggle(status: boolean): void {
    for (let index = 0; index < this.toggleStatus?.length; index++) {
      this.toggleStatus[index] = status;
    }
  }

  getProductVariantList(productID: number, marketProductIDs: number[]): void {
    if (productID) {
      const idObj = { id: productID };
      this.productListService
        .getVariantsOfProduct(idObj, marketProductIDs)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result: IVariantsOfProduct[]) => {
            if (result) {
              this.tableData.map((product) => {
                if (product.id === productID) {
                  product.variantData = result;
                }
              });
            }
          },
          (error) => {
            console.log('Variant fetch error!', error);
          },
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  changePage($event: PageEvent): void {
    this.tableForProduct.isAllchecked = false;
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getProductListData();
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.PRODUCT_LIST);
    void this.router.navigate([routerInit, this.tableFilters.currentPage]);
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.PRODUCT_LIST);
    void this.router.navigate([routerInit, this.tableFilters.currentPage]);
  }

  openDeleteConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });
    const title = this.translate.instant('Are you sure you want to delete');
    dialogRef.componentInstance.data = { title, text: '', btnOkClick: this.remove.bind(this) };
  }

  remove(): void {
    this.tableForProduct.isLoading = true;
    this.loaderText = this.translate.instant('Removing Product Please wait');
    const deleteIDs = this.tableForProduct.tableSelectedIDs.map((id) => ({
      id: +id,
    }));
    this.removeRequest(deleteIDs);
  }

  openResponseDialog(data: ITextTitle, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = data;
    dialogRef.componentInstance.isError = isError;

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!isError) this.getProductListData();
      });
  }

  removeRequest(ids: IDObject[]): void {
    const productSelected = intersectionBy(this.tableData, ids, 'id');
    const marketPlaceData = flatten(productSelected.filter(({ mergedProductData }) => mergedProductData?.length).map(({ mergedProductData }) => mergedProductData) || []);
    const marketPlaceVariantData = flatten(marketPlaceData?.map(({ mergedVariants }) => mergedVariants) || []);
    const marketPlaceIDs = marketPlaceData?.map(({ mergedMarketPlaceID }) => mergedMarketPlaceID) || [];
    const marketPlaceVariantIDs = marketPlaceVariantData?.map(({ marketPlaceVariantID }) => +marketPlaceVariantID) || [];
    this.productListService
      .removeProducts(ids, marketPlaceIDs, marketPlaceVariantIDs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: IHTTPResult) => {
          const { value } = result;
          const response = this.translate.instant(value);
          if (result?.status === 200) {
            this.removeProductResponse(response, false);
          } else {
            this.removeProductResponse(response, true);
          }
        },
        () => {
          const errRemoveMessge = this.translate.instant('Error removing Products');
          this.removeProductResponse(errRemoveMessge, true);
        },
      );
  }

  removeProductResponse(text: string, isError: boolean): void {
    const title = this.translate.instant('Remove Product');
    this.openResponseDialog({ text, title }, isError);
    this.tableForProduct.tableSelectedIDs = [];
    this.tableForProduct.isLoading = false;
    this.tableForProduct.isAllchecked = false;
  }

  onCategoryChange(event): void {
    const { value } = event;
    if (value) {
      this.tableFilters.dropDownID = value;
      this.goToFirstPage();
      this.getProductListData();
    }
  }

  trackBy(index: number, el: IDObject): number {
    return el.id;
  }

  ////:: marketplace functionality commenting now
  /*

  mapProductWithMetaData(productList: IProductAllList[]): IProductAllList[] {
    return productList?.map((product) => ({
      ...product,
      marketPlaceIcon: this.getMarketPlaceIcon(product.marketPlaceType as SocialTypes),
      mergedProductData: product?.mergedProductData?.map((mergedData) => ({ ...mergedData, mergedMarketPlaceTypeIcon: this.getMarketPlaceIcon(mergedData.mergedMarketPlaceType) })),
    }));
  }

  getMarketPlaceIcon(marketPlaceType: SocialTypes): string {
    return this.marketPlaceService.getMarketPlaceTypeIcon(marketPlaceType);
  }

  openUnMergeDialog(unMergeItem: IProductOrVariantUnMerge, itemType: MergeMarketPlaceType, metaUnMergeItem: IVariantsOfProduct | IProductAllList): void {
    this.dialog
      .open<ProductUnmergeDialogComponent, [IProductOrVariantUnMerge, MergeMarketPlaceType], IMergedProductData[]>(ProductUnmergeDialogComponent, {
        width: '70%',
        data: [unMergeItem, itemType],
      })
      .afterClosed()
      .pipe(
        switchMap((unMergeList) =>
          this.marketPlaceService.unMergeMarketPlaceProductOrVariant(
            unMergeList.map(({ mergedMarketPlaceID, mergedMarketPlaceType }) => ({ mergedMarketPlaceID, mergedMarketPlaceType })),
            itemType,
          ),
        ),
        tap((res) => this.showUnMergeResult(res)),
      )
      .subscribe();
  }

  showUnMergeResult(res: IHTTPResult): void {
    if (res.status === 200) {
      const successTitle = this.translate.instant('Success');
      const successUnMerge = this.translate.instant('Unmerge successful');
      this.toastr.success(successUnMerge, successTitle, { positionClass: this.toastPosition });
      this.getProductListData();
      const closeAllToggleVariant = false;
      this.variantListButtonToggle(closeAllToggleVariant);
    } else {
      const errorTitle = this.translate.instant('Error');
      const errorUnMerge = this.translate.instant('Error in Unmerge');
      this.toastr.error(errorUnMerge, errorTitle, { positionClass: this.toastPosition });
    }
  }

  unMergeProductDialog(product: IProductAllList): void {
    const { name, minUnitPrice, maxUnitPrice, mergedProductData, images } = product;
    const unMergedProduct = this.getUnMergeData({
      name,
      img: images[0]?.mediaLink,
      price: maxUnitPrice,
      minPrice: minUnitPrice,
      mergedMarketPlaceData: mergedProductData,
    });
    this.openUnMergeDialog(unMergedProduct, MergeMarketPlaceType.PRODUCT, product);
  }

  unMergeVariantDialog(moreCommerceVariant: IVariantsOfProduct): void {
    const { mergedVariantData, variantUnitPrice, variantImages, variantAttributes } = moreCommerceVariant;
    const unMergedVariant = this.getUnMergeData({
      name: variantAttributes,
      img: variantImages[0]?.mediaLink,
      price: variantUnitPrice,
      mergedMarketPlaceData: mergedVariantData,
    });

    this.openUnMergeDialog(unMergedVariant, MergeMarketPlaceType.VARIANT, moreCommerceVariant);
  }

  getUnMergeData({ name, img, price, mergedMarketPlaceData, minPrice = null }: IProductOrVariantUnMerge): IProductOrVariantUnMerge {
    return {
      name,
      img: img ? img : this.noImage,
      price: minPrice ? `฿ ${minPrice} - ฿ ${price}` : `฿ ${price}`,
      mergedMarketPlaceData: mergedMarketPlaceData?.map((marketData) => ({ ...marketData })),
    };
  }

  mergeProductVariantDialog(moreCommerceVariant: IVariantsOfProduct, product: IProductAllList): void {
    const { variantData, id } = product;
    this.variantMergeProductID = id;
    this.variantMergeMarketIDs = product?.mergedProductData?.map(({ mergedMarketPlaceID }) => mergedMarketPlaceID);
    const marketPlaceVariants = variantData.filter((variant) => variant.variantMarketPlaceType !== this.moreCommerceType);

    const mergeVariantDialogData: IMergeVariantDialogData = {
      moreCommerceVariant,
      marketPlaceVariants: marketPlaceVariants.map((variant) => ({ ...variant, isSelected: false, isDisabled: false })),
    };
    this.dialog
      .open<ProductVariantMergeDialogComponent, IMergeVariantDialogData, IVariantsOfProduct[]>(ProductVariantMergeDialogComponent, { width: '70%', data: mergeVariantDialogData })
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((marketProductVariantList) => {
          if (marketProductVariantList?.length) {
            const { variantID } = moreCommerceVariant;
            const mergeIDs = marketProductVariantList.map(({ variantID }) => variantID);
            this.moreCommerceMergeVariant = moreCommerceVariant;
            const [lazadaMergeVariant] = marketProductVariantList.filter((marketVariant) => marketVariant.variantMarketPlaceType === SocialTypes.LAZADA) || null;
            this.lazadaMergeVariant = lazadaMergeVariant;
            return this.mergeProductOrVariant(variantID, mergeIDs, MergeMarketPlaceType.VARIANT);
          } else {
            return EMPTY;
          }
        }),
        catchError((error) => {
          this.mergeVariantErrorToast();
          throw error;
        }),
      )
      .subscribe();
  }

  mergeVariantErrorToast(): void {
    const errorMessage = this.translate.instant('Error merging product variant');
    this.toastr.error(errorMessage);
  }

  mergeProductDialog(product: IProductAllList): void {
    const { marketPlaceType } = product;
    if (marketPlaceType === SocialTypes.MORE_COMMERCE) {
      this.dialog
        .open<ProductMergeDialogComponent, IProductAllList, IProductMarketPlaceList[]>(ProductMergeDialogComponent, { width: '70%', data: product })
        .afterClosed()
        .pipe(
          takeUntil(this.destroy$),
          switchMap((marketProductList) => {
            if (marketProductList?.length) {
              const { id: productID } = product;
              const marketProductIDs = marketProductList.map(({ id }) => id);
              return this.mergeProductOrVariant(productID, marketProductIDs, MergeMarketPlaceType.PRODUCT);
            } else {
              return of([]);
            }
          }),
          catchError((error) => {
            this.mergeProductErrorToast();
            throw error;
          }),
        )
        .subscribe();
    }
  }

  mergeProductOrVariant(id: number, marketIDs: number[], mergeType: MergeMarketPlaceType): Observable<IHTTPResult[]> {
    return this.marketPlaceService.mergeMarketPlaceProductOrVariant({ id, marketIDs, mergeType }).pipe(
      takeUntil(this.destroy$),
      switchMap((mergeVariantResponse: IHTTPResult[]) => {
        mergeType === MergeMarketPlaceType.PRODUCT ? this.mergeProductResult(mergeVariantResponse[0]) : this.mergeVariantResult(mergeVariantResponse);
        return of(mergeVariantResponse);
      }),
    );
  }

  mergeVariantResult(mergeVariantResponse: IHTTPResult[]): Observable<IHTTPResult[]> {
    if (mergeVariantResponse[0].value === false) {
      const title = this.translate.instant('Error');
      const text = this.translate.instant('Error merging product variant');
      this.openMergeDialog({ title, text }, true);
      return of(mergeVariantResponse);
    }
    const lazadaVariantResponse = mergeVariantResponse?.find(({ value }) => value === SocialTypes.LAZADA);
    const shopeeVariantResponse = mergeVariantResponse?.find(({ value }) => value === SocialTypes.SHOPEE);
    this.openVariantResponseDialog(lazadaVariantResponse, this.socialTypes.LAZADA);
    this.openVariantResponseDialog(shopeeVariantResponse, this.socialTypes.SHOPEE);
    const response = [];
    if (lazadaVariantResponse?.status) response.push(lazadaVariantResponse);
    if (shopeeVariantResponse?.status) response.push(shopeeVariantResponse);
    return of(response);
  } */
}
