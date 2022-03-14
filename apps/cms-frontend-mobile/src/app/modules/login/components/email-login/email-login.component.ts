import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { getFormErrorMessages } from '@reactor-room/cms-frontend-helpers-lib';
import { IValidationMessage } from '@reactor-room/cms-models-lib';
import { validationMessages } from './validation-messages';

interface IErrorMessageType {
  emailErrorMessage: string;
  passwordErrorMessage: string;
}

@Component({
  selector: 'cms-next-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {
  loginForm: FormGroup;
  validationMessages = validationMessages as IValidationMessage[];
  formErrorMessageObj = {} as IErrorMessageType;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initLoginEmailForm();
  }

  initLoginEmailForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  loginSubmit(): void {
    try {
      if (this.loginForm.valid) {
      } else {
        this.formErrorMessageObj = getFormErrorMessages<IErrorMessageType>(this.loginForm, this.validationMessages);
      }
    } catch (err) {}
  }
}
