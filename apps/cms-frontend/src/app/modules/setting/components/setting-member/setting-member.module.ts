import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingMemberComponent } from './setting-member.component';
import { HeadingModule } from '../../../../components/heading/heading.module';

@NgModule({
  declarations: [SettingMemberComponent],
  imports: [CommonModule, HeadingModule],
  exports: [SettingMemberComponent],
})
export class SettingMemberModule {}
