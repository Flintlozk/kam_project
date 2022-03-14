import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { ISubscriptionLimitAndDetails, EnumAuthError, EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { Router, ActivatedRoute } from '@angular/router';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { TranslateService } from '@ngx-translate/core';

const INDEXES = {
  order: 0,
  refund: 1,
};

@Component({
  selector: 'reactor-room-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseOrderComponent implements OnInit {
  allTabData = { label: 'All', count: 0 };
  isLoading = true as boolean;
  maximumLabel = 'Order ( Limit... )';
  selectedIndex: number;

  constructor(public ngZone: NgZone, public router: Router, public translate: TranslateService, private route: ActivatedRoute, private subscriptionService: SubscriptionService) {
    translate.onLangChange.subscribe(() => {
      this.getSubscriptionLimitAndDetails();
    });
  }

  ngOnInit(): void {
    this.getSubscriptionLimitAndDetails();
    this.route.params.subscribe((params) => {
      this.selectedIndex = params['tab'] ? INDEXES[params['tab']] : 0;
    });
  }

  handleIndexChange(newIndex) {
    const newRoute = ['/purchase-order', getKeyByValue(INDEXES, newIndex), 1];
    void this.router.navigate(newRoute);
  }

  getSubscriptionLimitAndDetails() {
    this.subscriptionService.$subscriptionLimitAndDetail.subscribe((subscriptionLimit: ISubscriptionLimitAndDetails) => {
      if (subscriptionLimit.featureType === EnumSubscriptionFeatureType.BUSINESS) {
        location.href = `/follows?err=${EnumAuthError.PACKAGE_INVALID}`;
      } else {
        this.maximumLabel = `${this.translate.instant('Orders')} (${this.translate.instant('Limit')} ${subscriptionLimit.maximumOrders} ${this.translate.instant('orders')})`;
        this.isLoading = false;
      }
    });
  }
}
