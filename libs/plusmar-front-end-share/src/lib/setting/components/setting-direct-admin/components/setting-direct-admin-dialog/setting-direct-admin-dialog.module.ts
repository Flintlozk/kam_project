import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingDirectAdminDialogComponent } from './setting-direct-admin-dialog.component';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SettingDirectAdminDialogComponent],
  exports: [SettingDirectAdminDialogComponent],
  imports: [CommonModule, TranslateModule, CustomDialogModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
})
export class SettingDirectAdminDialogModule {}
