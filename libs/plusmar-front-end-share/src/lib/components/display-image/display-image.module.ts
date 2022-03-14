import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayImageComponent } from './display-image.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipeModule } from '@reactor-room/plusmar-front-end-share/pipes/safe.pipe.module';
import { QueryRemoverModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [DisplayImageComponent],
  imports: [CommonModule, TranslateModule, SafePipeModule, QueryRemoverModule],
  exports: [DisplayImageComponent],
})
export class DisplayImageModule {}
