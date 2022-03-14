import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { IDropDown } from '@reactor-room/plusmar-front-end-share/app.model';
import { TaxService } from '@reactor-room/plusmar-front-end-share/services/tax.service';
import { IQuickPayBillItem, IQuickPaySave, QuickPayComponentTypes, QuickPayMessageTypes } from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { sumBy } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { QuickPayService } from '../quick-pay.service';

const MAX_YEAR = 1;
@Component({
  selector: 'reactor-room-quick-pay-new',
  templateUrl: './quick-pay-new.component.html',
  styleUrls: ['./quick-pay-new.component.scss'],
})
export class QuickPayNewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() audienceID: number;
  @Input() parentContainer: HTMLElement;
  @Input() isBankEnable: boolean;
  @ViewChild('itemTableTbody') private itemTableTbody: ElementRef;
  minDate = new Date();
  maxDate = new Date(dayjs().add(MAX_YEAR, 'year').format('YYYY-MM-DD'));
  quickBillForm: FormGroup;
  vat = 0;
  amountTotal = 0.0;
  vatTotal = 0.0;
  grandTotal = 0.0;
  discountTotal = 0.0;
  withHoldingTaxTotal = 0.0;
  destroy$ = new Subject();
  expireDateDropDown: IDropDown[] = [
    {
      value: '7',
      label: '7',
    },
    {
      value: '15',
      label: '15',
    },
    {
      value: '30',
      label: '30',
    },
    {
      value: 'Custom',
      label: 'Custom',
    },
  ];
  expireDate = null;

  defaultExpireDate = this.expireDateDropDown[0].value;

  currencySymbol = '฿';
  containerHeight: string;
  discountError = [] as boolean[];
  withHoldingTaxDefaultPercent = 3;
  withHoldingTaxLimitPercent = 10;

  get billItemArray(): FormArray {
    return <FormArray>this.quickBillForm?.get('billItems');
  }

  constructor(
    private fb: FormBuilder,
    private quickPayService: QuickPayService,
    private taxService: TaxService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.taxService
      .getTaxByPageID()
      .pipe(
        takeUntil(this.destroy$),
        tap((vat) => {
          if (vat?.status) {
            this.vat = vat.tax;
          }
        }),
      )
      .subscribe();
    this.initQuickForm();
    this.subscribeToValueChanges();
  }

  ngOnChanges(): void {
    this.containerHeight = this.parentContainer.offsetHeight - 200 + 'px';
  }

  initQuickForm(): void {
    this.quickBillForm = this.fb.group({
      billItems: this.fb.array([this.getQuickBillItem()]),
      linkExpireValue: [],
      linkExpireDate: [],
      isWithHoldingTax: [false],
      withHoldingTax: [this.withHoldingTaxDefaultPercent],
    });
    this.setExpireDate();
  }

  subscribeToValueChanges(): void {
    this.quickBillForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((bill: IQuickPaySave) => {
          this.validateDiscount(bill);
          this.validateWithHoldingPercent(bill);
          const amountTaxList: { amount: number; vatAmount: number; discount: number }[] = bill.billItems.map(({ amount, isVAT, discount }) => ({
            amount: +amount > (+discount || 0) ? amount - (+discount || 0) : 0,
            vatAmount: isVAT && amount > (+discount || 0) ? +((amount - (+discount || 0) || 0) * (this.vat / 100)).toFixed(2) : 0,
            discount: +discount || 0,
          }));
          const totalAmount = sumBy(amountTaxList, 'amount');
          const totalTax = sumBy(amountTaxList, 'vatAmount');
          const totalDiscount = sumBy(amountTaxList, 'discount');
          const withHoldingTaxTotal = this.calculateWithHoldingTax(bill, totalAmount);
          const grandTotal = totalAmount + totalTax - withHoldingTaxTotal || 0;
          this.discountTotal = +totalDiscount.toFixed(2);
          this.amountTotal = +totalAmount.toFixed(2);
          this.vatTotal = +totalTax.toFixed(2);
          this.grandTotal = +grandTotal.toFixed(2);
          this.withHoldingTaxTotal = +withHoldingTaxTotal.toFixed(2);
        }),
      )
      .subscribe();
  }

  validateWithHoldingPercent({ isWithHoldingTax, withHoldingTax }: IQuickPaySave): void {
    const withHoldingTaxControl = this.quickBillForm.get('withHoldingTax');
    if (isWithHoldingTax) {
      if (+withHoldingTax > this.withHoldingTaxLimitPercent) {
        withHoldingTaxControl.setErrors({ withHoldingTaxOverLimit: true });
      } else {
        withHoldingTaxControl.setErrors(null);
      }
    } else {
      withHoldingTaxControl.setErrors(null);
    }
  }

  calculateWithHoldingTax({ isWithHoldingTax, withHoldingTax }: IQuickPaySave, totalAmount: number): number {
    if (isWithHoldingTax) {
      return (totalAmount / 100) * withHoldingTax;
    } else {
      return 0;
    }
  }

  validateDiscount(bill: IQuickPaySave): void {
    const billItems = bill.billItems as IQuickPayBillItem[];
    for (let index = 0; index < billItems?.length; index++) {
      const billItem = billItems[index];
      const amount = +billItem.amount || 0;
      const discount = +billItem.discount || 0;
      if (discount >= amount && discount > 0 && amount > 0) {
        this.discountError[index] = true;
      } else {
        this.discountError[index] = false;
      }
    }
  }

  setExpireDate(): void {
    this.quickBillForm
      .get('linkExpireValue')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        tap((expireValue) => {
          if (!expireValue) return false;
          if (expireValue === 'Custom') {
            this.quickBillForm.get('linkExpireDate').setValue(this.minDate);
            this.expireDate = this.minDate;
          } else {
            const expireDate = dayjs().add(expireValue, 'day').format('YYYY-MM-DD');
            this.expireDate = new Date(expireDate);
            this.quickBillForm.get('linkExpireDate').setValue(this.expireDate);
          }
        }),
      )
      .subscribe();
    this.quickBillForm.get('linkExpireValue').setValue(this.defaultExpireDate);
  }

  addBillItem(): void {
    this.billItemArray.push(this.getQuickBillItem());
    setTimeout(() => {
      this.itemTableTbody.nativeElement.scrollTop = this.itemTableTbody.nativeElement.scrollHeight;
    }, 2);
  }

  deleteBillItem(i: number): void {
    this.billItemArray.removeAt(i);
  }

  getQuickBillItem(): FormGroup {
    return this.fb.group({
      item: [null, Validators.required],
      amount: [null, Validators.required],
      discount: [null],
      isVAT: [false],
    });
  }

  setDate(expireDate: Date): void {
    const exipreDateDayJs = dayjs(expireDate);
    const dayDifference = exipreDateDayJs.diff(this.minDate, 'd') + 1;
    const daysArr = this.expireDateDropDown.filter(({ value }) => value !== 'Custom').map(({ value }) => +value);
    const isDayDiffExists = daysArr.some((value) => value === dayDifference);
    if (isDayDiffExists) {
      this.quickBillForm.get('linkExpireValue').setValue(dayDifference + '');
    } else {
      this.quickBillForm.get('linkExpireValue').setValue('Custom');
    }
    this.expireDate = expireDate;
  }

  onCancelClick(): void {
    this.quickPayService.setShowQuickPayComponent(QuickPayComponentTypes.TRANSACTION);
  }

  saveQuickPay(): void {
    let quickPay = this.quickBillForm.value as IQuickPaySave;
    const expireDate = new Date(new Date(this.expireDate).setHours(23, 59)).toUTCString();
    quickPay.linkExpireDate = expireDate;
    quickPay.total = {
      amountTotal: this.amountTotal,
      vatTotal: this.vatTotal,
      grandTotal: this.grandTotal,
      discountTotal: this.discountTotal,
      withHoldingTaxTotal: this.withHoldingTaxTotal,
    };

    quickPay.billItems = quickPay.billItems.map((bill) => ({ ...bill, amount: +bill.amount, discount: +bill.discount }));

    quickPay = { ...quickPay, withHoldingTax: +quickPay.withHoldingTax };
    this.quickPayService
      .saveQuickPay(this.audienceID, this.vat, quickPay)
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => this.showResponseToast(result)),
      )
      .subscribe();
  }

  showResponseToast({ status, value }: IHTTPResult): void {
    if (status !== 200) {
      this.showQuickPaySaveError(value);
    } else {
      this.quickPayService.quickPayID$.next(+value);
      this.quickPayService.setShowQuickPayComponent(QuickPayComponentTypes.TRANSACTION);
    }
  }

  showQuickPaySaveError(value: string): void {
    const title = this.translate.instant('Error');
    if (value === QuickPayMessageTypes.NO_PAYMENT_METHOD) {
      const message = this.translate.instant('To enable Quick Pay please enable at least one Bank Payment');
      this.toastr.error(title, message);
      this.isBankEnable = false;
    } else {
      const message = this.translate.instant('process_req_error');
      this.toastr.error(title, message);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
