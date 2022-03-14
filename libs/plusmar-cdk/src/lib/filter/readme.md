# Usage

In current version you need to pass userService which will get `startDate` for `All Time` option.

```html
<reactor-room-filter
  [isExportAvailable]="true"
  [yesterdayActive]="false"
  [searchActive]="true"
  [customActive]="true"
  (handleFilterUpdate)="handleFilterUpdate($event)"
  [allTimeStartGetService]="userService"
></reactor-room-filter>
```

```ts
  handleFilterUpdate(value): void {
    this.tableFilters = {
      ...this.tableFilters,
      endDate: dayjs(value.endDate).format('YYYY-MM-DD'),
      startDate: dayjs(value.startDate).format('YYYY-MM-DD'),
      search: value.search,
    };

    this.goToFirstPage(); // reset page to 1st
    this.getCustomerActivity(); // API call
  }
```
