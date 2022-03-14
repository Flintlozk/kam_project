import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { DatepickerModule, ITOPPLUSCDKModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { QuickPayCancelDialogComponent } from './quick-pay-details/quick-pay-cancel-dialog/quick-pay-cancel-dialog.component';
import { QuickPayDetailsComponent } from './quick-pay-details/quick-pay-details.component';
import { QuickPayImageSelectorDialogComponent } from './quick-pay-details/quick-pay-image-selector-dialog/quick-pay-image-selector-dialog.component';
import { QuickPayDisableComponent } from './quick-pay-disable/quick-pay-disable.component';
import { QuickPayNewComponent } from './quick-pay-new/quick-pay-new.component';
import { QuickPayTransactionListComponent } from './quick-pay-transaction-list/quick-pay-transaction-list.component';
import { QuickPayComponent } from './quick-pay.component';
import { QuickpayPaymentStatusPipe } from './quickpay-payment-status.pipe';
const componentList = [
  QuickPayComponent,
  QuickPayTransactionListComponent,
  QuickPayNewComponent,
  QuickpayPaymentStatusPipe,
  QuickPayDetailsComponent,
  QuickPayCancelDialogComponent,
  QuickPayDisableComponent,
  QuickPayImageSelectorDialogComponent,
];
@NgModule({
  declarations: componentList,
  imports: [
    CommonModule,
    TranslateModule,
    CustomTableModule,
    ReactiveFormsModule,
    FormsModule,
    ITOPPLUSCDKModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    DatepickerModule,
    TimeAgoPipeModule,
  ],
  exports: componentList,
})
export class QuickPayModule {}
