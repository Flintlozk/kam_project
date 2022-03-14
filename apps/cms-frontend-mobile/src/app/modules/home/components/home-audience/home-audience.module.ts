import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HomeDeviceModule } from './component/home-device/home-device.module';
import { HomeTotalVisitorModule } from './component/home-total-visior/home-total-visitor.module';
import { HomeTrafficSourceModule } from './component/home-traffic-source/home-traffic-source.module';
import { HomeAudienceComponent } from './home-audience.component';

@NgModule({
  declarations: [HomeAudienceComponent],
  imports: [HomeTotalVisitorModule, HomeTrafficSourceModule, HomeDeviceModule, TranslateModule],
  exports: [HomeAudienceComponent],
})
export class HomeAudienceModule {}
