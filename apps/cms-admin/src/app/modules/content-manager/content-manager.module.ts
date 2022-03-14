import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentManagerComponent } from './content-manager.component';
import { HeaderModule } from '../../components/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { PagePaginationModule } from '@reactor-room/cms-cdk';

@NgModule({
  declarations: [ContentManagerComponent],
  imports: [
    CommonModule,
    HeaderModule,
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: ContentManagerComponent,
      },
    ]),
    PagePaginationModule,
  ],
})
export class ContentManagerModule {}
