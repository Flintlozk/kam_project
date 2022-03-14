import { IHeading } from '../../../../components/heading/heading.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-sale-channel',
  templateUrl: './sale-channel.component.html',
  styleUrls: ['./sale-channel.component.scss'],
})
export class SaleChannelComponent implements OnInit {
  heading: IHeading = {
    title: 'Sale Channel',
    subTitle: 'Dashboard / Sale Channel',
  };
  constructor() {}

  ngOnInit(): void {}
}
