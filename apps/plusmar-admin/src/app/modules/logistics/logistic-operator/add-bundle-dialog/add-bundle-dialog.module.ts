import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { DatepickerModule } from '../../../../components/datepicker/datepicker.module';
import { AddBundleDialogComponent } from './add-bundle-dialog.component';

@NgModule({
  declarations: [AddBundleDialogComponent],
  imports: [CommonModule, DatepickerModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, ITOPPLUSCDKModule],
  exports: [AddBundleDialogComponent],
})
export class AddBundleDialogModule {}
