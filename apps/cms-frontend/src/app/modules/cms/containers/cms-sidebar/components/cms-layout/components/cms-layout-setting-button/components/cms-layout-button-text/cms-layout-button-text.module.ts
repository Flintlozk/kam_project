import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutButtonTextComponent } from './cms-layout-button-text.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [CmsLayoutButtonTextComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatMenuModule],
  exports: [CmsLayoutButtonTextComponent],
})
export class CmsLayoutButtonTextModule {}
