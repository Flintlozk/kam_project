import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export interface EmailTo {
  email: string;
}

@Component({
  selector: 'reactor-room-customer-service-send-email-dialog',
  templateUrl: './customer-service-send-email-dialog.component.html',
  styleUrls: ['./customer-service-send-email-dialog.component.scss'],
})
export class CustomerServiceSendEmailDialogComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  emailChips: EmailTo[] = [];

  emailForm: FormGroup;

  get emailToArray(): FormArray {
    return <FormArray>this.emailForm.get('emailTo');
  }

  emailUserData = [
    { imgUrl: 'assets/img/sample-account.png', name: 'Athena Edwards', email: 'abc1@abc.com' },
    { imgUrl: 'assets/img/sample-account.png', name: 'Athena Edwards', email: 'abc2@abc.com' },
    { imgUrl: 'assets/img/sample-account.png', name: 'Athena Edwards', email: 'abc3@abc.com' },
    { imgUrl: 'assets/img/sample-account.png', name: 'Athena Edwards', email: 'abc4@abc.com' },
    { imgUrl: 'assets/img/sample-account.png', name: 'Athena Edwards', email: 'abc5@abc.com' },
    { imgUrl: 'assets/img/sample-account.png', name: 'Athena Edwards', email: 'abc6@abc.com' },
  ];

  profileListStatus = false;

  constructor(private dialogRef: MatDialogRef<CustomerServiceSendEmailDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private leadFormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.emailForm = this.getEmailFromGroup();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSend() {
    this.dialogRef.close();
  }

  getEmailFromGroup(): FormGroup {
    const emailFromGroup = this.leadFormBuilder.group({
      emailTo: this.getEmailToFormArray(),
      emailSubject: ['', Validators.required],
      emailContent: ['', Validators.required],
    });
    return emailFromGroup;
  }

  getEmailToFormArray(): FormArray {
    const emailToFormArray = this.leadFormBuilder.array([]);
    return emailToFormArray;
  }

  addEmailChip(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.emailChips.push({ email: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEmailChip(email: EmailTo): void {
    const index = this.emailChips.indexOf(email);

    if (index >= 0) {
      this.emailChips.splice(index, 1);
    }
  }

  openProfileList() {
    this.profileListStatus = true;
  }
  clickOutsideEmailSendToEvent(event: boolean) {
    if (event) {
      this.profileListStatus = false;
    }
  }
  selectEmail(index: number) {
    const emailVal = this.emailUserData[index].email;
    if (emailVal) {
      this.emailChips.push({ email: emailVal });
    }
    this.profileListStatus = false;
  }
}
