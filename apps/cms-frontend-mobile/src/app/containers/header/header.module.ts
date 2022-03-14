import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { EcosystemModule } from '@reactor-room/itopplus-cdk';
@NgModule({
  declarations: [HeaderComponent],
  imports: [RouterModule, EcosystemModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
