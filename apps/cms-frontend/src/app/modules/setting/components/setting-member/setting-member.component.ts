import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-setting-member',
  templateUrl: './setting-member.component.html',
  styleUrls: ['./setting-member.component.scss'],
})
export class SettingMemberComponent implements OnInit {
  heading: IHeading = {
    title: 'Member Settings',
    subTitle: 'Settings / Member Settings',
  };
  constructor() {}

  ngOnInit(): void {}
}
