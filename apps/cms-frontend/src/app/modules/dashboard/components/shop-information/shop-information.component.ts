import { IHeading } from '../../../../components/heading/heading.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-shop-information',
  templateUrl: './shop-information.component.html',
  styleUrls: ['./shop-information.component.scss'],
})
export class ShopInformationComponent implements OnInit {
  heading: IHeading = {
    title: 'Shopping Information',
    subTitle: 'Dashboard / Shopping Information',
  };
  constructor() {}

  ngOnInit(): void {}
}
