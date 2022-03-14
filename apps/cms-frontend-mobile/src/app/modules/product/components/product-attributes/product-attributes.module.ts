import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAttributesComponent } from './product-attributes.component';
import { OptionToggleLayoutModule } from '../../../../components/option-toggle-layout/option-toogle-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ProductAttributesComponent],
  imports: [CommonModule, OptionToggleLayoutModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TranslateModule],
  exports: [ProductAttributesComponent],
})
export class ProductAttributesModule {}
