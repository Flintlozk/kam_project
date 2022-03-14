import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { getFormErrorMessages } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult, ITextTitle, IValidationMessage } from '@reactor-room/model-lib';
import { getBankAccountDetailObject } from '@reactor-room/plusmar-front-end-helpers';
import { IDropDown, ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import {
  IMessageModel,
  IQuickPayCancelDetails,
  IQuickPayList,
  IQuickPayOrderItems,
  IQuickPayPaymentDetails,
  IQuickPayPaymentSave,
  IQuickPayPaymentSaveError,
  QuickPayComponentTypes,
  ReturnAddBankAccount,
} from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { isEmpty, sumBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, forkJoin, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { QuickPayService } from '../quick-pay.service';
import { QuickPayCancelDialogComponent } from './quick-pay-cancel-dialog/quick-pay-cancel-dialog.component';
import { QuickPayImageSelectorDialogComponent } from './quick-pay-image-selector-dialog/quick-pay-image-selector-dialog.component';
const MAX_YEAR = 1;

@Component({
  selector: 'reactor-room-quick-pay-details',
  templateUrl: './quick-pay-details.component.html',
  styleUrls: ['./quick-pay-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuickPayDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() audienceID: number;
  @Input() parentContainer: HTMLElement;
  @Input() isBankEnable: boolean;
  @ViewChild('slipFile', { read: ElementRef }) slipFile: ElementRef;
  order: IQuickPayList;
  orderItems = [] as IQuickPayOrderItems[];
  currencySymbol = '฿';
  amountTotal: number;
  vatTotal: number;
  minDate = new Date(dayjs().subtract(MAX_YEAR, 'year').format('YYYY-MM-DD'));
  maxDate = new Date();
  expireDate = this.maxDate;
  imageLimitSize = 4194304;
  fileSizeAllow: boolean;
  paymentForm: FormGroup;
  slipDefault = 'assets/img/slip-image.png';
  toastPosition = 'toast-bottom-right';
  successTitle = this.translate.instant('Success');
  errorTitle = this.translate.instant('Error');
  destroy$ = new Subject();

  validateMessage: IValidationMessage[] = [
    {
      control: 'method',
      rules: {
        required: this.translate.instant('This field is required'),
      },
    },
    {
      control: 'date',
      rules: {
        required: this.translate.instant('This field is required'),
      },
    },
    {
      control: 'time',
      rules: {
        required: this.translate.instant('This field is required'),
      },
    },
    {
      control: 'bankAccountID',
      rules: {
        required: this.translate.instant('This field is required'),
      },
    },
    {
      control: 'amount',
      rules: {
        required: this.translate.instant('This field is required'),
      },
    },
  ];

  quickPayPaymentSaveError = {} as IQuickPayPaymentSaveError;
  orderItemsTableHeader: ITableHeader[] = [
    { sort: false, title: this.translate.instant('Name'), key: null },
    { sort: false, title: this.translate.instant('Amount'), key: null },
    { sort: false, title: this.translate.instant('Discount'), key: null },
    { sort: false, title: 'VAT', key: null },
  ];

  paymentMethod: IDropDown[] = [
    {
      value: 'BANK_TRANSFER',
      label: 'Bank Transfer',
    },
  ];
  paymentFileUrl: string;
  paymentSlipFileTooBig: boolean;
  cancelDetails: IQuickPayCancelDetails;
  paymentDetails: IQuickPayPaymentDetails;
  isUnpaid: boolean;
  isCancel: boolean;
  isPaid: boolean;
  userName: string;
  bankAccounts: ReturnAddBankAccount[];
  bankDetails = getBankAccountDetailObject();
  defaultDate = new Date();
  defaultHours = ('0' + this.defaultDate.getHours()).slice(-2);
  defaultTime = ('0' + this.defaultDate.getMinutes()).slice(-2);
  defaultTimeValue = `${this.defaultHours}:${this.defaultTime}`;
  containerHeight: string;
  messageAttachments: IMessageModel[];
  messageURLs: string[];
  isLoading = true;
  userID: number;
  isWithHoldingTax: boolean;
  withHoldingTax: number;
  withHoldingTaxTotal = 0;

  constructor(
    private quickPayService: QuickPayService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private paymentsService: PaymentsService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.order = this.quickPayService.quickPayOrderDetail;
    const { id } = this.order;
    const orderItemDetails$ = this.quickPayService.getQuickPayOrderItemsByOrderID(id);
    const orderCancelDetails$ = this.quickPayService.getQuickPayCancelDetails(id);
    const orderPaymentDetails$ = this.quickPayService.getQuickPayPaymentDetails(id);
    this.userService.$userContext.pipe(tap((user) => (this.userID = user?.id))).subscribe();

    forkJoin([orderItemDetails$, orderPaymentDetails$, orderCancelDetails$])
      .pipe(
        takeUntil(this.destroy$),
        tap(([orderItems, paymentDetails, cancelDetails]) => {
          this.orderItems = orderItems;
          this.cancelDetails = cancelDetails;
          this.paymentDetails = paymentDetails;
          this.isUnpaid = !paymentDetails.isPaid && !cancelDetails.isCancel && !this.order.isExpired;
          this.isCancel = cancelDetails.isCancel;
          this.isPaid = paymentDetails.isPaid;
          this.userName = cancelDetails.userName;
          this.isLoading = false;
          this.isWithHoldingTax = paymentDetails.isWithHoldingTax;
          this.withHoldingTax = paymentDetails.withHoldingTax;
          this.calcTotalVatAndTotalAmount(orderItems);
        }),
        catchError((e) => {
          console.log('error on details ', e);
          this.isLoading = false;
          this.toastr.error(this.translate.instant('unknown_error'), this.errorTitle, { positionClass: this.toastPosition });
          return EMPTY;
        }),
      )
      .subscribe();
    this.initPaymentForm();
    this.getBankAccountDetails();
  }

  ngOnChanges(): void {
    this.containerHeight = this.parentContainer.offsetHeight - 200 + 'px';
  }

  getBankAccountDetails(): void {
    this.paymentsService.getBankAccountList().subscribe(
      (bankAccounts: ReturnAddBankAccount[]) => {
        const result = bankAccounts ? bankAccounts.filter((bank) => bank.status).map((bank) => ({ ...bank, image: this.bankDetails[bank.type].imgUrl })) : [];
        this.bankAccounts = result;
      },
      (err) => {
        console.log('getBankAccountDetails', err);
        this.toastr.error(this.translate.instant('unknown_error'), this.errorTitle, { positionClass: this.toastPosition });
      },
    );
  }

  calcTotalVatAndTotalAmount(orderItems: IQuickPayOrderItems[]): void {
    const vatTotalAmountTotal = orderItems.map(({ itemPrice, isVat, discount }) => ({
      amount: itemPrice,
      vat: isVat ? (+itemPrice - +discount) * (this.order.tax / 100) : 0,
    }));
    this.amountTotal = +sumBy(vatTotalAmountTotal, 'amount').toFixed(2) - this.order.discount;
    this.vatTotal = +sumBy(vatTotalAmountTotal, 'vat').toFixed(2);
    this.withHoldingTaxTotal = +((this.amountTotal / 100) * this.withHoldingTax).toFixed(2);
  }

  initPaymentForm(): void {
    this.paymentForm = this.fb.group({
      method: ['BANK_TRANSFER', Validators.required],
      bankAccountID: [null, Validators.required],
      date: [null, Validators.required],
      time: [this.defaultTimeValue, Validators.required],
      amount: [String(this.order.totalPrice), Validators.required],
      slip: this.fb.group({
        file: [null, Validators.required],
        url: null,
        isURL: false,
      }),
    });
    this.setDate(this.maxDate);
  }

  setDate(paymentDate: Date): void {
    this.paymentForm.get('date').setValue(paymentDate);
  }

  onCancelClick(): void {
    this.quickPayService.setShowQuickPayComponent(QuickPayComponentTypes.TRANSACTION);
  }

  showPaymentFormError({ slip: { url } }: IQuickPayPaymentSave): void {
    this.quickPayPaymentSaveError = getFormErrorMessages<IQuickPayPaymentSaveError>(this.paymentForm, this.validateMessage);
    if (!url) {
      this.quickPayPaymentSaveError.fileErrorMessage = this.translate.instant('Image File is required');
    } else {
      this.quickPayPaymentSaveError.fileErrorMessage = null;
    }
  }

  onConfirmPayment(): void {
    const quickPayPaymentInput = this.paymentForm.value as IQuickPayPaymentSave;
    const date = dayjs(quickPayPaymentInput.date).format('YYYY-MM-DD');
    if (this.paymentForm.valid && this.fileSizeAllow) {
      !quickPayPaymentInput.slip.isURL && delete quickPayPaymentInput.slip.url;
      quickPayPaymentInput.slip.isURL && delete quickPayPaymentInput.slip.file;
      this.quickPayService
        .saveQuickPayPayment(this.order.id, { ...quickPayPaymentInput, date })
        .pipe(
          takeUntil(this.destroy$),
          tap(({ status, value }) => {
            status === 200
              ? this.toastr.success(this.translate.instant(value), this.successTitle, { positionClass: this.toastPosition })
              : this.toastr.error(this.translate.instant(value), this.errorTitle, { positionClass: this.toastPosition });
            this.redirectToTransaction(status);
          }),
          catchError((e) => {
            console.log('error on details ', e);
            this.toastr.error(this.translate.instant('unknown_error'), this.errorTitle, { positionClass: this.toastPosition });
            return EMPTY;
          }),
        )
        .subscribe();
    } else {
      if (!this.fileSizeAllow) {
        this.paymentForm.get('slip').setErrors({ file_too_big: true });
        this.quickPayPaymentSaveError.fileErrorMessage = this.translate.instant('4 MB max file size');
        this.toastr.error(this.translate.instant('4 MB max file size'), this.errorTitle, { positionClass: this.toastPosition });
      } else {
        this.showPaymentFormError(quickPayPaymentInput);
      }
    }
  }

  onCancelBill(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Cancel',
        text: 'Are you sure you want to cancel payment link',
        buttonMode: 1,
      } as ITextTitle,
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap((data: boolean) => data && this.openCancelDialog()),
      )
      .subscribe();
  }

  openCancelDialog(): void {
    const cancelDialogRef = this.dialog.open<QuickPayCancelDialogComponent, unknown, IHTTPResult>(QuickPayCancelDialogComponent, {
      width: '50%',
    });
    cancelDialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap(({ status, value }) => status === 200 && this.quickPayPaymentCancel(value)),
      )
      .subscribe();
  }

  quickPayPaymentCancel(description: string): void {
    const { id } = this.order;
    this.quickPayService
      .quickPayPaymentCancel(id, description)
      .pipe(
        takeUntil(this.destroy$),
        tap(({ status, value }) => {
          status === 200
            ? this.toastr.success(this.translate.instant(value), this.successTitle, { positionClass: this.toastPosition })
            : this.toastr.error(this.translate.instant(value), this.errorTitle, { positionClass: this.toastPosition });
          this.redirectToTransaction(status);
        }),
        catchError((e) => {
          console.log('error on details ', e);
          this.toastr.error(this.translate.instant('unknown_error'), this.errorTitle, { positionClass: this.toastPosition });
          return EMPTY;
        }),
      )
      .subscribe();
  }

  redirectToTransaction(status: number): void {
    status === 200 && this.onCancelClick();
  }

  openImageDialog(): void {
    const imageSelectorDialogRef = this.dialog.open<QuickPayImageSelectorDialogComponent, [number, number], IHTTPResult>(QuickPayImageSelectorDialogComponent, {
      width: '50%',
      data: [this.audienceID, this.userID],
    });

    imageSelectorDialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => {
          if (isEmpty(result)) return;
          const { status, value } = result;
          if (status === 200) {
            this.setImage(value);
          }
        }),
      )
      .subscribe();
  }

  setImage(value: string): void {
    if (value !== 'false') {
      this.paymentForm.get('slip').patchValue({
        file: true,
        url: value,
        isURL: true,
      });
      this.paymentForm.get('slip').markAsDirty();
      this.paymentFileUrl = value;
    } else {
      this.paymentForm.get('slip').patchValue({
        file: null,
        url: null,
        isURL: false,
      });
      this.slipFile.nativeElement.click();
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onFileChange(event, formControlName: string): void {
    const files = event.target.files;
    if (files.length) {
      for (const file of files) {
        this.fileSizeAllow = file.size < this.imageLimitSize;
        if (!this.fileSizeAllow) {
          this.paymentForm.get('slip').setErrors({ file_too_big: true });
          this.quickPayPaymentSaveError.fileErrorMessage = this.translate.instant('4 MB max file size');
        } else {
          this.paymentForm.get('slip').setErrors({});
          this.quickPayPaymentSaveError.fileErrorMessage = null;
        }
        const reader = new FileReader();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (reader.onload = (e: any) => {
          this.paymentForm.get(formControlName).patchValue({
            file,
            url: e.target.result,
            isURL: false,
          });
          this.paymentForm.get(formControlName).markAsDirty();
          this.paymentFileUrl = e.target.result;
        }),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          (reader.onloadend = () => {});
        reader.readAsDataURL(file);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
