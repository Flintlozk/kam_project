import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Setting2C2PDetailComponent } from './setting-2c2p-detail.component';
import { CardModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [Setting2C2PDetailComponent],
  imports: [CommonModule, CardModule, TranslateModule],
  exports: [Setting2C2PDetailComponent],
})
export class Setting2c2pDetailModule {}
