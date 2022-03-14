import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutButtonBorderComponent } from './cms-layout-button-border.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutButtonBorderComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsLayoutButtonBorderComponent],
})
export class CmsLayoutButtonBorderModule {}
