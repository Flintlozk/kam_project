import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import {
  CashOnDeliveryDetail,
  EnumAuthError,
  EnumAuthScope,
  EnumPageMemberType,
  EnumPaymentType,
  I2C2PPaymentModel,
  IOmiseDetail,
  IPayment,
  PaypalDetail,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingBankTransferDialogComponent } from './components';

@Component({
  selector: 'reactor-room-setting-payment',
  templateUrl: './setting-payment.component.html',
  styleUrls: ['./setting-payment.component.scss'],
})
export class SettingPaymentComponent implements OnInit, OnDestroy {
  constructor(private dialog: MatDialog, private paymentsService: PaymentsService, public translate: TranslateService, private userService: UserService) {}
  @Input() theme = EnumAuthScope.SOCIAL;
  themeType = EnumAuthScope;
  @Input() role: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  EnumPaymentType = EnumPaymentType;
  tableitem: unknown;
  successDialog;
  isClosable = true as boolean;
  isBankTransferActive: boolean;
  isAnyBankActive: boolean;
  isAnyBank = false as boolean;
  isBankDisabled = false as boolean;
  isBankClosable: boolean;
  isPaypalValid: boolean;
  is2C2PValid: boolean;
  isOmiseValid: boolean;
  isAllowed = false as boolean;

  bankAccounts = [];
  codDetail = {} as CashOnDeliveryDetail;
  paypalDetail = {} as PaypalDetail;
  payment2C2PDetail = {} as I2C2PPaymentModel;
  omiseDetail = {} as IOmiseDetail;
  payments = [] as IPayment[];
  gatewayEnabled = {
    BANK_ACCOUNT: false,
    CASH_ON_DELIVERY: false,
    QR_PAYMENT_KBANK: false,
    PAYPAL: false,
    PAYMENT_2C2P: false,
    PAY_SOLUTION: false,
    OMISE: false,
  };

  moreStatus = {
    BANK_ACCOUNT: false,
    CASH_ON_DELIVERY: false,
    QR_PAYMENT_KBANK: false,
    PAYPAL: false,
    PAYMENT_2C2P: false,
    PAY_SOLUTION: false,
    OMISE: false,
  };
  default: {
    break;
  };

  openDialog(activeTransfer: boolean, status: boolean, type: string): void {
    const dialogRef = this.dialog.open(SettingBankTransferDialogComponent, {
      width: '100%',
      data: {
        mode: 'ADD',
        status: status,
        activeTransfer: activeTransfer,
        type: type,
        theme: this.theme,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        if (result.activeTransfer) {
          this.isBankTransferActive = true;
          this.togglePaymentByType(EnumPaymentType.BANK_ACCOUNT);
        }
        this.openSuccessDialog({ text: this.translate.instant('Add data success'), title: this.translate.instant('Success') }, false);
      }
    });
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  ngOnInit(): void {
    this.getPagePaymentList();
    this.checkIsUserHavePermission();
  }

  checkIsUserHavePermission(): void {
    if (this.theme === this.themeType.CMS) {
      if (this.role !== EnumPageMemberType.STAFF) this.isAllowed = true;
    } else {
      this.isAllowed = true;
      this.userService.$userPageRole.pipe(takeUntil(this.destroy$)).subscribe((userRole) => {
        if (userRole !== EnumPageMemberType.STAFF) this.isAllowed = true;
      });
    }
  }

  handleBankActive(isActive: boolean): void {
    this.isAnyBankActive = isActive;
    this.checkIsBankDisable();
  }

  handleBankAccountUpdated(bankAccounts): void {
    this.isAnyBank = bankAccounts.length > 0;
    this.isAnyBankActive = bankAccounts.filter((x) => x.status === true).length > 0;
    this.checkIsBankDisable();
  }

  getPagePaymentList(): void {
    this.paymentsService
      .getPaymentList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: [IPayment]) => {
        this.isClosable = value.filter((x) => x.status === true).length > 1;
        this.payments = value;
        value.map((item) => {
          this.gatewayEnabled[item.type] = item.status;
          switch (item.type) {
            case EnumPaymentType.BANK_ACCOUNT: {
              this.isBankTransferActive = item.status;
              this.isAnyBank = item.option[item.type].length > 0;
              this.isAnyBankActive = item.option[item.type].filter((x) => x.bankStatus === true).length > 0;
              this.checkIsBankDisable();
              break;
            }
            case EnumPaymentType.CASH_ON_DELIVERY: {
              this.codDetail = item.option[item.type];
              break;
            }
            case EnumPaymentType.PAYPAL: {
              this.paypalDetail = item.option[item.type];
              this.isPaypalValid = !(isEmpty(this.paypalDetail) || this.paypalDetail.clientId === '' || this.paypalDetail.clientSecret === '');
              break;
            }
            case EnumPaymentType.PAYMENT_2C2P: {
              this.payment2C2PDetail = item.option[item.type];
              this.is2C2PValid = !(isEmpty(this.payment2C2PDetail) || this.payment2C2PDetail.merchantID === '' || this.payment2C2PDetail.secretKey === '');
              break;
            }
            case EnumPaymentType.OMISE: {
              this.omiseDetail = item.option[item.type];
              this.isOmiseValid = !(isEmpty(this.omiseDetail) || this.omiseDetail.publicKey === '' || this.omiseDetail.secretKey === '');
              break;
            }
          }
        });
      });
  }

  onCodUpdated(value: CashOnDeliveryDetail): void {
    this.codDetail = value;
  }

  checkIsBankDisable(): void {
    this.isBankDisabled = (!this.isClosable && this.isBankTransferActive) || (!this.isBankTransferActive && !this.isAnyBankActive);
  }

  togglePaymentSetting(type: string): void {
    this.moreStatus[type] = !this.moreStatus[type];
  }

  openError(): void {
    this.openSuccessDialog({ text: this.translate.instant('The shop must have at least 1 enable payment method'), title: this.translate.instant('Error') }, true);
  }
  openPaypalError(): void {
    this.openSuccessDialog(
      { text: this.translate.instant('Unable to turn on Paypal, required ClientID and ClientSecret'), title: this.translate.instant('Toggle Paypal Error') },
      true,
    );
  }

  open2C2PError(): void {
    this.openSuccessDialog(
      { text: this.translate.instant('Unable to turn on 2C2P, required Merchant ID and Merchant Authentication Key'), title: this.translate.instant('Toggle 2C2P Error') },
      true,
    );
  }

  openOmiseError(): void {
    this.openSuccessDialog(
      { text: this.translate.instant('Unable to turn on Omise, required Public Key and Secret Key'), title: this.translate.instant('Toggle Omise Error') },
      true,
    );
  }

  openNoBankActiveError(): void {
    this.openSuccessDialog({ text: this.translate.instant('To active Bank Trasfer, please active atleast 1 bank account '), title: this.translate.instant('Error') }, true);
  }

  togglePaymentGateway(type: EnumPaymentType): void {
    this.togglePaymentByType(type);
    if (type === EnumPaymentType.BANK_ACCOUNT) this.isBankTransferActive = !this.isBankTransferActive;
  }

  togglePaymentByType(type: EnumPaymentType): void {
    this.paymentsService.togglePaymentByType(type).subscribe(
      () => {
        //
      },
      (err) => {
        this.getPagePaymentList();
        if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
          this.openSuccessDialog(
            { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
            true,
          );
        } else {
          console.log('err', err);
          this.openSuccessDialog(
            {
              text: this.translate.instant('Something went wrong when updating payment status, please try again later. For more information, please contact us at 02-029-1200'),
              title: this.translate.instant('Error'),
            },
            true,
          );
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
