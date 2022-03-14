import { Component, OnInit, ViewEncapsulation, HostListener, DoCheck, OnDestroy } from '@angular/core';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { EnumPageMemberType, EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { AuthService } from '@reactor-room/plusmar-front-end-share/auth.service';

const COMMERCE_INDEXES = {
  owner: 0,
  payment: 1,
  logistic: 2,
  tax: 3,
  // order: 4,
  general: 4,
  advance_setting: 5,
  admin: 6,
  log: 7,
  api: 8,
  openapi: 9,
};

const BUSINESS_INDEXES = {
  owner: 0,
  // advance_setting: 1,
  admin: 1,
  log: 2,
  api: 3,
};

@Component({
  selector: 'reactor-room-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingComponent implements OnInit, DoCheck, OnDestroy {
  INDEXES;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading = true as boolean;
  tabWidth: string;
  tabParams;
  menuStatus: boolean;
  invalid = true as boolean;
  selectedIndex: number;
  isAllowed = false as boolean;
  isSubscriptionBusiness = false as boolean;

  constructor(
    private route: ActivatedRoute,
    private layoutservice: LayoutCommonService,
    private router: Router,
    private pagesService: PagesService,
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
  ) {
    this.layoutservice.shareMenuStatus.subscribe((result) => (this.menuStatus = result));
  }

  // resize handlers
  handleResize(target: any) {
    if (window.innerWidth <= 992) {
      this.tabWidth = target - 40 + 'px';
    } else {
      this.tabWidth = target + (this.menuStatus ? -310 : -115) + 'px';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleResize(event.target.innerWidth);
  }

  ngDoCheck(): void {
    this.handleResize(window.innerWidth);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tabParams = params;
      this.authService.menuEnable$.subscribe((res) => {
        this.invalid = !res;
        this.validateUserAndSubcription();
      });

      if (this.tabParams['tab'] === 'setting-invalid') {
        this.isLoading = false;
      }
    });
  }

  validateUserAndSubcription(): void {
    this.subscriptionService.$subscriptionLimitAndDetail
      .pipe(
        takeUntil(this.destroy$),
        switchMap((subscriptionLimit) => {
          this.isSubscriptionBusiness = subscriptionLimit.featureType === EnumSubscriptionFeatureType.BUSINESS;
          this.INDEXES = this.isSubscriptionBusiness ? BUSINESS_INDEXES : COMMERCE_INDEXES;
          return this.pagesService.$facebookResponse.pipe(takeUntil(this.destroy$));
        }),
        switchMap((fbResponse) => {
          if (fbResponse) {
            this.invalid = false;
          } else {
            this.invalid = true;
            this.isLoading = false;
          }
          return this.userService.$userPageRole.pipe(takeUntil(this.destroy$));
        }),
      )
      .subscribe((userRole) => {
        this.isLoading = false;
        this.invalid = false;
        this.selectedIndex = this.tabParams['tab'] ? this.INDEXES[this.tabParams['tab']] : 0;
        this.handleResize(window.innerWidth);
        if (userRole !== EnumPageMemberType.STAFF) this.isAllowed = true;
      });
  }

  handleIndexChange(newIndex) {
    const paginatedIndexes = [6, 7];
    const firstPage = paginatedIndexes.includes(newIndex) ? 1 : '';
    const newRoute = ['/setting', getKeyByValue(this.INDEXES, newIndex), firstPage];
    void this.router.navigate(newRoute);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
