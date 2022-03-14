import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { deleteCookie, getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { groupBy } from 'lodash';
import { FlowConfigService } from '../../modules/flow-config/services/flow-config.service';

@Component({
  selector: 'reactor-room-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss'],
})
export class SidebarNavComponent implements OnInit {
  groupWorkflows = [];
  groupByWorkflows;
  profilePic: string;
  ownerPic: string;
  constructor(public router: Router, private flowConfigService: FlowConfigService) {}

  ngOnInit(): void {
    this.flowConfigService.getWorkFlowUser().subscribe((userWorkFlows) => {
      this.groupByWorkflows = groupBy(userWorkFlows, 'workflowNameGroup');
      Object.keys(this.groupByWorkflows).forEach((groupWorkflow) => {
        const workflowMenu = {
          workflows: this.groupByWorkflows[groupWorkflow],
          groupName: groupWorkflow,
        };
        this.groupWorkflows.push(workflowMenu);
      });
    });
    this.profilePic = getCookie('profile_pic_url');
    this.ownerPic = getCookie('owner_pic_url');
  }
  onLogout() {
    void this.router.navigate(['']);
    deleteCookie('name');
    deleteCookie('profile_pic_url');
    deleteCookie('access_token');
  }
  onClickTaskSale(departmentSale: string): void {
    void this.router.navigate(['task/' + departmentSale]);
  }
  onClickAddLead(): void {
    void this.router.navigate(['lead/contactlead']);
  }
}
