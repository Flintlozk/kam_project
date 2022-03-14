import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogisticsComponent } from './logistics.component';

const routes: Routes = [{ path: '', component: LogisticsComponent }];
// , data: { animation: 'logistics' }
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogisticsRoutingModule {}
