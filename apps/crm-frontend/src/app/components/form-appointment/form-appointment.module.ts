import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAppointmentComponent } from './form-appointment.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatTimepickerModule, NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
@NgModule({
  declarations: [FormAppointmentComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    TimeAgoPipeModule,
    MatTooltipModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
  ],
  exports: [FormAppointmentComponent],
})
export class FormAppointmentModule {}
