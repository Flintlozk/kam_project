import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { getFormErrorMessages, resetForm } from '@reactor-room/cms-frontend-helpers-lib';
import { IValidationMessage } from '@reactor-room/cms-models-lib';
import { validationMessages } from './validation-messages';

interface IErrorMessageType {
  contentContentDataErrorMessage: string;
}

@Component({
  selector: 'cms-next-content-content-dialog',
  templateUrl: './content-content-dialog.component.html',
  styleUrls: ['./content-content-dialog.component.scss'],
})
export class ContentContentDialogComponent implements OnInit {
  contentContentForm: FormGroup;
  validationMessages = validationMessages as IValidationMessage[];
  formErrorMessageObj = {} as IErrorMessageType;

  constructor(private dialogRef: MatDialogRef<ContentContentDialogComponent>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contentContentForm = this.getContentContentForm();
  }

  getContentContentForm(): FormGroup {
    const contentContentFormGroup = this.fb.group({
      contentContentData: ['', Validators.required],
    }) as FormGroup;
    return contentContentFormGroup;
  }

  onCloseDialog(): void {
    this.dialogRef.close();
    resetForm(this.contentContentForm);
  }

  onConfirmDialog(): void {
    if (this.contentContentForm.valid) this.dialogRef.close(this.contentContentForm);
    else this.formErrorMessageObj = getFormErrorMessages<IErrorMessageType>(this.contentContentForm, this.validationMessages);
  }
}
