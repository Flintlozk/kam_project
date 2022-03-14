import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeComponent } from './upgrade.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UpgradeComponent],
  imports: [CommonModule, TranslateModule],
  exports: [UpgradeComponent],
})
export class UpgradeModule {}
