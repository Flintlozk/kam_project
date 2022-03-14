import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSelectionComponent } from './theme-selection.component';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { PagePaginationModule, ThemeListModule } from '@reactor-room/cms-cdk';
import { EditSiteButtonModule } from '../edit-site-button/edit-site-button.module';

@NgModule({
  declarations: [ThemeSelectionComponent],
  imports: [CommonModule, MatSnackBarModule, MatDialogModule, RouterModule, PagePaginationModule, ThemeListModule, EditSiteButtonModule],
  exports: [ThemeSelectionComponent],
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
export class ThemeSelectionModule {}
