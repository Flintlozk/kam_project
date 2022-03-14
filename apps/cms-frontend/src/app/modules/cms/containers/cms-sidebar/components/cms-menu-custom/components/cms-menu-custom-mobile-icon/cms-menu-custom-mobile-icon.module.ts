import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomMobileIconComponent } from './cms-menu-custom-mobile-icon.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsMenuCustomMobileIconComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsMenuCustomMobileIconComponent],
})
export class CmsMenuCustomMobileIconModule {}
