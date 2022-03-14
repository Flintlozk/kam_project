import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomDialogComponent } from './custom-dialog.component';

@NgModule({
  declarations: [CustomDialogComponent],
  exports: [CustomDialogComponent],
  imports: [CommonModule],
})
export class CustomDialogModule {}
