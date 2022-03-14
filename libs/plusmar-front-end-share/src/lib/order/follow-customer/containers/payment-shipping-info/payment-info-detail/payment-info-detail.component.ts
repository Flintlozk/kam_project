import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { deepCopy, getUTCDayjs, inputOnlyNumber } from '@reactor-room/itopplus-front-end-helpers';
import { getBankAccountDetailArray } from '@reactor-room/plusmar-front-end-helpers';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { EnumPaymentName, EnumPaymentType, IPayment, IPurchaseOrderPaymentDetail, PaymentShippingDetail, ReturnAddBankAccount } from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-payment-info-detail',
  templateUrl: './payment-info-detail.component.html',
  styleUrls: ['./payment-info-detail.component.scss'],
})
export class PaymentInfoDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() paymentData: PaymentShippingDetail;
  @Input() paymentDetail: IPurchaseOrderPaymentDetail;
  @Input() totalCost: number;
  @Output() updateDetail = new EventEmitter<FormGroup>();
  enumPaymentType = EnumPaymentType;
  paymentForm: FormGroup;
  timeForm: FormGroup;
  paymentStatus = 'false';
  currentDate = getUTCDayjs().toDate();
  paymentSelectedStatus = false;
  paymentSelectedDefault = { imgUrl: null, title: 'Select Payment Method' };

  paymentSlipIamge = 'assets/img/mockup_payment.png';
  imageLimitSize = 2097152;

  selectStatus = false;

  bankData = getBankAccountDetailArray();
  paymentMethodData = [
    { title: 'Bank Transfer', type: EnumPaymentType.BANK_ACCOUNT, imgUrl: 'assets/img/payment/bank-transfer.svg' },
    { title: 'Cash on Delivery', type: EnumPaymentType.CASH_ON_DELIVERY, imgUrl: 'assets/img/payment/COD.svg' },
    { title: 'Paypal', type: EnumPaymentType.PAYPAL, imgUrl: 'assets/img/payment/paypal.svg' },
    { title: 'QR Payment KBank', type: EnumPaymentType.QR_PAYMENT_KBANK, imgUrl: 'assets/img/payment/k-bank.png' },
    { title: 'Pay Solutions', type: EnumPaymentType.PAY_SOLUTION, imgUrl: 'assets/img/payment/pay-solutions.png' },
    { title: 'Omise', type: EnumPaymentType.OMISE, imgUrl: 'assets/img/payment/omise.svg' },
  ];

  selectData: ReturnAddBankAccount;
  bankAccounts: ReturnAddBankAccount[];
  paymentMethods: IPayment[];

  paymentTimeData = [];
  dialogTitle = 'Edit Info';

  destroy$: Subject<void> = new Subject<void>();

  constructor(private leadFormBuilder: FormBuilder, private paymentsService: PaymentsService) {}

  ngOnInit(): void {
    this.getPaymentMethodList();
    this.paymentForm = this.getPaymentFormGroup();
    this.timeForm = this.getTimeFormGroup();
    this.timeFormOnChanges();
    this.setDetail();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.paymentForm.valueChanges.pipe(debounceTime(200)).subscribe((val) => {
      this.watchOnEditDetail();
    });
  }

  triggerUploadFile(element: HTMLElement): void {
    element.click();
  }

  setDetail(): void {
    if (this.paymentDetail) {
      if (this.paymentDetail.type === EnumPaymentType.BANK_ACCOUNT) this.getBankAccountList();
      this.paymentForm.controls['paymentMethod'].setValue(EnumPaymentName[this.paymentDetail.type]);
      this.paymentForm.controls['paymentStatus'].setValue(this.paymentDetail.isPaid ? 'true' : 'false');

      if (this.paymentDetail.paidAmount !== null) this.paymentForm.controls['money'].setValue(this.paymentDetail.paidAmount);
      if (this.paymentDetail.paidTime !== null) this.paymentForm.controls['hour'].setValue(this.paymentDetail.paidTime);
      if (this.paymentDetail.paidProof !== null) this.paymentForm.controls['imagePayment'].setValue(this.paymentDetail.paidProof);

      if (this.paymentDetail.paidDate !== null) {
        this.currentDate = this.paymentDetail.paidDate;
        this.paymentForm.controls['datetime'].setValue(new Date(this.paymentDetail.paidDate));
      }
      this.watchOnEditDetail();
    }
  }

  getPaymentMethodList(): void {
    this.paymentsService.getPaymentListInfo().subscribe((payments) => {
      this.paymentMethods = payments;
    });
  }

  getBankAccountList(): void {
    this.paymentsService
      .getBankAccountList()
      .pipe(
        map((accounts: ReturnAddBankAccount[]) => {
          accounts = deepCopy(accounts);
          return accounts.filter((item) => {
            if (item.status === true) {
              const filtered = this.bankData.filter((x) => x.type === item.type);
              if (filtered) item.image = filtered[0].imgUrl;
              else item.image = null;
            }

            return item.status === true;
          });
        }),
      )
      .subscribe((accounts) => {
        this.bankAccounts = accounts;
        if (this.paymentDetail.bank) {
          const filter = this.bankAccounts.filter((item) => item.id === this.paymentDetail.bank.id);
          this.setSelectedData(filter[0]);
        }
      });
  }

  setSelectedData(item: ReturnAddBankAccount): void {
    this.selectData = item;
    this.paymentForm.patchValue({
      bankAccount: item.id,
    });
  }

  setDate(date: Date): void {
    this.currentDate = date;
    this.paymentForm.controls['datetime'].setValue(date);
  }

  getPaymentFormGroup(): FormGroup {
    const time = dayjs().format('HH:mm');
    const paymentFormGroup = this.leadFormBuilder.group({
      paymentMethod: [{ value: '', disabled: true }, Validators.required],
      bankAccount: [-1],
      datetime: [this.currentDate, Validators.required],
      hour: [time, Validators.required],
      money: [this.totalCost || 0, Validators.required],
      paymentStatus: ['false', Validators.required],
      imagePayment: ['assets/img/mockup_payment.png'],
      file: [null],
    });

    return paymentFormGroup;
  }

  paymentSelectStatusToogle(): void {
    this.paymentSelectedStatus = !this.paymentSelectedStatus;
  }

  watchOnEditDetail(): void {
    this.updateDetail.emit(this.paymentForm.value);
  }

  // eslint-disable-next-line
  onFileChange(event: any): void {
    const files = event.target.files;

    if (files.length) {
      for (const file of files) {
        if (file.size > this.imageLimitSize) {
          continue;
        }
        const reader = new FileReader();
        // eslint-disable-next-line
        (reader.onload = (e: any) => {
          this.paymentForm.controls['imagePayment'].setValue(e.target.result);
          this.paymentForm.controls['file'].setValue(file);
          this.watchOnEditDetail();
        }),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          (reader.onloadend = () => {});

        reader.readAsDataURL(file);
      }
    }
  }
  isNumberKey(evt: KeyboardEvent): boolean {
    return inputOnlyNumber(evt);
  }

  timeFormOnChanges(): void {
    this.timeForm.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe((changes: { hour: string; minute: string }) => {
      const hour = Number(changes.hour);
      if (hour < 0) {
        this.timeForm.controls['hour'].setValue(String(0).padStart(2, '0'));
      } else if (hour >= 24) {
        this.timeForm.controls['minute'].setValue(String(23).padStart(2, '0'));
      }

      const minute = Number(changes.minute);
      if (minute < 0) {
        this.timeForm.controls['minute'].setValue(String(0).padStart(2, '0'));
      } else if (minute >= 60) {
        this.timeForm.controls['minute'].setValue(String(59).padStart(2, '0'));
      }

      this.paymentForm.controls['hour'].setValue(`${this.timeForm.controls['hour'].value}:${this.timeForm.controls['minute'].value}`);
    });
  }

  onScrollTimer(event: WheelEvent, type: string /* hour,minute */): void {
    const min = 0;
    const max = type === 'hour' ? 24 : 59;
    const isScrollUp = event.deltaY <= 0;
    const currentValue = Number(this.timeForm.controls[type].value) as number;

    const newValue = isScrollUp ? currentValue + 1 : currentValue - 1;
    if (newValue > max) {
      this.timeForm.controls[type].setValue(String(min).padStart(2, '0'));
    } else if (newValue < min) {
      this.timeForm.controls[type].setValue(String(max).padStart(2, '0'));
    } else {
      this.timeForm.controls[type].setValue(String(newValue).padStart(2, '0'));
    }

    this.paymentForm.controls['hour'].setValue(`${this.timeForm.controls['hour'].value}:${this.timeForm.controls['minute'].value}`);
  }
  getTimeFormGroup(): FormGroup {
    const hour = dayjs().format('HH');
    const minute = dayjs().format('mm');
    return this.leadFormBuilder.group({
      hour: [hour, Validators.required],
      minute: [minute, Validators.required],
    });
  }
}
