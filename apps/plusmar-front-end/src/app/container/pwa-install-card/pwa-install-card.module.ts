import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { PwaInstallCardComponent } from './pwa-install-card.component';

@NgModule({
  declarations: [PwaInstallCardComponent],
  imports: [CommonModule, ClickOutsideModule, TranslateModule],
  exports: [PwaInstallCardComponent],
})
export class PwaInstallCardModule {}
