import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { CmsTextRenderingComponent } from './cms-text-rendering.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CmsContainerRenderingModule } from '../cms-container-rendering/cms-container-rendering.module';
import { ComponentSettingModule } from '../../../directives/component-setting/component-setting.module';
import { ComponentTextModule } from '../../../directives/component-text/component-text.module';
import { ComponentCommonModule } from '../../../directives/component-common/component-common.module';
import { ComponentDesignModule } from '../../../directives/component-design/component-design.module';
import { ComponentLayoutModule } from '../../../directives/component-layout/component-layout.module';
import { SafeHtmlPipeModule } from '@reactor-room/itopplus-cdk/safehtml-pipe/safehtml.module';

@NgModule({
  declarations: [CmsTextRenderingComponent],
  imports: [
    CommonModule,
    DragDropModule,
    DragDropModule,
    CmsContainerRenderingModule,
    QuillModule.forRoot({
      theme: 'bubble',
      modules: {
        toolbar: false,
      },
    }),
    ComponentTextModule,
    ComponentCommonModule,
    ComponentDesignModule,
    ComponentSettingModule,
    ComponentLayoutModule,
    SafeHtmlPipeModule,
  ],
  exports: [CmsTextRenderingComponent],
})
export class CmsTextRenderingModule {}
