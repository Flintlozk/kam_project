import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderConfirmShippingDialogComponent } from './order-confirm-shipping-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [OrderConfirmShippingDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, TranslateModule],
  exports: [OrderConfirmShippingDialogComponent],
})
export class OrderConfirmShippingDialogModule {}
