import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { OrderConfirmFinishComponent } from './order-confirm-finish.component';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { CurrencyModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [OrderConfirmFinishComponent],
  imports: [CommonModule, ClipboardModule, MatSnackBarModule, CurrencyModule, TranslateModule],
  exports: [OrderConfirmFinishComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 1000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
})
export class OrderConfirmFinishModule {}
