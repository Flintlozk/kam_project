import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FormTemplatesModule } from './form-templates/form-templates.module';
import { ImagesTemplatesModule } from './images-templates/images-templates.module';
import { MessageTemplatesModule } from './message-templates/message-templates.module';
import { ProductCatalogModule } from './product-catalog/product-catalog.module';
import { ProductChatModule } from './product-chat/product-chat.module';
import { SocialNetworksModule } from './social-networks/social-networks.module';
import { TemplatesComponent } from './templates.component';

@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatTabsModule,
    TranslateModule,
    FormTemplatesModule,
    MessageTemplatesModule,
    ProductChatModule,
    SocialNetworksModule,
    ImagesTemplatesModule,
    ProductCatalogModule,
  ],
  exports: [TemplatesComponent],
})
export class TemplatesModule {}
