import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderInformPaymentDialogComponent } from './order-inform-payment-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [OrderInformPaymentDialogComponent],
  imports: [CommonModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDialogModule, TranslateModule],
  exports: [OrderInformPaymentDialogComponent],
})
export class OrderInformPaymentDialogModule {}
