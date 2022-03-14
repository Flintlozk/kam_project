import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OwnerSelectPageComponent } from './components';
import { OwnerRoutingModule } from './owner.routing';

registerLocaleData(localePt, 'th-TH');
@NgModule({
  declarations: [OwnerSelectPageComponent],
  imports: [CommonModule, OwnerRoutingModule, TranslateModule],
})
export class OwnerModule {}
