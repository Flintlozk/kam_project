import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { MatDialog } from '@angular/material/dialog';
import { CustomerServiceIssueTypeDialogComponent } from '../customer-service-issue-type-dialog/customer-service-issue-type-dialog.component';
import { CustomerServiceSendEmailDialogComponent } from '../customer-service-send-email-dialog/customer-service-send-email-dialog.component';
import { IssueService } from '../../services';
import { IssueData } from '../../customer-service.model';

@Component({
  selector: 'reactor-room-customer-service-issue-list',
  templateUrl: './customer-service-issue-list.component.html',
  styleUrls: ['./customer-service-issue-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerServiceIssueListComponent implements OnInit {
  tableHeader: ITableHeader[] = [
    { sort: true, title: 'ID', key: null },
    { sort: true, title: 'Issue', key: null },
    { sort: true, title: 'Issue Type', key: null },
    { sort: true, title: 'Assignee', key: null },
    { sort: true, title: 'Latest Date', key: null },
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
      status: 1,
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
      status: 2,
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
      status: 2,
      actionMoreStatus: false,
      priorityId: 3,
    },
  ] as IssueData[];

  status = [
    { id: 0, label: 'Status' },
    { id: 1, label: 'Open' },
    { id: 2, label: 'In progress' },
  ];

  issueType = [
    { id: 0, label: 'Issue Type' },
    { id: 1, label: 'Issue Type 01' },
    { id: 2, label: 'Issue Type 02' },
    { id: 3, label: 'Issue Type 03' },
    { id: 4, label: 'Issue Type 04' },
    { id: 5, label: 'Issue Type 05' },
  ];

  assignee = [
    { id: 0, name: 'Assignee' },
    { id: 1, name: 'Adam Smith 01' },
    { id: 2, name: 'Adam Smith 02' },
    { id: 3, name: 'Adam Smith 03' },
    { id: 4, name: 'Adam Smith 04' },
    { id: 5, name: 'Adam Smith 05' },
  ];

  priorityData = [
    { id: 0, label: 'Priority' },
    { id: 1, label: 'Low' },
    { id: 2, label: 'Medium' },
    { id: 3, label: 'High' },
  ];

  constructor(private issueTypeDialog: MatDialog, private emailDialog: MatDialog, private ngZone: NgZone, private router: Router, private issueService: IssueService) {}

  ngOnInit(): void {}

  clickMoreEvent(index: number) {
    for (let i = 0; i < this.tableData.length; i++) {
      if (i !== index) this.tableData[i].actionMoreStatus = false;
    }
    this.tableData[index].actionMoreStatus = !this.tableData[index].actionMoreStatus;
  }

  openIssueTypeDialog(): void {
    const dialogRef = this.issueTypeDialog.open(CustomerServiceIssueTypeDialogComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
