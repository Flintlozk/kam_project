import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutRenderingComponent } from './cms-layout-rendering.component';
import { CmsContainerRenderingModule } from '../cms-container-rendering/cms-container-rendering.module';
import { CmsLayoutGuidelineModule } from '../../common/cms-layout-guideline/cms-layout-guideline.module';

@NgModule({
  declarations: [CmsLayoutRenderingComponent],
  imports: [CommonModule, CmsContainerRenderingModule, CmsLayoutGuidelineModule],
  exports: [CmsLayoutRenderingComponent],
})
export class CmsLayoutRenderingModule {}
