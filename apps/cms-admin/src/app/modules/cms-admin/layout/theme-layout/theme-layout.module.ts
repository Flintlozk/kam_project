import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeLayoutComponent } from './theme-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { NavBarThemeModule } from '../../component/nav-bar-theme/nav-bar-theme.module';
import { SideBarThemeModule } from '../../component/side-bar-theme/side-bar-theme.module';
import { MonacoEditorModule } from '@reactor-room/itopplus-front-end-helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlusModule } from '../../../../components/icon/plus/plus.module';
import { HttpClientModule } from '@angular/common/http';
import { UpdateHtmlErrorModalModule } from '../../component/update-html-error-modal/update-html-error-modal.module';
import { ConfirmDialogModule } from '@reactor-room/itopplus-cdk';
import { MatMenuModule } from '@angular/material/menu';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SafePipeModule } from '@reactor-room/cms-cdk';
@NgModule({
  declarations: [ThemeLayoutComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NavBarThemeModule,
    SideBarThemeModule,
    MonacoEditorModule,
    FormsModule,
    ReactiveFormsModule,
    PlusModule,
    UpdateHtmlErrorModalModule,
    ConfirmDialogModule,
    MatMenuModule,
    ClipboardModule,
    SafePipeModule,
    RouterModule.forChild(<Routes>[
      {
        path: ':_id',
        component: ThemeLayoutComponent,
        children: [],
      },
    ]),
  ],
})
export class ThemeLayoutModule {}
