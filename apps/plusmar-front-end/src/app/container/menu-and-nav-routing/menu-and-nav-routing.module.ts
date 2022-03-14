import { NgModule } from '@angular/core';
import { MenuAndNavRoutingComponent } from './menu-and-nav-routing.component';
import { MenuAndNavRoutingRouting } from './menu-and-nav-routing.routing';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  declarations: [MenuAndNavRoutingComponent],
  imports: [LayoutModule, MenuAndNavRoutingRouting],
})
export class MenuAndNavRoutingModule {}
