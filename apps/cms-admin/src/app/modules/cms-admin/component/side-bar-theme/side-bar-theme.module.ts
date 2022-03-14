import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarThemeComponent } from './side-bar-theme.component';
import { RouterModule } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatInputModule } from '@angular/material/input';
import { DevicesListModule } from 'apps/cms-admin/src/app/components/devices-list/devices-list.module';

@NgModule({
  declarations: [SideBarThemeComponent],
  imports: [CommonModule, RouterModule, ColorPickerModule, ReactiveFormsModule, MatSlideToggleModule, FormsModule, MatInputModule, DevicesListModule],
  exports: [SideBarThemeComponent],
})
export class SideBarThemeModule {}
