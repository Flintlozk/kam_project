import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsEditRenderingContentComponent } from './cms-edit-rendering-content.component';
import { CmsLanguageSwitchModule } from '../../../../components/common/cms-language-switch/cms-language-switch.module';

@NgModule({
  declarations: [CmsEditRenderingContentComponent],
  imports: [CommonModule, CmsLanguageSwitchModule],
  exports: [CmsEditRenderingContentComponent],
})
export class CmsEditRenderingContentModule {}
