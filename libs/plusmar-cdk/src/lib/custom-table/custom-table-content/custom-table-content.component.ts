import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { AudienceDomainStatus, AudienceDomainType, CUSTOMER_TAG_COLOR, IAudienceWithCustomer } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-custom-table-content',
  templateUrl: './custom-table-content.component.html',
  styleUrls: ['./custom-table-content.component.less'],
})
export class CustomTableContentComponent implements OnInit {
  audiencePlatformType = AudiencePlatformType;
  audienceDomainType = AudienceDomainType;
  audienceDomainStatus = AudienceDomainStatus;
  customerTagEnum = CUSTOMER_TAG_COLOR;
  @Input() Selector: string;
  @Input() Status: number;
  //
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() aliases: string;
  @Input() image: string;
  @Input() platform: string;
  @Input() platformImg: string;
  @Input() formName: string;
  @Input() audience: IAudienceWithCustomer;
  //
  @Input() senderName: string;
  @Input() createdAt: string;
  @Input() senderProfilePic: string;
  @Input() profileName: string;
  @Input() profileUrl: string;
  @Input() paymentMethodName: string;
  @Input() paymentMethodStatus: string;
  @Input() paymentMethodUrl: string;
  @Input() logisticImgUrl: string;
  @Input() logisticTrackingfUrl: string;
  @Input() logisticInfoImgUrl: string;
  @Input() logisticInfoName: string;
  @Input() logisticInfoDate: string;
  @Input() logisticInfoCode: string;
  @Input() logisticInfoPayment: string;
  @Input() logisticInfoValue: string;
  @Input() logisticInfoPaid: boolean;
  @Input() logisticInfoChangeUrl: string;
  @Input() commentProfileUrl: string;
  @Input() commentName: string;
  @Input() commentDate: string;
  @Input() isConfirmAddress: boolean;

  name = '';

  constructor(private matDialog: MatDialog) {}
  ngOnInit(): void {
    this.config();
  }

  config() {
    if (this.Selector === 'comment-by' || this.Selector === 'follow-list-mobile') {
      this.name = this.firstName + ' ' + (this.lastName || '') + ' ' + (this.aliases || '');
    }
  }
}
