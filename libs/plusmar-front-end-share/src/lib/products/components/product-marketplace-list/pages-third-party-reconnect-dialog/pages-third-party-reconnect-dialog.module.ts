import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { PagesThirdPartyReconnectDialogComponent } from './pages-third-party-reconnect-dialog.component';

@NgModule({
  declarations: [PagesThirdPartyReconnectDialogComponent],
  imports: [CommonModule, TranslateModule, CustomDialogModule, MatFormFieldModule, MatSelectModule],
  exports: [PagesThirdPartyReconnectDialogComponent],
})
export class PagesThirdPartyReconnectDialogModule {}
