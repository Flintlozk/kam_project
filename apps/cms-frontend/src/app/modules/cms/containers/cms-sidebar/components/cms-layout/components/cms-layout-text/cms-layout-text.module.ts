import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { CmsElementPositionModule } from './../../../../../../../../components/cms-element-position/cms-element-position.module';
import { CmsLayoutTextComponent } from './cms-layout-text.component';

@NgModule({
  declarations: [CmsLayoutTextComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatMenuModule, MatAutocompleteModule, CmsElementPositionModule],
  exports: [CmsLayoutTextComponent],
})
export class CmsLayoutTextModule {}
