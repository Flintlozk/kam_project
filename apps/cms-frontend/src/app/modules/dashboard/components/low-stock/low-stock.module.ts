import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LowStockComponent } from './low-stock.component';
import { HeadingModule } from '../../../../components/heading/heading.module';
// import { CustomTableModule, TableActionModule } from '@reactor-room/plusmar-cdk';
// import { PaginationModule } from '@reactor-room/itopplus-cdk';
import { LowStockInventoryModule } from './components/low-stock-inventory/low-stock-inventory.module';
import { LowStockSettingModule } from './components/low-stock-setting/low-stock-setting.module';
import { RouterModule, Routes } from '@angular/router';
import { LowStockInventoryComponent } from './components/low-stock-inventory/low-stock-inventory.component';
import { LowStockSettingComponent } from './components/low-stock-setting/low-stock-setting.component';
import { RouteAnimateEnum } from '@reactor-room/animation';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'low-stock-inventory',
  },
  {
    path: '',
    component: LowStockComponent,
    data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_LOW_STOCK_PAGE },
    children: [
      { path: 'low-stock-setting', component: LowStockSettingComponent },
      { path: 'low-stock-inventory', component: LowStockInventoryComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'low-stock-inventory',
  },
];

@NgModule({
  declarations: [LowStockComponent],
  imports: [CommonModule, HeadingModule, LowStockInventoryModule, LowStockSettingModule, RouterModule.forChild(routes)],
})
export class LowStockModule {
  'assets': ['src/assets'];
}
