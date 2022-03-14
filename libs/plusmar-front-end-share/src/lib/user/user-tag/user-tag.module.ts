import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTagComponent } from './user-tag.component';
import { UserTagService } from './user-tag.service';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UserTagComponent],
  imports: [CommonModule, CustomDialogModule, TranslateModule],
  exports: [UserTagComponent],
  providers: [UserTagService],
})
export class UserTagModule {}
