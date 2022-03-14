import { NgModule } from '@angular/core';
import { ContentFileManageDetailComponent } from './content-file-manage-detail.component';
import { OptionToggleLayoutModule } from '../../../../../../components/option-toggle-layout/option-toogle-layout.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ContentFileManageDetailComponent],
  imports: [OptionToggleLayoutModule, RouterModule, TranslateModule],
  exports: [ContentFileManageDetailComponent],
})
export class ContentFileManageDetailModule {}
