import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingLazadaDialogComponent } from './setting-lazada-dialog.component';

const components = [SettingLazadaDialogComponent];
@NgModule({
  declarations: [...components],
  imports: [CommonModule],
  exports: [...components],
})
export class SettingLazadaDialogModule {}
