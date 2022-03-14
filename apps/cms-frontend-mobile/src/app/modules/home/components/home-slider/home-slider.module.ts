import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeSliderComponent } from './home-slider.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [HomeSliderComponent],
  imports: [CommonModule, TranslateModule],
  exports: [HomeSliderComponent],
})
export class HomeSliderModule {}
