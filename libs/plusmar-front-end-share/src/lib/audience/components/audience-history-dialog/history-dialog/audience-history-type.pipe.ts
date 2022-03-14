import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { toLower, upperFirst } from 'lodash';

@Pipe({
  name: 'audienceHistoryType',
})
export class AudienceHistoryTypePipe implements PipeTransform {
  private historySteps = {
    AUDIENCE_INBOX: this.translateService.instant('New Message'),
    AUDIENCE_FOLLOW: this.translateService.instant('Follow'),
    CUSTOMER_FOLLOW: `Step 1: ${this.translateService.instant('Open For Order')}`,
    CUSTOMER_WAITING_FOR_PAYMENT: `Step 2: ${this.translateService.instant('Waiting for payment')}`,
    CUSTOMER_CONFIRM_PAYMENT: `Step 3: ${this.translateService.instant('Confirm Payment')}`,
    CUSTOMER_WAITING_FOR_SHIPMENT: `Step 4: ${this.translateService.instant('Waiting for Shipment')}`,
    CUSTOMER_CLOSED: `Step 5: ${this.translateService.instant('Close Sales')}`,
    AUDIENCE_LEAD: `${this.translateService.instant('Audience')} ${this.translateService.instant('Lead')}`,
    AUDIENCE_CLOSED: `${this.translateService.instant('Audience')} ${this.translateService.instant('Close')}`,
    LEADS_FINISHED: `${this.translateService.instant('Leads')} ${this.translateService.instant('Finished')}`,
    LEADS_FOLLOW: `${this.translateService.instant('Leads')} ${this.translateService.instant('Follow')}`,
    LEADS_REJECT: `${this.translateService.instant('Leads')} ${this.translateService.instant('Reject')}`,
    AUDIENCE_LIVE: `${this.translateService.instant('Audience')} ${this.translateService.instant('Live')}`,
    AUDIENCE_COMMENT: `${this.translateService.instant('Comment')}`,
    AUDIENCE_REJECT: `${this.translateService.instant('Audience')} ${this.translateService.instant('Reject')}`,
    CUSTOMER_REJECT: `${this.translateService.instant('Customer')} ${this.translateService.instant('Reject')}`,
    CUSTOMER_EXPIRED: `${this.translateService.instant('Customer')} ${this.translateService.instant('Expired')}`,
  };

  constructor(private translateService: TranslateService) {}

  transform(domain: string, status: string): string {
    if (domain === null && status === null) {
      return `${this.translateService.instant('Customer')}`;
    } else {
      const stepKey = `${domain}_${status}`;
      let historyStep = this.historySteps[stepKey];
      historyStep = historyStep ? historyStep : `${upperFirst(toLower(domain))} ${upperFirst(toLower(status))}`;
      return historyStep;
    }
  }
}
