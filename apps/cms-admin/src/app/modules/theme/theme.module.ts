import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeComponent } from './theme.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../components/header/header.module';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateModalModule } from '../../components/create-modal/create-modal.module';
import { PagePaginationModule, ThemeListModule } from '@reactor-room/cms-cdk';
import { ConfirmDialogModule } from '@reactor-room/itopplus-cdk';
@NgModule({
  declarations: [ThemeComponent],
  imports: [
    CommonModule,
    HeaderModule,
    MatDialogModule,
    CreateModalModule,
    PagePaginationModule,
    ThemeListModule,
    ConfirmDialogModule,
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: ThemeComponent,
      },
    ]),
  ],
})
export class ThemeModule {}
