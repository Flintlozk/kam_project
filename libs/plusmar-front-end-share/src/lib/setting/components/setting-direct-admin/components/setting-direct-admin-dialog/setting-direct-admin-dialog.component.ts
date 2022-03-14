import { Component, OnInit, Inject, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { validationMessages } from '../../admin.validation';
import { TranslateService } from '@ngx-translate/core';
import { EnumAuthScope, ThemeWithIPageMemberModelArray } from '@reactor-room/itopplus-model-lib';
@Component({
  selector: 'reactor-room-setting-direct-admin-dialog',
  templateUrl: './setting-direct-admin-dialog.component.html',
  styleUrls: ['./setting-direct-admin-dialog.component.scss'],
})
export class SettingDirectAdminDialogComponent implements OnInit, AfterViewChecked {
  themeType = EnumAuthScope;
  theme: string;
  addAdminForm: FormGroup;
  positionStatus = true;
  private validationMessages = validationMessages;
  emailValidationMessage: string;
  emailDuplicateMessage: string;
  isEmailDuplicate = false;

  positionData = [
    { positionId: '01', positionName: this.translate.instant('Staff') },
    { positionId: '02', positionName: this.translate.instant('Admin') },
  ];
  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<SettingDirectAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThemeWithIPageMemberModelArray,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.addAdminForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      position: [this.positionData[0].positionName, Validators.required],
    });
  }

  setPostion(index: number): void {
    this.addAdminForm.patchValue({
      position: this.positionData[index].positionName,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.addAdminForm.valid && !this.isEmailDuplicate) {
      this.dialogRef.close({
        addMember: {
          email: this.addAdminForm.value.email.toLowerCase(),
          position: this.addAdminForm.value.position,
        },
        isSave: true,
      });
    }
  }

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.addAdminForm.get(controlName);
    customerFormControl.valueChanges.pipe(debounceTime(800)).subscribe(() => this.setErrorMessage(customerFormControl, controlName));
  }

  ngAfterViewChecked(): void {
    this.theme = this.data.theme;
    const email = this.addAdminForm.value.email.toLowerCase();
    if (this.data) {
      const member = this.data.pageMemberModel.find((x) => x.email === email);
      if (member) {
        this.isEmailDuplicate = true;
        this.showErrorMessage('duplicate', this.translate.instant('The owner of this email already be a member of the page'));
      } else {
        this.isEmailDuplicate = false;
      }
    } else {
      this.isEmailDuplicate = false;
    }
    this.cdr.detectChanges();
  }

  setErrorMessage(c: AbstractControl, controlName: string): void {
    if (c.errors && (c.touched || c.dirty)) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');

      this.showErrorMessage(controlName, errorMessage);
    }
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    switch (controlName) {
      case 'email':
        this.emailValidationMessage = errorMessage;
        break;
      case 'duplicate':
        this.emailDuplicateMessage = errorMessage;
        break;
      default:
        break;
    }
  }
}
