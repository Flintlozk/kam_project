import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AudienceContactStatus, AudienceStats, IAudienceMessageFilter } from '@reactor-room/itopplus-model-lib';
import { takeUntil } from 'rxjs/operators';
import { DashboardMessageService } from '../../services/message/dashboard-message.service';
import { environmentLib } from '@reactor-room/environment-services-frontend';

@Component({
  selector: 'cms-next-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();
  mainCardTotal: number;
  messageData = [
    {
      title: 'Waiting',
      subTitle: 'for reply',
      value: 0,
    },
    {
      title: 'NewActivity',
      children: [
        { label: 'Inbox', value: 0 },
        { label: 'Comment', value: 0 },
      ],
      value: 0,
    },
    {
      title: 'Follow',
      value: 0,
    },
    {
      title: 'Leads',
      value: 0,
    },
  ];
  constructor(public dashboardMessageService: DashboardMessageService) {}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.getStats();
  }
  getStats(): void {
    this.dashboardMessageService
      .getDashboardMessageStats({
        searchText: '',
        tags: [],
        noTag: false,
        contactStatus: AudienceContactStatus.ALL,
      } as IAudienceMessageFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: AudienceStats) => {
          this.setData(result);
        },
        (err) => {
          console.log(err);
        },
      );
  }
  trackByIndex(index: number): number {
    return index;
  }
  setData(result: AudienceStats): void {
    this.mainCardTotal = result.inbox_audience + result.comment_audience + result.lead_audience + result.follow_audience || 0;
    this.messageData[0].value = result.unread_audience || 0;
    this.messageData[1].value = result.inbox_audience + result.comment_audience || 0;
    this.messageData[1].children[0].value = result.inbox_audience || 0;
    this.messageData[1].children[1].value = result.comment_audience || 0;
    this.messageData[2].value = result.follow_audience || 0;
    this.messageData[3].value = result.lead_audience || 0;
  }
  openTabOfMoreCommerce() {
    window.open(`${environmentLib.origin}/follows/list/all/1`);
  }
}
