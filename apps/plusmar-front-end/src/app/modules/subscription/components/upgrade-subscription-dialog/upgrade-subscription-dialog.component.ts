import { Component, OnInit, Inject, NgZone, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'reactor-room-upgrade-subscription-dialog',
  templateUrl: './upgrade-subscription-dialog.component.html',
  styleUrls: ['./upgrade-subscription-dialog.component.scss'],
})
export class UpgradeSubscriptionDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<UpgradeSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private ngZone: NgZone,
  ) {}
  isBusiness = false;
  isCommerce = true;
  currentPlanID;
  subscriptionID;
  isSubscriptionBusiness = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.getSubscriptionPlan();
  }

  getSubscriptionPlan(): void {
    this.subscriptionService.$subscription.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.subscriptionID = res.id;
      this.currentPlanID = res.planId || 0;
      if (this.currentPlanID !== 1 && this.currentPlanID < 5) {
        this.isSubscriptionBusiness = true;
      }
    });
  }

  onSelectSubscriptionPlan(subscriptionPlanID: number): void {
    void this.ngZone.run(() => this.router.navigateByUrl(`/subscription/${this.subscriptionID}/payment/${subscriptionPlanID}`));
    this.dialogRef.close();
  }

  onBusinessClick(): void {
    this.isBusiness = true;
    this.isCommerce = false;
  }

  onCommerceClick(): void {
    this.isBusiness = false;
    this.isCommerce = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  comparePackages(): void {
    void this.ngZone.run(() => this.router.navigateByUrl('subscription/create/compare-packages'));
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
