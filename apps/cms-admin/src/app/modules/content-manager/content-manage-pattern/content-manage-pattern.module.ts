import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentManagePatternComponent } from './content-manage-pattern.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@reactor-room/itopplus-front-end-helpers';
import { CmsContentManageLayoutModule } from './cms-content-manage-layout/cms-content-manage-layout.module';
import { ResponsiveLayoutModule } from '../../../containers/responsive-layout/responsive-layout.module';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  declarations: [ContentManagePatternComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    CmsContentManageLayoutModule,
    ResponsiveLayoutModule,
    MatSnackBarModule,
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: ContentManagePatternComponent,
      },
    ]),
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
})
export class ContentManagePatternModule {}
