import { Component, OnInit } from '@angular/core';
import { IHeading } from 'apps/cms-frontend/src/app/components/heading/heading.model';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'cms-next-low-stock-setting',
  templateUrl: './low-stock-setting.component.html',
  styleUrls: ['./low-stock-setting.component.scss'],
})
export class LowStockSettingComponent implements OnInit {
  darkModeFormControl = new FormControl(false);

  heading: IHeading = {
    title: 'Low Inventory',
    subTitle: 'E-Commerce / Low inventory',
  };

  constructor() {}

  ngOnInit(): void {}
}
