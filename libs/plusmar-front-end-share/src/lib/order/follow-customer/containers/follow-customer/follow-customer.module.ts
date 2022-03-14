import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowCustomerComponent } from './follow-customer.component';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FollowCustomerComponent],
  imports: [CommonModule, TranslateModule, ITOPPLUSCDKModule, RouterModule],
  exports: [FollowCustomerComponent],
})
export class FollowCustomerModule {}
