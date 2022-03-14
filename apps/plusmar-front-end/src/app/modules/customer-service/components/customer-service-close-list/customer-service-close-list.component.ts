import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IssueService } from '../../services/issue.service';
import { IssueData } from '../../customer-service.model';
import { CustomerServiceSendEmailDialogComponent } from '../customer-service-send-email-dialog/customer-service-send-email-dialog.component';

@Component({
  selector: 'reactor-room-customer-service-close-list',
  templateUrl: './customer-service-close-list.component.html',
  styleUrls: ['./customer-service-close-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerServiceCloseListComponent implements OnInit {
  tableHeader: ITableHeader[] = [
    { sort: true, title: 'ID', key: null },
    { sort: true, title: 'Issue', key: null },
    { sort: true, title: 'Latest Date', key: null },
    { sort: true, title: 'Customer', key: null },
    { sort: true, title: 'Assignee', key: null },
    { sort: true, title: 'Status', key: null },
    { sort: true, title: 'Action', key: null },
  ];

  tableData = [
    {
      id: 'ISU-000004',
      issue: 'Issue A Lorem ipsum dolor sit',
      issueType: 'Issue Type 01',
      date: '31/01/2020 15:03',
      customer: 'Ken Edwards',
      assignee: 'Adam Smith',
      status: 3,
      actionMoreStatus: false,
      priorityId: 1,
    },
    {
      id: 'ISU-000003',
      issue: 'Issue B Lorem ipsum dolor sit',
      issueType: 'Issue Type 02',
      date: '31/01/2020 15:03',
      customer: 'Ken Edwards',
      assignee: 'Adam Smith',
      status: 3,
      actionMoreStatus: false,
      priorityId: 2,
    },
    {
      id: 'ISU-000003',
      issue: 'Issue C Lorem ipsum dolor sit',
      issueType: 'Issue Type 03',
      date: '31/01/2020 15:03',
      customer: 'Ken Edwards',
      assignee: 'Adam Smith',
      status: 4,
      actionMoreStatus: false,
      priorityId: 3,
    },
  ] as IssueData[];

  status = [
    { id: 0, label: 'Status' },
    { id: 1, label: 'Done' },
    { id: 2, label: 'Reject' },
  ];

  issueType = [
    { id: 0, label: 'Issue Type' },
    { id: 1, label: 'Issue Type 01' },
    { id: 2, label: 'Issue Type 02' },
    { id: 3, label: 'Issue Type 03' },
    { id: 4, label: 'Issue Type 04' },
    { id: 5, label: 'Issue Type 05' },
  ];

  priorityData = [
    { id: 1, label: 'Priority' },
    { id: 1, label: 'Low' },
    { id: 2, label: 'Medium' },
    { id: 3, label: 'High' },
  ];

  constructor(private emailDialog: MatDialog, private ngZone: NgZone, private router: Router, private issueService: IssueService) {}

  ngOnInit(): void {}

  clickMoreEvent(index: number) {
    for (let i = 0; i < this.tableData.length; i++) {
      if (i !== index) this.tableData[i].actionMoreStatus = false;
    }
    this.tableData[index].actionMoreStatus = !this.tableData[index].actionMoreStatus;
  }

  openSendEmailDialog(index: number): void {
    const dialogRef = this.emailDialog.open(CustomerServiceSendEmailDialogComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openIssueInfo(index: number) {
    const issueData = this.tableData[index];
    this.issueService.setIssueData(issueData);
    void this.ngZone.run(() => this.router.navigateByUrl('customer-service/issue-info'));
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }
}
