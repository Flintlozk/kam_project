import { Pipe, PipeTransform } from '@angular/core';
import { AudienceDomainType, AudienceDomainStatus, CustomerDomainStatus, LeadsDomainStatus } from '@reactor-room/itopplus-model-lib';
import { TranslateService } from '@ngx-translate/core';
@Pipe({
  name: 'status',
})
export class AudienceStatusPipe implements PipeTransform {
  domain: AudienceDomainType;
  status: AudienceDomainStatus | CustomerDomainStatus | LeadsDomainStatus;

  constructor(public translate: TranslateService) {}

  transform(value: string, args: 'domain' | 'status' | 'status-shorthand'): string {
    switch (args) {
      case 'domain': {
        switch (value) {
          case AudienceDomainType.AUDIENCE:
            return 'Audience';
          case 'Customer':
          case AudienceDomainType.CUSTOMER:
            return 'Order';
          case AudienceDomainType.LEADS:
            return 'Leads';
          case AudienceDomainType.CUSTOMER_SERVICE:
            return 'Customer Service';
          default:
            return value;
        }
      }
      case 'status':
        switch (value) {
          case CustomerDomainStatus.FOLLOW:
            return ' : ' + this.translate.instant('Follow');
          case CustomerDomainStatus.WAITING_FOR_PAYMENT:
            return ' : ' + this.translate.instant('Waiting For Payment');
          case CustomerDomainStatus.CONFIRM_PAYMENT:
            return ' : ' + this.translate.instant('Confirm Payment');
          case CustomerDomainStatus.WAITING_FOR_SHIPMENT:
            return ' : ' + this.translate.instant('Waiting For Shipment');
          case CustomerDomainStatus.CLOSED:
            return this.translate.instant('Closed');
          case AudienceDomainStatus.FOLLOW:
            return this.translate.instant('Follow');
          case AudienceDomainStatus.CLOSED:
            return this.translate.instant('Closed');
          case AudienceDomainStatus.REJECT:
            return this.translate.instant('Reject');
          case AudienceDomainStatus.INBOX:
          case AudienceDomainStatus.COMMENT:
          case AudienceDomainStatus.LIVE:
            return this.translate.instant('New Message');
          default:
            return value;
        }
      case 'status-shorthand':
        switch (value) {
          case CustomerDomainStatus.FOLLOW:
            return this.translate.instant('Follow');
          case CustomerDomainStatus.WAITING_FOR_PAYMENT:
            return '2: Payment';
          case CustomerDomainStatus.CONFIRM_PAYMENT:
            return '3: Confirm';
          case CustomerDomainStatus.WAITING_FOR_SHIPMENT:
            return '4: Shipping';
          case CustomerDomainStatus.CLOSED:
            return this.translate.instant('Closed');
          case AudienceDomainStatus.FOLLOW:
            return this.translate.instant('Follow');
          case AudienceDomainStatus.CLOSED:
            return this.translate.instant('Closed');
          case AudienceDomainStatus.REJECT:
            return this.translate.instant('Reject');
          case AudienceDomainStatus.INBOX:
          case AudienceDomainStatus.COMMENT:
          case AudienceDomainStatus.LIVE:
            return this.translate.instant('New Message');
          default:
            return value;
        }
      default:
        return value;
    }
  }
}
