import { Pipe, PipeTransform } from '@angular/core';
import { IQuickPayList, QuickPayPaymenteStatusTypes } from '@reactor-room/itopplus-model-lib';

@Pipe({
  name: 'quickpayPaymentStatus',
})
export class QuickpayPaymentStatusPipe implements PipeTransform {
  transform({ isExpired, is_paid, is_cancel }: IQuickPayList): QuickPayPaymenteStatusTypes {
    if (is_cancel && !is_paid) return QuickPayPaymenteStatusTypes.CANCELED;
    if (isExpired && !is_paid) return QuickPayPaymenteStatusTypes.EXPIRED;
    return is_paid ? QuickPayPaymenteStatusTypes.PAID : QuickPayPaymenteStatusTypes.UNPAID;
  }
}
