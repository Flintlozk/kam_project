import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss'],
})
export class OrderPaymentComponent implements OnInit {
  orderNewData = [
    {
      date: 'Sep 7, 2020',
      details: [
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
      ],
    },
    {
      date: 'Sep 7, 2020',
      details: [
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
      ],
    },
    {
      date: 'Sep 7, 2020',
      details: [
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
        {
          imgUrl: null,
          fullName: 'Jimmy Sone',
          orderCode: 'OR-000233',
          hhmm: '20:39',
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
  trackByIndex(index: number): number {
    return index;
  }
}
