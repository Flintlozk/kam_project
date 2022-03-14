import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { EnumPaymentType, IAudienceWithCustomer, QuickPayComponentTypes, ReturnAddBankAccount } from '@reactor-room/itopplus-model-lib';
import { TemplatesService } from '@reactor-room/plusmar-front-end-share/components/chatbox/templates/templates.service';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { QuickPayService } from './quick-pay.service';

@Component({
  selector: 'reactor-room-quick-pay',
  templateUrl: './quick-pay.component.html',
  styleUrls: ['./quick-pay.component.scss'],
})
export class QuickPayComponent implements OnInit, OnChanges, OnDestroy {
  @Input() audienceID: number;
  @Input() customerID: number;
  @Input() parentContainer: HTMLElement;
  @Input() audience: IAudienceWithCustomer;
  showQuickComponent$ = this.quickPayService.showQuickPayComponent$;
  showQuickComponent: QuickPayComponentTypes = null;
  quickPayID: number = null;
  quickPayID$ = this.quickPayService.quickPayID$;
  quickPayComponentsType = QuickPayComponentTypes;
  destroy$ = new Subject();
  bankAccountDetails$ = this.paymentService.getBankAccountList();
  paymentListDetails$ = this.paymentService.getPaymentList();
  isBankEnable = true;

  constructor(private quickPayService: QuickPayService, public templateService: TemplatesService, private paymentService: PaymentsService) {}

  ngOnInit(): void {
    this.showQuickComponent$.pipe(tap((componentType) => (this.showQuickComponent = componentType))).subscribe();
  }

  getPaymentDetailsStatus(): void {
    this.paymentListDetails$
      .pipe(
        switchMap((paymentList) => {
          const paymentBankStatus = paymentList?.find(({ type }) => type === EnumPaymentType.BANK_ACCOUNT)?.status || false;
          return paymentBankStatus ? this.bankAccountDetails$ : of<boolean>(false);
        }),
        tap((result: boolean | ReturnAddBankAccount[]) => {
          if (!result) {
            this.isBankEnable = false;
          } else {
            const bankDetails = result as ReturnAddBankAccount[];
            const isBankDetailStatus = bankDetails?.some(({ status }) => status);
            this.isBankEnable = isBankDetailStatus;
          }
        }),
      )
      .subscribe();
  }

  ngOnChanges(): void {
    this.getPaymentDetailsStatus();
    this.quickPayService.setShowQuickPayComponent(QuickPayComponentTypes.TRANSACTION);
    this.quickPayID$
      .pipe(
        takeUntil(this.destroy$),
        tap((quickPayID) => {
          quickPayID && this.sendQuickPayToChatBox(quickPayID);
        }),
      )
      .subscribe();
  }

  sendQuickPayToChatBox(quickPayID: number): void {
    this.templateService.changeMessage(quickPayID, 'quick_pay');
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
