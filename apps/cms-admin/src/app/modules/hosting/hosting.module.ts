import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostingComponent } from './hosting.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../components/header/header.module';
import { HostingtableModule } from '../../components/hostingtable/hostingtable.module';

@NgModule({
  declarations: [HostingComponent],
  imports: [
    CommonModule,
    HeaderModule,
    HostingtableModule,
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: HostingComponent,
      },
    ]),
  ],
  exports: [HostingComponent],
})
export class HostingModule {}
