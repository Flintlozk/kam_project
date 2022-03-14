import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomSettingStickyComponent } from './cms-menu-custom-setting-sticky.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsMenuCustomSettingStickyComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsMenuCustomSettingStickyComponent],
})
export class CmsMenuCustomSettingStickyModule {}
