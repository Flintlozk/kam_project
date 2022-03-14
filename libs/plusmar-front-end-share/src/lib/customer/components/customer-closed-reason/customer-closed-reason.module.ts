import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerClosedReasonComponent } from './customer-closed-reason.component';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomerClosedReasonComponent],
  imports: [CommonModule, CustomDialogModule, TranslateModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  exports: [CustomerClosedReasonComponent],
})
export class CustomerClosedReasonModule {}
