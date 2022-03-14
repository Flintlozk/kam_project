import { Component, NgZone, OnInit } from '@angular/core';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'reactor-room-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss'],
})
export class UpgradeComponent implements OnInit {
  isDisplayUpgrade = false;

  constructor(private subscriptionService: SubscriptionService, public translate: TranslateService, private ngZone: NgZone, private router: Router) {}

  ngOnInit(): void {
    this.subscriptionService.shareIsDisplayUpgrade.subscribe((status) => (this.isDisplayUpgrade = status));
  }

  openComparePackage(): void {
    void this.ngZone.run(() => this.router.navigateByUrl('subscription/create/compare-packages'));
  }
}
