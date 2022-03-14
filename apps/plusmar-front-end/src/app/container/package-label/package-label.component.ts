import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-package-label',
  templateUrl: './package-label.component.html',
  styleUrls: ['./package-label.component.scss'],
})
export class PackageLabelComponent implements OnInit {
  activeSubscription;
  constructor(private subscriptionService: SubscriptionService, public translate: TranslateService) {}

  ngOnInit(): void {
    this.subscriptionService.sharedPackageLabelData.subscribe((data) => (this.activeSubscription = data));
  }
}
