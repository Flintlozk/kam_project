import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentSettingDirective } from './component-setting.directive';

@NgModule({
  declarations: [ComponentSettingDirective],
  imports: [CommonModule],
  exports: [ComponentSettingDirective],
})
export class ComponentSettingModule {}
