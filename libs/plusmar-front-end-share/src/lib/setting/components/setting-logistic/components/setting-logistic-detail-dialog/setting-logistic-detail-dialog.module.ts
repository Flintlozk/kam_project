import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticDetailDialogComponent } from './setting-logistic-detail-dialog.component';
import { SettingLogisticFlashExpressDetailModule } from '../setting-logistic-flash-express-detail/setting-logistic-flash-express-detail.module';
import { TranslateModule } from '@ngx-translate/core';
import { LogisticSystemModule } from '@reactor-room/plusmar-front-end-share/logistic-system/logistic-system.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { SettingLogisticThaiPostDetailModule } from '../setting-logistic-thai-post-detail/setting-logistic-thai-post-detail.module';
import { SettingLogisticJAndTExpressDetailModule } from '../setting-logistic-j&t-express-detail/setting-logistic-j&t-express-detail.module';

@NgModule({
  declarations: [SettingLogisticDetailDialogComponent],
  imports: [
    CommonModule,
    SettingLogisticFlashExpressDetailModule,
    TranslateModule,
    LogisticSystemModule,
    ReactiveFormsModule,
    CustomDialogModule,
    SettingLogisticThaiPostDetailModule,
    SettingLogisticJAndTExpressDetailModule,
  ],
  exports: [SettingLogisticDetailDialogComponent],
})
export class SettingLogisticDetailDialogModule {}
