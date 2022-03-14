import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalErrorComponent } from './modal-error.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ModalErrorComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [ModalErrorComponent],
})
export class ModalErrorModule {}
