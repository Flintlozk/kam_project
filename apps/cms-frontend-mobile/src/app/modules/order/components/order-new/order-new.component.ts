import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss'],
})
export class OrderNewComponent implements OnInit {
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
