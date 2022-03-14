import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CmsLayoutEmbededModule } from '../cms-layout/components/cms-layout-embeded/cms-layout-embeded.module';
import { CmsLayoutImageModule } from '../cms-layout/components/cms-layout-image/cms-layout-image.module';
import { CmsLayoutTextModule } from '../cms-layout/components/cms-layout-text/cms-layout-text.module';
import { CmsContentManagementComponent } from './cms-content-management.component';
import { CmsCategorySettingModule } from '../cms-category-setting/cms-category-setting.module';
import { CmsTagSettingModule } from '../cms-tag-setting/cms-tag-setting.module';
import { MonacoEditorModule } from '@reactor-room/itopplus-front-end-helpers/ngx-monaco-editor';

@NgModule({
  declarations: [CmsContentManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    CmsLayoutTextModule,
    CmsLayoutEmbededModule,
    CmsLayoutImageModule,
    MatNativeDateModule,
    MonacoEditorModule,
    CmsCategorySettingModule,
    CmsTagSettingModule,
  ],
  exports: [CmsContentManagementComponent],
})
export class CmsContentManagementModule {}
