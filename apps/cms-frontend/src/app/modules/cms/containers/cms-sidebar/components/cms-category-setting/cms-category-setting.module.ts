import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsCategorySettingComponent } from './cms-category-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CmsCategorySettingComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatChipsModule, MatFormFieldModule, MatAutocompleteModule],
  exports: [CmsCategorySettingComponent],
})
export class CmsCategorySettingModule {}
