import { NgModule } from '@angular/core';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { CMSProcessComponent } from './cms-process.component';

@NgModule({
  declarations: [CMSProcessComponent],
  exports: [CMSProcessComponent, MatSnackBarModule],
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
export class CMSProcessModule {}
