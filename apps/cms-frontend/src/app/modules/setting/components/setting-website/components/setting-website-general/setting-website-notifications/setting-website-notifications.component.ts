import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { EnumConfigGeneral } from '@reactor-room/cms-models-lib';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-next-setting-website-notifications',
  templateUrl: './setting-website-notifications.component.html',
  styleUrls: ['./setting-website-notifications.component.scss'],
})
export class SettingWebsiteNotificationsComponent implements OnInit, OnDestroy {
  notification: FormGroup;
  destroy$ = new Subject<void>();
  @Input() formGroup: FormGroup;
  @Output() formGroupChange = new EventEmitter<FormGroup>();
  @Output() readyToPatch: EventEmitter<{ name: string }> = new EventEmitter<{ name: string }>();
  constructor(private fb: FormBuilder) {}

  get getEmailStatus(): boolean {
    return this.notification.get('push_notifications.email.is_active').value;
  }
  get getEmails(): FormArray {
    return this.notification.get('push_notifications.email.emails') as FormArray;
  }
  get getEmailField(): FormControl {
    return this.notification.get('push_notifications.email.email_field') as FormControl;
  }
  get getEmailFieldValue(): string {
    return this.notification.get('push_notifications.email.email_field').value;
  }

  ngOnInit(): void {
    this.formCheck();
    this.formGroupChange.emit(this.formGroup);
  }
  formCheck(): void {
    const form = this.formGroup.get('notification') as FormGroup;
    if (_.isEmpty(form)) {
      this.generatePushNotificationsView();
      this.formGroup.addControl('notification', this.notification);
    } else {
      this.notification = form;
    }
    this.readyToPatch.emit({ name: EnumConfigGeneral.NOTIFICATION });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
  generatePushNotificationsView(): void {
    this.notification = this.fb.group({
      push_notifications: this.fb.group({
        line_notify: this.fb.group({
          is_active: [false],
          line_notify_token: [''],
        }),
        email: this.fb.group({
          is_active: [false],
          emails: [[]],
          email_field: ['', Validators.pattern('[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\\.[a-z]{2,3}')],
        }),
      }),
      activity: this.fb.group({
        new_order: [false],
        new_messages: [false],
        new_comments: [false],
        reject_order: [false],
        submit_form: [false],
        field_update: [false],
      }),
    });
  }
}
