import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { IssueService } from '../../services';
import { IssueData } from '../../customer-service.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerServiceSendEmailDialogComponent } from '../customer-service-send-email-dialog/customer-service-send-email-dialog.component';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'reactor-room-customer-service-issue-info',
  templateUrl: './customer-service-issue-info.component.html',
  styleUrls: ['./customer-service-issue-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerServiceIssueInfoComponent implements OnInit {
  issueData: IssueData;

  navBarData = [
    { step: 1, label: 'Open', active: true, passed: false },
    { step: 2, label: 'In Progress', active: false, passed: false },
    { step: 3, label: 'Done', active: false, passed: false },
  ];

  fileAttatchData = [
    { imgUrl: 'assets/img/customer-service/files/zip.png', title: 'Attatchment A', size: '1.2 MB' },
    { imgUrl: 'assets/img/customer-service/files/docx.png', title: 'Attatchment B', size: '1.2 MB' },
    { imgUrl: 'assets/img/customer-service/files/pdf.png', title: 'Attatchment C', size: '1.2 MB' },
  ];

  historyData = [
    { profileImgUrl: 'assets/img/sample-account.png', profileName: 'Adam Smith', time: '4m ago', beginStatus: 1, endStatus: 2 },
    { profileImgUrl: 'assets/img/sample-account.png', profileName: 'Adam Smith', time: '4m ago', beginStatus: 2, endStatus: 3 },
    { profileImgUrl: 'assets/img/sample-account.png', profileName: 'Adam Smith', time: '4m ago', beginStatus: 3, endStatus: 4 },
    { profileImgUrl: 'assets/img/sample-account.png', profileName: 'Adam Smith', time: '4m ago', beginStatus: 4, endStatus: 1 },
    { profileImgUrl: 'assets/img/sample-account.png', profileName: 'Adam Smith', time: '4m ago', beginStatus: 1, endStatus: 4 },
  ];

  constructor(private emailDialog: MatDialog, private dialogCopyLink: MatDialog, private issueService: IssueService, private ngZone: NgZone, private router: Router) {}

  ngOnInit(): void {
    this.issueService.sharedIssueData.subscribe((data) => (this.issueData = data));
    if (this.issueData.id == null) void this.ngZone.run(() => this.router.navigateByUrl('customer-service/create-new-issue'));
    this.navBarDetection();
  }

  activeNavBar(position: number) {
    this.navBarData[position].active = true;
    this.navBarData[position].passed = false;
    for (let i = 0; i < position; i++) {
      this.navBarData[i].active = false;
      this.navBarData[i].passed = true;
    }
    for (let i = position + 1; i < this.navBarData.length; i++) {
      this.navBarData[i].active = false;
      this.navBarData[i].passed = false;
    }
  }

  openSendEmailDialog(): void {
    const dialogRef = this.emailDialog.open(CustomerServiceSendEmailDialogComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openCopyLinkSuccessDialog(): void {
    const dialogRef = this.dialogCopyLink.open(SuccessDialogComponent, {
      width: '100%',
      data: {
        title: 'Copied',
        text: 'https://m.me/1879462715469393?ref=sale_6DPqVmj6',
      },
    });
  }

  navBarDetection(): void {
    if (this.issueData.status === 1) {
      this.activeNavBar(0);
    }
    if (this.issueData.status === 2) {
      this.activeNavBar(1);
    }
    if (this.issueData.status === 3) {
      this.activeNavBar(2);
    }
  }
}
