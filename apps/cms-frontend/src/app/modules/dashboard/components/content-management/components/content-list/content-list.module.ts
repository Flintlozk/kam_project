import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { ConfirmDialogModule } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.module';
import { ContentListComponent } from './content-list.component';

@NgModule({
  declarations: [ContentListComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, CustomTableModule, RouterModule, MatMenuModule, ConfirmDialogModule, FormsModule, ReactiveFormsModule],
  exports: [ContentListComponent],
})
export class ContentListModule {}
