import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [CommonModule, MatDialogModule],
  exports: [ConfirmDialogComponent],
})
export class ConfirmDialogModule {}
