import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-audience-details',
  templateUrl: './audience-details.component.html',
  styleUrls: ['./audience-details.component.scss'],
})
export class AudienceDetailsComponent implements OnInit {
  heading: IHeading = {
    title: 'Audience',
    subTitle: 'Dashboard / Audience',
  };
  constructor() {}

  ngOnInit(): void {}
}
