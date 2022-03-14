import { Component, OnDestroy, OnInit } from '@angular/core';
import { CMSUserService } from '@reactor-room/cms-frontend-services-lib';
import { Subject } from 'rxjs';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  heading: IHeading = {
    title: 'Dashboard',
    subTitle: 'Dashboard',
  };
  destroy$: Subject<void> = new Subject<void>();
  constructor(private userService: CMSUserService) {}

  ngOnInit(): void {
    // this.getUserSubscriptionsContext();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  // getUserSubscriptionsContext(): void {
  //   this.userService.$userContext
  //     .pipe(
  //       tap((res) => {
  //         // console.log('uc', res);
  //       }),
  //     )
  //     .subscribe();

  //   this.userService.$userSubscriptionsContext
  //     .pipe(
  //       tap((res) => {
  //         // console.log('sc', res);
  //       }),
  //     )
  //     .subscribe();
  // }
}
