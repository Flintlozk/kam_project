import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'admin-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
  parentForm: FormGroup;
  @Input() controlName = 'expires_at';
  today = new Date();
  constructor(private parentFormDirective: FormGroupDirective, private form: FormBuilder) {}

  ngOnInit(): void {
    this.parentForm = this.parentFormDirective.form;
    const date = new Date();
    this.parentForm.addControl(this.controlName, new FormControl(new Date(date.setMonth(date.getMonth() + 5)), [Validators.required]));
  }
}
