import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { SettingShopOwnerDetailComponent } from '@reactor-room/plusmar-front-end-share/setting/components/setting-shop-owner/components';
import { PageListComponent } from './components';

const routes: Routes = [
  { path: '', component: PageListComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: SettingShopOwnerDetailComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
