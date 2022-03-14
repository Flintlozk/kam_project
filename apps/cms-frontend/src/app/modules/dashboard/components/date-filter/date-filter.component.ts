import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '../../../../services/filter.service';
import * as dayjs from 'dayjs';

const dates = {
  today: dayjs().format('YYYY-MM-DD'),
  yesterday: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
  last7days: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  last14days: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
  last30days: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  last60days: dayjs().subtract(60, 'day').format('YYYY-MM-DD'),
  last6months: dayjs().subtract(180, 'days').format('YYYY-MM-DD'),
  lastYear: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
  last5years: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
  nextYear: dayjs().add(1, 'year').format('YYYY-MM-DD'),
};

@Component({
  selector: 'cms-next-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements OnInit {
  dateRangeForm: FormGroup;
  selectedOption: string;
  minDatePicker = dates.last6months;
  datePicker = [
    {
      key: 'today',
      label: this.translate.instant('Today'),
      values: { startDate: dates.today, endDate: dates.today },
    },
    {
      key: 'yesterday',
      label: this.translate.instant('Yesterday'),
      values: { startDate: dates.yesterday, endDate: dates.yesterday },
    },
    {
      key: 'last7days',
      label: this.translate.instant('Last 7 days'),
      values: { startDate: dates.last7days, endDate: dates.today },
    },

    {
      key: 'last14days',
      label: this.translate.instant('Last 14 days'),
      values: { startDate: dates.last14days, endDate: dates.today },
    },
    {
      key: 'last30days',
      label: this.translate.instant('Last 30 days'),
      values: { startDate: dates.last30days, endDate: dates.today },
    },
    {
      key: 'custom',
      //add thai and english
      label: this.translate.instant('Custom'),
      values: { startDate: dates.last60days, endDate: dates.today },
    },
  ];

  constructor(private fb: FormBuilder, public translate: TranslateService, public filterService: FilterService) {}

  ngOnInit(): void {
    this.selectedOption = this.datePicker[0].key;
    this.dateRangeForm = this.getDateRangeFormGroup();
    this.filterService.actionDateFilter.next({ startDate: this.dateRangeForm.value.start, endDate: this.dateRangeForm.value.end, dateRange: this.selectedOption });
  }
  getDateRangeFormGroup(): FormGroup {
    const dateRangeForm = this.fb.group({
      start: [dates.today, Validators.required],
      end: [dates.today, Validators.required],
    });
    return dateRangeForm;
  }

  listenOnDateChange() {
    const startDate = dayjs(this.dateRangeForm.value.start).format('YYYY-MM-DD');
    let endDate = dayjs(this.dateRangeForm.value.end).format('YYYY-MM-DD');
    if (endDate === 'Invalid Date') {
      endDate = startDate;
      this.dateRangeForm.setValue({
        start: startDate,
        end: endDate,
      });
      if (startDate === dayjs().format('YYYY-MM-DD')) {
        this.selectedOption = this.datePicker[0].key;
      } else {
        this.selectedOption = this.datePicker[5].key;
      }
      this.putDataToSubject(startDate, endDate, this.selectedOption);
    } else {
      const dayDifference = dayjs(startDate).diff(dates.today, 'day');
      switch (dayDifference) {
        case 0: {
          this.selectedOption = this.datePicker[0].key;
          this.putDataToSubject(startDate, endDate, this.selectedOption);
          break;
        }
        case -1: {
          this.selectedOption = this.datePicker[1].key;
          this.putDataToSubject(startDate, endDate, this.selectedOption);
          break;
        }
        case -7: {
          if (endDate === dates.today) this.selectedOption = this.datePicker[2].key;
          else this.selectedOption = this.datePicker[5].key;
          this.putDataToSubject(startDate, endDate, this.selectedOption);
          break;
        }
        case -14: {
          if (endDate === dates.today) this.selectedOption = this.datePicker[3].key;
          else this.selectedOption = this.datePicker[5].key;
          this.putDataToSubject(startDate, endDate, this.selectedOption);
          break;
        }
        case -30: {
          if (endDate === dates.today) this.selectedOption = this.datePicker[4].key;
          else this.selectedOption = this.datePicker[5].key;
          this.putDataToSubject(startDate, endDate, this.selectedOption);
          break;
        }
        default: {
          this.selectedOption = this.datePicker[5].key;
          this.putDataToSubject(startDate, endDate, this.selectedOption);
          break;
        }
      }
    }
  }
  putDataToSubject(startDate: string, endDate: string, dateRange: string) {
    this.filterService.actionDateFilter.next({ startDate: startDate, endDate: endDate, dateRange: dateRange });
  }
  optionSelected(event) {
    this.selectedOption = event.value;
    switch (this.selectedOption) {
      case 'yesterday': {
        this.dateRangeForm.setValue({
          start: dates.yesterday,
          end: dates.today,
        });
        const startDate = dayjs(this.dateRangeForm.value.start).format('YYYY-MM-DD');
        const endDate = dayjs(this.dateRangeForm.value.end).format('YYYY-MM-DD');
        this.putDataToSubject(startDate, endDate, 'yesterday');

        break;
      }
      case 'today': {
        this.dateRangeForm.setValue({
          start: dates.today,
          end: dates.today,
        });
        const startDate = dayjs(this.dateRangeForm.value.start).format('YYYY-MM-DD');
        const endDate = dayjs(this.dateRangeForm.value.end).format('YYYY-MM-DD');
        this.putDataToSubject(startDate, endDate, 'today');

        break;
      }
      case 'last7days': {
        this.dateRangeForm.setValue({
          start: dates.last7days,
          end: dates.today,
        });
        const startDate = dayjs(this.dateRangeForm.value.start).format('YYYY-MM-DD');
        const endDate = dayjs(this.dateRangeForm.value.end).format('YYYY-MM-DD');
        this.putDataToSubject(startDate, endDate, 'last7days');

        break;
      }
      case 'last14days': {
        this.dateRangeForm.setValue({
          start: dates.last14days,
          end: dates.today,
        });
        const startDate = dayjs(this.dateRangeForm.value.start).format('YYYY-MM-DD');
        const endDate = dayjs(this.dateRangeForm.value.end).format('YYYY-MM-DD');
        this.putDataToSubject(startDate, endDate, 'last14days');

        break;
      }
      case 'last30days': {
        this.dateRangeForm.setValue({
          start: dates.last30days,
          end: dates.today,
        });
        const startDate = dayjs(this.dateRangeForm.value.start).format('YYYY-MM-DD');
        const endDate = dayjs(this.dateRangeForm.value.end).format('YYYY-MM-DD');
        this.putDataToSubject(startDate, endDate, 'last30days');

        break;
      }
      case 'custom': {
        this.dateRangeForm.setValue({
          start: dates.last60days,
          end: dates.today,
        });
        const startDate = dayjs(this.dateRangeForm.value.start).format('YYYY-MM-DD');
        const endDate = dayjs(this.dateRangeForm.value.end).format('YYYY-MM-DD');
        this.putDataToSubject(startDate, endDate, 'custom');
        break;
      }
    }
  }
}
