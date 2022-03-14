import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomerServiceIssueTypeDialogComponent } from '../customer-service-issue-type-dialog/customer-service-issue-type-dialog.component';

@Component({
  selector: 'reactor-room-customer-service-create-issue',
  templateUrl: './customer-service-create-issue.component.html',
  styleUrls: ['./customer-service-create-issue.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerServiceCreateIssueComponent implements OnInit {
  newIssueForm: FormGroup;

  issueTypeAssignee = [
    { id: 0, label: 'Issue Type', assigneeId: 1, assigneeName: 'Adam Smith' },
    { id: 1, label: 'Issue Type 01', assigneeId: 1, assigneeName: 'Adam Smith' },
    { id: 2, label: 'Issue Type 02', assigneeId: 1, assigneeName: 'Adam Smith' },
    { id: 3, label: 'Issue Type 03', assigneeId: 1, assigneeName: 'Adam Smith' },
    { id: 4, label: 'Issue Type 04', assigneeId: 2, assigneeName: 'Kent Wynn' },
    { id: 5, label: 'Issue Type 05', assigneeId: 2, assigneeName: 'ent Wynn' },
  ];

  priority = [
    { id: 1, value: true, label: 'Low' },
    { id: 2, value: false, label: 'Medium' },
    { id: 3, value: false, label: 'High' },
  ];

  fileAttatchData = [
    { imgUrl: 'assets/img/customer-service/files/zip.png', title: 'Attatchment A', size: '1.2 MB' },
    { imgUrl: 'assets/img/customer-service/files/docx.png', title: 'Attatchment B', size: '1.2 MB' },
    { imgUrl: 'assets/img/customer-service/files/pdf.png', title: 'Attatchment C', size: '1.2 MB' },
  ];

  constructor(private issueTypeDialog: MatDialog, private leadFormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.newIssueForm = this.getNewIssueFormGroup();
  }

  getNewIssueFormGroup(): FormGroup {
    const newIssueFormGroup = this.leadFormBuilder.group({
      issueName: ['', Validators.required],
      customerName: ['', Validators.required],
      issueType: [this.issueTypeAssignee[0].id, Validators.required],
      assignee: [this.issueTypeAssignee[0].assigneeId, Validators.required],
      priority: [this.priority[0].id, Validators.required],
      description: ['', Validators.required],
    });
    return newIssueFormGroup;
  }

  openIssueTypeDialog(): void {
    const dialogRef = this.issueTypeDialog.open(CustomerServiceIssueTypeDialogComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
