import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { CRUD_MODE, IHTTPResult, ISortTableEvent, ITableFilter, ITextString, ITextTitle } from '@reactor-room/model-lib';
import { validateThirdPartyTokenExpire } from '@reactor-room/plusmar-front-end-helpers';
import { IDropDown } from '@reactor-room/plusmar-front-end-share/app.model';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { IPagesThirdParty, IProductMarketPlaceList, IProductMarketPlaceVariantList, ISocialConnect, SocialTypes, TokenRefreshByTypes } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, EMPTY, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, exhaustMap, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ProductMarketPlaceService } from '../../services/product-marketplace.service';
import { TableForProducts } from '../product-table-header';
import { PagesThirdPartyReconnectDialogComponent } from './pages-third-party-reconnect-dialog/pages-third-party-reconnect-dialog.component';
import { ProductMarketplaceImportDialogComponent } from './product-marketplace-import-dialog/product-marketplace-import-dialog.component';

let openNewWindow = false;
const isClosed = new Subject<boolean>();
let thirdPartyAuthWindow;

function checkAuthWindow() {
  if (openNewWindow == true) {
    if (thirdPartyAuthWindow.closed) {
      isClosed.next(true);
    } else {
      setTimeout(() => {
        isClosed.next(false);
        checkAuthWindow();
      }, 2000);
    }
  }
}

@Component({
  selector: 'reactor-room-product-marketplace-list',
  templateUrl: './product-marketplace-list.component.html',
  styleUrls: ['./product-marketplace-list.component.scss'],
})
export class ProductMarketplaceListComponent implements OnInit, OnDestroy {
  tableForProduct = new TableForProducts();
  maximumProducts = 0;
  categoryDropdown = [] as IDropDown[];
  searchField = new FormControl();
  categoryDefault = -1;
  selectedIds: string[] = [];
  categoryDialogDefault: IDropDown = { label: this.translate.instant('Categories'), value: -1 };
  tableData = [] as IProductMarketPlaceList[];
  isCreatable = false;
  isImported = true;
  tableFilters = this.tableForProduct.commonTableFilters;
  errorTitle = this.translate.instant('Error');
  toggleStatus = [] as Array<boolean>;
  marketPlaceTypeDropdown = this.marketPlaceService.marketPlaceDropdown;
  marketPlaceTypeDefault = this.marketPlaceService.marketPlaceDropdown[0].value;
  marketPlaceTypeDropDown$ = new Subject<string>();
  notImportedCount: number;
  isUpdating = false;
  updateText = this.translate.instant('Refresh');
  errorConnect = this.translate.instant('Unable to connect marketplace Try again or Please contact support');

  destroy$ = new Subject();
  importProductClick$ = new Subject<void>();
  updateProductClick$ = new Subject<void>();
  lazadaProduct$ = this.marketPlaceService.getProductsFromLazada();
  shopeeProduct$ = this.marketPlaceService.getProductsFromShopee();

  importProductMarketPlaceList$ = this.marketPlaceService.getProductMarketPlaceList({ isImported: this.isImported, filters: this.tableFilters });
  noImportFilter = {
    ...this.tableFilters,
    pageSize: 1,
  } as ITableFilter;
  notImportProductMarketPlaceList$ = this.marketPlaceService.getProductMarketPlaceList({ isImported: !this.isImported, filters: this.noImportFilter });

  lazadaConnect$ = this.pageService.getLazadaConnectURL().pipe(
    takeUntil(this.destroy$),
    tap((lazadaConnectData) => {
      const { text: lazadaConnectUrl } = lazadaConnectData;
      lazadaConnectUrl ? window.open(lazadaConnectUrl, '_blank') : this.toastr.error(this.errorConnect, this.errorTitle);
      return EMPTY;
    }),
  );

  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  lazadaIsConnected: boolean;
  shopeeIsConnected: boolean;
  connected: boolean;

  socialConnect$ = this.settingService.getSocialConnectStatus();
  thirdPartyPages: {
    lazada: IPagesThirdParty;
    shopee: IPagesThirdParty;
  };

  shopeeRefreshToken$ = this.settingService.refreshPageThirdPartyToken({ pageType: SocialTypes.SHOPEE, tokenType: TokenRefreshByTypes.REFRESH_TOKEN });
  lazadaRefreshToken$ = this.settingService.refreshPageThirdPartyToken({ pageType: SocialTypes.LAZADA, tokenType: TokenRefreshByTypes.REFRESH_TOKEN });

  constructor(
    private translate: TranslateService,
    public toastr: ToastrService,
    public dialog: MatDialog,
    private marketPlaceService: ProductMarketPlaceService,
    private pageService: PagesService,
    private settingService: SettingsService,
  ) {}

  ngOnInit(): void {
    // this.getMarketPlaceProducts();
    this.importClickEvent();
    this.marketPlaceDropDownEvent();
    // this.getImportedMarketPlaceProductList();
    this.onSearchEvent();
    this.updateClickEvent();

    this.getSocialConnectStatus();

    combineLatest([this.pageService.getPageThirdPartyByPageType(SocialTypes.LAZADA), this.pageService.getPageThirdPartyByPageType(SocialTypes.SHOPEE)]).subscribe((res) => {
      this.lazadaIsConnected = res[0].id !== null;
      this.shopeeIsConnected = res[1].id !== null;
      this.connected = [this.lazadaIsConnected, this.shopeeIsConnected].includes(true);

      if (this.connected) {
        this.getMarketPlaceProducts();
      } else {
        this.toastr.warning(this.translate.instant('Need to connect at least 1 marketpace'), 'Marketplace');
      }
    });
  }

  updateClickEvent(): void {
    this.updateProductClick$
      .pipe(
        switchMap(() => {
          this.getMarketPlaceProducts();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  getMarketPlaceProducts(): void {
    this.isUpdating = true;
    this.tableForProduct.isLoading = true;
    this.updateText = this.translate.instant('Refreshing');
    const joinQuery = [] as Observable<IHTTPResult>[];
    if (this.lazadaIsConnected) joinQuery.push(this.lazadaProduct$);
    if (this.shopeeIsConnected) joinQuery.push(this.shopeeProduct$);
    forkJoin(joinQuery)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((result) => {
          return this.processMarketPlaceProduct(result);
        }),
        finalize(() => {
          this.isUpdating = false;
          this.tableForProduct.isLoading = false;
          this.updateText = this.translate.instant('Refresh');
        }),
      )
      .subscribe();
  }

  processMarketPlaceProduct([lazadaResult]: IHTTPResult[]): Observable<[IProductMarketPlaceList[], IProductMarketPlaceList[]]> {
    if (lazadaResult.status === 200) {
      return this.getImportedMarketPlaceProductList();
    } else {
      this.openReconnectToMarketPlaceDialog(SocialTypes.LAZADA);
      const emptyMarketPlace = [[], []] as [IProductMarketPlaceList[], IProductMarketPlaceList[]];
      return of(emptyMarketPlace);
    }
  }

  getImportedMarketPlaceProductList(): Observable<[IProductMarketPlaceList[], IProductMarketPlaceList[]]> {
    const importedProduct = this.importProductMarketPlaceList$;
    const notImportedProduct = this.notImportProductMarketPlaceList$;

    return forkJoin([importedProduct, notImportedProduct]).pipe(
      map((productArr) => this.processProductsTypes(productArr)),
      tap(([imported]) => (imported.length ? this.onImportedProductList(imported) : this.noImportedProductList())),
      takeUntil(this.destroy$),
      catchError(() => {
        console.log('eerrr');
        this.onProductImportedListError();
        throw 'Error in getting imported products';
      }),
    );
  }

  openReconnectToMarketPlaceDialog(marketPlaceType: SocialTypes): void {
    const title = this.translate.instant('Authorization');
    const text = `${marketPlaceType.toUpperCase()} - ${this.translate.instant('Authorization required')}`;
    const data = { title, text, btnOkClick: this.reconnectToMarketPlace.bind(this, marketPlaceType) };
    this.dialog.open<ConfirmDialogComponent, ITextTitle, boolean>(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data,
    });
  }

  reconnectToMarketPlace(marketPlaceType: SocialTypes): void {
    if (marketPlaceType === SocialTypes.LAZADA) {
      this.lazadaConnect$.subscribe();
    } else {
      throw new Error('Not a valid marketplace');
    }
  }

  onSearchEvent(): void {
    this.searchField.valueChanges
      .pipe(
        filter((searchKey) => searchKey.length > 2 || !searchKey.length),
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap((searchKey) => {
          this.tableFilters.search = searchKey;
          this.getImportedMarketPlaceProductList().subscribe();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  marketPlaceDropDownEvent(): void {
    this.marketPlaceTypeDropDown$
      .pipe(
        switchMap((marketType) => {
          this.tableFilters.dropDownID = marketType;
          if (marketType === 'lazada' && !this.lazadaIsConnected) return this.informMarketPlaceConnection(marketType);
          if (marketType === 'shopee' && !this.shopeeIsConnected) return this.informMarketPlaceConnection(marketType);
          return this.getImportedMarketPlaceProductList();
        }),
      )
      .subscribe();
  }

  informMarketPlaceConnection(marketType): Observable<void> {
    return new Observable((observer) => {
      this.tableForProduct.isNoData = true;
      this.tableData = [];

      const title = this.translate.instant('Marketplace');
      const text = `${marketType.toUpperCase()} - ${this.translate.instant('required to connect')}`;
      const data = { title, text, btnOkClick: this.reconnectToMarketPlace.bind(this, marketType) };
      this.dialog.open<ConfirmDialogComponent, ITextTitle, boolean>(ConfirmDialogComponent, {
        width: isMobile() ? '90%' : '50%',
        data,
      });

      observer.next(null);
    });
  }

  processProductsTypes([importedProduct, notImportedProduct]: [IProductMarketPlaceList[], IProductMarketPlaceList[]]): [IProductMarketPlaceList[], IProductMarketPlaceList[]] {
    const imported = importedProduct.map((product) => ({ ...product, marketPlaceIcon: this.marketPlaceService.getMarketPlaceTypeIcon(product.marketPlaceType) }));
    this.notImportedCount = notImportedProduct[0]?.totalRows || 0;
    return [imported, notImportedProduct];
  }

  onProductImportedListError(): void {
    this.toastr.error(this.translate.instant('Error in getting response'));
  }

  onImportedProductList(result: IProductMarketPlaceList[]): void {
    this.tableData = result;
    this.tableForProduct.totalRows = result[0].totalRows;
    this.tableForProduct.isNoData = false;
    this.tableForProduct.storedSelectedIDs = this.tableData.map(({ id }) => String(id));
    this.tableData.map(() => this.toggleStatus.push(false));
  }

  noImportedProductList(): void {
    this.tableForProduct.isNoData = true;
    this.tableForProduct.totalRows = 0;
    this.tableData = [];
  }

  importClickEvent(): void {
    const operation = CRUD_MODE.IMPORT;
    this.importProductClick$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const importDialogRef = this.dialog.open<ProductMarketplaceImportDialogComponent, unknown, [boolean, string[]]>(ProductMarketplaceImportDialogComponent, { width: '70%' });
      importDialogRef
        .afterClosed()
        .pipe(
          takeUntil(this.destroy$),
          exhaustMap(([status, importIDs]) => {
            this.importDeleteProductFromMarketPlace(status, operation, importIDs);
            return EMPTY;
          }),
        )
        .subscribe();
    });
  }

  importDeleteProductFromMarketPlace(status: boolean, operation: CRUD_MODE, selectedIDs: string[]): void {
    if (status && selectedIDs.length) {
      const importedProductIDs = selectedIDs.map((id) => +id);
      this.marketPlaceService
        .importDeleteProductFromMarketPlace(importedProductIDs, operation)
        .pipe(
          takeUntil(this.destroy$),
          switchMap(() => this.getImportedMarketPlaceProductList()),
        )
        .subscribe();
    }
  }

  toggleVariantButton(i: number, productID: number): void {
    this.toggleStatus[i] = !this.toggleStatus[i];
    if (this.toggleStatus[i]) {
      this.getProductMarketPlaceVariantList(productID);
    }
  }

  getProductMarketPlaceVariantList(id: number): void {
    const isMerged = false;
    this.marketPlaceService
      .getProductMarketPlaceVariantList({ id, isMerged })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          if (result.length) this.processVariantList(id, result);
        },
        (err) => {
          this.toastr.show(this.translate.instant('Error in getting response'), this.errorTitle);
          console.log('err :>> ', err);
        },
      );
  }

  processVariantList(productID: number, result: IProductMarketPlaceVariantList[]): void {
    const productMarketPlace = this.tableData.find(({ id }) => id === productID);
    productMarketPlace.variantList = result;
  }

  changePage($event: PageEvent): void {
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getImportedMarketPlaceProductList().subscribe();
  }

  sortTableData($event: ISortTableEvent): void {
    const { type, index } = $event;
    const columnKey = this.tableForProduct.productTableHeader[index].key;
    if (columnKey === 'sold' || columnKey === 'status') return;
    this.tableFilters.orderBy = [columnKey];
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getImportedMarketPlaceProductList().subscribe();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
  }

  openDeleteConfirmDialog(): void {
    const data = { title: this.translate.instant('Are you sure you want to delete'), text: '', btnOkClick: this.remove.bind(this) };
    this.dialog.open<ConfirmDialogComponent, ITextTitle, boolean>(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data,
    });
  }

  remove(): void {
    const selectedIDs = this.tableForProduct.getTableSelectedID() || [];
    this.importDeleteProductFromMarketPlace(Boolean(selectedIDs?.length), CRUD_MODE.DELETE, selectedIDs);
    this.tableForProduct.clearTableSelectedID();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  openLazadaConnect(): void {
    this.pageService
      .getLazadaConnectURL()
      .pipe(
        takeUntil(this.destroy$),
        tap((urlData) => {
          const { text: lazadaConnectUrl } = urlData;
          lazadaConnectUrl ? this.openNewTab(lazadaConnectUrl) : this.toastr.error(this.errorConnect, this.errorTitle);
        }),
      )
      .subscribe();
  }

  openShopeeConnect(): void {
    this.pageService
      .getShopeeConnectURL()
      .pipe(
        takeUntil(this.destroy$),
        tap((urlData) => {
          const { text: shopeeConnectUrl } = urlData;
          shopeeConnectUrl ? this.openNewTab(shopeeConnectUrl) : this.toastr.error(this.errorConnect, this.errorTitle);
        }),
      )
      .subscribe();
  }

  openNewTab(url: string): void {
    thirdPartyAuthWindow = window.open(url, '_blank');
    openNewWindow = true;
    setTimeout(() => {
      checkAuthWindow();
    }, 2000);
    isClosed.pipe(tap((isClosed) => isClosed && location.reload())).subscribe();
  }

  getSocialConnectStatus(): void {
    this.socialConnect$
      .pipe(
        takeUntil(this.destroy$),
        tap((socials) => this.checkSocialConnectStatus(socials)),
      )
      .subscribe();
  }

  checkSocialConnectStatus(socials: ISocialConnect): void {
    this.thirdPartyPages = {
      lazada: socials.lazada,
      shopee: socials.shopee,
    };
    const lazadaShop = this.thirdPartyPages.lazada;
    const shopeeShop = this.thirdPartyPages.shopee;
    const [lazadaRefreshType, shopeeRefreshType] = [validateThirdPartyTokenExpire(lazadaShop), validateThirdPartyTokenExpire(shopeeShop)];
    lazadaRefreshType === TokenRefreshByTypes.REFRESH_TOKEN && this.lazadaRefreshToken$.pipe(takeUntil(this.destroy$)).subscribe();
    shopeeRefreshType === TokenRefreshByTypes.REFRESH_TOKEN && this.shopeeRefreshToken$.pipe(takeUntil(this.destroy$)).subscribe();
    this.accessTokenPageThirdPartyDialog([lazadaRefreshType, shopeeRefreshType]);
  }

  accessTokenPageThirdPartyDialog([lazadaRefreshType, shopeeRefreshType]: TokenRefreshByTypes[]): void {
    const pageThirdPartyAccess: SocialTypes[] = [];
    lazadaRefreshType === TokenRefreshByTypes.ACCESS_TOKEN && pageThirdPartyAccess.push(SocialTypes.LAZADA);
    shopeeRefreshType === TokenRefreshByTypes.ACCESS_TOKEN && pageThirdPartyAccess.push(SocialTypes.SHOPEE);
    if (pageThirdPartyAccess?.length) {
      const reconectPagesDialog = this.dialog.open<PagesThirdPartyReconnectDialogComponent, SocialTypes[], SocialTypes>(PagesThirdPartyReconnectDialogComponent, {
        width: isMobile() ? '90%' : '50%',
        data: pageThirdPartyAccess,
      });
      reconectPagesDialog
        .afterClosed()
        .pipe(
          takeUntil(this.destroy$),
          switchMap((page) => (page ? this.goToPagesThirdParty(page) : EMPTY)),
        )
        .subscribe();
    }
  }
  goToPagesThirdParty(page: SocialTypes): Observable<ITextString> {
    switch (page) {
      case SocialTypes.LAZADA:
        return this._openLazadaConnect();
      case SocialTypes.SHOPEE:
        return this._openShopeeConnect();
      default:
        break;
    }
  }

  _openLazadaConnect(): Observable<ITextString> {
    return this.pageService.getLazadaConnectURL().pipe(
      takeUntil(this.destroy$),
      tap((urlData) => {
        const { text: lazadaConnectUrl } = urlData;
        lazadaConnectUrl && this.openNewTab(lazadaConnectUrl);
      }),
    );
  }

  _openShopeeConnect(): Observable<ITextString> {
    return this.pageService.getShopeeConnectURL().pipe(
      takeUntil(this.destroy$),
      tap((urlData) => {
        const { text: shopeeConnectUrl } = urlData;
        shopeeConnectUrl && this.openNewTab(shopeeConnectUrl);
      }),
    );
  }
}
