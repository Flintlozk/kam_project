import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import {
  EnumPageMemberType,
  IAdvancedPageSettingsDirectMessageSteps,
  IPageAdvancedSettings,
  IPages,
  IPagesContext,
  IPageSettings,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-advance',
  templateUrl: './setting-advance.component.html',
  styleUrls: ['./setting-advance.component.scss'],
})
export class SettingAdvanceComponent implements OnInit, OnDestroy {
  @Input() isSubscriptionBusiness: boolean;
  messageForm: FormGroup;
  // messagePipeline: FormGroup;
  leadForm: FormGroup;
  cartForm: FormGroup;
  currentSetting: IAdvancedPageSettingsDirectMessageSteps = null;
  isLoading = false;

  feature: { CUSTOMER_CLOSED_REASON: boolean; CUSTOMER_SLA_TIME: boolean };

  constructor(public translate: TranslateService, private pageService: PagesService, private settingsService: SettingsService, private userService: UserService) {
    translate.onLangChange.subscribe(() => {
      // this.setLabels();
    });
  }
  destroy$ = new Subject<boolean>();
  settings: IPageAdvancedSettings = null;
  isAllowed = false;
  successDialog;
  defaultSettings: IPageAdvancedSettings = {
    auto_reply: false,
    direct_message: [],
  };
  type: [
    { 6; title: 'add to cart'; subtitle: ['shipping'] },
    {
      title: 'customer confirm order';
      subtitle: ['Received Order', 'Logistic'];
    },
  ];

  ngOnInit(): void {
    this.getPageSettings();
    this.checkIsUserHavePermission();
    this.pageService.currentPage$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((p: IPagesContext) => (p ? this.pageService.getPageByID() : of(null))),
        map((page: IPages) => (this.settings = page.option.advanced_settings || this.defaultSettings)),
      )
      .subscribe();
  }

  checkIsUserHavePermission(): void {
    this.userService.$userPageRole.pipe(takeUntil(this.destroy$)).subscribe((userRole) => {
      if (userRole !== EnumPageMemberType.STAFF) this.isAllowed = true;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  isLoadingToggle(bool: boolean): void {
    this.isLoading = bool;
  }

  getPageSettings(): void {
    const feature = {
      CUSTOMER_CLOSED_REASON: false,
      CUSTOMER_SLA_TIME: false,
    };
    this.settingsService.getPageSettings().subscribe((val: IPageSettings[]) => {
      val.map((item: IPageSettings) => {
        switch (item.setting_type) {
          case PageSettingType.CUSTOMER_CLOSED_REASON:
            feature.CUSTOMER_CLOSED_REASON = item.status;
            break;
          case PageSettingType.CUSTOMER_SLA_TIME:
            feature.CUSTOMER_SLA_TIME = item.status;
            break;
        }
      });

      this.feature = feature;
    });
  }
}
