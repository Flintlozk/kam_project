import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { AddressModule } from '@reactor-room/itopplus-cdk/address/address.module';
import { CustomTableModule, FilterModule, TableActionModule } from '@reactor-room/plusmar-cdk';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { TagColorSelectorModule } from '@reactor-room/plusmar-front-end-share/components/tag-color-selector/tag-color-selector.module';
import { AddCompanyDialogModule } from './components/customer-companies/add-company-dialog/add-company-dialog.module';
import { CustomerCompaniesModule } from './components/customer-companies/customer-companies.module';
import { CompaniesDialogComponent } from './components/customer-new/customer-company/companies-dialog/companies-dialog.component';
import { CustomerNotesModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-notes/customer-notes.module';
import { customerComponents, CustomerRoutingModule } from './customer.routing';
import { CustomerImgPipe } from './pipes/customer-img.pipe';
import { CustomerCompanyComponent } from './components/customer-new/customer-company/customer-company.component';
import { CustomerTagAddEditDialogModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tag-add-edit-dialog/customer-tag-add-edit-dialog.module';
import { CustomerTagsDialogModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tags-dialog/customer-tags-dialog.module';
import { AudienceContactFilterModule } from '@reactor-room/plusmar-front-end-share/order/audience-contact/components/audience-contact-filter/audience-contact-filter.module';
import { CustomerAudienceHistoriesModule } from './components/customer-audience-histories/customer-audience-histories.module';
import { CustomerFilterService } from './services/customer-filter.service';

registerLocaleData(localePt, 'th-TH');
@NgModule({
  declarations: [...customerComponents, CustomerImgPipe, CompaniesDialogComponent, CustomerCompanyComponent],
  imports: [
    CustomerCompaniesModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    CustomerRoutingModule,
    MatIconModule,
    ITOPPLUSCDKModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    MatTabsModule,
    CustomerNotesModule,
    ComponentModule,
    TranslateModule,
    TagColorSelectorModule,
    AddCompanyDialogModule,
    AddressModule,
    CustomTableModule,
    TableActionModule,
    FilterModule,
    CustomerTagAddEditDialogModule,
    CustomerTagsDialogModule,
    CustomerAudienceHistoriesModule,
    AudienceContactFilterModule,
  ],
  exports: [CustomerImgPipe],
  providers: [CustomerFilterService],
})
export class CustomerModule {}
