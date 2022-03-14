import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { EnumPageMemberType, IPagesAPI } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SetttingApiDialogComponent } from './components';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { SettingApiService } from '@reactor-room/plusmar-front-end-share/setting/services';
//import { SettingApiService } from '@plusmar-front/modules/setting/services';

@Component({
  selector: 'reactor-room-setting-api',
  templateUrl: './setting-api.component.html',
  styleUrls: ['./setting-api.component.scss'],
})
export class SettingApiComponent implements OnInit, OnDestroy {
  tableData: [];
  isAllowed = false;
  isActive = false;
  tableHeader: ITableHeader[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  clientAPI: IPagesAPI = {
    benabled_api: false,
    api_client_id: '',
    api_client_secret: '',
  };
  constructor(public translate: TranslateService, private userService: UserService, private settingApiService: SettingApiService, private dialog: MatDialog) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  ngOnInit(): void {
    this.setLabels();
    this.checkIsUserHavePermission();
    this.getApiKey();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getApiKey(): void {
    this.settingApiService
      .getClientAPIKey()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: IPagesAPI) => {
        this.clientAPI = result;
      });
  }

  toggleActiveStatus(): void {
    this.settingApiService
      .createClientAPI(this.isActive)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.clientAPI = result;
        this.settingApiService.bOpenApiToggle.next(this.isActive);
      });
  }

  openAPIDialog(): void {
    this.dialog.open(SetttingApiDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: this.clientAPI,
    });
  }

  setLabels(): void {
    this.tableHeader = [
      { sort: false, title: 'Client ID', key: 'client_id' },
      { sort: false, title: '', key: null },
    ];
  }

  checkIsUserHavePermission(): void {
    this.userService.$userPageRole.pipe(takeUntil(this.destroy$)).subscribe((userRole) => {
      if (userRole !== EnumPageMemberType.STAFF) this.isAllowed = true;
    });
  }
}
