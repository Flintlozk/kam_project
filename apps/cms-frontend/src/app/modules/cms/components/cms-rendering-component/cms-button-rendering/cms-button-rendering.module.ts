import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsButtonRenderingComponent } from './cms-button-rendering.component';
import { CmsSingleButtonRenderingModule } from './cms-single-button-rendering/cms-single-button-rendering.module';

@NgModule({
  declarations: [CmsButtonRenderingComponent],
  imports: [CommonModule, CmsSingleButtonRenderingModule],
  exports: [CmsButtonRenderingComponent],
})
export class CmsButtonRenderingModule {}
