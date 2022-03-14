import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopupDialogComponent } from './topup-dialog.component';
import { CustomDialogModule, FormatCurrencyModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TopupDialogComponent],
  imports: [CommonModule, CustomDialogModule, TranslateModule, FormatCurrencyModule, FormsModule, ReactiveFormsModule],
  exports: [TopupDialogComponent],
})
export class TopupDialogModule {}
