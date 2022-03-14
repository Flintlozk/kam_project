import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IssueData } from '../customer-service.model';

@Injectable()
export class IssueService {
  issueData: IssueData = {
    id: null,
    issue: null,
    issueType: null,
    date: null,
    customer: null,
    assignee: null,
    status: null,
    actionMoreStatus: null,
    priorityId: null,
  };
  private data = new BehaviorSubject(this.issueData);
  sharedIssueData = this.data.asObservable();

  constructor() {}

  setIssueData(data: IssueData) {
    this.data.next(data);
  }
}
