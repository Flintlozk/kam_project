import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IPayment, EnumPaymentType, PaypalDetail, CashOnDeliveryDetail, I2C2PPaymentModel, IOmiseDetail, IBankAccount, EnumWizardStepType } from '@reactor-room/itopplus-model-lib';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import {
  Setting2C2PlDialogComponent,
  SettingBankTransferDialogComponent,
  SettingCodDialogComponent,
  SettingOmiseDialogComponent,
  SettingPaypalDialogComponent,
} from '@reactor-room/plusmar-front-end-share/setting/components/setting-payment/components';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-wizard-step-4',
  templateUrl: './wizard-step-4.component.html',
  styleUrls: ['wizard-step-4.component.scss'],
})
export class WizardStepFourComponent implements OnInit, OnDestroy {
  @Output() cancel = new EventEmitter<boolean>();
  @Output() setupSuccess = new EventEmitter<boolean>();
  constructor(
    private leadFormBuilder: FormBuilder,
    public translate: TranslateService,
    private paymentsService: PaymentsService,
    private pagesService: PagesService,
    private dialog: MatDialog,
  ) {}
  destroy$: Subject<boolean> = new Subject<boolean>();
  successDialog;
  EnumPaymentType = EnumPaymentType;
  bankAccounts = [];
  isBankTransferActive = true;
  isAllowed = true;
  codDetail: CashOnDeliveryDetail;
  paypalDetail: PaypalDetail;
  payment2C2PDetail: I2C2PPaymentModel;
  omiseDetail: IOmiseDetail;
  isBankCanActive = false;
  moreStatus = {
    BANK_ACCOUNT: false,
    CASH_ON_DELIVERY: false,
    QR_PAYMENT_KBANK: false,
    PAYPAL: false,
    PAYMENT_2C2P: false,
    PAY_SOLUTION: false,
    OMISE: false,
  };

  isCodActive: boolean;
  payments: IPayment[];
  feePercent: string;
  feeValue: string;
  minimumValue: string;

  ngOnInit(): void {
    this.getPaymentList();
  }

  getPaymentList(): void {
    this.paymentsService
      .getPaymentList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.payments = res;
        res.map((item) => {
          switch (item.type) {
            case EnumPaymentType.BANK_ACCOUNT: {
              const bankAccounts = item.option[item.type] as [IBankAccount];
              const activeAmount = bankAccounts.length > 0 ? bankAccounts.filter((x) => x.bankStatus === true).length : 0;
              this.isBankCanActive = activeAmount > 0;
              this.moreStatus.BANK_ACCOUNT = item.status;
              break;
            }
            case EnumPaymentType.CASH_ON_DELIVERY: {
              this.codDetail = item.option[item.type];
              this.moreStatus.CASH_ON_DELIVERY = item.status;
              break;
            }
            case EnumPaymentType.PAYPAL: {
              this.paypalDetail = item.option[item.type];
              this.moreStatus.PAYPAL = item.status;
              break;
            }
            case EnumPaymentType.PAYMENT_2C2P: {
              this.payment2C2PDetail = item.option[item.type];
              this.moreStatus.PAYMENT_2C2P = item.status;
              break;
            }
            case EnumPaymentType.OMISE: {
              this.omiseDetail = item.option[item.type];
              this.moreStatus.OMISE = item.status;
              break;
            }
          }
        });
      });
  }

  openBankDialog(): void {
    const diaRef = this.dialog.open(SettingBankTransferDialogComponent, {
      width: '100%',
      data: {
        mode: 'CREATE',
        bankAccount: {},
      },
    });

    diaRef.afterClosed().subscribe(() => {
      this.getPaymentList();
    });
  }

  openCodDialog(status: boolean): void {
    const diaRef = this.dialog.open(SettingCodDialogComponent, {
      width: '100%',
      data: { ...this.codDetail, createMode: status },
    });

    diaRef.afterClosed().subscribe(() => {
      this.getPaymentList();
    });
  }

  openPaypalDialog(status: boolean): void {
    const diaRef = this.dialog.open(SettingPaypalDialogComponent, {
      width: '100%',
      data: { ...this.paypalDetail, createMode: status },
    });
    diaRef.afterClosed().subscribe(() => {
      this.getPaymentList();
    });
  }

  open2c2pDialog(status: boolean): void {
    const diaRef = this.dialog.open(Setting2C2PlDialogComponent, {
      width: '100%',
      data: { ...this.payment2C2PDetail, createMode: status },
    });
    diaRef.afterClosed().subscribe(() => {
      this.getPaymentList();
    });
  }

  openOmiseDialog(status: boolean): void {
    const diaRef = this.dialog.open(SettingOmiseDialogComponent, {
      width: '100%',
      data: { ...this.omiseDetail, createMode: status },
    });
    diaRef.afterClosed().subscribe(() => {
      this.getPaymentList();
    });
  }

  toggle(type: EnumPaymentType): void {
    switch (type) {
      case EnumPaymentType.BANK_ACCOUNT:
        if (this.isBankCanActive) {
          this.togglePaymentByType(type);
        } else {
          this.openBankDialog();
        }
        break;
      case EnumPaymentType.CASH_ON_DELIVERY:
        if (this.codDetail) {
          this.togglePaymentByType(type);
        } else {
          this.openCodDialog(true);
        }
        break;
      case EnumPaymentType.PAYPAL:
        if (this.paypalDetail) {
          this.togglePaymentByType(type);
        } else {
          this.openPaypalDialog(true);
        }
        break;
      case EnumPaymentType.PAYMENT_2C2P:
        if (this.payment2C2PDetail) {
          this.togglePaymentByType(type);
        } else {
          this.open2c2pDialog(true);
        }
        break;
      case EnumPaymentType.OMISE:
        if (this.omiseDetail) {
          this.togglePaymentByType(type);
        } else {
          this.openOmiseDialog(true);
        }
        break;
      default:
        console.log('no choice select : ');
        break;
    }
  }

  togglePaymentByType(type: EnumPaymentType): void {
    this.paymentsService
      .togglePaymentByType(type)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        (err) => {
          console.log('err', err);
          this.getPaymentList();
          this.openSuccessDialog(
            {
              text: this.translate.instant('Something went wrong when updating payment status, please try again later. For more information, please contact us at 02-029-1200'),
              title: this.translate.instant('Error'),
            },
            true,
          );
        },
      );
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  onSave(): void {
    const isAnyActive = this.payments.filter((p) => p.status);
    if (isAnyActive.length > 0) {
      this.pagesService
        .updatePageWizardStepToSuccess(EnumWizardStepType.STEP_SET_PAYMENT)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.setupSuccess.emit(true);
          },
          (err) => {
            console.log('err: ', err);
            this.openSuccessDialog({ text: this.translate.instant('Update Wizard step error'), title: this.translate.instant('Error') }, true);
          },
        );
    } else {
      this.openSuccessDialog({ text: this.translate.instant('The shop must have at least 1 enable payment method'), title: this.translate.instant('Error') }, true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
