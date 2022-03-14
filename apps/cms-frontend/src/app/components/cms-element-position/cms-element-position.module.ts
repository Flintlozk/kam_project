import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsElementPositionComponent } from './cms-element-position.component';

@NgModule({
  declarations: [CmsElementPositionComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsElementPositionComponent],
})
export class CmsElementPositionModule {}
