import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { AddressModule, CustomDialogModule, ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { CompanyInfoDialogComponent } from './company-info-dialog.component';

@NgModule({
  declarations: [CompanyInfoDialogComponent],
  imports: [CommonModule, TranslateModule, AddressModule, MatFormFieldModule, ReactiveFormsModule, CustomDialogModule],
  exports: [CompanyInfoDialogComponent],
})
export class CompanyInfoDialogModule {}
