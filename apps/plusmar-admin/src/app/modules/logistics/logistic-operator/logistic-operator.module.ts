import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticOperatorComponent } from './logistic-operator.component';
import { AddBundleDialogModule } from './add-bundle-dialog/add-bundle-dialog.module';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { NumberBundleModule } from './number-bundle/number-bundle.module';

@NgModule({
  declarations: [LogisticOperatorComponent],
  imports: [CommonModule, NumberBundleModule, AddBundleDialogModule, ConfirmDialogModule],
  exports: [LogisticOperatorComponent],
})
export class LogisticOperatorModule {}
