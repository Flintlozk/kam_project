import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { SubscriptionUserRoleAndPagesGuard } from '@reactor-room/plusmar-front-end-share/services/subscription-user-role-and-pages.guard.service';

export enum ENUM {
  LOGIN = 'LOGIN',
  UPDATE_SUBSCRIPTION = 'UPDATE_SUBSCRIPTION',
}

@Component({
  selector: 'reactor-room-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
  providers: [SubscriptionUserRoleAndPagesGuard],
})
export class ProcessComponent implements OnInit {
  @Input() setInitTo: ENUM;
  @Output() errorEvent = new EventEmitter<boolean>();
  constructor(public translate: TranslateService) {}

  ngOnInit(): void {
    switch (this.setInitTo) {
      case ENUM.LOGIN: {
        this.initializeLoginFlow();
        break;
      }
      default: {
        // redirect back to /
      }
    }
  }
  initializeLoginFlow(): void {
    window.location.href = environment.DEFAULT_ROUTE;
  }
}
