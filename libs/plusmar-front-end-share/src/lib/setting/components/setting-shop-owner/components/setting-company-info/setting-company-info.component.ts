import { AfterContentInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { SettingModuleService } from '@plusmar-front/modules/setting/setting.module.service';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { EnumAuthScope, ICompanyInfo, IGetShopProfile } from '@reactor-room/itopplus-model-lib';
import { CompanyInfoDialogComponent } from './company-info-dialog/company-info-dialog.component';
import { SettingModuleService } from '@reactor-room/plusmar-front-end-share/setting/setting.module.service';

@Component({
  selector: 'reactor-room-setting-company-info',
  templateUrl: './setting-company-info.component.html',
  styleUrls: ['./setting-company-info.component.scss'],
})
export class SettingCompanyInfoComponent implements OnInit, AfterContentInit {
  companyInfo: ICompanyInfo;
  @Input() shopDetails: IGetShopProfile;
  @Input() isEditAvailable = true;
  @Input() theme = 'SOCIAL';
  themeType = EnumAuthScope;

  constructor(private cd: ChangeDetectorRef, private dialog: MatDialog, private settingModuleService: SettingModuleService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.getCompanyInfo();
  }

  ngAfterContentInit(): void {
    this.cd.detectChanges();
  }

  getCompanyInfo(): void {
    this.settingsService.getCompanyInfo().subscribe((companyInfo) => {
      this.companyInfo = companyInfo;
      this.settingModuleService.fetchCompanyInfo.next(companyInfo);
    });
  }

  openCompanyInfoSetting(): void {
    const dialogRef = this.dialog.open(CompanyInfoDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      panelClass: 'settings-company-info',
      data: this.theme,
    });
    dialogRef.componentInstance.shopDetails = this.shopDetails;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.settingModuleService.fetchCompanyInfo.next(result);
      setTimeout(() => {
        this.getCompanyInfo();
      }, 100);
    });
  }
}
