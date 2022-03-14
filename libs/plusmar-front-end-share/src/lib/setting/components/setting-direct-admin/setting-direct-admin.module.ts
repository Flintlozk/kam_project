import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingDirectAdminDialogModule } from './components/setting-direct-admin-dialog/setting-direct-admin-dialog.module';
import { SettingDirectAdminComponent } from './setting-direct-admin.component';

import { CustomDialogModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';

import { UserAliasNameModule } from '@reactor-room/plusmar-front-end-share/user/user-alias-name/user-alias-name.module';
import { UserRoleDialogModule } from '@reactor-room/plusmar-front-end-share/user/user-role-dialog/user-role-dialog.module';
import { UserNotifyEmailDialogModule } from '@reactor-room/plusmar-front-end-share/user/user-notify-email-dialog/user-notify-email-dialog.module';

@NgModule({
  declarations: [SettingDirectAdminComponent],
  exports: [SettingDirectAdminComponent],
  imports: [
    CommonModule,
    CustomTableModule,
    CustomDialogModule,
    LoaderModule,
    TranslateModule,
    SettingDirectAdminDialogModule,
    UserAliasNameModule,
    UserRoleDialogModule,
    UserNotifyEmailDialogModule,
  ],
})
export class SettingDirectAdminModule {}
