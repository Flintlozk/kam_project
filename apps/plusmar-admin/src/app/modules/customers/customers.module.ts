import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { CustomersRoutingModule } from './customers.routing';

import { CustomersService } from './customers.service';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk/time-ago-pipe/time-ago.module';
import { PaginationModule } from '@reactor-room/itopplus-cdk';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [CustomersComponent],
  imports: [CommonModule, ReactiveFormsModule, CustomersRoutingModule, TimeAgoPipeModule, CustomTableContentModule, CustomTableModule, PaginationModule],
  providers: [CustomersService],
})
export class CustomersModule {}
