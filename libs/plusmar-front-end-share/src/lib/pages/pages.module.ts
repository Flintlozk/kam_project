import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { CreatePageComponent, EditPageComponent, PageListComponent } from './components';
import { PagesRoutingModule } from './pages.routing';

registerLocaleData(localePt, 'th-TH');

@NgModule({
  declarations: [EditPageComponent, CreatePageComponent, PageListComponent],
  imports: [ITOPPLUSCDKModule, PagesRoutingModule, CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, TranslateModule],
})
export class PagesModule {}
