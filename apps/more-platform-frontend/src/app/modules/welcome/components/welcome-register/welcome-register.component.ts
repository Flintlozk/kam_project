import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { getFormErrorMessages } from '@reactor-room/itopplus-front-end-helpers';
import { IValidationMessage } from '@reactor-room/model-lib';
import { validationMessages } from './validation-messages';
import { IErrorMessageType } from './validation-messages';
import { StatusDialogComponent } from '@reactor-room/itopplus-cdk';
import { StatusDialogModel, StatusDialogType } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'more-platform-welcome-register',
  templateUrl: './welcome-register.component.html',
  styleUrls: ['./welcome-register.component.scss'],
})
export class WelcomeRegisterComponent implements OnInit {
  registerForm: FormGroup;

  validationMessages = validationMessages as IValidationMessage[];
  formErrorMessageObj = {} as IErrorMessageType;

  passwordInstruction = 'Password should be at least 8 Characters including at least 1 Uppercase, 1 Lowercase, 1 Number & 1 Special Character!';

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.registerForm = this.getRegisterFormGroup();
  }
  setPasswordErrors(): void {
    const rePassword = this.registerForm.get('rePassword');
    const password = this.registerForm.get('password');
    if (password.value !== rePassword.value) {
      rePassword.setErrors({ mismatch: true });
    } else {
      rePassword.setErrors(null);
    }
  }

  onSignup(): void {
    this.setPasswordErrors();
    if (this.registerForm.valid) {
      this.dialog.open(StatusDialogComponent, {
        data: {
          type: StatusDialogType.WARNING,
          title: 'Warning!',
          content: 'Your session is over. Please Refesh the page!',
        } as StatusDialogModel,
      });
    } else {
      this.formErrorMessageObj = getFormErrorMessages<IErrorMessageType>(this.registerForm, this.validationMessages);
    }
  }

  getRegisterFormGroup(): FormGroup {
    const passwordPatern = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{8,}$';
    const registerFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordPatern)]],
      rePassword: ['', [Validators.required]],
    });
    return registerFormGroup;
  }
}
