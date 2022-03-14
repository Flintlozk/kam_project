import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLanguageSwitchComponent } from './cms-language-switch.component';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk/click-outsite-directive/click-outside.module';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  declarations: [CmsLanguageSwitchComponent],
  imports: [CommonModule, ClickOutsideModule, MatSnackBarModule],
  exports: [CmsLanguageSwitchComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
})
export class CmsLanguageSwitchModule {}
