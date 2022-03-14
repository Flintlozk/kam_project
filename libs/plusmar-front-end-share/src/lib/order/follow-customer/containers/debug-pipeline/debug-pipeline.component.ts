import { Component, OnInit, Input } from '@angular/core';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { EnumPurchasingPayloadType } from '@reactor-room/itopplus-model-lib';
import { PipelineService } from '@reactor-room/plusmar-front-end-share/services/facebook/pipeline/pipeline.service';

@Component({
  selector: 'reactor-room-debug-pipeline',
  templateUrl: './debug-pipeline.component.html',
  styleUrls: ['./debug-pipeline.component.scss'],
})
export class DebugPipelineComponent implements OnInit {
  @Input() audienceId: number;
  @Input() psid: string;
  @Input() platform: AudiencePlatformType;

  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {}
  // DEBUG
  debugUpdatedCart(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.UPDATE_CART, this.platform);
  }
  sendReceipt(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.SEND_RECEIPT, this.platform);
  }

  sendConfirmOrder(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.CONFIRM_ORDER, this.platform);
  }

  sendLogistic(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.LOGISTIC_SELECTOR, this.platform);
  }
  receiveOrderConfriming(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.RECEIVE_ORDER_CONFIRMATION, this.platform);
  }
  receiveFlatRateOrderConfriming(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.RECEIVE_ORDER_CONFIRMATION_FLAT_RATE, this.platform);
  }

  sendPayment(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.SEND_PAYMENT, this.platform);
  }

  sendBankAccount(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.SEND_BANK_ACCOUNT, this.platform);
  }
  sendPaypalPaypment(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.SEND_PAYPAL_PAYMENT, this.platform);
  }

  sendConfirmPayment(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.SEND_BANK_ACCOUNT, this.platform);
  }

  // sendCheckAddress():void {
  // void   await this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.CHECK_ADDRESS, this.platform);
  // }

  sendEditAddress(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.ADDRESS_EDITING, this.platform);
  }

  sendTrackingNumber(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.SEND_TRACKING_NUMBER, this.platform);
  }

  sendCombineLogisPay(): void {
    void this.pipelineService.sendPayload(this.audienceId, this.psid, EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT, this.platform);
  }
}
