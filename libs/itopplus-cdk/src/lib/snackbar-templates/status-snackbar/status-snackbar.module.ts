import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusSnackbarComponent } from './status-snackbar.component';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [StatusSnackbarComponent],
  imports: [CommonModule, MatSnackBarModule, TranslateModule],
  exports: [StatusSnackbarComponent],
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
export class StatusSnackbarModule {}
