import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentColumnRenderingComponent } from './cms-content-column-rendering.component';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsContentColumnRenderingComponent],
  imports: [CommonModule, MatMenuModule, FormsModule, ReactiveFormsModule],
  exports: [CmsContentColumnRenderingComponent],
})
export class CmsContentColumnRenderingModule {}
