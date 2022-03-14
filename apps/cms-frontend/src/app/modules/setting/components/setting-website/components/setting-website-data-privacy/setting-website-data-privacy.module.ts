import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SettingWebsiteDataPrivacyComponent } from './setting-website-data-privacy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TitleUnderlineModule } from 'apps/cms-frontend/src/app/components/title-underline/title-underline.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [SettingWebsiteDataPrivacyComponent],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot({
      theme: 'snow',
      modules: {
        toolbar: [[{ header: [1, 2, 3, 4, 5, 6, false] }], ['bold', 'italic', 'underline', 'strike'], [{ list: 'ordered' }, { list: 'bullet' }], [{ align: [] }]],
      },
    }),
    TitleUnderlineModule,
  ],
  exports: [SettingWebsiteDataPrivacyComponent],
})
export class SettingWebsiteDataPrivacyModule {}
