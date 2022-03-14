import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviousMessagesComponent } from './previous-messages.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PreviousMessagesComponent],
  imports: [CommonModule, MatTabsModule, TranslateModule],
  exports: [PreviousMessagesComponent],
})
export class PreviousMessagesModule {}
