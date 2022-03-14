import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentFileManageComponent } from './content-file-manage.component';
import { OptionToggleLayoutModule } from '../../../../components/option-toggle-layout/option-toogle-layout.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ContentFileManageComponent],
  imports: [CommonModule, OptionToggleLayoutModule, RouterModule, TranslateModule],
  exports: [ContentFileManageComponent],
})
export class ContentFileManageModule {}
