import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingApiComponent } from './setting-api.component';

import { CustomDialogModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { FormsModule } from '@angular/forms';
import { SetttingApiDialogComponent } from './components';

@NgModule({
  declarations: [SettingApiComponent, SetttingApiDialogComponent],
  exports: [SettingApiComponent],
  imports: [CommonModule, CustomTableModule, CustomDialogModule, LoaderModule, TranslateModule, MatTooltipModule, FormsModule],
})
export class SettingAPIModule {}
