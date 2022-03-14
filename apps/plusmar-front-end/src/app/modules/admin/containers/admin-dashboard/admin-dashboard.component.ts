import { E } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { EPageMessageTrackMode, IPageListOnMessageTrackMode, IPageMessageTrackMode, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { Subject, Subscription, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { of } from 'zen-observable';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'reactor-room-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  facebookPageData: IPageListOnMessageTrackMode[] = [];
  EPageMessageTrackMode = EPageMessageTrackMode;
  currentPageID = -1;

  isReady = false;

  interval$: Subscription;
  destroy$ = new Subject<void>();
  stopTimer$ = new Subject<void>();
  INTERVAL_THRESHOLD = 30000;
  trackMode: EPageMessageTrackMode;
  constructor(private settingService: SettingsService, public adminService: AdminService, public userService: UserService, public layoutService: LayoutCommonService) {}

  ngOnInit(): void {
    this.getSettingMessageTrackMode();
    this.layoutService.setMenuStatus(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.stopTimer$.next(null);

    if (this.interval$) this.interval$.unsubscribe();
  }

  getSettingMessageTrackMode(): void {
    this.settingService
      .getPageSetting(PageSettingType.MESSAGE_TRACK)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          const configs = <IPageMessageTrackMode>val.options;
          if (configs?.trackMode) {
            this.trackMode = configs?.trackMode;
            this.getPageListContext();
          }
        }
      });
  }

  getPageListContext(): void {
    this.adminService.getPageListOnMessageTrackMode().subscribe((pages: IPageListOnMessageTrackMode[]) => {
      this.facebookPageData = pages;
      this.localFilter();
    });
  }

  localFilter(): void {
    let index = -1;
    const localValue = localStorage.getItem('adb-idx');
    if (!localValue) localStorage.setItem('adb-idx', '-1');
    else {
      const isFound = this.facebookPageData.find((page) => page.pageID === Number(localValue));
      index = Number(localValue);
      if (isFound) {
        index = Number(localValue);
        this.currentPageID = index;
      } else {
        localStorage.setItem('adb-idx', String(index));
        this.currentPageID = index;
        if (index === -1) this.trackMode = EPageMessageTrackMode.TRACK_BY_TAG;
        else if (index === -2) this.trackMode = EPageMessageTrackMode.TRACK_BY_ASSIGNEE;
      }
    }
    this.isReady = true;
    this.startInterval();
  }

  doChangePage(event: number): void {
    this.stopTimer$.next(null);
    if (event === -1) this.trackMode = EPageMessageTrackMode.TRACK_BY_TAG;
    else if (event === -2) this.trackMode = EPageMessageTrackMode.TRACK_BY_ASSIGNEE;
    else {
      const page = this.facebookPageData.find((item) => item.pageID === event);
      this.trackMode = page.pageMessageMode;
    }
    localStorage.setItem('adb-idx', event.toString());
    this.startInterval();
  }

  startInterval(): void {
    this.interval$ = timer(this.INTERVAL_THRESHOLD, this.INTERVAL_THRESHOLD)
      .pipe(
        takeUntil(this.stopTimer$),
        tap(() => {
          console.log(new Date());
          this.adminService.initiateEmitter.next(true);
          return of([true]);
        }),
      )
      .subscribe(() => {
        this.adminService.initiateEmitter.next(false);
      });
  }
}
