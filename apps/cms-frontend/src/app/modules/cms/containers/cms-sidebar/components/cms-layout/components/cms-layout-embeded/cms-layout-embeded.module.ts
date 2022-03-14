import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutEmbededComponent } from './cms-layout-embeded.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutEmbededComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsLayoutEmbededComponent],
})
export class CmsLayoutEmbededModule {}
