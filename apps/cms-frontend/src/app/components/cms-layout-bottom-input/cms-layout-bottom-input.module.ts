import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormModule } from 'apps/cms-frontend-mobile/src/app/shared/form.module';
import { CmsLayoutBottomInputComponent } from './cms-layout-bottom-input.component';

@NgModule({
  declarations: [CmsLayoutBottomInputComponent],
  imports: [CommonModule, ReactiveFormsModule, FormModule, MatSelectModule, MatFormFieldModule, MatMenuModule, MatAutocompleteModule],
  exports: [CmsLayoutBottomInputComponent],
})
export class CmsLayoutBottomInputModule {}
