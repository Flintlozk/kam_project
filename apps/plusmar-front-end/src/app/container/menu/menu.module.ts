import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PackageLabelModule } from '../package-label/package-label.module';
import { UpgradeModule } from '../upgrade/upgrade.module';
import { ClickOutsideModule, LoaderModule, RouterLinkActiveMatchModule } from '@reactor-room/itopplus-cdk';
import { MenuComponent } from './menu.component';
import { ShopPageSwitcherModule } from '@reactor-room/itopplus-cdk/shop-page-switcher/shop-page-switcher.module';
import { StorageDriveModule } from './storage-drive/storage-drive.module';
@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    ClickOutsideModule,
    MatTooltipModule,
    TranslateModule,
    PackageLabelModule,
    UpgradeModule,
    RouterModule,
    LoaderModule,
    RouterLinkActiveMatchModule,
    ShopPageSwitcherModule,
    StorageDriveModule,
  ],
  exports: [MenuComponent],
})
export class MenuModule {}
