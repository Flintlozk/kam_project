import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceViewType,
  GenericButtonMode,
  GenericDialogMode,
  IAudienceWithCustomer,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CloseReasonDialogService } from '@reactor-room/plusmar-front-end-share/services/close-reason-dialog.service';

@Component({
  selector: 'reactor-room-peekbox-audience-control',
  templateUrl: './peekbox-audience-control.component.html',
  styleUrls: ['./peekbox-audience-control.component.scss'],
})
export class PeekboxAudienceControlComponent implements OnInit {
  @Input() audience: IAudienceWithCustomer;
  @Input() route: AudienceViewType;
  @Output() closeResponse = new EventEmitter<boolean>();

  destroy$: Subject<void> = new Subject<void>();
  featureControl: {
    NEW: boolean;
    POST: boolean;
    FOLLOW: boolean;
    ORDER: boolean;
    LEAD: boolean;
  };
  constructor(
    private audienceService: AudienceService,
    public layoutCommonService: LayoutCommonService,
    private router: Router,
    private dialogService: DialogService,
    private closeReasonDialogService: CloseReasonDialogService,

    private translate: TranslateService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.featureControl = {
      NEW: false,
      POST: false,
      FOLLOW: false,
      ORDER: false,
      LEAD: false,
    };
    this.loadComponent();
  }

  loadComponent(): void {
    switch (this.audience.domain) {
      case AudienceDomainType.CUSTOMER: {
        this.featureControl.ORDER = true;
        break;
      }
      case AudienceDomainType.AUDIENCE: {
        switch (this.audience.status) {
          case AudienceDomainStatus.FOLLOW:
            this.featureControl.FOLLOW = true;
            break;
          case AudienceDomainStatus.INBOX:
            this.featureControl.NEW = true;
            break;
          case AudienceDomainStatus.COMMENT:
            this.featureControl.POST = true;
            break;
        }
        break;
      }
      case AudienceDomainType.LEADS: {
        this.featureControl.LEAD = true;
        break;
      }
      default: {
        break;
      }
    }
  }

  onClose(closeWithUpdate = false): void {
    this.closeResponse.emit(closeWithUpdate);
  }

  onCloseFollowAudience(): void {
    this.settingsService
      .getPageSetting(PageSettingType.CUSTOMER_CLOSED_REASON)
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        if (config.status) {
          this.closeReasonDialogService.openClosedAudienceReason(this.audience.id).subscribe((success) => {
            if (success) {
              this.layoutCommonService.startLoading();
              this.closeAudience();
            }
          });
        } else {
          this.onCloseAudience(true);
        }
      });
  }

  onCloseAudience(isFollow: boolean): void {
    const text = isFollow ? this.translate.instant('Close this audience ?') : this.translate.instant('Are you sure you want to remove this audience ?');
    this.dialogService.openDialog(text, GenericDialogMode.CAUTION, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.layoutCommonService.startLoading();
        this.closeAudience();
      }
    });
  }

  closeAudience(): void {
    this.audienceService.closeAudience(this.audience.psid, this.audience.id).subscribe(() => {
      this.layoutCommonService.endLoading();
      this.onClose(true);
    });
  }

  onRouteChangeToLead(): void {
    void this.router.navigate([`/follows/chat/${this.audience.id}/lead`]);
    this.onClose();
  }
  onRouteChangeToOrder(): void {
    void this.router.navigate([`/follows/chat/${this.audience.id}/cart`]);
    this.onClose();
  }
  onRouteChangeToPost(): void {
    void this.router.navigate([`/follows/chat/${this.audience.id}/post`]);
    this.onClose();
  }
}
