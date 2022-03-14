import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { EnumPageMemberType, IDashboardWidgets, IUserContext } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-total-customer-sla',
  templateUrl: './total-customer-sla.component.html',
  styleUrls: ['./total-customer-sla.component.scss'],
})
export class TotalCustomerSlaComponent implements OnInit {
  @Input() data: IDashboardWidgets;
  width = '150px';
  height = '150px';
  currentPageRole: EnumPageMemberType;
  constructor(public router: Router, public userService: UserService) {}

  ngOnInit(): void {
    this.getUserContext();

    if (window.innerWidth <= 768) {
      this.width = '100px';
      this.height = '100px';
    } else {
      this.width = '150px';
      this.height = '150px';
    }
  }

  getUserContext(): void {
    this.userService.$userContext.subscribe((res: IUserContext) => {
      const { pages } = res;
      const currentPageIndex = Number(getCookie('page_index'));
      this.currentPageRole = pages[currentPageIndex].pageRole;
    });
  }
  redirectToMainPage(): void {
    if (this.currentPageRole !== EnumPageMemberType.STAFF) void this.router.navigate(['customer-sla']);
  }
}
