import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { IFormLayout } from '../../modules/task/task.model';

@Component({
  selector: 'reactor-room-form-input-amount',
  templateUrl: './form-input-amount.component.html',
  styleUrls: ['./form-input-amount.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class FormInputAmountComponent implements OnInit, OnChanges {
  @Input() formControlInput: FormGroup;
  @Input() formLayout: IFormLayout[];
  @Input() editMode: boolean;
  @Input() updateMode: boolean;
  @Input() insertContactMode: boolean;
  @Output() saveContactCompany = new EventEmitter();
  @Output() updateContactCompany = new EventEmitter();
  @Output() cancelContactCompany = new EventEmitter();

  businessTypeOptions: string[];
  formContactDetail: FormGroup;
  formCompanyAddress: FormGroup;
  private formTask: FormGroup;
  constructor(private fb: FormBuilder, private parent: FormGroupDirective) {}

  ngOnInit(): void {
    this.formContactDetail = this.fb.group({
      name: [{ value: '', disabled: !this.editMode }, Validators.required],
      phoneNumber: [{ value: '', disabled: !this.editMode }],
      email: [{ value: '', disabled: !this.editMode }],
      primaryContact: [{ value: true, disabled: !this.editMode }, Validators.required],
      lineId: [{ value: '', disabled: !this.editMode }],
      position: [{ value: '', disabled: !this.editMode }],
    });
    this.formCompanyAddress = this.fb.group({
      postalcode: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
    });
    this.formTask = this.parent.form;
    this.formTask.addControl('formContactDetail', this.formContactDetail);
    this.formTask.addControl('formCompanyAddress', this.formCompanyAddress);
  }

  onInsertCompanyContact() {
    this.saveContactCompany.emit();
  }
  onUpdateCompanyContact() {
    this.updateContactCompany.emit();
  }
  onCancelCompanyContact() {
    this.cancelContactCompany.emit();
  }
  trackByIndex(index: number): number {
    return index;
  }

  ngOnChanges(): void {
    if (this.formContactDetail) {
      const formName = this.formContactDetail.get('name');
      const formPhoneNumber = this.formContactDetail.get('phoneNumber');
      const formEmail = this.formContactDetail.get('email');
      const formPrimaryContact = this.formContactDetail.get('primaryContact');
      const formLineId = this.formContactDetail.get('lineId');
      const formPosition = this.formContactDetail.get('position');
      if (this.editMode) {
        formName.enable();
        formPhoneNumber.enable();
        formEmail.enable();
        formPrimaryContact.enable();
        formLineId.enable();
        formPosition.enable();
      }
      if (!this.editMode) {
        formName.disable();
        formPhoneNumber.disable();
        formEmail.disable();
        formPrimaryContact.disable();
        formLineId.disable();
        formPosition.disable();
      }
    }
  }
}
