import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentEmbededRenderingComponent } from './cms-content-embeded-rendering.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [CmsContentEmbededRenderingComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [CmsContentEmbededRenderingComponent],
})
export class CmsContentEmbededRenderingModule {}
