import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { PlusModule } from '../../components/icon/plus/plus.module';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from '../../components/icon/search/search.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderModule } from '../../components/header/header.module';
@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    CustomTableContentModule,
    CustomTableModule,
    PlusModule,
    SearchModule,
    MatTooltipModule,
    HeaderModule,
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: UserManagementComponent,
      },
    ]),
  ],
})
export class UserManagementModule {}
