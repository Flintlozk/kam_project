import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';

@Component({
  selector: 'reactor-room-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PromotionsComponent implements OnInit {
  selectOptionData = [
    { id: 1, value: 'Promotion' },
    { id: 2, value: 'Promotion 2' },
    { id: 3, value: 'Promotion 3' },
    { id: 4, value: 'Promotion 4' },
  ];

  moreOptionData = [
    { imgUrl: 'assets/img/copy-icon.png', title: 'Copy Link' },
    { imgUrl: 'assets/img/trash-icon.svg', title: 'Delete' },
  ];

  promotionsDataTable = [
    {
      promotionTitle: 'Promotion - April 2020',
      promotionDetail: 'Buy 1 product, get coupon (JUNE2020)',
      promotionCoupon: 'C039442',
      startDate: '12/04/2020 00:00',
      endDate: '12/04/2020 00:00',
      status: 'Start in 3 days',
    },
    {
      promotionTitle: 'Promotion - April 2020',
      promotionDetail: 'Buy 1 product, get coupon (JUNE2020)',
      promotionCoupon: 'C039442',
      startDate: '12/04/2020 00:00',
      endDate: '12/04/2020 00:00',
      status: 'Start in 3 days',
    },
  ];

  tableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: 'Promotion', key: null },
    { sort: true, title: 'Coupon', key: null },
    { sort: true, title: 'Start date', key: null },
    { sort: true, title: 'End date', key: null },
    { sort: true, title: 'Status', key: null },
    { sort: false, title: 'Action', key: null },
  ];

  isAllchecked = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  selectAllHandler(isChecked: boolean): void {
    this.isAllchecked = isChecked;
  }
  trackBy(index: number, el: any): number {
    return el.id;
  }
}
