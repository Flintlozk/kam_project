import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable()
export class LeadsCreateFormService {
  public leadCreadFormData: FormGroup = new FormGroup({});
  private leadCreateForm = new BehaviorSubject(this.leadCreadFormData);
  sharedLeadCreateForm = this.leadCreateForm.asObservable();

  constructor() {}

  updateLeadCreateForm(form: FormGroup) {
    this.leadCreateForm.next(form);
  }
}
