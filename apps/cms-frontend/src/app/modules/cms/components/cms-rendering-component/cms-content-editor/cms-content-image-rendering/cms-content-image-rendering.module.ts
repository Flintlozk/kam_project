import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentImageRenderingComponent } from './cms-content-image-rendering.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [CmsContentImageRenderingComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [CmsContentImageRenderingComponent],
})
export class CmsContentImageRenderingModule {}
