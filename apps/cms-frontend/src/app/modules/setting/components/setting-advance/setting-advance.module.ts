import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingAdvanceComponent } from './setting-advance.component';
import { HeadingModule } from '../../../../components/heading/heading.module';

@NgModule({
  declarations: [SettingAdvanceComponent],
  imports: [CommonModule, HeadingModule],
  exports: [SettingAdvanceComponent],
})
export class SettingAdvanceModule {}
