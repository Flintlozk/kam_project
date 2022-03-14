import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { getFormErrorMessages, resetForm } from '@reactor-room/itopplus-front-end-helpers';
import { IValidationMessage } from '@reactor-room/model-lib';
import { StatusDialogComponent } from '@reactor-room/itopplus-cdk';
import { StatusDialogModel, StatusDialogType } from '@reactor-room/itopplus-cdk';
import { IErrorMessageType, validationMessages } from './validation-messages';

@Component({
  selector: 'more-platform-welcome-forget-password',
  templateUrl: './welcome-forget-password.component.html',
  styleUrls: ['./welcome-forget-password.component.scss'],
})
export class WelcomeForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  validationMessages = validationMessages as IValidationMessage[];
  formErrorMessageObj = {} as IErrorMessageType;
  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.forgetPasswordForm = this.getForgetPasswordFormGroup();
  }

  getForgetPasswordFormGroup(): FormGroup {
    const forgetPasswordFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    }) as FormGroup;
    return forgetPasswordFormGroup;
  }

  onSendEmail(): void {
    if (this.forgetPasswordForm.valid) {
      this.dialog.open(StatusDialogComponent, {
        data: {
          type: StatusDialogType.SUCCESS,
          title: 'Success!',
          content: 'An Instruction email has been sent to ' + this.forgetPasswordForm.get('email').value + '!',
        } as StatusDialogModel,
      });
      resetForm(this.forgetPasswordForm);
    } else {
      this.formErrorMessageObj = getFormErrorMessages<IErrorMessageType>(this.forgetPasswordForm, this.validationMessages);
    }
  }
}
