import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutBottomInputModule } from 'apps/cms-frontend/src/app/components/cms-layout-bottom-input/cms-layout-bottom-input.module';
import { FormModule } from './../../../../../../../../../../../../../cms-frontend-mobile/src/app/shared/form.module';
import { CmsLayoutShoppingCartPatternComponent } from './cms-layout-shopping-cart-pattern.component';

@NgModule({
  declarations: [CmsLayoutShoppingCartPatternComponent],
  imports: [CommonModule, ReactiveFormsModule, FormModule, CmsLayoutBottomInputModule],
  exports: [CmsLayoutShoppingCartPatternComponent],
})
export class CmsLayoutShoppingCartPatternModule {}
