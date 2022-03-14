import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { NgModule } from '@angular/core';

import { HomeAudienceModule } from './components/home-audience/home-audience.module';
import { HomeStorageModule } from './components/home-storage/home-storage.module';
import { HomeSliderModule } from './components/home-slider/home-slider.module';
import { HomeECommerceModule } from './components/home-e-commerce/home-e-commerce.module';
import { HomeDatePickerModule } from './components/home-date-picker/home-date-picker.module';

const MODULES = [HomeAudienceModule, HomeStorageModule, HomeSliderModule, HomeECommerceModule, HomeDatePickerModule, HomeRoutingModule];

@NgModule({
  declarations: [HomeComponent],
  imports: [MODULES],
  exports: [HomeComponent],
})
export class HomeModule {}
