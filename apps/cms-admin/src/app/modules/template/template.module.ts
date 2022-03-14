import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './template.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../components/header/header.module';
import { templateListModule } from '../../components/template-list/template-list.module';
import { ConfirmDialogModule } from '@reactor-room/itopplus-cdk';
import { CreateModalModule } from '../../components/create-modal/create-modal.module';

@NgModule({
  declarations: [TemplateComponent],
  imports: [
    CommonModule,
    HeaderModule,
    templateListModule,
    ConfirmDialogModule,
    CreateModalModule,
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: TemplateComponent,
      },
    ]),
  ],
  exports: [TemplateComponent],
})
export class TemplateModule {}
