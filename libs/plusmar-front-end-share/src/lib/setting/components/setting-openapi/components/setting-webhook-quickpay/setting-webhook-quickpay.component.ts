import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { ToastrService } from 'ngx-toastr';
import { IPageQuickpayWebhookOptions, PageSettingType } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-setting-webhook-quickpay',
  templateUrl: './setting-webhook-quickpay.component.html',
  styleUrls: ['./setting-webhook-quickpay.component.scss'],
})
export class SettingWebhookQuickpayComponent implements OnInit, OnDestroy {
  @Input() isAllowed: boolean;
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
      .getPageSetting(PageSettingType.QUICKPAY_WEBHOOK)
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.url = (<IPageQuickpayWebhookOptions>config?.options)?.url;
      });
  }
  saveUrl(): void {
    this.settingsService.saveWebhookURL(this.url, PageSettingType.QUICKPAY_WEBHOOK).subscribe(
      (res) => {
        this.toastr.success('Updated', 'Webhook URL', { positionClass: 'toast-bottom-right' });
      },
      () => {
        this.toastr.error('Fail', 'Connection', { positionClass: 'toast-bottom-right' });
      },
    );
  }
}
