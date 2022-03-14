import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
})
export class TrashComponent implements OnInit {
  heading: IHeading = {
    title: 'Trash',
    subTitle: 'Dashboard / Trash',
  };
  constructor() {}

  ngOnInit(): void {}
}
