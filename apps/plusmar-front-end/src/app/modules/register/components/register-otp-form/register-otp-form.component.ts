import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RegisterService } from '@plusmar-front/services/register/register.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-register-otp-form',
  templateUrl: './register-otp-form.component.html',
  styleUrls: [],
})
export class RegisterOTPFormComponent implements OnInit, AfterViewInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChildren('formRow', { read: ElementRef }) rows: QueryList<ElementRef<HTMLInputElement>>;
  @Output() isBack = new EventEmitter<boolean>();
  @Output() isValidateOTPSuccess = new EventEmitter<boolean>();
  @Output() isResend = new EventEmitter<boolean>();
  @Input() phoneNumber: string;

  isInvalid = false;
  isDisabled = false;
  OTPForm: FormGroup;
  items: FormArray;
  constructor(public translate: TranslateService, private registerService: RegisterService, private formBuilder: FormBuilder) {}

  createItem(): FormGroup {
    return this.formBuilder.group({
      otp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
  }

  ngOnInit(): void {
    this.OTPForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem(), this.createItem(), this.createItem(), this.createItem()]),
    });
  }

  ngAfterViewInit(): void {
    this.rows.toArray()[0].nativeElement.focus();
  }

  back() {
    this.isBack.emit(true);
  }

  resend() {
    this.isResend.emit(true);
  }

  onSubmit() {
    if (!this.isDisabled) {
      this.isDisabled = true;
      const otp = this.OTPForm.value.items[0].otp + this.OTPForm.value.items[1].otp + this.OTPForm.value.items[2].otp + this.OTPForm.value.items[3].otp;
      this.verifyOTP(otp);
    }
  }

  verifyOTP(otp: string) {
    this.isValidateOTPSuccess.emit(false);
    this.registerService
      .validateOTP(this.phoneNumber, otp)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.isValidateOTPSuccess.emit(true);
        },
        (err) => {
          if (err) this.isInvalid = true;
          this.isValidateOTPSuccess.emit(false);
          this.isDisabled = false;
        },
      );
  }

  keyUpEvent(event, index) {
    if (event.keyCode === 13 && event.which === 13 && this.OTPForm.valid && !this.isDisabled) this.onSubmit();
    if (this.isInvalid) this.isInvalid = false;
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < 4) {
      this.rows.toArray()[pos].nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
