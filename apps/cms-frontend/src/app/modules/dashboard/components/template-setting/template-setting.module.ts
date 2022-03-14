import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { TemplateSettingComponent } from './template-setting.component';
import { RouterModule } from '@angular/router';
import { ThemeSelectionModule } from 'apps/cms-frontend/src/app/components/theme-selection/theme-selection.module';

@NgModule({
  declarations: [TemplateSettingComponent],
  imports: [CommonModule, HeadingModule, RouterModule, ThemeSelectionModule],
  exports: [TemplateSettingComponent],
})
export class TemplateSettingModule {}
