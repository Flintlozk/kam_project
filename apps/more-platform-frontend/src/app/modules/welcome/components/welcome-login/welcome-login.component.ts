import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validationMessages } from './validation-messages';
import { IValidationMessage } from '@reactor-room/model-lib';
import { RouteLinkEnum } from '../../../../shares/route.model';
import { getFormErrorMessages } from '@reactor-room/itopplus-front-end-helpers';
import { IErrorMessageType } from './validation-messages';
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent } from '@reactor-room/itopplus-cdk';
import { StatusDialogModel, StatusDialogType } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'more-platform-welcome-login',
  templateUrl: './welcome-login.component.html',
  styleUrls: ['./welcome-login.component.scss'],
})
export class WelcomeLoginComponent implements OnInit {
  RouteLinkEnum = RouteLinkEnum;

  loginForm: FormGroup;

  validationMessages = validationMessages as IValidationMessage[];
  formErrorMessageObj = {} as IErrorMessageType;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loginForm = this.getLoginFormGroup();
  }

  getLoginFormGroup(): FormGroup {
    const loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      isRemember: [false],
    }) as FormGroup;
    return loginFormGroup;
  }

  onSignin(): void {
    if (this.loginForm.valid) {
      this.dialog.open(StatusDialogComponent, {
        data: {
          type: StatusDialogType.ERROR,
          title: 'Error!',
          content: 'Please recheck your email and/or password!',
        } as StatusDialogModel,
      });
    } else {
      this.formErrorMessageObj = getFormErrorMessages<IErrorMessageType>(this.loginForm, this.validationMessages);
    }
  }
}
