import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-order-finish',
  templateUrl: './order-finish.component.html',
  styleUrls: ['./order-finish.component.scss'],
})
export class OrderFinishComponent implements OnInit {
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
