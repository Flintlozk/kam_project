import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerNotesComponent } from './customer-notes.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClickOutsideModule, TimeAgoPipeModule, UrlifyModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [CustomerNotesComponent],
  imports: [TimeAgoPipeModule, UrlifyModule, CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, MatInputModule, MatTooltipModule, ClickOutsideModule],
  exports: [CustomerNotesComponent],
})
export class CustomerNotesModule {}
