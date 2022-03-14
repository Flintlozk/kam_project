import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsSiteSettingComponent } from './cms-site-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MonacoEditorModule } from '@reactor-room/itopplus-front-end-helpers';

@NgModule({
  declarations: [CmsSiteSettingComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, MatSelectModule, MatFormFieldModule, MatMenuModule, MonacoEditorModule],
  exports: [CmsSiteSettingComponent],
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
export class CmsSiteSettingModule {}
