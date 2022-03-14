import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { IPageCloseCustomerOptions, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-webhook',
  templateUrl: './setting-webhook.component.html',
  styleUrls: ['./setting-webhook.component.scss'],
})
export class SettingWebhookComponent implements OnInit, OnDestroy {
  isAllowed = true;
  destroy$: Subject<void> = new Subject<void>();

  url = '';
  constructor(private settingsService: SettingsService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getWebhookConfig();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getWebhookConfig(): void {
    this.settingsService
      .getPageSetting(PageSettingType.CUSTOMER_CLOSED_REASON)
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.url = (<IPageCloseCustomerOptions>config?.options)?.url;
      });
  }

  saveUrl(): void {
    this.settingsService.saveWebhookURL(this.url, PageSettingType.CUSTOMER_CLOSED_REASON).subscribe(
      (res) => {
        this.toastr.success('Updated', 'Webhook URL', { positionClass: 'toast-bottom-right' });
      },
      () => {
        this.toastr.error('Fail', 'Connection', { positionClass: 'toast-bottom-right' });
      },
    );
  }
}
