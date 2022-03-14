import { Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import {
  ICustomerAddressData,
  ISubscriptionPlan,
  ISubscriptionOrderInput,
  IRequestPaymentData,
  ICreateOrderHistoryResponse,
  EnumAuthError,
} from '@reactor-room/itopplus-model-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { OrderHistoryService } from '@plusmar-front/services/order-history/subscription-order/subscription-order.service';
import { validationMessages } from './subscription-payment-validation';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, Observable, of, Subject } from 'rxjs';

function phoneInitial(): ValidatorFn {
  return (c: { value: string }): { [key: string]: boolean } | null => {
    const { value } = c;
    if (value.length >= 9) {
      const infrontNumber = value.substring(0, 2);
      const isHomeNumber = infrontNumber === '02' || infrontNumber === '03' || infrontNumber === '04' || infrontNumber === '05' || infrontNumber === '07';
      const checkLenght = value.replace(/[^0-9]/g, '').length;
      if (isHomeNumber) {
        if (checkLenght === 9) {
          return null;
        } else {
          return { phoneinit: true };
        }
      } else {
        if (checkLenght === 10) {
          return null;
        } else {
          return { phoneinit: true };
        }
      }
    } else if (value.length === 0) {
      return null;
    } else {
      return { phoneinit: true };
    }
  };
}

@Component({
  selector: 'reactor-room-subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SubscriptionPaymentComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentEventTarget;
  hash_value = '';
  subscriptionPlan: ISubscriptionPlan;
  isLoading = true;
  paymentRedirectApiURL;
  paymentForm: FormGroup;
  paymentRequestForm: FormGroup;
  country = this.translate.instant('Thailand');
  plan = 0;
  subscriptionID: '';
  isBusiness = false;
  isCommerce = false;
  hashResult = '';
  tax = 0;
  discount = 0;
  total = 0;
  paymentSetting = {
    GenOID: 321654,
    merchantid: '',
    cc: 764,
    details: 'Pro+ Commerce',
    calculate: '',
    version: '',
    returnurl: '', //result_url_1
    postbackurl: '', //result_url_2
    orderID: '',
    amount: '',
    payment_option: 'C', //Customer Payment Options
    request_3ds: '',
    recurring: 'Y', //Recurring flag
    order_prefix: '', // We will use order ID
    recurring_amount: '', // Charge for next time
    allow_accumulate: 'N',
    recurring_interval: '365', //To indicate the frequency of RPP by days. minimum is every 1 day. maximum is every 365 days (1 year).
    recurring_count: 0, //To indicate how many times to charge the customer with RPP. set to '0' to charge indefinitely until terminated
    charge_next_date: '', // Should be next year : Format:ddMMyyyy
    user_defined_1: '', //This will keep sub id
  };

  addressFields: ICustomerAddressData[] = [
    { value: null, field: 'post_code', label: this.translate.instant('Post code'), validator: [], errorMessage: '' },
    { value: null, field: 'district', label: this.translate.instant('District'), validator: [], errorMessage: '' },
    { value: null, field: 'city', label: this.translate.instant('City'), validator: [], errorMessage: '' },
    { value: null, field: 'province', label: this.translate.instant('Province'), validator: [], errorMessage: '' },
  ];

  constructor(
    private leadFormBuilder: FormBuilder,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private subscriptionOrderService: OrderHistoryService,
    private elm: ElementRef,
    private location: Location,
  ) {}

  private validationMessages = validationMessages;
  firstNameValidationMessage;
  lastNameValidationMessage;
  telValidationMessage;

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe((params) => {
      this.plan = Number(params['planID'] || '0');
      if (this.plan === 0) {
        void this.router.navigateByUrl('/follows?err=INVALID_SUBSCRIPTION_PLAN');
      }
      this.subscriptionID = params['subscriptionID'];
      this.getSubscriptionPlanDetails();
    });
  }

  initForm(): void {
    this.paymentForm = this.leadFormBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      tel: ['', phoneInitial()],
      taxID: [''],
      address: [''],
      country: ['Thailand'],
    });

    this.paymentRequestForm = this.leadFormBuilder.group({
      version: [this.paymentSetting.version],
      order_id: [this.paymentSetting.orderID],
      merchant_id: [this.paymentSetting.merchantid],
      currency: [this.paymentSetting.cc],
      payment_description: [this.paymentSetting.details],
      amount: [this.paymentSetting.amount],
      result_url_1: [this.paymentSetting.returnurl],
      result_url_2: [this.paymentSetting.postbackurl],
      hash_value: [this.hash_value],
      payment_option: [this.paymentSetting.payment_option],
      request_3ds: [this.paymentSetting.request_3ds],
      recurring: [this.paymentSetting.recurring],
      order_prefix: [this.paymentSetting.order_prefix],
      recurring_amount: [this.paymentSetting.recurring_amount],
      allow_accumulate: [this.paymentSetting.allow_accumulate],
      recurring_interval: [this.paymentSetting.recurring_interval],
      charge_next_date: [this.paymentSetting.charge_next_date],
      recurring_count: [this.paymentSetting.recurring_count],
      user_defined_1: [this.paymentSetting.user_defined_1],
    });
  }

  handleAddressValue(addressValues: ICustomerAddressData): void {
    this.paymentForm.patchValue(addressValues);
  }

  getSubscriptionPlanDetails(): void {
    this.subscriptionService
      .getSubscriptionPlanDetails(this.plan)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe(
        (res) => {
          this.subscriptionPlan = res;
          this.tax = res.price * 0.07;
          this.total = res.price + this.tax - this.discount;
          this.paymentSetting.calculate = this.total.toFixed(2);
          this.paymentSetting.details = res.planName;
          this.paymentSetting.amount = this.paymentSetting.calculate.replace('.', '').padStart(12, '0');
          if (res.featureType === 'BUSINESS') {
            this.isBusiness = true;
          } else if (res.featureType === 'COMMERCE') {
            this.isCommerce = true;
          } else void this.router.navigateByUrl(`/follows?err=${EnumAuthError.INVALID_SUBSCRIPTION_PLAN}`);
        },
        (err) => {
          console.log('err ', err);
          void this.router.navigateByUrl(`/follows?err=${EnumAuthError.INVALID_SUBSCRIPTION_PLAN_ID}`);
        },
      );
  }

  submitPurchase(event: HTMLFormElement): void {
    if (this.paymentForm.valid) {
      event.preventDefault();
      this.currentEventTarget = event.currentTarget;
      const orderInput: ISubscriptionOrderInput = {
        discount: this.discount,
        first_name: this.paymentForm.value.firstName,
        last_name: this.paymentForm.value.lastName,
        tel: this.paymentForm.value.tel,
        tax_id: this.paymentForm.value.taxID,
        address: this.paymentForm.value.address,
        sub_district: this.paymentForm.value.location && this.paymentForm.value.location.district ? this.paymentForm.value.location.district : '',
        district: this.paymentForm.value.location && this.paymentForm.value.location.city ? this.paymentForm.value.location.city : '',
        province: this.paymentForm.value.location && this.paymentForm.value.location.province ? this.paymentForm.value.location.province : '',
        post_code: this.paymentForm.value.location && this.paymentForm.value.location.post_code ? this.paymentForm.value.location.post_code : '',
        country: 'Thailand',
        price: this.total,
      };
      this.createSubscriptionOrderAndShitory(orderInput).pipe(takeUntil(this.destroy$)).subscribe();
    } else {
      this.findInvalidControls();
    }
  }

  createSubscriptionOrderAndShitory(orderInput: ISubscriptionOrderInput): Observable<boolean> {
    return of(true).pipe(
      switchMap(() => {
        return this.subscriptionOrderService.createSubscriptionOrder(this.plan, orderInput, this.subscriptionID).pipe(
          tap((res: ICreateOrderHistoryResponse) => {
            this.paymentSetting.orderID = String(res.id);
            this.paymentSetting.order_prefix = res.id.toString();
            this.paymentSetting.user_defined_1 = res.subscription_id;
            this.paymentSetting.recurring_amount = this.paymentSetting.amount;
          }),
          catchError((err) => {
            if (err.message.indexOf('NO_SUBSCRIPTION_FROM_ID') !== -1) {
              void this.router.navigateByUrl(`/follows?err=${EnumAuthError.NO_SUBSCRIPTION_FROM_ID}`);
            } else if (err.message.indexOf('INVALID_SUBSCRIPTION_PLAN_ID') !== -1) {
              void this.router.navigateByUrl(`/follows?err=${EnumAuthError.INVALID_SUBSCRIPTION_PLAN_ID}`);
            } else if (err.message.indexOf('INVALID_SUBSCRIPTION_PLAN') !== -1) {
              void this.router.navigateByUrl(`/follows?err=${EnumAuthError.INVALID_SUBSCRIPTION_PLAN}`);
            } else {
              console.log('err', err);
              void this.router.navigateByUrl(`/follows?err=${EnumAuthError.UNKNOWN}`);
            }
            return EMPTY;
          }),
        );
      }),
      switchMap((createOrderHistoryResponse: ICreateOrderHistoryResponse) => {
        const requestPaymentData: IRequestPaymentData = {
          payment_description: this.paymentSetting.details,
          order_id: String(createOrderHistoryResponse.id),
          currency: this.paymentSetting.cc,
          amount: this.paymentSetting.amount,
          payment_option: this.paymentSetting.payment_option,
          recurring: this.paymentSetting.recurring,
          order_prefix: createOrderHistoryResponse.id.toString(),
          recurring_amount: this.paymentSetting.amount,
          allow_accumulate: this.paymentSetting.allow_accumulate,
          recurring_interval: this.paymentSetting.recurring_interval,
          recurring_count: this.paymentSetting.recurring_count,
          user_defined_1: createOrderHistoryResponse.subscription_id,
        };
        return this.subscriptionOrderService.getHashValue(requestPaymentData).pipe(
          tap((result) => {
            this.paymentRedirectApiURL = result.order_detail.redirect_api;
            this.paymentSetting.merchantid = result.order_detail.merchant_id;
            this.paymentSetting.request_3ds = result.order_detail.request_3ds;
            this.paymentSetting.version = result.order_detail.version;
            this.paymentSetting.returnurl = result.order_detail.result_url_1;
            this.paymentSetting.postbackurl = result.order_detail.result_url_2;
            this.hashResult = result.hash_value;
            this.paymentSetting.charge_next_date = result.charge_next_date;
          }),
          catchError((err) => {
            console.log('err: ', err);
            void this.router.navigateByUrl('/follows?err=UNKNOWN');
            return EMPTY;
          }),
        );
      }),
      switchMap(() => {
        return of(true);
      }),
    );
  }

  findInvalidControls(): void {
    let invalid = '';
    const controls = this.paymentForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid = name;
        break;
      }
    }

    for (const name in controls) {
      if (controls[name].invalid) {
        const customerFormControl = this.paymentForm.get(name);
        this.setErrorMessage(customerFormControl, name);
      }
    }

    const invalidControl = this.elm.nativeElement.querySelector('[formControlName="' + invalid + '"]');
    if (invalidControl != null) {
      invalidControl.focus();
    }
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    this[`${controlName}ValidationMessage`] = errorMessage;
  }

  setErrorMessage(c: AbstractControl, controlName: string): void {
    if (c.errors) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      this.showErrorMessage(controlName, errorMessage);
    }
  }

  changeHashValue(): void {
    this.hash_value = this.hashResult;
  }

  fireSubmit(): void {
    if (this.hash_value.length > 0) {
      this.currentEventTarget.submit();
    }
  }

  back(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
