import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductMarketPlaceService } from '@reactor-room/plusmar-front-end-share/products/services/product-marketplace.service';
import { SocialTypes } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-pages-third-party-reconnect-dialog',
  templateUrl: './pages-third-party-reconnect-dialog.component.html',
  styleUrls: ['./pages-third-party-reconnect-dialog.component.scss'],
})
export class PagesThirdPartyReconnectDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<PagesThirdPartyReconnectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public reconnectPages: SocialTypes[],
    private marketPlaceService: ProductMarketPlaceService,
  ) {}

  marketPlaceIconObj = this.marketPlaceService.marketPlaceIconObj;

  ngOnInit(): void {}

  onReconnect(pageType: SocialTypes): void {
    this.dialogRef.close(pageType);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
