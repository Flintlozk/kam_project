import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsSiteMenuPageComponent } from './cms-site-menu-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CmsSiteMenuOptionModule } from './cms-site-menu-option/cms-site-menu-option.module';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [CmsSiteMenuPageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatDialogModule, MatMenuModule, CmsSiteMenuOptionModule, MatSnackBarModule, DragDropModule],
  exports: [CmsSiteMenuPageComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
})
export class CmsSiteMenuPageModule {}
