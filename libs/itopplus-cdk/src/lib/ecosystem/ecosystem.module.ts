import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcosystemComponent } from './ecosystem.component';
import { ClickOutsideModule } from '../click-outsite-directive/click-outside.module';

@NgModule({
  declarations: [EcosystemComponent],
  imports: [CommonModule, ClickOutsideModule],
  exports: [EcosystemComponent],
})
export class EcosystemModule {}
