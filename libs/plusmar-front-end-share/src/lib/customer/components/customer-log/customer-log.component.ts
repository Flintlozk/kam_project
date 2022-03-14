import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'reactor-room-customer-log',
  templateUrl: './customer-log.component.html',
  styleUrls: ['./customer-log.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerLogComponent implements OnInit {
  @Input() customerId;
  tableData = [
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
    { Item: 'Click “Follow Customer” button', Event: 'Audience', Date: '01/01/2020 15:05:09' },
  ];

  tableHeader = [
    { sort: true, title: 'Items' },
    { sort: true, title: 'Event' },
    { sort: true, title: 'Date Time' },
  ];

  constructor() {}

  ngOnInit(): void {}

  trackBy(index: number, el: any): number {
    return el.id;
  }
}
