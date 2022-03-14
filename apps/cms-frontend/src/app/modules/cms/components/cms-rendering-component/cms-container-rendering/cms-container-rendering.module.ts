import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContainerRenderingComponent } from './cms-container-rendering.component';
import { ComponentCommonModule } from '../../../directives/component-common/component-common.module';
import { ComponentDesignModule } from '../../../directives/component-design/component-design.module';
import { ComponentSettingModule } from '../../../directives/component-setting/component-setting.module';

@NgModule({
  declarations: [CmsContainerRenderingComponent],
  imports: [CommonModule, ComponentCommonModule, ComponentDesignModule, ComponentSettingModule],
  exports: [CmsContainerRenderingComponent],
})
export class CmsContainerRenderingModule {}
