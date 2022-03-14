import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MigrationComponent } from './migration.component';

const routes: Routes = [{ path: '', component: MigrationComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MigrationsRoutingModule {}
