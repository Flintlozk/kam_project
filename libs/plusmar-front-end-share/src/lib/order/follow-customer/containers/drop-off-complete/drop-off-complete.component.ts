import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AudienceViewType, IPayOffResult, PaperSize, PaperType } from '@reactor-room/itopplus-model-lib';
import { Router } from '@angular/router';

@Component({
  selector: 'reactor-room-drop-off-complete',
  templateUrl: './drop-off-complete.component.html',
  styleUrls: ['./drop-off-complete.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropOffCompleteComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { result: IPayOffResult; orderData: { audienceID: number; orderId: number; orderUUID: string; route: AudienceViewType } },
    private dialogRef: MatDialogRef<DropOffCompleteComponent>,
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close(false);
  }
  onSubmit(): void {
    this.dialogRef.close(true);

    const AID = this.data.orderData.audienceID;
    const OID = this.data.orderData.orderId;
    const OUUID = this.data.orderData.orderUUID;
    void this.router.navigate([`order/report/${PaperType.LABEL}/${PaperSize.A4}/${OID}/${OUUID}/${AID}/${this.data.orderData.route}`]);
  }
}
