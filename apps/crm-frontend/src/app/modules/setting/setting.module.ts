import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingAllLayoutComponent } from './containers/setting-all-layout/setting-all-layout.component';
import { SettingTagComponent } from './containers/setting-tag/setting-tag.component';
import { SettingRoutingModule } from './setting.routes';
import { MatCardModule } from '@angular/material/card';
import { SidebarNavModule } from '../../components/sidebar-nav/sidebar-nav.module';
import { TopToolBarComponentModule } from '../../components/top-tool-bar-component/top-tool-bar-component.module';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [SettingComponent, SettingAllLayoutComponent, SettingTagComponent],
  imports: [CommonModule, SettingRoutingModule, SidebarNavModule, TopToolBarComponentModule, MatCardModule, MatSelectModule],
})
export class SettingModule {}
