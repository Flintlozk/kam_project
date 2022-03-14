import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { IAudienceWithCustomer } from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'reactor-room-add-to-calendar',
  templateUrl: './add-to-calendar.component.html',
  styleUrls: ['./add-to-calendar.component.scss'],
})
export class AddToCalendarComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private fb: FormBuilder, private userService: UserService, private audienceService: AudienceService) {}
  @Input() chatBoxStatus: boolean;
  @Input() message;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Output() closeCalendar = new EventEmitter();
  @Input() audience: IAudienceWithCustomer;
  audienceID;
  window = window as unknown as { safari: any | undefined };
  calendarForm: FormGroup;
  customerName: string;
  minDate = dayjs(new Date()).toISOString();
  user_id;

  get title(): AbstractControl {
    return this.calendarForm.get('title');
  }
  get date(): AbstractControl {
    return this.calendarForm.get('date');
  }
  get time_start(): AbstractControl {
    return this.calendarForm.get('time_start');
  }
  get time_end(): AbstractControl {
    return this.calendarForm.get('time_end');
  }
  get customer(): AbstractControl {
    return this.calendarForm.get('customer');
  }
  get details(): AbstractControl {
    return this.calendarForm.get('details');
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
    this.getTitle();
    this.getDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.message?.currentValue || changes?.message?.currentValue === '') {
      this.initForm();
      this.getTitle();
      this.getDetails();
    }
  }

  getTitle(): void {
    this.audience?.name ? this.calendarForm.patchValue({ customer: this.audience.name, title: `Appointment with customer: ${this.audience.name}` }) : this.getCustomer();
  }

  getDetails(): void {
    this.calendarForm.patchValue({ details: this.message ? `Message: ${this.message}` : '' });
  }

  getCustomer(): void {
    this.audienceService
      .getCustomerByAudienceID(this.audienceID)
      .subscribe(({ first_name, last_name }) =>
        this.calendarForm.patchValue({ customer: `${first_name} ${last_name}`, title: `Appointment with customer: ${first_name} ${last_name}` }),
      );
  }

  initForm(): void {
    this.calendarForm = this.fb.group({
      title: ['', Validators.required],
      date: [dayjs().startOf('day').toISOString(), Validators.required],
      time_start: [dayjs(new Date()).add(1, 'h').format('HH:mm'), [Validators.required], [this.validateTimeStart]],
      time_end: [dayjs(new Date()).add(1, 'h').add(30, 'm').format('HH:mm'), Validators.required],
      customer: ['', [Validators.required]],
      details: [''],
    });
  }

  openDefaultSidebar(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.closeCalendar.emit();
  }

  validateAll(): void {
    Object.keys(this.calendarForm.controls).forEach((field) => {
      const control = this.calendarForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  validateTimeStart(control: AbstractControl): { [key: string]: any } | null {
    if (control?.value && control?.parent?.value?.time_end) {
      const [hStart, mStart] = control.value.split(':');
      const [hEnd, mEnd] = control.parent.value.time_end.split(':');

      const start = dayjs().hour(hStart).minute(mStart);
      const end = dayjs().hour(hEnd).minute(mEnd);

      if (dayjs(start).isAfter(end)) {
        return { timeStartIsBefore: true };
      }
    }
    return null;
  }

  getURLString(s): string {
    return s.replace(/ /g, '+');
  }

  getDateString(date: Date, time: string): string {
    const [h, m] = time.split(':');
    return dayjs(date).add(Number(h), 'h').add(Number(m), 'm').toISOString().replace(/-/g, '').replace(/\./g, '').replace(/:/g, '');
  }

  addToGoogle(): void {
    const { title, date, time_start, time_end, customer, details }: { date: Date; time_start: string; time_end: string; title: string; customer: string; details: string } =
      this.calendarForm.value;
    this.validateAll();
    if (this.calendarForm.valid) {
      const url = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${this.getURLString(title)}&dates=${this.getDateString(date, time_start)}/${this.getDateString(
        date,
        time_end,
      )}&details=${this.getURLString(details) ? this.getURLString(details) + '%0A' : ''}Customer:+${this.getURLString(customer)}`;
      window.open(url);
      // this.openDefaultSidebar();
    }
  }

  addAsICS(): void {
    const { title, date, time_start, time_end, customer, details }: { date: Date; time_start: string; time_end: string; title: string; customer: string; details: string } =
      this.calendarForm.value;
    const content = `
      BEGIN:VCALENDAR
      VERSION:2.0
      BEGIN:VEVENT
      URL:
      DTSTART:${this.getDateString(date, time_start)}
      DTEND:${this.getDateString(date, time_end)}
      SUMMARY:${title}
      DESCRIPTION:${details}\\nCustomer: ${customer}
      LOCATION:
      END:VEVENT
      END:VCALENDAR
    `;
    this.downloadICS(content);
  }

  downloadICS(content): void {
    const a = document.createElement('a');
    const file = new Blob([content], { type: 'content-type:text/calendar' });
    a.href = URL.createObjectURL(file);
    a.download = `plusmar-chat-event-${dayjs().format('YYYY-MM-DD')}.ics`;
    a.click();
  }

  getUser(): void {
    this.userService.$userContext.subscribe(({ id: user_id }) => {
      this.user_id = user_id;
    });
  }
}
