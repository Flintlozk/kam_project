import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseOrderMarketPlaceService } from './purchase-order-services/purchase-order-marketplace.service';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { IMarketPlaceOrderDetails, IMarketPlaceOrderItemDetails, IMarketPlaceTogglerInput, OrderChannelTypes } from '@reactor-room/itopplus-model-lib';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-order-lazada-details',
  templateUrl: './order-lazada-details.component.html',
  styleUrls: ['./order-lazada-details.component.scss'],
})
export class OrderLazadaDetailsComponent implements OnInit, OnDestroy {
  lazadaOrderChannel = OrderChannelTypes.LAZADA;
  togglerHeaderIcon = 'assets/img/social/lazada-heart-icon.svg';
  lazadaIcon = 'assets/img/social/lazada.svg';

  destroy$ = new Subject();
  isLoading = false;
  loadingText = '';
  headingTitle = this.translate.instant('Lazada Order Details');
  routeTitle = this.translate.instant('Orders/Lazada');
  marketPlaceOrder = {} as IMarketPlaceOrderDetails;
  marketPlaceOrderItems: IMarketPlaceOrderItemDetails[];
  togglerInput: IMarketPlaceTogglerInput = {
    id: 'order_items',
    icon: this.togglerHeaderIcon,
    title: this.translate.instant('Order Items'),
    toggleStatus: true,
    notRequiredForm: null,
    requiredForm: null,
  };

  orderItemsTableHeader: ITableHeader[] = [
    { sort: false, title: 'Image', key: 'productImage' },
    { sort: false, title: 'Name', key: 'name' },
    { sort: false, title: 'Unit Price', key: 'unitPrice' },
    { sort: false, title: 'Discount', key: 'discount' },
    { sort: false, title: 'Inventory', key: 'inventory' },
    { sort: false, title: 'SKU', key: 'sku' },
    { sort: false, title: 'Action', key: null },
  ];
  orderHeaderTableColSpan = this.orderItemsTableHeader.length;

  constructor(public purchaseOrderMarketPlaceService: PurchaseOrderMarketPlaceService, private route: ActivatedRoute, public translate: TranslateService, private router: Router) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((param) => {
          const { id } = param || null;
          if (!id) {
            this.goToOrderList();
            return EMPTY;
          }
          return this.purchaseOrderMarketPlaceService.getMarketPlaceOrderDetails(id, this.lazadaOrderChannel);
        }),
        tap((marketPlaceOrder) => this.initMarketPlaceOrder(marketPlaceOrder)),
        catchError((err) => {
          this.goToOrderList();
          throw err;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  initMarketPlaceOrder(marketPlaceOrder: IMarketPlaceOrderDetails): void {
    this.marketPlaceOrder = marketPlaceOrder;
    this.marketPlaceOrderItems = marketPlaceOrder.orderItems;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onToggle(toggleID: number): void {
    this.togglerInput.toggleStatus = !this.togglerInput.toggleStatus;
  }

  showProductAtLazada(externalLink: string): void {
    window.open(externalLink, '_blank');
  }

  goToOrderList(): void {
    void this.router.navigate(['/order/all']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
