import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDetailComponent } from './task-detail.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormInputAmountModule } from '../form-input-amount/form-input-amount.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DealFormDetailModule } from '../deal-form-detail/deal-form-detail.module';
import { AssignFormModule } from '../assign-form/assign-form.module';
import { FormAppointmentModule } from '../form-appointment/form-appointment.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { ModalConfirmDeleteModule } from '../modal-confirm-delete/modal-confirm-delete.module';
import { FormAdditionAccountExcecutiveModule } from '../form-addition-account-excecutive/form-addition-account-excecutive.module';
import { FormStartEndDateModule } from '../form-start-end-date/form-start-end-date.module';
import { FormCreateDealModule } from '../form-create-deal/form-create-deal.module';

@NgModule({
  declarations: [TaskDetailComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatBadgeModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule,
    MatDatepickerModule,
    FormInputAmountModule,
    MatMenuModule,
    MatTooltipModule,
    MatAutocompleteModule,
    AssignFormModule,
    DealFormDetailModule,
    FormAppointmentModule,
    MatIconModule,
    TranslateModule,
    MatSelectModule,
    TimeAgoPipeModule,
    ModalConfirmDeleteModule,
    FormAdditionAccountExcecutiveModule,
    FormStartEndDateModule,
    FormCreateDealModule,
  ],
  exports: [TaskDetailComponent],
})
export class TaskDetailModule {}
