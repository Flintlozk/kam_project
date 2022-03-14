import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingAdminComponent } from './setting-admin.component';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SettingDirectAdminModule } from '@reactor-room/plusmar-front-end-share/setting/components/setting-direct-admin/setting-direct-admin.module';
import { SettingLogComponent } from '@reactor-room/plusmar-front-end-share/setting/components/setting-log/setting-log.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule, FilterModule } from '@reactor-room/plusmar-cdk';
import { MatNativeDateModule } from '@angular/material/core';
import { SettingAdminRoutingModule } from './setting-admin.routing';
import { LogDescriptionTranslatePipeModule } from '@reactor-room/plusmar-front-end-share/pipes/log-description-translate.pipe.module';

@NgModule({
  declarations: [SettingAdminComponent, SettingLogComponent],
  imports: [
    CommonModule,
    HeadingModule,
    MatTabsModule,
    SettingDirectAdminModule,
    TranslateModule,
    PaginationModule,
    CustomTableModule,
    FilterModule,
    MatNativeDateModule,
    SettingAdminRoutingModule,
    TimeAgoPipeModule,
    LogDescriptionTranslatePipeModule,
  ],
  exports: [SettingAdminComponent],
})
export class SettingAdminModule {}
