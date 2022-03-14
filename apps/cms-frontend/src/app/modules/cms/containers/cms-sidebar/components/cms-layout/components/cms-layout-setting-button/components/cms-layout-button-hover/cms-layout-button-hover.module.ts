import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutButtonHoverComponent } from './cms-layout-button-hover.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CmsLayoutButtonHoverComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  exports: [CmsLayoutButtonHoverComponent],
})
export class CmsLayoutButtonHoverModule {}
