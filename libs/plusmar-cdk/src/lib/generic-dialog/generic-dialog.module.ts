import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericDialogComponent } from './generic-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [GenericDialogComponent],
  imports: [CommonModule, TranslateModule],
  exports: [GenericDialogComponent],
})
export class GenericDialogModule {}
