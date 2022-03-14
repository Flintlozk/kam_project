import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingShopOwnerSocialNetworkComponent } from './setting-shop-owner-social-network.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingShopOwnerSocialNetworkComponent],
  imports: [CommonModule, TranslateModule, CustomDialogModule, ReactiveFormsModule],
  exports: [SettingShopOwnerSocialNetworkComponent],
})
export class SettingShopOwnerSocialNetworkModule {}
