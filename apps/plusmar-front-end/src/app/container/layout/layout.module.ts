import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavModule } from '../../container/nav/nav.module';
import { WizardNavModule } from '../../container/wizard-nav/wizard-nav.module';
import { LayoutComponent } from './layout.component';
import { MenuModule } from '../../container/menu/menu.module';
import { PwaInstallCardModule } from '../../container/pwa-install-card/pwa-install-card.module';
import { TranslateModule } from '@ngx-translate/core';

import { LayoutRoutingModule } from './layout-routing';
import { UiBlockLoaderModule } from '@reactor-room/plusmar-front-end-share/components/ui-block-loader/ui-block-loader.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [LayoutRoutingModule, CommonModule, UiBlockLoaderModule, MenuModule, NavModule, WizardNavModule, PwaInstallCardModule, TranslateModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
