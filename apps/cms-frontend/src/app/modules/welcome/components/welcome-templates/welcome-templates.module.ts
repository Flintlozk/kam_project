import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeTemplatesComponent } from './welcome-templates.component';
import { ThemeSelectionModule } from 'apps/cms-frontend/src/app/components/theme-selection/theme-selection.module';

@NgModule({
  declarations: [WelcomeTemplatesComponent],
  imports: [CommonModule, ThemeSelectionModule],
  exports: [WelcomeTemplatesComponent],
})
export class WelcomeTemplatesModule {}
