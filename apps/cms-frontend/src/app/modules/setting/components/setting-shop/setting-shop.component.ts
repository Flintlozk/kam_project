import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';
import { IHeading } from 'apps/cms-frontend/src/app/components/heading/heading.model';

@Component({
  selector: 'cms-next-shop-setting',
  templateUrl: './setting-shop.component.html',
  styleUrls: ['./setting-shop.component.scss'],
})
export class SettingShopComponent implements OnInit {
  heading: IHeading = {
    title: 'Shop Settings',
    subTitle: 'Settings / Shop Settings',
  };
  tabParams;
  theme = 'CMS';
  selectedIndex;
  INDEX = {
    owner: 0,
    payment: 1,
    logistics: 2,
    advanced_setting: 3,
  };
  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.params.subscribe(({ tab }) => {
      this.selectedIndex = tab ? this.INDEX[tab] : 0;
    });
  }
  handleIndexChange(newIndex) {
    const newRoute = ['/setting', 'shop', getKeyByValue(this.INDEX, newIndex)];
    void this.router.navigate(newRoute);
  }
}
