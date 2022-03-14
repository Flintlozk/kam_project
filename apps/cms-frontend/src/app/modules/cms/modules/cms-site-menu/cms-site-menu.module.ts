import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsSiteMenuComponent } from './cms-site-menu.component';
import { CmsSiteMenuPageModule } from './components/cms-site-menu-page/cms-site-menu-page.module';
import { CmsSiteMenuPopupModule } from './components/cms-site-menu-popup/cms-site-menu-popup.module';

@NgModule({
  declarations: [CmsSiteMenuComponent],
  imports: [CommonModule, CmsSiteMenuPageModule, CmsSiteMenuPopupModule],
  exports: [CmsSiteMenuComponent],
})
export class CmsSiteMenuModule {}
