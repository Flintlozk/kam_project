import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsPageSelectionComponent } from './cms-page-selection.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  declarations: [CmsPageSelectionComponent],
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  exports: [CmsPageSelectionComponent],
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
export class CmsPageSelectionModule {}
