import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateModalComponent } from './create-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CreateModalComponent],
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule, MatDialogModule, MatSelectModule, MatFormFieldModule],
  exports: [CreateModalComponent],
})
export class CreateModalModule {}
