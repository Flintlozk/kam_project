import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'reactor-room-customer-service-issue-type-dialog',
  templateUrl: './customer-service-issue-type-dialog.component.html',
  styleUrls: ['./customer-service-issue-type-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerServiceIssueTypeDialogComponent implements OnInit {
  assigneeData = [
    { id: 1, name: 'Adam Smith 1' },
    { id: 2, name: 'Adam Smith 2' },
    { id: 3, name: 'Adam Smith 3' },
    { id: 4, name: 'Adam Smith 4' },
    { id: 5, name: 'Adam Smith 5' },
  ];

  issueForm: FormGroup;

  get issueFormArray(): FormArray {
    return <FormArray>this.issueForm.get('issue');
  }

  constructor(
    private dialogRef: MatDialogRef<CustomerServiceIssueTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogSave: MatDialog,
    private leadFormBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.issueForm = this.getIssueTypeFormGroup();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.openSaveDialog();
  }

  openSaveDialog(): void {
    const dialogRef = this.dialogSave.open(SuccessDialogComponent, {
      width: '100%',
      data: {
        title: 'Saved',
        text: 'Data have been saved successfully…',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.dialogRef.close();
    });
  }

  addNewIssueType() {
    const mainFormArray = this.issueFormArray;
    mainFormArray.push(this.getIssueAssigneeFormGroup());
  }

  removeIssueType(index: number) {
    this.issueFormArray.removeAt(index);
  }

  setAssigneeData(event, index: number) {
    const assigneeUserID = event.value;
    const currentFromGroup = this.issueFormArray.controls[index] as FormGroup;
    const assigneedFormControl = currentFromGroup.controls.assignee;
    assigneedFormControl.setValue(assigneeUserID);
  }

  getIssueTypeFormGroup(): FormGroup {
    const issueTypeFormGroup = this.leadFormBuilder.group({
      issue: this.getIssueAssigneeFormArray(),
    });
    return issueTypeFormGroup;
  }

  getIssueAssigneeFormArray(): FormArray {
    const issueAssigneeFormArray = this.leadFormBuilder.array([this.getIssueAssigneeFormGroup()]);
    return issueAssigneeFormArray;
  }

  getIssueAssigneeFormGroup(): FormGroup {
    const issueAssigneeFormGroup = this.leadFormBuilder.group({
      issueType: ['', Validators.required],
      assignee: [this.assigneeData[0].id],
    });
    return issueAssigneeFormGroup;
  }
}
