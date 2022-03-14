import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductImagesDialogComponent } from './product-images-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
@NgModule({
  declarations: [ProductImagesDialogComponent],
  imports: [CommonModule, MatDialogModule, MatSnackBarModule],
  exports: [ProductImagesDialogComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 1000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
})
export class ProductImagesDialogModule {}
