import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeSettingTextComponent } from './cms-theme-setting-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [CmsThemeSettingTextComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatAutocompleteModule],
  exports: [CmsThemeSettingTextComponent],
})
export class CmsThemeSettingTextModule {}
