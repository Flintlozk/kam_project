import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { RadioFields } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent implements OnInit {
  @Input() buttons: RadioFields[];
  parentForm: FormGroup;
  @Input() defaultState: boolean;
  @Input() controlName = 'use-company-address';

  constructor(private pFD: FormGroupDirective) {}

  ngOnInit(): void {
    this.parentForm = this.pFD.form;
    this.parentForm.addControl(this.controlName, new FormControl(this.defaultState, [Validators.required]));
  }
}
