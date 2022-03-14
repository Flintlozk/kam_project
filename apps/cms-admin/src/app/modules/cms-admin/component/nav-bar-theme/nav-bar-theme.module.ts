import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarThemeComponent } from './nav-bar-theme.component';
import { LogoModule } from '../../../../components/icon/logo/logo.module';
import { SideBarThemeModule } from '../side-bar-theme/side-bar-theme.module';
import { DevicesListModule } from 'apps/cms-admin/src/app/components/devices-list/devices-list.module';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [NavBarThemeComponent],
  imports: [CommonModule, LogoModule, SideBarThemeModule, DevicesListModule, RouterModule, MatSelectModule],
  exports: [NavBarThemeComponent],
})
export class NavBarThemeModule {}
