import { Component, OnInit } from '@angular/core';
import { ISiteStatus, SiteStatusEnum, SiteStatusLabelEnum } from './site-info.model';

@Component({
  selector: 'cms-next-site-info',
  templateUrl: './site-info.component.html',
  styleUrls: ['./site-info.component.scss'],
})
export class SiteInfoComponent implements OnInit {
  siteTitle = "Powell's Site";

  siteStatusDropdown: ISiteStatus[] = [
    { value: SiteStatusEnum.PUBLISH, title: SiteStatusLabelEnum.PUBLISH },
    { value: SiteStatusEnum.UNPUBLISH, title: SiteStatusLabelEnum.UNPUBLISH },
  ];

  constructor() {}

  ngOnInit(): void {}
}
