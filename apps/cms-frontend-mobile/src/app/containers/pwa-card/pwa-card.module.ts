import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaCardComponent } from './pwa-card.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PwaCardComponent],
  imports: [CommonModule, ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }), TranslateModule],
  exports: [PwaCardComponent],
})
export class PwaCardModule {}
