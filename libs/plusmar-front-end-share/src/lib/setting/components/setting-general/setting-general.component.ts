import { Component, OnInit } from '@angular/core';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { EnumPageMemberType, IPageSettings, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-general',
  templateUrl: './setting-general.component.html',
  styleUrls: ['./setting-general.component.scss'],
})
export class SettingGeneralComponent implements OnInit {
  isAllowed = false;

  destroy$ = new Subject<boolean>();
  feature: { WORKING_HOURS: boolean };

  constructor(private userService: UserService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.checkIsUserHavePermission();
    this.getPageSettings();
  }

  checkIsUserHavePermission(): void {
    this.userService.$userPageRole.pipe(takeUntil(this.destroy$)).subscribe((userRole) => {
      if (userRole !== EnumPageMemberType.STAFF) this.isAllowed = true;
    });
  }

  getPageSettings(): void {
    const feature = {
      WORKING_HOURS: false,
    };
    this.settingsService.getPageSettings().subscribe((val: IPageSettings[]) => {
      val.map((item: IPageSettings) => {
        switch (item.setting_type) {
          case PageSettingType.WORKING_HOURS:
            feature.WORKING_HOURS = item.status;
            break;
        }
      });

      this.feature = feature;
    });
  }
}
