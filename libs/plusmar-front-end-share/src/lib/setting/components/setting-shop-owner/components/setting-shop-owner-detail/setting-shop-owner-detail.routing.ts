import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { SettingShopOwnerDetailComponent } from '@reactor-room/plusmar-front-end-share/setting/components/setting-shop-owner/components';

const routes: Routes = [{ path: 'edit', component: SettingShopOwnerDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingShopOwnerDetailRoutingModule {}
