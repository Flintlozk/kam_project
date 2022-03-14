import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { CrudType } from '@reactor-room/crm-models-lib';
import { getUTCDateFromString } from '@reactor-room/itopplus-front-end-helpers';
import { IAppointmentTask } from '../../modules/task/task.model';

@Component({
  selector: 'reactor-room-form-appointment',
  templateUrl: './form-appointment.component.html',
  styleUrls: ['./form-appointment.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class FormAppointmentComponent implements OnInit {
  @ViewChild('startDatepicker') startDatepicker: ElementRef;
  @ViewChild('endDatepicker') endDatepicker: ElementRef;
  @Input() appointmentTask: IAppointmentTask[];
  @Input() displayDatePicker: boolean;
  @Output() addAppointment = new EventEmitter<FormGroup>();
  @Output() editAppointment = new EventEmitter<FormGroup>();
  @Output() deleteAppointment = new EventEmitter<IAppointmentTask>();
  @Output() openAppointment = new EventEmitter<string>();
  appointmentOnEdit: IAppointmentTask;
  appointmentDate: FormGroup;
  primaryDisplayAppointment = 3;
  disableIndex = -1;
  actionType: string;
  public minDate: Date;
  constructor() {}
  displayMoreComment = false;
  public appointMentFormGroup = new FormGroup({
    startDateControl: new FormControl(null, [Validators.required]),
    endDateControl: new FormControl(null, [Validators.required]),
    appointmentNote: new FormControl(null, [Validators.required]),
    uuidAppointment: new FormControl(null),
  });

  ngOnInit(): void {
    const now = new Date();
    this.minDate = new Date();
    this.minDate.setDate(now.getDate());
  }
  trackByIndex(index: number): number {
    return index;
  }
  onAddAppointment(): void {
    this.addAppointment.emit(this.appointMentFormGroup);
  }
  onDeleteAppointment(appointment: IAppointmentTask): void {
    this.deleteAppointment.emit(appointment);
  }
  onAppointment(): void {
    this.appointMentFormGroup.patchValue({
      startDateControl: null,
      endDateControl: null,
      appointmentNote: '',
    });
    this.openAppointment.emit();
  }
  onClickUndoEditAppointment(): void {
    this.actionType = CrudType.NONE;
    this.disableIndex = -1;
  }
  onClickEdit(appoinment: IAppointmentTask, index: number) {
    this.disableIndex = index;
    this.actionType = CrudType.EDIT;
    this.appointmentOnEdit = appoinment;
    this.appointMentFormGroup.patchValue({
      startDateControl: appoinment.appointmentStartDate,
      endDateControl: appoinment.appointmentEndDate,
      appointmentNote: appoinment.note,
      uuidAppointment: appoinment.uuidAppointment,
    });
  }
  onEditAppointment(): void {
    this.appointmentTask.forEach((appointment) => {
      if (appointment === this.appointmentOnEdit) {
        appointment.appointmentStartDate = getUTCDateFromString(this.appointMentFormGroup.value.startDateControl.toLocaleString());
        appointment.appointmentEndDate = getUTCDateFromString(this.appointMentFormGroup.value.endDateControl.toLocaleString());
        appointment.note = this.appointMentFormGroup.value.appointmentNote;
      }
    });
    this.actionType = CrudType.NONE;
    this.disableIndex = -1;
    this.editAppointment.emit(this.appointMentFormGroup);
  }
}
