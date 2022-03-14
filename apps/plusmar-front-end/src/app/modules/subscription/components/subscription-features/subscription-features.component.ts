import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'reactor-room-subscription-features',
  templateUrl: './subscription-features.component.html',
  styleUrls: ['./subscription-features.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SubscriptionFeaturesComponent implements OnInit {
  tableData = [
    {
      stCol: 'แพ็กเกจ',
      ndCol: 'FREE',
      rdCol: 'BASIC',
      thCol: 'PRO',
    },
    {
      stCol: 'ราคาแพ็กเกจ',
      ndCol: '-',
      rdCol: '1,200 บาท/เดือน',
      thCol: '1,500 บาท/เดือน',
    },
    {
      stCol: 'จำนวนข้อความ',
      ndCol: '1,000 ข้อความ',
      rdCol: '15,000 ข้อความ',
      thCol: '35,000 ข้อความ',
    },
    {
      stCol: 'ราคาเฉลี่ยต่อข้อความ',
      ndCol: '-',
      rdCol: '0.08 บาท',
      thCol: '0.04 บาท',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
