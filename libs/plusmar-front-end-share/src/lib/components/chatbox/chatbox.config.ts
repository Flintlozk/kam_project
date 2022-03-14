import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IAttachmentsModel, IMessageModel } from '@reactor-room/itopplus-model-lib';
import { DisplayImageComponent } from '../display-image/display-image.component';
import { TemplatesComponent } from './templates/templates.component';
@Injectable()
export class ChatBoxConfig {
  constructor(private dialog: MatDialog, private location: Location) {}

  zoomIn(url: string, type: string): void {
    if (url.search('/resize/') !== -1) {
      url = url.replace('/resize/', '/');
    }
    this.dialog.open(DisplayImageComponent, {
      width: '100%',
      data: {
        url,
        type,
      },
    });
  }

  trackBy(index: number, item: IAttachmentsModel): number {
    return item.id;
  }

  trackById(i: number, message: IMessageModel): string {
    return message.mid;
  }

  openPresetsDialog(isFormHide: boolean, isProductHide: boolean, isProductCatalogHide: boolean): void {
    this.dialog.open(TemplatesComponent, {
      width: '100%',
      data: {
        feature: {
          message: true,
          social: true,
          form: isFormHide,
          product: isProductHide,
          catalog: isProductCatalogHide,
          images: true,
        },
        type: 'CHAT',
      },
    });
  }

  onCancel(): void {
    // todo: Check route and use route.navigate instead
    this.location.back();
  }
}
