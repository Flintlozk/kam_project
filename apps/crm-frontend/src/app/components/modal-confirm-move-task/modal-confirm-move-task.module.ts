import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmMoveTaskComponent } from './modal-confirm-move-task.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { AssignFormModule } from '../assign-form/assign-form.module';

@NgModule({
  declarations: [ModalConfirmMoveTaskComponent],
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatInputModule, AssignFormModule],
  exports: [ModalConfirmMoveTaskComponent],
})
export class ModalConfirmMoveTaskModule {}
