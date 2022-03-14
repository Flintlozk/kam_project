import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CMSUserService } from '@reactor-room/cms-frontend-services-lib';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';
import { EnumPageMemberType } from '@reactor-room/itopplus-model-lib';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-setting-admin',
  templateUrl: './setting-admin.component.html',
  styleUrls: ['./setting-admin.component.scss'],
})
export class SettingAdminComponent implements OnInit {
  selectedIndex;
  heading: IHeading = {
    title: 'Admin Settings',
    subTitle: 'Settings / Admin Settings',
  };
  theme = 'CMS';
  role = 'STAFF';
  isAllowed = false;
  tabParams: string;
  INDEX = {
    admin: 0,
    log: 1,
  };
  constructor(private router: Router, private route: ActivatedRoute, private userService: CMSUserService) {}

  getRole(): void {
    this.userService.$userPageRole.subscribe((userRole) => {
      if (userRole !== EnumPageMemberType.STAFF) {
        this.isAllowed = true;
        this.role = userRole;
      }
    });
  }

  ngOnInit(): void {
    this.getRole();
    this.route.params.subscribe(({ tab }) => {
      this.tabParams = tab;
    });
    this.selectedIndex = this.tabParams ? this.INDEX[this.tabParams] : 0;
  }
  handleIndexChange(newIndex): void {
    if (newIndex === 0) {
      const newRoute = ['/setting', 'admin', 'admin'];
      void this.router.navigate(newRoute);
    } else {
      const newRoute = ['/setting', 'admin', 'log', 1];
      void this.router.navigate(newRoute);
    }
  }
}
