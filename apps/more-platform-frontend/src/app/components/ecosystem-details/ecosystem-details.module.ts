import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcosystemDetailsComponent } from './ecosystem-details.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [EcosystemDetailsComponent],
  imports: [CommonModule, RouterModule],
  exports: [EcosystemDetailsComponent],
})
export class EcosystemDetailsModule {}
