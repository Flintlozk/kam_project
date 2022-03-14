import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { debounceTime, filter, first, map, takeUntil } from 'rxjs/operators';
import { FilterService } from './filter.service';
import { Intervals } from './filter.types';
import { TranslateService } from '@ngx-translate/core';

import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { Subject } from 'rxjs';
import { isEmpty } from 'lodash';

const GET_VISIBILITY_FILTER = gql`
  query FilterForm {
    filterForm @client {
      interval
      startDate
      endDate
    }
  }
`;

const dates = {
  today: dayjs().format('YYYY-MM-DD'),
  yesterday: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
  last7days: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  last14days: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
  last30days: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  lastYear: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
  last5years: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
  nextYear: dayjs().add(1, 'year').format('YYYY-MM-DD'),
};

@Component({
  selector: 'reactor-room-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() yesterdayActive = true;
  @Input() isForExpireDate = false;
  @Input() customActive = false;
  @Input() searchActive = false;

  @Input() isDatePickerHidden = false;
  @Input() selectedCustomDropdownOption;

  // Export
  @Input() isExportAvailable = false;
  @Input() isOnlyExportAll = false;
  @Input() isExportSelectedDisabled = false;
  @Input() exportSelectedTotal;
  @Output() exportAllHandler = new Subject();
  @Output() exportSelectedHandler = new Subject();
  // Export
  @Input() reportPrintReceipt;
  @Input() reportPrintAllReceipt;

  @Input() customDropdown;
  @Input() customDropdownNested;
  @Input() defaultInterval: Intervals = 'last7days'; // set default selected
  @Input() allTimeOptionStart;
  @Input() isLabel = false;
  @Input() customFilterLabel = 'Filter by type';
  @Input() customDropdownNestedLabel = 'All';
  @Output() handleFilterUpdate: EventEmitter<any> = new EventEmitter();

  @Input() searchInput = '';
  searchField;
  filterForm: FormGroup;
  printingReport = false;
  defaultIntervals: {
    key: string;
    label;
    values: { startDate; endDate };
  }[];

  intervals;
  isCustom = false;
  today = dates.today;
  nextYear = dates.nextYear;

  destroy$ = new Subject();
  debounce = new Subject();

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService,
    public translate: TranslateService,
    private apollo: Apollo,
    private dateAdapter: DateAdapter<NativeDateAdapter>,
  ) {
    this.dateAdapter.setLocale(this.translate.currentLang);
    translate.onLangChange.asObservable().subscribe(({ lang }) => {
      this.setLabels();
      this.initIntervals();
      this.dateAdapter.setLocale(lang);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  setLabels(): void {
    this.defaultIntervals = [
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
    ];
  }

  ngOnInit(): void {
    this.setLabels();
    this.initIntervals();
    this.initForm();
    this.initDateFilter();
    this.getAllTimeStartDate();
    this.setChangesListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      const { selectedCustomDropdownOption, searchInput } = changes;
      if (selectedCustomDropdownOption?.currentValue && this.filterForm) {
        const newValue = selectedCustomDropdownOption?.currentValue?.value === 'ALL' ? null : selectedCustomDropdownOption?.currentValue?.value;
        this.filterForm.get('customDropdown').setValue(newValue);
      }
    }, 100);
  }

  initIntervals(): void {
    this.intervals = [
      ...this.defaultIntervals,
      {
        key: 'alltime',
        label: this.translate.instant('All time'),
        values: { startDate: this.allTimeOptionStart, endDate: dates.today },
      },
      { key: 'custom', label: this.translate.instant('Custom'), values: { startDate: dates.lastYear, endDate: dates.today } },
    ];
  }

  checkIsCustom(intervalName: string): boolean {
    const currentInterval = this.intervals.find((interval) => interval.key === intervalName);
    return !(
      currentInterval.values.startDate === dayjs(this.filterForm.value.startDate).format('YYYY-MM-DD') &&
      currentInterval.values.endDate === dayjs(this.filterForm.value.endDate).format('YYYY-MM-DD')
    );
  }

  getAllTimeStartDate(): void {
    this.getCreatedAtForCurrentPage();
  }

  getCreatedAtForCurrentPage(): void {
    this.filterService
      .getDateOfPageCreation()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.intervals.find((item) => item.key === 'alltime').values.startDate = dayjs(result.created_at).format('YYYY-MM-DD');
        },
        (err) => {
          console.log(err);
        },
      );
  }

  initDateFilter(): void {
    this.apollo
      .watchQuery<any>({
        query: GET_VISIBILITY_FILTER,
      })
      .valueChanges.pipe(
        map((result) => result.data && result.data.filterForm),
        filter((filterForm) => !!filterForm),
        first(),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (value) => {
          this.filterForm.patchValue(value);
        },
      });
  }
  initForm(): void {
    this.filterForm = this.fb.group({
      interval: [this.defaultInterval],
      startDate: [this.getSelectedInterval(this.defaultInterval).values.startDate],
      endDate: [this.getSelectedInterval(this.defaultInterval).values.endDate],
      ...(this.searchActive && { search: [this.searchInput] }),
      ...(this.customDropdown && { customDropdown: [this.selectedCustomDropdownOption?.value ?? null] }),
      ...(this.customDropdownNested && { customDropdownNested: [null] }),
    });
    if (!isEmpty(this.filterService.filterDate.value)) {
      this.handleFilterUpdate.emit(this.filterService.filterDate.value);
    } else {
      const emitValue = { ...this.filterForm.value, initial: true };
      this.handleFilterUpdate.emit(emitValue);
      this.filterService.setFilterDate(emitValue);
    }
  }

  setChangesListener(): void {
    this.filterForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((value) => {
      // reactive form changes
      this.isCustom = this.checkIsCustom(this.filterForm.value.interval);
      const startDate = dayjs(value.startDate);
      const endDate = dayjs(value.endDate);
      this.apollo.client.writeQuery({
        query: GET_VISIBILITY_FILTER,
        data: {
          filterForm: { ...value, startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD') },
        },
      });

      const emitValue = { ...value, startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD') };
      this.handleFilterUpdate.emit(emitValue);
      this.filterService.setFilterDate(emitValue);
    });
  }

  getSelectedInterval(intervalKey: Intervals) {
    const [result] = this.intervals.filter((item) => item.key === intervalKey);
    return result;
  }

  handleIntervalChange(e): void {
    this.filterForm.patchValue({
      startDate: dayjs(this.getSelectedInterval(e).values.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(this.getSelectedInterval(e).values.endDate).format('YYYY-MM-DD'),
    });

    if (e === 'custom') {
      setTimeout(() => {
        this.isCustom = true;
      }, 600);
    }
  }

  dateChanged(e): void {
    // handles dropdown autoselect if picker is changed
    const picker = e.target._formField._controlNonStatic.ngControl.name;
    const secondPicker = picker === 'startDate' ? 'endDate' : 'startDate';
    const found = this.intervals.find((interval) => {
      return interval.values[picker] === dayjs(e.value).format('YYYY-MM-DD') && interval.values[secondPicker] === dayjs(this.filterForm.value[secondPicker]).format('YYYY-MM-DD');
    })?.key;
    this.filterForm.patchValue({ interval: found || 'custom' });
  }
}
