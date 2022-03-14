import { AfterViewChecked, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@reactor-room/plusmar-front-end-share/auth.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { getCookie, isMobile, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import {
  EnumAuthError,
  EnumAuthScope,
  EnumForceUpdateRoute,
  EnumPageMemberType,
  EnumSubscriptionFeatureType,
  EnumUserSubscriptionType,
  EnumWizardStepError,
  EnumWizardStepType,
  IPages,
  IPagesContext,
  IPageWithStatus,
  ISubscription,
  ISubscriptionContext,
  IUserContext,
  topUpHashValidate,
} from '@reactor-room/itopplus-model-lib';
import { Observable, Subject } from 'rxjs';
import { delay, finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { Menu, SubMenu } from './menu.model';
import { environment } from '../../../environments/environment';
import { NotificationService } from '@reactor-room/plusmar-front-end-share/services/notification/notification.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';

@Component({
  selector: 'reactor-room-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, AfterViewChecked, OnDestroy {
  theme = EnumAuthScope.SOCIAL;
  destroy$ = new Subject<boolean>();
  menuEnable = false;
  initProcessing = false;
  isLoading = false;
  subscription: ISubscription;
  isOwner = false;
  menuMinHeight: string;
  menuMaxHeight: string;
  menuStatus = true;
  navOutside: boolean;
  userContext: IUserContext;
  facebookPageData: IPageWithStatus[] = [];
  isSubscriptionBusiness: boolean;
  pageImgUrlActive: string;
  pageTitleActive: string;
  totalPage: number;
  hasPages = false as boolean;
  page$: Observable<IPages> = this.pagesService.getPages().pipe(mergeMap((pages) => pages));
  retried = 0;
  EnumWizardStep = EnumWizardStepType;
  audienceTotal;
  currentRoute = '';
  currentPageRole: EnumPageMemberType;

  constructor(
    public router: Router,
    private routeService: RouteService,
    public activatedRoute: ActivatedRoute,
    public ngZone: NgZone,
    public pagesService: PagesService,
    public userService: UserService,
    public dialog: MatDialog,
    private layoutservice: LayoutCommonService,
    private subscriptionService: SubscriptionService,
    public translate: TranslateService,
    public CDR: ChangeDetectorRef,
    public authService: AuthService,
    public notificationService: NotificationService,
  ) {
    this.layoutservice.shareMenuStatus.pipe(delay(100)).subscribe((result) => {
      this.menuStatus = result;
    });
    this.layoutservice.sharedIsOutSideMenu.subscribe((result) => {
      this.navOutside = result;
    });
  }
  menuAdminItems = [
    {
      id: 'menu-admin-dashboard',
      label: 'Admin Dashboard',
      routerLink: '/organization',
      routeNode: 'organization',
      imgUrl: '/assets/img/admin/dashboard/icon_org-dashboard.svg',
      isActive: false,
      subMenu: [] as SubMenu[],
      isHiddenInBusiness: false,
    },
    // {
    //   id: 'menu-admin-ticket',
    //   label: 'Ticket',
    //   routerLink: '#',
    //   routeNode: '#',
    //   imgUrl: '/assets/img/admin/dashboard/icon_org-ticket.svg',
    //   isActive: false,
    //   subMenu: [] as SubMenu[],
    //   isHiddenInBusiness: false,
    // },
    // {
    //   id: 'menu-admin-member',
    //   label: 'Members',
    //   routerLink: '#',
    //   routeNode: '#',
    //   imgUrl: '/assets/img/admin/dashboard/icon_org-member.svg',
    //   isActive: false,
    //   subMenu: [
    //     { id: 'menu-orders-list', label: 'Support Staff', routerLink: '#' },
    //     { id: 'menu-orders-history', label: 'Shop Staff', routerLink: '#' },
    //   ] as SubMenu[],
    //   isHiddenInBusiness: false,
    // },
    // {
    //   id: 'menu-admin-knowledge-base',
    //   label: 'Knowledge base',
    //   routerLink: '#',
    //   routeNode: '#',
    //   imgUrl: '/assets/img/admin/dashboard/icon_org-knowledgebase.svg',
    //   isActive: false,
    //   subMenu: [] as SubMenu[],
    //   isHiddenInBusiness: false,
    // },
  ];
  menuItems = [
    {
      id: 'menu-dashboard',
      label: 'Dashboard',
      routerLink: '/dashboard',
      routeNode: 'dashboard',
      imgUrl: '/assets/img/menu/icon_dashboard.svg',
      isActive: false,
      subMenu: [] as SubMenu[],
      isHiddenInBusiness: false,
    },
    {
      id: 'menu-messages',
      label: 'Messages',
      routerLink: '/follows/list/all/1',
      routeNode: 'follows',
      imgUrl: '/assets/img/menu/icon_follow.svg',
      isActive: false,
      subMenu: [] as SubMenu[],
      total: 0,
      isHiddenInBusiness: false,
    },
    {
      id: 'menu-orders',
      label: 'Orders',
      routerLink: '/order/all',
      routeNode: 'order',
      imgUrl: '/assets/img/menu/icon_bill.svg',
      isActive: false,
      subMenu: [
        { id: 'menu-orders-list', label: 'Order List', routerLink: '/order/all' },
        { id: 'menu-orders-history', label: 'Order History', routerLink: '/purchase-order/1' },
      ] as SubMenu[],
      isHiddenInBusiness: true,
    },
    {
      id: 'menu-leads',
      label: 'Leads',
      routerLink: '/leads/follow/1',
      routeNode: 'leads',
      imgUrl: '/assets/img/menu/icon_Leads.svg',
      isActive: false,
      subMenu: [
        { id: 'menu-leads-info', label: 'Lead Info', routerLink: '/leads/follow/1' },
        { id: 'menu-leads-form', label: 'Form', routerLink: '/leads/form' },
      ] as SubMenu[],
      isHiddenInBusiness: false,
    },
    // {
    //   label: 'Customer Service',
    //   routerLink: '/service',
    //   imgUrl: '/assets/img/menu/icon_service.svg',
    //   isActive: false,
    //   subMenu: [] as SubMenu[],
    // },
    {
      id: 'menu-customers',
      label: 'Customers',
      routerLink: '/customers/details/list/1',
      routeNode: 'customers',
      imgUrl: '/assets/img/menu/icon_customer.svg',
      param: 1,
      isActive: false,
      subMenu: [] as SubMenu[],
      isHiddenInBusiness: false,
    },
    {
      id: 'menu-products',
      label: 'Products',
      routerLink: '/products/list/1',
      routeNode: 'products',
      param: 1,
      imgUrl: '/assets/img/menu/icon_product.svg',
      isActive: false,
      subMenu: [] as SubMenu[],
      isHiddenInBusiness: true,
    },
    {
      id: 'menu-settings',
      label: 'Settings',
      routerLink: '/setting/owner',
      routeNode: 'setting',
      imgUrl: '/assets/img/menu/icon_setting.svg',
      isActive: false,
      subMenu: [] as SubMenu[],
      isHiddenInBusiness: false,
    },
  ] as Menu[];

  ngOnInit(): void {
    this.currentRoute = this.activatedRoute.snapshot.firstChild?.url[0]?.path || '';
    this.authService.menuEnable$.subscribe((res) => {
      this.menuEnable = res;
    });
    this.checkUserRole();
    this.getUserContext();
    this.getIsSubscriptionBusiness();
    this.onPageChangingSubscription();
    if (window.innerWidth <= 992) {
      this.menuMinHeight = 'unset';
      this.menuMaxHeight = window.innerHeight - 65 + 'px';
    } else {
      this.menuMinHeight = window.innerHeight - 2 + 'px';
      this.menuMaxHeight = 'unset';
    }
  }
  ngAfterViewChecked(): void {
    this.CDR.detectChanges();
  }

  // updateUserContext(): void {
  //   this.pagesService.updateContext.pipe(takeUntil(this.destroy$)).subscribe((isUpdate: boolean) => {
  //     if (isUpdate) {
  //       this.getUserContext();
  //     }
  //   });
  // }

  goToMessages(): void {
    void this.router.navigate(['/follows/list/all/1']);
  }
  //
  getUserContext(): void {
    this.userService.$userContext.subscribe((res: IUserContext) => {
      this.facebookPageData = [];
      this.hasPages = true;
      this.userContext = res;
      const { pages } = this.userContext;
      const currentPageIndex = Number(getCookie('page_index'));

      pages.map((item, index) => {
        const page: IPageWithStatus = {
          pageID: item.pageId,
          pageIndex: item.pageIndex,
          pageImgUrl: item.picture,
          pageTitle: item.pageName,
          pageActiveStatus: false,
          pageWizardStep: item.wizardStep,
        };

        if (index === currentPageIndex) {
          page.pageActiveStatus = true;
          this.pageImgUrlActive = page.pageImgUrl;
          this.pageTitleActive = page.pageTitle;
          this.currentPageRole = item.pageRole;
        }

        if (pages.length - 1 < currentPageIndex && index === 0) {
          page.pageActiveStatus = true;
          this.pageImgUrlActive = page.pageImgUrl;
          this.pageTitleActive = page.pageTitle;
          setCookie('page_index', 0, 30);
        }

        this.facebookPageData.push(page);
      });
    });
  }

  getAllPageNotification(): void {
    this.notificationService
      .getAllNotificationInbox()
      .pipe(takeUntil(this.destroy$))
      .subscribe((notify) => {
        this.facebookPageData.map((pageContext) => {
          const payload = notify.find((x) => pageContext.pageID === x.pageID);
          payload ? (pageContext.pageTotalNotify = payload.total) : (pageContext.pageTotalNotify = 0);
        });
      });
  }

  getIsSubscriptionBusiness(): void {
    this.subscriptionService.$subscriptionLimitAndDetail.pipe(takeUntil(this.destroy$)).subscribe((subscriptionLimit) => {
      this.isSubscriptionBusiness = subscriptionLimit.featureType === EnumSubscriptionFeatureType.BUSINESS;
    });
  }

  checkUserRole(): void {
    this.subscriptionService.$subscription.subscribe((result: ISubscriptionContext) => {
      this.subscription = result;
      if (result.role === EnumUserSubscriptionType.OWNER) {
        this.isOwner = true;
        this.isLoading = false;
      }
    });
  }
  menuToggle(): void {
    this.menuStatus = !this.menuStatus;
    this.layoutservice.setMenuStatus(this.menuStatus);
  }
  fetchAllPageNotification(fetch: boolean): void {
    if (fetch === true) {
      this.getAllPageNotification();
    }
  }

  openSuccessDialog(message, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });
    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  createPage(): void {
    this.isLoading = true;

    this.pagesService
      .createPage()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        () => {
          this.pagesService.triggerPageChanging(true).subscribe();
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.PAGE_REACHED_LIMIT) !== -1) {
            this.openSuccessDialog(
              {
                text: 'Because you have more than the specified shop For more information, please contact us at 02-029-1200',
                title: 'Sorry, unable to create shop',
              },
              true,
            );
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant('Something went wrong'),
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.log(err);
          }
        },
      );
  }

  selectPageByIndex(page: IPagesContext): void {
    const currentIndex = Number(getCookie('page_index'));
    const index = page.pageIndex;
    if (index !== currentIndex) {
      for (let i = 0; i < this.facebookPageData.length; i++) {
        this.facebookPageData[i].pageActiveStatus = false;
      }
      this.facebookPageData[index].pageActiveStatus = true;
      this.pageImgUrlActive = this.facebookPageData[index].pageImgUrl;
      this.pageTitleActive = this.facebookPageData[index].pageTitle;
      setCookie('page_index', page.pageIndex, 30);

      this.pagesService
        .changingPage(page.pageIndex)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.pagesService.triggerPageChanging(false).subscribe();
            window.location.reload();
          },
          (err) => {
            if (err.message.indexOf(EnumWizardStepError.SETUP_FLOW_NOT_SUCCESS) !== -1) {
              this.pagesService.triggerPageChanging(true).subscribe();
              void this.router.navigateByUrl('/create-shop');
            } else {
              this.openSuccessDialog(
                {
                  text: this.translate.instant('Something went wrong'),
                  title: this.translate.instant('Error'),
                },
                true,
              );
              console.log('err :', err);
            }
          },
        );
    }
  }

  onResize(event): void {
    if (window.innerWidth <= 992) {
      this.menuMinHeight = 'unset';
      this.menuMaxHeight = event.target.innerHeight - 65 + 'px';
      this.menuStatus = false;
      this.layoutservice.setMenuStatus(false);
    } else {
      this.menuMinHeight = event.target.innerHeight - 2 + 'px';
      this.menuMaxHeight = 'unset';
      this.menuStatus = true;
      this.layoutservice.setMenuStatus(true);
    }
  }

  clickOutsideMenuEvent(event): void {
    const isOutsideMenu = event && window.innerWidth <= 992 && this.navOutside;
    if (isOutsideMenu) {
      this.menuStatus = false;
      this.layoutservice.setMenuStatus(false);
    }
  }

  onPageChangingSubscription(): void {
    this.pagesService
      .onPageChangingSubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        // redirect
        if (res.value === EnumForceUpdateRoute.TO_DEFAULT) {
          window.location.href = environment.DEFAULT_ROUTE;
        } else if (res.value === EnumForceUpdateRoute.TO_CREATE) {
          window.location.href = '/create-shop';
        }
      }),
      (err) => {
        console.log('onPageChangingSubscription ===> err: ', err);
      };
  }

  recheckMenuActiveStatus(index: number): void {
    for (let i = 0; i < this.menuItems.length; i++) {
      if (i !== index) {
        this.menuItems[i].isActive = false;
        if (this.menuItems[i].subMenu.length > 0) {
          this.menuItems[i].routerLink = this.menuItems[i].subMenu[0].routerLink;
        }
      }
    }
    if (this.menuItems[index].subMenu.length && this.menuStatus) this.menuItems[index].isActive = !this.menuItems[index].isActive;
  }

  changeRouteTo(target: string, index: number): void {
    this.currentRoute = target;
    if (this.menuEnable) {
      this.routeService.setRouteRef(target);
      void this.ngZone.run(() => this.router.navigateByUrl(target));
      this.recheckMenuActiveStatus(index);
    }
  }

  changeRouteSubTo(target: string, index: number, subindex: number): void {
    if (this.menuEnable) {
      this.routeService.setRouteRef(target);
      void this.ngZone.run(() => this.router.navigateByUrl(target));
      this.menuItems[index].routerLink = this.menuItems[index].subMenu[subindex].routerLink;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
