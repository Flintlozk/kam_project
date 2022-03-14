import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomTableModule, TableActionModule } from '@reactor-room/plusmar-cdk';
import { PaginationModule } from '@reactor-room/itopplus-cdk/pagination/pagination.module';
import { ImagesTemplatesComponent } from './images-templates.component';
import { ImageInputModule } from '@reactor-room/plusmar-front-end-share/components/image-input/image-input.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [ImagesTemplatesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatProgressBarModule,
    MatTooltipModule,
    CustomTableModule,
    PaginationModule,
    TableActionModule,
    ImageInputModule,
    LoaderModule,
  ],
  exports: [ImagesTemplatesComponent],
})
export class ImagesTemplatesModule {}
