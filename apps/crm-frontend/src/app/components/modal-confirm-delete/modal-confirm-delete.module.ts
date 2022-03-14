import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmDeleteComponent } from './modal-confirm-delete.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ModalConfirmDeleteComponent],
  imports: [CommonModule, MatButtonModule, MatInputModule, MatDialogModule],
  exports: [ModalConfirmDeleteComponent],
})
export class ModalConfirmDeleteModule {}
