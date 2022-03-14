import { NgModule } from '@angular/core';
import { TrackingDialogComponent } from './tracking-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DatepickerModule, CustomDialogModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [TrackingDialogComponent],
  imports: [CommonModule, TranslateModule, DatepickerModule, CustomDialogModule, TimeAgoPipeModule],
  exports: [TrackingDialogComponent],
})
export class TrackingDialogModule {}
