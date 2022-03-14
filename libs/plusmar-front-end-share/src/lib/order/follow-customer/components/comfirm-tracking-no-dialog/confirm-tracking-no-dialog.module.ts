import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComfirmTrackingNoDialogComponent } from './comfirm-tracking-no-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule, DatepickerModule } from '@reactor-room/itopplus-cdk';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ComfirmTrackingNoDialogComponent],
  imports: [CommonModule, TranslateModule, CustomDialogModule, ReactiveFormsModule, DatepickerModule],
  exports: [ComfirmTrackingNoDialogComponent],
})
export class ConfirmTrackingNoDialogModule {}
