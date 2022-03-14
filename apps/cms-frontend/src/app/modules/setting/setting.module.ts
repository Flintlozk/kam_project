import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting.routing';
import { SettingAdvanceModule } from './components/setting-advance/setting-advance.module';
import { SettingMemberModule } from './components/setting-member/setting-member.module';
import { SettingAdminModule } from './components/setting-admin/setting-admin.module';
import { SettingWebsiteModule } from './components/setting-website/setting-website.module';
import { LayoutModule } from '../../containers/layout/layout.module';
import { SettingShopModule } from './components/setting-shop/setting-shop.module';

@NgModule({
  declarations: [SettingComponent],
  imports: [CommonModule, SettingRoutingModule, SettingAdminModule, SettingAdvanceModule, SettingMemberModule, SettingWebsiteModule, SettingShopModule, LayoutModule],
  exports: [SettingComponent],
})
export class SettingModule {}
