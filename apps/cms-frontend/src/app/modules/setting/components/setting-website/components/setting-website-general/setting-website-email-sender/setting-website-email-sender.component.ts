import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { EnumConfigGeneral } from '@reactor-room/cms-models-lib';
@Component({
  selector: 'cms-next-setting-website-email-sender',
  templateUrl: './setting-website-email-sender.component.html',
  styleUrls: ['./setting-website-email-sender.component.scss'],
})
export class SettingWebsiteEmailSenderComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Output() formGroupChange = new EventEmitter<any>();
  @Output() readyToPatch: EventEmitter<{ name: string }> = new EventEmitter<{ name: string }>();
  email_sender_name: FormControl;
  destroy$ = new Subject<void>();
  constructor() {}

  ngOnInit(): void {
    this.formCheck();
  }
  formCheck(): void {
    const form = this.formGroup.get('email_sender_name') as FormControl;
    if (_.isEmpty(form)) {
      this.email_sender_name = new FormControl('');
      this.formGroup.addControl('email_sender_name', this.email_sender_name);
    } else {
      this.email_sender_name = form;
    }
    this.readyToPatch.emit({ name: EnumConfigGeneral.EMAIL_SENDER });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
