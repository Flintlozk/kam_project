import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { EnumAuthScope, ITopupRequest2C2P } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { CreditTopupService } from '@reactor-room/plusmar-front-end-share/topup/credit-topup.service';

@Component({
  selector: 'reactor-room-topup-dialog',
  templateUrl: './topup-dialog.component.html',
  styleUrls: ['./topup-dialog.component.scss'],
})
export class TopupDialogComponent implements OnInit, OnDestroy {
  theme = EnumAuthScope.SOCIAL;
  themeType = EnumAuthScope;
  currentEventTarget;
  paymentRedirectApiURL = environmentLib.PAYMENT_2C2P_REDIRECT_API;
  paymentSetting: ITopupRequest2C2P;
  paymentRequestForm: FormGroup;
  moneyForm: FormGroup;

  destroy$: Subject<boolean> = new Subject();

  onInvalid = '';

  min = 200;
  max = 30000;
  constructor(
    @Inject(MAT_DIALOG_DATA) public paymentForm: ITopupRequest2C2P,
    private dialogRef: MatDialogRef<TopupDialogComponent>,
    private formBuilder: FormBuilder,
    public creditTopupService: CreditTopupService,
    public translate: TranslateService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.paymentSetting = this.paymentForm;
    this.theme = this.paymentSetting.theme;
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  submitPurchase(event: HTMLFormElement): void {
    this.currentEventTarget = event.currentTarget;

    const money = this.moneyForm.controls['amount'].value as string;
    const amount = (String(money) + '00').padStart(12, '0');
    this.paymentRequestForm.controls['amount'].patchValue(amount);

    if (this.moneyForm.valid && Number(money) >= this.min && Number(money) <= this.max) {
      this.onInvalid = '';

      this.creditTopupService.getTopUpHashValue(this.paymentRequestForm.value).subscribe((result) => {
        this.paymentRequestForm.setValue(result);
        this.currentEventTarget.submit();
      });
    } else {
      if (Number(money) < this.min) this.onInvalid = `${this.translate.instant('Minimum amount to top up')} ฿${this.min}`;
      else if (Number(money) > this.max) this.onInvalid = `${this.translate.instant('Maximum amount to top up')} ฿${this.max}`;
      else this.onInvalid = 'Invalid format';
    }
  }

  initForm(): void {
    this.moneyForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    this.paymentRequestForm = this.formBuilder.group({
      version: [this.paymentSetting.version],
      order_id: [this.paymentSetting.order_id],
      merchant_id: [this.paymentSetting.merchant_id],
      payment_description: [this.paymentSetting.payment_description],
      currency: [this.paymentSetting.currency],
      amount: [this.paymentSetting.amount],
      result_url_1: [this.paymentSetting.returnurl],
      result_url_2: [this.paymentSetting.postbackurl],
      hash_value: [this.paymentSetting.hash_value],
      payment_option: [this.paymentSetting.payment_option],
      request_3ds: [this.paymentSetting.request_3ds],
      user_defined_1: [this.paymentSetting.user_defined_1],
      user_defined_2: [this.router.url === '/setting/owner' ? '' : this.router.url],
    });
  }

  avoidInputString(event: Event): void {
    const keyAs = (<KeyboardEvent>event).key;
    const pattern = /[0-9+\- ]/;
    if (!pattern.test(keyAs) && keyAs !== 'Enter') {
      event.preventDefault();
    }
  }
}
