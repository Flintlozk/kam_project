import { NgModule } from '@angular/core';
import { UpdateHtmlErrorModalComponent } from './update-html-error-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [UpdateHtmlErrorModalComponent],
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule, MatDialogModule, MatTableModule],
  exports: [UpdateHtmlErrorModalComponent],
})
export class UpdateHtmlErrorModalModule {}
