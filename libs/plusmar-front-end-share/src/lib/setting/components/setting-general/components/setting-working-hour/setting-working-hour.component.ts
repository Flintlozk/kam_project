import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { convertTimeWithTz, isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { fadeInOutFasterAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { IPageWorkingHoursOptionDates, IPageWorkingHoursOptions, IPageWorkingHoursOptionTimes, PageSettingType } from '@reactor-room/itopplus-model-lib';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

enum Days {
  sunday = 'sunday',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
}

@Component({
  selector: 'reactor-room-setting-working-hour',
  templateUrl: './setting-working-hour.component.html',
  styleUrls: ['./setting-working-hour.component.scss'],
  animations: [fadeInOutFasterAnimation],
})
export class SettingWorkingHourComponent implements OnInit {
  settingType = PageSettingType.WORKING_HOURS;
  @Input() isAllowed: boolean;
  @Input() isEnabled = false;
  days = Days;

  destroy$: Subject<void> = new Subject<void>();

  isAlert = false;

  dates = [
    { origin: 'sunday', name: 'Sunday' },
    { origin: 'monday', name: 'Monday' },
    { origin: 'tuesday', name: 'Tuesday' },
    { origin: 'wednesday', name: 'Wednesday' },
    { origin: 'thursday', name: 'Thursday' },
    { origin: 'friday', name: 'Friday' },
    { origin: 'saturday', name: 'Saturday' },
  ];

  dropDownList = [] as { value: Date; allow: boolean }[];
  showTimepickerStartAt = null;
  showTimepickerEndAt = null;
  workingForm: FormGroup;
  defaultTimesGroup = this.fromBuilder.group({
    openTime: dayjs().set('hour', 9).set('minute', 0).toDate(),
    closeTime: dayjs().set('hour', 17).set('minute', 0).toDate(),
  });

  constructor(
    private toastr: ToastrService,
    private matDialog: MatDialog,
    public layoutCommonService: LayoutCommonService,
    private settingService: SettingsService,
    private fromBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initDropDownSelection();
    this.initForm();
  }

  getDefaultOffTimeMessage(): void {
    this.workingForm.controls['offTime']
      .get('message')
      .setValue(
        'ระบบอัตโนมัติ : ขณะนี้อยู่นอกเวลาทำการ ระบบจะทำการแจ้งเตือนไปยังพนักงานที่ดูแลลูกค้า หรือฝากข้อความไว้ที่นี่ เพื่อให้พนักงานติดต่อกลับภายหลัง ขออภัย ในความไม่สะดวก',
      );
  }

  initDropDownSelection(): void {
    for (let i = 0; i < 24; i += 1) {
      const day = dayjs().set('second', 0).set('millisecond', 0);
      const anHour = day.set('hour', i).set('minute', 0).toDate();
      this.dropDownList.push({ value: anHour, allow: true });
      const halfHour = day.set('hour', i).set('minute', 30).toDate();
      this.dropDownList.push({ value: halfHour, allow: true });
    }
  }

  get getOffTimeControl(): AbstractControl {
    return <FormGroup>this.workingForm.get('offTime');
  }

  initForm(): void {
    this.workingForm = this.fromBuilder.group({
      offTime: this.fromBuilder.group({
        isActive: [false, Validators.required],
        message: ['', Validators.required],
        attachment: [null],
      }),
      additional: this.fromBuilder.group({
        isActive: [false, Validators.required],
        time: [0, Validators.required],
      }),
      notifyList: this.fromBuilder.group({
        isActive: [false, Validators.required],
        emails: this.fromBuilder.array([]),
      }),
      sunday: this.fromBuilder.group({
        isActive: [true, Validators.required],
        allTimes: [true, Validators.required],
        times: this.fromBuilder.array([]),
      }),
      monday: this.fromBuilder.group({
        isActive: [false, Validators.required],
        allTimes: [false, Validators.required],
        times: this.fromBuilder.array([]),
      }),
      tuesday: this.fromBuilder.group({
        isActive: [true, Validators.required],
        allTimes: [false, Validators.required],
        times: this.fromBuilder.array([]),
      }),
      wednesday: this.fromBuilder.group({
        isActive: [true, Validators.required],
        allTimes: [false, Validators.required],
        times: this.fromBuilder.array([]),
      }),
      thursday: this.fromBuilder.group({
        isActive: [true, Validators.required],
        allTimes: [false, Validators.required],
        times: this.fromBuilder.array([]),
      }),
      friday: this.fromBuilder.group({
        isActive: [true, Validators.required],
        allTimes: [false, Validators.required],
        times: this.fromBuilder.array([]),
      }),
      saturday: this.fromBuilder.group({
        isActive: [true, Validators.required],
        allTimes: [false, Validators.required],
        times: this.fromBuilder.array([]),
      }),
    });

    this.getSettingWorkingHours();
  }

  getSettingWorkingHours(): void {
    this.settingService
      .getPageSetting(this.settingType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          const configs = <IPageWorkingHoursOptions>val.options;
          this.mapDateData(configs);
        }
      });
  }

  isAfterMinDate(current: Date, min: Date): boolean {
    if (!current) return true;
    if (!min) return false;
    const compare = dayjs().set('hour', dayjs(min).get('hour')).set('minute', dayjs(min).get('minute')).set('second', 0);
    return dayjs(current).isAfter(compare);
  }

  isBeforeMaxDate(current: Date, max: Date): boolean {
    if (!current) return true;
    if (!max) return true;
    const compare = dayjs().set('hour', dayjs(max).get('hour')).set('minute', dayjs(max).get('minute')).set('second', 0);
    return dayjs(current).isBefore(compare);
  }

  isBeforeNextOpenTime(current: Date, dateOrigin: string, formIndex: number): boolean {
    const nextRange = this.workingForm.controls[dateOrigin]?.get('times')['controls'][formIndex + 1]?.get('openTime').value;
    if (!nextRange) return true;
    const compare = dayjs().set('hour', dayjs(nextRange).get('hour')).set('minute', dayjs(nextRange).get('minute')).set('second', 0);
    return dayjs(current).isBefore(compare);
  }
  isAfterPreviousCloseTime(current: Date, dateOrigin: string, formIndex: number): boolean {
    const previousRange = this.workingForm.controls[dateOrigin]?.get('times')['controls'][formIndex - 1]?.get('closeTime').value;
    if (!previousRange) return true;
    const compare = dayjs().set('hour', dayjs(previousRange).get('hour')).set('minute', dayjs(previousRange).get('minute')).set('second', 0);
    return dayjs(current).isAfter(compare);
  }

  closeTimerPicker(isClose: boolean, isStart: boolean): void {
    if (isClose) {
      if (isStart) {
        this.showTimepickerStartAt = null;
      } else {
        this.showTimepickerEndAt = null;
      }
    }
  }

  toggleDropDownAndFocused(dateOrigin: string, formIndex: number, isStart: boolean): void {
    if (isStart) {
      this.showTimepickerStartAt = dateOrigin + formIndex;
    } else {
      this.showTimepickerEndAt = dateOrigin + formIndex;
    }
  }

  mapDateData(configs: IPageWorkingHoursOptions): void {
    this.workingForm.controls['offTime'].patchValue(configs.offTime);
    this.workingForm.controls['additional'].patchValue(configs.additional);

    if (configs.notifyList !== null) {
      // Migration setting on nonexist value
      this.workingForm.controls['notifyList'].patchValue(configs.notifyList);
    }

    const notifyFormControl = this.getNotifyListController();
    const emails = configs.notifyList?.emails;

    if (emails && emails.length > 0) {
      for (const email of emails) {
        (<FormArray>notifyFormControl.get('emails')).push(this.fromBuilder.group({ email: email.email }));
      }
    }

    for (const date of this.dates) {
      const config = configs[date.origin] as IPageWorkingHoursOptionDates;
      const dateFromControl = this.getDayController(date.origin);
      dateFromControl.get('isActive').setValue(config.isActive);
      dateFromControl.get('allTimes').setValue(config.allTimes);

      config.times.map((time: IPageWorkingHoursOptionTimes) => {
        const openTimeString = convertTimeWithTz(new Date(time.openTime));
        const closeTimeString = convertTimeWithTz(new Date(time.closeTime));
        (<FormArray>dateFromControl.get('times')).push(
          this.fromBuilder.group({
            openTime: [time.openTime, Validators.required],
            openTimeString: [openTimeString, Validators.required],
            closeTime: [time.closeTime, Validators.required],
            closeTimeString: [closeTimeString, Validators.required],
          }),
        );
        return time;
      });
    }
  }

  getDayController(dateOrigin: string): AbstractControl {
    return this.workingForm.controls[dateOrigin];
  }
  getNotifyListController(): AbstractControl {
    return this.workingForm.controls['notifyList'];
  }
  getTimeOfDay(dateOrigin: string): AbstractControl[] {
    return this.workingForm.controls[dateOrigin].get('times')['controls'];
  }
  getControlOfTimeByIndex(dateOrigin: string, index: number): AbstractControl {
    return (<FormArray>this.workingForm.controls[dateOrigin].get('times')).at(index);
  }

  setValueToDateForm(dateOrigin: string, formIndex: number, propertyName: string, value: Date): void {
    const targetFormArray = this.getControlOfTimeByIndex(dateOrigin, formIndex);
    const formControl = targetFormArray.get(propertyName);
    const formControlString = targetFormArray.get(propertyName === 'openTime' ? 'openTimeString' : 'closeTimeString');
    formControl.patchValue(value);
    formControlString.patchValue(convertTimeWithTz(value));

    this.showTimepickerStartAt = null;
    this.showTimepickerEndAt = null;

    this.cdr.detectChanges();
    this.workingForm.markAsDirty();
  }

  addNewDateRange(dateOrigin: Days): void {
    const currentFormArray = <FormArray>this.workingForm.controls[dateOrigin].get('times');
    const newTimeGroups = this.fromBuilder.group({
      openTime: [null, Validators.required],
      openTimeString: [null, Validators.required],
      closeTime: [null, Validators.required],
      closeTimeString: [null, Validators.required],
    });

    currentFormArray.push(newTimeGroups);
    this.cdr.detectChanges();
    this.workingForm.markAsDirty();
  }

  removeDateRange(dateOrigin: Days, index: number): void {
    (<FormArray>this.workingForm.controls[dateOrigin].get('times')).removeAt(index);
    this.workingForm.markAsDirty();
    this.cdr.detectChanges();
  }

  addNotifyListEmail(email: string): void {
    this.workingForm.markAsDirty();
    const notifyFormControl = this.getNotifyListController();
    const form = this.fromBuilder.group({ email: email });
    (<FormArray>notifyFormControl.get('emails')).push(form);
    this.cdr.detectChanges();
  }
  removeNotifyListEmail(index: number): void {
    this.workingForm.markAsDirty();
    const notifyFormControl = this.getNotifyListController();
    (<FormArray>notifyFormControl.get('emails')).removeAt(index);
    this.cdr.detectChanges();
  }

  toggleFeature(): void {
    this.layoutCommonService.startLoading();
    this.settingService.togglePageSetting(this.isEnabled, this.settingType).subscribe(
      () => {
        this.layoutCommonService.endLoading();
        this.toastr.success(this.isEnabled ? 'Enabled' : 'Disabled', 'Working hours', { positionClass: 'toast-bottom-right' });
      },
      () => {
        this.layoutCommonService.endLoading();
        this.toastr.error('Please try again', 'Working hours', { positionClass: 'toast-bottom-right' });
      },
    );
  }

  saveSetting(): void {
    this.isAlert = !this.workingForm.valid;
    if (this.workingForm.dirty) {
      if (this.workingForm.valid) {
        const value = this.workingForm.value as IPageWorkingHoursOptions;
        this.layoutCommonService.startLoading();
        const params = {
          ...value,
          additional: {
            isActive: value.additional.isActive,
            time: Number(value.additional.time),
          },
        } as IPageWorkingHoursOptions;

        this.settingService
          .setWorkingHour(params)
          .pipe(
            finalize(() => {
              this.layoutCommonService.endLoading();
            }),
          )
          .subscribe(
            () => {
              this.openDialog();
              this.workingForm.markAsPristine();
            },
            (err) => {
              console.log('save working hour error ', err);
            },
          );
      } else {
        this.toastr.error('Some field is invalid, Please try again.', 'Working hours', { positionClass: 'toast-bottom-right' });
      }
    }
  }

  openDialog(): void {
    this.matDialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '422px',
      data: {
        title: 'Saved Successfully !',
        text: 'Data have been saved successfully…',
      },
    });
  }
}
