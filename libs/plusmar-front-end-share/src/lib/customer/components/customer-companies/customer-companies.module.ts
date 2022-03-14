import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerCompaniesComponent } from './customer-companies.component';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from '@reactor-room/itopplus-cdk/pagination/pagination.module';
import { CustomTableModule, TableActionModule, FilterModule } from '@reactor-room/plusmar-cdk';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [CustomerCompaniesComponent],
  imports: [CommonModule, TranslateModule, PaginationModule, CustomTableModule, TableActionModule, MatTooltipModule, TranslateModule, FilterModule, ReactiveFormsModule],
  exports: [CustomerCompaniesComponent],
})
export class CustomerCompaniesModule {}
