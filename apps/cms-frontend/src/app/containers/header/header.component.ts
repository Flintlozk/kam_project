import { Component, OnInit } from '@angular/core';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { EcosystemKeyEnum, IEcosystem } from '@reactor-room/itopplus-cdk';
import { EcosystemService } from '../../services/ecosystem.service';

@Component({
  selector: 'cms-next-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentApp = EcosystemKeyEnum.CMS;
  constructor(public ecosystemService: EcosystemService) {}

  ngOnInit(): void {}

  handleRedirect(ecoSystem: IEcosystem): void {
    switch (ecoSystem.key) {
      case EcosystemKeyEnum.SOCIAL:
        this.loginMoreCommerce(ecoSystem);
        break;
      case EcosystemKeyEnum.AUTODIGI:
        this.loginAutodigi(ecoSystem);
        break;
    }
  }

  loginMoreCommerce(ecoSystem: IEcosystem): void {
    this.ecosystemService.loginToMoreCommerce().subscribe((response) => {
      if (response.status !== 200) {
        // window.location.href = ecoSystem.route;
        window.open(ecoSystem.route, '__blank');
      } else {
        // window.location.href = environmentLib.origin;
        window.open(environmentLib.origin, '__blank');
      }
    });
  }
  loginAutodigi(ecoSystem: IEcosystem): void {
    this.ecosystemService.loginToAutodigi().subscribe((response) => {
      if (response.status !== 200) {
        // window.location.href = ecoSystem.route;
        window.open(ecoSystem.route, '__blank');
      } else {
        const token = response.value;
        // window.location.href = `${environmentLib.AUTODIGI_URL}/mclogin/${token}&redirectTo=AUTH`; // TODO : Redirec to Token validate route
        window.open(`${environmentLib.AUTODIGI_URL}/mclogin/${token}&redirectTo=AUTH`, '__blank'); // TODO : Redirec to Token validate route
      }
    });
  }
}
