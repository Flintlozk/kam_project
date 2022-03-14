import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutColumnComponent } from './cms-layout-column.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutColumnComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsLayoutColumnComponent],
})
export class CmsLayoutColumnModule {}
