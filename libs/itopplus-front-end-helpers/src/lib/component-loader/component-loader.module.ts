import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentLoaderDirective } from './component-loader.directive';
// import { ComponentLoaderService } from './component-loader.service';

@NgModule({
  declarations: [ComponentLoaderDirective],
  exports: [ComponentLoaderDirective],
  imports: [CommonModule],
})
export class ComponentLoaderModule {}
