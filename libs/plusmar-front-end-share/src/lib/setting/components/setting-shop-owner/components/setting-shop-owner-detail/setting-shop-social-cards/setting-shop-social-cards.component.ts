import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { environmentLib as environment } from '@reactor-room/environment-services-frontend';
import { deleteCookie, isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { ISocialCard, ISocialConnect, SocialModeTypes, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { ITextTitle } from '@reactor-room/model-lib';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';

@Component({
  selector: 'reactor-room-setting-shop-social-cards',
  templateUrl: './setting-shop-social-cards.component.html',
  styleUrls: ['./setting-shop-social-cards.component.scss'],
})
export class SettingShopSocialCardsComponent implements OnChanges {
  @Input() socialConnect: ISocialConnect;
  @Input() state: SocialModeTypes;
  socialTypes = SocialTypes;
  socialCards: ISocialCard[];
  @Output() connectRequest: EventEmitter<SocialTypes> = new EventEmitter<SocialTypes>();
  ////:: marketplace functionality commenting now
  // lazadaLogoUrl = 'assets/img/icon-lazadaoa.svg';
  // shopeeLogoUrl = 'assets/img/icon-shopeeoa.svg';
  webhookUrl = '';
  constructor(private pageService: PagesService, public translate: TranslateService, private dialog: MatDialog, private settingsService: SettingsService) {}

  ngOnChanges(): void {
    this.createSocialCards();
  }
  createSocialCards(): void {
    const notLinkMessage = 'No Official Account added';
    const facebookCard = this.getSocialCards({ label: 'Facebook', logoUrl: 'assets/img/facebook-logo.png', notLinkMessage } as ISocialCard, SocialTypes.FACEBOOK);

    const lineCard = this.getSocialCards({ label: 'Line', logoUrl: 'assets/img/icon-lineoa.svg', notLinkMessage } as ISocialCard, SocialTypes.LINE);

    ////:: marketplace functionality commenting now
    // const lazadaCard = this.getSocialCards({ label: 'Lazada', logoUrl: this.lazadaLogoUrl, notLinkMessage } as ISocialCard, SocialTypes.LAZADA);
    // const shopeeCard = this.getSocialCards({ label: 'Shopee', logoUrl: this.shopeeLogoUrl, notLinkMessage } as ISocialCard, SocialTypes.SHOPEE);

    this.socialCards = [
      facebookCard,
      lineCard,
      ////:: marketplace functionality commenting now
      // { ...lazadaCard, picture: lazadaCard.picture ? lazadaCard.picture : this.lazadaLogoUrl },
      // { ...shopeeCard, picture: this.shopeeLogoUrl },
    ];
    if (lineCard.id) {
      this.getLineWebhookUrl();
    }
  }

  getSocialCards({ label, logoUrl, notLinkMessage }: ISocialCard, type: SocialTypes): ISocialCard {
    const { id, name, picture } = this.socialConnect[type] || {};
    return {
      type,
      id,
      name,
      picture,
      label,
      logoUrl,
      notLinkMessage,
    };
  }

  sendConnectEvent(connectType: SocialTypes): void {
    this.connectRequest.emit(connectType);
  }

  revokeToken(): void {
    this.pageService.updateFacebookPageToken().subscribe(
      (res) => {
        deleteCookie('access_token');
        deleteCookie('page_index');
        setTimeout(() => {
          location.href = '/login';
        }, 500);
      },
      (err) => {
        console.log('updateFacebookPageToken err ::::::::::>>> ', err);
      },
    );
    // updateFacebookPageToken;
  }

  checkSocialCanConnect(social: ISocialCard): boolean {
    if (this.state === SocialModeTypes.EDIT_DEV) return true;
    if (this.state === SocialModeTypes.CREATE && social.type === this.socialTypes.FACEBOOK) return true;
    if (this.state === SocialModeTypes.EDIT && !social.id) return true;
  }

  showDialogNotify(social: ISocialCard): void {
    if (social.type !== SocialTypes.FACEBOOK && !this.socialCards[0].id) {
      this.openAlertDialog(
        {
          title: this.translate.instant("Can't connect !!"),
          text: this.translate.instant('Please connect facebook fanpage before connect other platform'),
        },
        true,
      );
    }
  }

  openAlertDialog(message: ITextTitle, isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  copyWebhookUrl(): void {
    const link = this.webhookUrl;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'absolute';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openAlertDialog(
      {
        text: link,
        title: this.translate.instant('Copied Successfully'),
      },
      false,
    );
  }

  getLineWebhookUrl(): void {
    this.settingsService.getLineChannelSettingByPageID().subscribe((result) => {
      this.webhookUrl = `${environment.linewebhook}/${result.id}/${result.uuid}`;
    });
  }
}
