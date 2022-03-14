import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-active-user',
  templateUrl: './active-user.component.html',
  styleUrls: ['./active-user.component.scss'],
})
export class ActiveUserComponent implements OnInit {
  heading: IHeading = {
    title: 'Active User',
    subTitle: 'Dashboard / Active User',
  };
  constructor() {}

  ngOnInit(): void {}
}
