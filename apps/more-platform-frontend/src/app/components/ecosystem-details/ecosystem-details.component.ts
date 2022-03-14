import { Component, OnInit } from '@angular/core';
import { EcosystemColorEnum, EcosystemIconEnum, EcosystemKeyEnum, EcosystemRouteEnum, EcosystemTitleEnum, IEcosystem } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'more-platform-ecosystem-details',
  templateUrl: './ecosystem-details.component.html',
  styleUrls: ['./ecosystem-details.component.scss'],
})
export class EcosystemDetailsComponent implements OnInit {
  ecosystemProducts: IEcosystem[] = [
    {
      key: EcosystemKeyEnum.CMS,
      route: EcosystemRouteEnum.CMS,
      title: EcosystemTitleEnum.CMS,
      activeStatus: false,
      icon: EcosystemIconEnum.CMS,
      backgroundImg: 'assets/img/ecosystem/cms-bg.svg',
      colorCode: EcosystemColorEnum.CMS,
      allowChangeRoute: true,
    },
    {
      key: EcosystemKeyEnum.SOCIAL,
      route: EcosystemRouteEnum.SOCIAL,
      title: EcosystemTitleEnum.SOCIAL,
      activeStatus: false,
      icon: EcosystemIconEnum.SOCIAL,
      backgroundImg: 'assets/img/ecosystem/social-bg.svg',
      colorCode: EcosystemColorEnum.SOCIAL,
      allowChangeRoute: true,
    },
    {
      key: EcosystemKeyEnum.AUTODIGI,
      route: EcosystemRouteEnum.AUTODIGI,
      title: EcosystemTitleEnum.AUTODIGI,
      activeStatus: false,
      icon: EcosystemIconEnum.AUTODIGI,
      backgroundImg: 'assets/img/ecosystem/autodigi-bg.svg',
      colorCode: EcosystemColorEnum.AUTODIGI,
      allowChangeRoute: true,
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
