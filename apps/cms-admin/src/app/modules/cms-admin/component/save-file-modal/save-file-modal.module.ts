import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveFileModalComponent } from './save-file-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [SaveFileModalComponent],
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule, MatDialogModule],
  exports: [SaveFileModalComponent],
})
export class SaveFileModalModule {}
