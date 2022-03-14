import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CMSUserService } from '@reactor-room/cms-frontend-services-lib';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import {
  EnumAuthError,
  EnumAuthScope,
  EnumSubscriptionFeatureType,
  EnumSubscriptionPackageType,
  EnumUserSubscriptionType,
  IGetShopProfile,
  IGetUserPhone,
  IPages,
  ISettingSubscriptionDetail,
  ISocialConnect,
  ISubscriptionLimitAndDetails,
  ITaxModel,
} from '@reactor-room/itopplus-model-lib';
import { ITextTitle } from '@reactor-room/model-lib';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { TaxService } from '@reactor-room/plusmar-front-end-share/services/tax.service';
import { EMPTY, forkJoin, Observable, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

enum TypeLink {
  FACEBOOK = 'facebook',
  LINE = 'line',
  ////:: marketplace functionality commenting now
  // SHOPEE = 'shopee',
  // LAZADA = 'lazada',
}

@Component({
  selector: 'reactor-room-setting-shop-owner',
  templateUrl: './setting-shop-owner.component.html',
  styleUrls: ['./setting-shop-owner.component.scss'],
})
export class SettingShopOwnerComponent implements OnInit, OnDestroy {
  @Input() theme = EnumAuthScope.SOCIAL;
  themeType = EnumAuthScope;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isOwner = false;
  taxData: ITaxModel;
  isRemainingWarning = false;
  isSubscriptionFree: boolean;
  isExpired = false;
  page$: Observable<IPages>;
  subscriptionLimit: ISubscriptionLimitAndDetails;
  subscriptionFeatureType: EnumSubscriptionFeatureType;
  shopOwner = {
    address: '',
    currency: '',
    email: '',
    language: '',
    tel: '',
    lastname: '',
    page_name: '',
    social_facebook: '',
    social_line: '',
    ////:: marketplace functionality commenting now
    // social_lazada: '',
    // social_shopee: '',
  } as IGetShopProfile;
  subscription = {
    package: '',
    pagelimit: 0,
    pageusing: 0,
    daysRemaining: 0,
    expiredDate: '',
  } as ISettingSubscriptionDetail;
  userPhone = '';
  socialConnect = {
    facebook: { id: null },
    line: { name: null },
    ////:: marketplace functionality commenting now
    // lazada: { id: null },
    // shopee: { id: null },
  } as ISocialConnect;
  isMobile: boolean;
  socialConnectedText = '';
  typeLink = TypeLink;

  currentBudget = 0;
  constructor(
    private pageService: PagesService,
    public translate: TranslateService,
    private settingService: SettingsService,
    private dialog: MatDialog,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private cmsSubscriptionService: CMSUserService,
    private taxService: TaxService,
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  editPage(): void {
    if (this.theme === this.themeType.CMS) {
      void this.router.navigateByUrl('setting/pages/edit');
    } else {
      void this.router.navigateByUrl('/pages/edit');
    }
  }

  ngOnInit(): void {
    this.isMobile = isMobile();
    this.socialConnectedText = this.isMobile ? 'Open app' : 'Copy link';
    this.getAllShopDetailPage().subscribe();
    this.getSubscriptionLimitAndDetails();
    this.getTaxData();
    if (this.theme === this.themeType.CMS) {
      this.cmsSubscriptionService.$subscription.subscribe((result) => {
        if (result.role === EnumUserSubscriptionType.OWNER) {
          this.isOwner = true;
        }
      });
    } else {
      this.subscriptionService.$subscription.subscribe((result) => {
        this.isSubscriptionFree = result.packageType === EnumSubscriptionPackageType.FREE;
        if (result.role === EnumUserSubscriptionType.OWNER) this.isOwner = true;
      });
    }
  }
  getTaxData(): void {
    this.taxService
      .getTaxByPageID()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: ITaxModel) => {
          if (result) {
            this.taxData = result;
          } else {
            this.taxData = null;
          }
        },
        (err) => {
          this.openSuccessDialog(
            {
              text: this.translate.instant('Something went wrong when loading tax info, please try again later. For more information, please contact us at 02-029-1200'),
              title: this.translate.instant('Error'),
            },
            true,
          );
          console.log(err);
        },
      );
  }
  getAllShopDetailPage(): Observable<{
    sourceOne: ISettingSubscriptionDetail;
    sourceTwo: IGetUserPhone;
    sourceThree: IGetShopProfile;
    sourceFour: ISocialConnect;
    // sourceFive: ISubscriptionBudget;
  }> {
    return forkJoin({
      sourceOne: this.getSubscriptionDetail(),
      sourceTwo: this.getPhoneFromUser(),
      sourceThree: this.getShopProfile(),
      sourceFour: this.getSocialConnectStatus(),
      // sourceFive: this.getSubscriptionBudget(),
    });
  }

  getSubscriptionDetail(): Observable<ISettingSubscriptionDetail> {
    return this.settingService.getSubScriptionDetail().pipe(
      tap((detail) => {
        this.subscription = detail;
        this.isRemainingWarning = this.subscription.daysRemaining < 8 && this.subscription.daysRemaining >= 0;
        this.isExpired = this.subscription.daysRemaining < 0;
      }),
      catchError((err) => {
        if (err.message.indexOf(EnumAuthError.NO_PAGES) !== -1) {
        } else {
          console.log('err', err);
          this.openSuccessDialog(
            {
              text: this.translate.instant('Something went wrong when loading package detail, please try again later. For more information, please contact us at 02-029-1200'),
              title: this.translate.instant('Error'),
            },
            true,
          );
        }
        return EMPTY;
      }),
    );
  }

  getSocialConnectStatus(): Observable<ISocialConnect> {
    return this.settingService.getSocialConnectStatus().pipe(
      tap((result) => {
        this.socialConnect = result;
      }),
      catchError((err) => {
        if (err.message.indexOf(EnumAuthError.FB_PAGE_NOT_FOUND) !== -1) {
          // TODO: case fb page delete?
        }
        return EMPTY;
      }),
    );
  }

  getPhoneFromUser(): Observable<IGetUserPhone> {
    return this.settingService.getPhoneFromUser().pipe(
      tap((userDetail) => {
        this.userPhone = userDetail.tel;
      }),
    );
  }

  getShopProfile(): Observable<IGetShopProfile> {
    return this.settingService.getShopProfile().pipe(
      tap((result) => {
        if (result != null) {
          this.shopOwner = result;
        }
      }),
    );
  }

  getSubscriptionLimitAndDetails(): void {
    if (this.theme === this.themeType.CMS) {
      this.cmsSubscriptionService.$subscriptionLimitAndDetail.subscribe((subscriptionLimit) => {
        this.subscriptionLimit = subscriptionLimit;
        this.subscriptionFeatureType = subscriptionLimit.featureType;
      });
    } else {
      this.subscriptionService.$subscriptionLimitAndDetail.subscribe((subscriptionLimit) => {
        this.subscriptionLimit = subscriptionLimit;
        this.subscriptionFeatureType = subscriptionLimit.featureType;
      });
    }
  }

  openSuccessDialog(message: ITextTitle, isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  copyLink(typeLink: TypeLink): void {
    const link = this.getLink(typeLink);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'absolute';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSuccessDialog(
      {
        text: link,
        title: this.translate.instant('Copied Successfully'),
      },
      false,
    );
  }

  getLink(typelink: TypeLink): string {
    let link = 'https://www.facebook.com/';
    switch (typelink) {
      case TypeLink.LINE:
        link = `https://line.me/R/ti/p/${this.socialConnect.line.id}`;
        break;
      ////:: marketplace functionality commenting now
      // case TypeLink.SHOPEE:
      //   link = `${this.socialConnect.shopee.url}`;
      //   break;
      // case TypeLink.LAZADA:
      //   link = `${this.socialConnect.lazada.url}`;
      //   break;
      default:
        link = `https://www.facebook.com/${this.socialConnect.facebook.username ? this.socialConnect.facebook.username : this.socialConnect.facebook.id}`;
        break;
    }
    return link;
  }
}
