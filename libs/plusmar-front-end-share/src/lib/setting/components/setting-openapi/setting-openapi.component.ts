import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { EnumPageMemberType, IPagesAPI } from '@reactor-room/itopplus-model-lib';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SettingApiService } from '../../services';
//import { SettingApiService } from '@plusmar-front/modules/setting/services';

@Component({
  selector: 'reactor-room-setting-openapi',
  templateUrl: './setting-openapi.component.html',
  styleUrls: ['./setting-openapi.component.scss'],
})
export class SettingOpenapiComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isAllowed = false;
  clientAPI: IPagesAPI = {
    benabled_api: false,
    api_client_id: '',
    api_client_secret: '',
  };
  constructor(private userService: UserService, private settingApiService: SettingApiService) {}

  ngOnInit(): void {
    this.checkIsUserHavePermission();
    this.getApiKey();
    this.settingApiService.bOpenApiToggle.subscribe((res: boolean) => {
      this.clientAPI.benabled_api = res;
    });
  }

  getApiKey(): void {
    this.settingApiService
      .getClientAPIKey()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: IPagesAPI) => {
        this.clientAPI = result;
      });
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
}
