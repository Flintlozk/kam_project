import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteDetailsComponent } from './site-details.component';
import { RouterModule } from '@angular/router';
import { EditSiteButtonModule } from 'apps/cms-frontend/src/app/components/edit-site-button/edit-site-button.module';
import { MockSiteButtonModule } from 'apps/cms-frontend/src/app/components/mock-site-button/mock-site-button.module';

@NgModule({
  declarations: [SiteDetailsComponent],
  imports: [CommonModule, RouterModule, EditSiteButtonModule, MockSiteButtonModule],
  exports: [SiteDetailsComponent],
})
export class SiteDetailsModule {}
