import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';
import { IHeading } from 'apps/cms-frontend/src/app/components/heading/heading.model';

@Component({
  selector: 'cms-next-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss'],
})
export class ContentManagementComponent implements OnInit {
  heading: IHeading = {
    title: 'Content Management',
    subTitle: 'Dashboard / Content Management',
  };

  INDEX = {
    content: 0,
    category: 1,
  };
  tabParams;
  btnExportStatus = false;
  RouteLinkEnum = RouteLinkEnum;
  selectedIndex;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ tab }) => {
      this.tabParams = tab;
    });
    this.selectedIndex = this.tabParams ? this.INDEX[this.tabParams] : 0;
  }
  handleIndexChange(newIndex) {
    const newRoute = ['/dashboard', 'content-management', getKeyByValue(this.INDEX, newIndex)];
    void this.router.navigate(newRoute);
  }
}
