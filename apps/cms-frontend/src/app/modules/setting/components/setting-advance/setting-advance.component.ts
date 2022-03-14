import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-setting-advance',
  templateUrl: './setting-advance.component.html',
  styleUrls: ['./setting-advance.component.scss'],
})
export class SettingAdvanceComponent implements OnInit {
  heading: IHeading = {
    title: 'Advanced Settings',
    subTitle: 'Settings / Advanced Settings',
  };
  constructor() {}

  ngOnInit(): void {}
}
