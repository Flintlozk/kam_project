import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentCategoryComponent } from './content-category.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { CustomDialogModule, PaginationModule } from '@reactor-room/itopplus-cdk';
import { MatMenuModule } from '@angular/material/menu';
import { ContentSubCategoryDialogComponent } from './content-sub-category-dialog/content-sub-category-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [ContentCategoryComponent, ContentSubCategoryDialogComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CustomTableModule,
    PaginationModule,
    MatMenuModule,
    CustomDialogModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
  exports: [ContentCategoryComponent],
})
export class ContentCategoryModule {}
