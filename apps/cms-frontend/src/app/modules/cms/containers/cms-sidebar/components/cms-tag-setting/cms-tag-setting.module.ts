import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsTagSettingComponent } from './cms-tag-setting.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsTagSettingComponent],
  imports: [CommonModule, MatChipsModule, MatFormFieldModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule],
  exports: [CmsTagSettingComponent],
})
export class CmsTagSettingModule {}
