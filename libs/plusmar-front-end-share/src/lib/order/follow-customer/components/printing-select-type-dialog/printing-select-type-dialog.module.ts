import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintingSelectTypeDialogComponent } from './printing-select-type-dialog.component';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [PrintingSelectTypeDialogComponent],
  imports: [CommonModule, CustomDialogModule, MatFormFieldModule, MatSelectModule],
  exports: [PrintingSelectTypeDialogComponent],
})
export class PrintingSelectTypeDialogModule {}
