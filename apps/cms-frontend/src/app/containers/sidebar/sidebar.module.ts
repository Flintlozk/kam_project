import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SiteInfoModule } from '../../components/site-info/site-info.module';
import { MainMenuModule } from '../../components/main-menu/main-menu.module';
import { StorageDriveModule } from '../../components/storage-drive/storage-drive.module';
import { ShopPageSwitcherModule } from '@reactor-room/itopplus-cdk/shop-page-switcher/shop-page-switcher.module';

@NgModule({
  declarations: [SidebarComponent],
  imports: [CommonModule, SiteInfoModule, MainMenuModule, StorageDriveModule, ShopPageSwitcherModule],
  exports: [SidebarComponent],
})
export class SidebarModule {}
