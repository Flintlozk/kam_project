import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentTextRenderingComponent } from './cms-content-text-rendering.component';
import { MatMenuModule } from '@angular/material/menu';
import { QuillModule } from 'ngx-quill';
import { SafeHtmlPipeModule } from '@reactor-room/itopplus-cdk/safehtml-pipe/safehtml.module';

@NgModule({
  declarations: [CmsContentTextRenderingComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    QuillModule.forRoot({
      theme: 'bubble',
      modules: {
        toolbar: false,
      },
    }),
    SafeHtmlPipeModule,
  ],
  exports: [CmsContentTextRenderingComponent],
})
export class CmsContentTextRenderingModule {}
