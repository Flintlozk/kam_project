import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusDialogComponent } from './status-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [StatusDialogComponent],
  imports: [CommonModule, MatDialogModule],
  exports: [StatusDialogComponent],
})
export class StatusDialogModule {}
