import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { PeekboxAudienceControlComponent } from './peekbox-audience-control.component';

@NgModule({
  declarations: [PeekboxAudienceControlComponent],
  imports: [CommonModule, TranslateModule, CustomDialogModule, MatFormFieldModule, MatSelectModule],
  exports: [PeekboxAudienceControlComponent],
})
export class PeekboxAudienceControlModule {}
