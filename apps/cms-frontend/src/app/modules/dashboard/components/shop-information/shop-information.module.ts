import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { ShopInformationComponent } from './shop-information.component';

@NgModule({
  declarations: [ShopInformationComponent],
  imports: [CommonModule, HeadingModule],
  exports: [ShopInformationComponent],
})
export class ShopInformationModule {}
