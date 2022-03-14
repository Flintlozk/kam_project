import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';

@Component({
  selector: 'reactor-room-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportComponent {
  allTabData = { label: 'All', count: 70 };
  stepTabData = [
    { label: this.translate.instant('Follow'), count: 20, value: '฿3,404' },
    { label: this.translate.instant('Waiting for Payment'), count: 20, value: '฿3,404' },
    { label: this.translate.instant('Confirm Payment'), count: 20, value: '฿3,404' },
    { label: this.translate.instant('Waiting for Shipment'), count: 20, value: '฿3,404' },
    { label: this.translate.instant('Close Sales'), count: 20, value: '฿3,404' },
  ];
  statusTabData = [
    { label: this.translate.instant('Expired'), count: 20 },
    { label: this.translate.instant('Reject'), count: 2 },
  ];

  tableHeader: ITableHeader[] = [
    { sort: true, title: this.translate.instant('Order No'), key: null },
    { sort: true, title: this.translate.instant('Created At'), key: null },
    { sort: true, title: this.translate.instant('Customer'), key: null },
    { sort: true, title: this.translate.instant('Total'), key: null },
    { sort: true, title: this.translate.instant('Status'), key: null },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];

  tableData = [
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
    {
      orderNo: 'OR-0000000137',
      createdOrder: '22/06/2020 17:08',
      customerImgUrl: 'assets/img/sample-account.png',
      customerName: 'Ken Edwards',
      total: '฿590',
      status: 'Step 1: Follow',
      actionStatus: false,
    },
  ];

  moreMenuData = [
    {
      iconUrl: 'assets/img/purchase_order/order.png',
      iconUrlActive: 'assets/img/purchase_order/order-active.png',
      label: 'Order Info',
      status: true,
    },
    // {iconUrl:'assets/img/purchase_order/chat.png', iconUrlActive:'assets/img/purchase_order/chat-active.png', label:'Chat', status: true},
    {
      iconUrl: 'assets/img/purchase_order/tracking.png',
      iconUrlActive: 'assets/img/purchase_order/tracking-active.png',
      label: 'Tracking No.',
      status: false,
    },
    {
      iconUrl: 'assets/img/purchase_order/refund.png',
      iconUrlActive: 'assets/img/purchase_order/refund-active.png',
      label: 'Refund / Return Product',
      status: false,
    },
  ];

  constructor(public translate: TranslateService) {}

  clickMoreEvent(index: number) {
    for (let i = 0; i < this.tableData.length; i++) {
      if (i !== index) this.tableData[i].actionStatus = false;
    }
    this.tableData[index].actionStatus = !this.tableData[index].actionStatus;
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }
}
