import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RegisterService } from '@plusmar-front/services/register/register.service';
import { deleteCookie, PhoneNumberValidators } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-register-phone-number-form',
  templateUrl: './register-phone-number-form.component.html',
  styleUrls: [],
})
export class RegisterPhoneNumberFormComponent implements OnInit {
  @Output() submitPhoneNumber = new EventEmitter<string>();

  telForm: FormGroup;
  phoneNoValidationMessage: string;
  isInvalid = false;

  constructor(private leadFormBuilder: FormBuilder, public translate: TranslateService, private elm: ElementRef, private registerService: RegisterService) {}

  ngOnInit(): void {
    this.telForm = this.leadFormBuilder.group({
      phoneNumber: ['', PhoneNumberValidators.phoneInitial()],
    });
  }

  logout() {
    deleteCookie('access_token');
    setTimeout(() => {
      location.href = '/login';
    }, 500);
  }

  keyUpEvent(event) {
    if (this.isInvalid) this.isInvalid = false;
    if (event.keyCode === 13 && event.which === 13) this.onSubmit();
  }

  onSubmit() {
    if (this.telForm.valid) {
      this.submitPhoneNumber.emit(this.telForm.value.phoneNumber);
    } else {
      this.isInvalid = true;
    }
  }
}
