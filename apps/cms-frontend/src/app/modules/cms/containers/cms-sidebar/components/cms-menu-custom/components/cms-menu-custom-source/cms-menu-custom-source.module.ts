import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomSourceComponent } from './cms-menu-custom-source.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CmsSiteMenuPageModule } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-site-menu/components/cms-site-menu-page/cms-site-menu-page.module';

@NgModule({
  declarations: [CmsMenuCustomSourceComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, CmsSiteMenuPageModule],
  exports: [CmsMenuCustomSourceComponent],
})
export class CmsMenuCustomSourceModule {}
