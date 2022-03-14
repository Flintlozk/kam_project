import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentDraftComponent } from './content-draft.component';
import { OptionToggleLayoutModule } from '../../../../components/option-toggle-layout/option-toogle-layout.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ContentDraftComponent],
  imports: [CommonModule, OptionToggleLayoutModule, RouterModule, TranslateModule],
  exports: [ContentDraftComponent],
})
export class ContentDraftModule {}
