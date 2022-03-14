import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { EPageMessageTrackMode, IAllSubscriptionFilter, IAllSubscriptionSLAAllSatff } from '@reactor-room/itopplus-model-lib';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'reactor-room-admin-sla-all-staff',
  templateUrl: './admin-sla-all-staff.component.html',
  styleUrls: ['./admin-sla-all-staff.component.scss'],
})
export class AdminSlaAllStaffComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pageID = -1;
  @Input() trackMode: EPageMessageTrackMode;
  filters: IAllSubscriptionFilter = { pageID: -1 };

  staffList: IAllSubscriptionSLAAllSatff[] = [];

  interval$: Subscription;
  destroy$ = new Subject<void>();
  stopTimer$ = new Subject<void>();
  INTERVAL_THRESHOLD = 30000;

  refetch = false;
  isDigest = false;

  zoomValue = 80; // default == 80

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    const zoomValue = localStorage.getItem('adb-r-zoom');
    if (zoomValue) this.zoomValue = Number(zoomValue);

    this.adminService.initiateEmitter.subscribe((isRefetch) => {
      this.refetch = isRefetch;
      if (isRefetch) this.initData();
    });
  }

  ngOnChanges(): void {
    this.filters.pageID = this.pageID;
    this.initData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initData(): void {
    switch (this.trackMode) {
      case EPageMessageTrackMode.TRACK_BY_TAG: {
        this.getAllSubscriptionSLAAllStaff().subscribe({
          error: (err) => {
            console.log('getAllSubscriptionSLAAllStaff err : ', err);
          },
        });
        break;
      }
      case EPageMessageTrackMode.TRACK_BY_ASSIGNEE: {
        this.getAllSubscriptionSLAAllStaffByAssignee().subscribe({
          error: (err) => {
            console.log('getAllSubscriptionSLAAllStaff err : ', err);
          },
        });
        break;
      }
    }
  }

  getAllSubscriptionSLAAllStaff(): Observable<IAllSubscriptionSLAAllSatff[]> {
    return this.adminService.getAllSubscriptionSLAAllStaff(this.filters, this.refetch, this.isDigest).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.mapData(result);
      }),
    );
  }
  getAllSubscriptionSLAAllStaffByAssignee(): Observable<IAllSubscriptionSLAAllSatff[]> {
    return this.adminService.getAllSubscriptionSLAAllStaffByAssignee(this.filters, this.refetch, this.isDigest).pipe(
      takeUntil(this.destroy$),
      tap((result) => {
        this.mapData(result);
      }),
    );
  }

  mapData(value: IAllSubscriptionSLAAllSatff[]): void {
    this.staffList = value;
  }

  onDoZoom(zoomEvt: MatSliderChange): void {
    localStorage.setItem('adb-r-zoom', zoomEvt?.value.toString());
  }
}
