import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsTextSectionComponent } from './cms-text-section.component';
import { CmsTextRenderingModule } from '../../../../../components/cms-rendering-component/cms-text-rendering/cms-text-rendering.module';
@NgModule({
  declarations: [CmsTextSectionComponent],
  imports: [CommonModule, CmsTextRenderingModule],
  exports: [CmsTextSectionComponent],
})
export class CmsTextSectionModule {}
