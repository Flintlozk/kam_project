import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dateFormatter } from '@reactor-room/cms-frontend-helpers-lib';
import { IDatePickerModel } from '@reactor-room/cms-models-lib';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-home-date-picker',
  templateUrl: './home-date-picker.component.html',
  styleUrls: ['./home-date-picker.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class HomeDatePickerComponent implements OnInit {
  dateRangeForm: FormGroup;

  dateRangeFormStart: string;
  dateRangeFormEnd: string;

  dateTabData = [
    {
      status: true,
      label: 'All',
      value: 'all',
    },
    {
      status: false,
      label: 'Last 30 days',
      value: 'last30',
    },
    {
      status: false,
      label: 'Yesterday',
      value: 'yesterday',
    },
  ] as IDatePickerModel[];

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.dateRangeForm = this.getDateRangeFormGroup() as FormGroup;
    this.dateRangeForm.get('start').valueChanges.subscribe((start) => {
      this.dateRangeFormStart = dateFormatter(start).toString();
    });
    this.dateRangeForm.get('end').valueChanges.subscribe((end) => {
      this.dateRangeFormEnd = dateFormatter(end).toString();
    });
  }

  onSelectDateTabDataItem(index: number): void {
    this.dateTabData.forEach((item) => {
      item.status = false;
    });
    this.dateTabData[index].status = true;
  }

  getDateRangeFormGroup(): FormGroup {
    const dateRangeForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
    return dateRangeForm;
  }

  clearDataRangeData(): void {
    this.dateRangeForm.get('start').patchValue('');
    this.dateRangeForm.get('end').patchValue('');
  }
  trackByIndex(index: number): number {
    return index;
  }
}
