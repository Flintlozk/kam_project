import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerProfilePictureComponent } from '@reactor-room/plusmar-front-end-share/components/customer-profile-picture/customer-profile-picture.component';
import { RadioComponent } from '@reactor-room/plusmar-front-end-share/components/radio/radio.component';
import { AddressModule } from '@reactor-room/itopplus-cdk/address/address.module';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { PaginationModule } from '@reactor-room/itopplus-cdk/pagination/pagination.module';
import { AddCompanyDialogComponent } from './add-company-dialog.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { MembersComponent } from './members/members.component';
import { SelectMembersComponent } from './select-members/select-members.component';
import { ShippingInfoComponent } from './shipping-info/shipping-info.component';

@NgModule({
  declarations: [AddCompanyDialogComponent, CompanyInfoComponent, ShippingInfoComponent, RadioComponent, MembersComponent, SelectMembersComponent, CustomerProfilePictureComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    AddressModule,
    MatInputModule,
    MatTooltipModule,
    CustomTableModule,
    PaginationModule,
  ],
  exports: [AddCompanyDialogComponent],
})
export class AddCompanyDialogModule {}
