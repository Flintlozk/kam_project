import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeFeaturesComponent } from './welcome-features.component';

@NgModule({
  declarations: [WelcomeFeaturesComponent],
  imports: [CommonModule],
  exports: [WelcomeFeaturesComponent],
})
export class WelcomeFeaturesModule {}
