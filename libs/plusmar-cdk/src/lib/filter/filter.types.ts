export type Intervals = 'today' | 'yesterday' | 'last7days' | 'last14days' | 'last30days' | 'alltime' | 'custom' | 'nextYear';

export interface FilterEmits {
  search: string;
  customDropdown: string;
  endDate: string;
  interval: Intervals;
  startDate: string;
  initial?: boolean;
}

export interface Labels {
  exportAll: string;
  exportToExcel: string;
  customFilterLabel: string;
  customDropdownNestedLabel: string;
  searchPlaceholder: string;
  exportSelected: string;
  to: string;
  startDate: string;
  endDate: string;
  today: string;
  yesterday: string;
  last7days: string;
  last14days: string;
  last30days: string;
  lastYear: string;
  alltime: string;
  custom: string;
  nextYear: string;
}
