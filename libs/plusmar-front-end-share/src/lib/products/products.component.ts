import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';
import { EnumAuthError, EnumAuthScope, EnumSubscriptionFeatureType, ProductRouteTypes } from '@reactor-room/itopplus-model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

////:: marketplace functionality commenting now
// const INDEXES = {
//   list: 0,
//   marketplace: 1,
//   tags: 2,
//   categories: 3,
//   attributes: 4,
// };

const INDEXES = {
  list: 0,
  tags: 1,
  categories: 2,
  attributes: 3,
};
@Component({
  selector: 'reactor-room-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutservice: LayoutCommonService,
    private subscriptionService: SubscriptionService,
    private productCommonService: ProductCommonService,
  ) {
    this.layoutservice.shareMenuStatus.subscribe((result) => (this.menuStatus = result));
  }
  projectScope: EnumAuthScope;
  selectedIndex: number;
  isSubscriptionBusiness: boolean;
  destroy$ = new Subject<boolean>();
  tabWidth: string;
  menuStatus: boolean;

  heading = {
    title: 'Products',
    subTitle: 'Dashboard / Products',
  };

  // resize handlers
  handleResize(target: any): void {
    if (window.innerWidth <= 992) {
      this.tabWidth = target - 40 + 'px';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.handleResize(event.target.innerWidth);
  }

  // resize handlers

  handleIndexChange(newIndex: number): void {
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.PRODUCT);
    const newRoute = [routerInit, getKeyByValue(INDEXES, newIndex), 1];
    void this.router.navigate(newRoute);
  }

  ngOnInit(): void {
    this.getIsSubscriptionBusiness();
    this.getProjectScope();
    this.route.params.subscribe((params: { id: string; tab: string }) => {
      this.selectedIndex = INDEXES[params['tab']];
    });
    if (window.innerWidth <= 992) {
      this.tabWidth = window.innerWidth - 40 + 'px';
    }
  }

  getProjectScope(): void {
    this.route.data
      .pipe(
        tap((data: { animation: string; projectScope: EnumAuthScope }) => {
          this.productCommonService.projectScope = data?.projectScope ? data.projectScope : null;
          this.projectScope = this.productCommonService.projectScope as EnumAuthScope;
        }),
      )
      .subscribe();
  }

  getIsSubscriptionBusiness(): void {
    this.subscriptionService.$subscriptionLimitAndDetail.pipe(takeUntil(this.destroy$)).subscribe((subscriptionLimit) => {
      if (subscriptionLimit.featureType === EnumSubscriptionFeatureType.BUSINESS) {
        void this.router.navigateByUrl(`/follows?err=${EnumAuthError.PACKAGE_INVALID}`);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
