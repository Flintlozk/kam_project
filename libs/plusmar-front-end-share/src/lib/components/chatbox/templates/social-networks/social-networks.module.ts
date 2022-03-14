import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SocialNetworksComponent } from './social-networks.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TemplatesService } from '../templates.service';

@NgModule({
  declarations: [SocialNetworksComponent],
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  providers: [TemplatesService],
  exports: [SocialNetworksComponent],
})
export class SocialNetworksModule {}
