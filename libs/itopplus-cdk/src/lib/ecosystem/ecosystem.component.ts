import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { EcosystemColorEnum, EcosystemIconWhiteEnum, EcosystemKeyEnum, EcosystemRouteEnum, EcosystemTitleEnum, IEcosystem } from './ecosystem.model';

@Component({
  selector: 'reactor-room-ecosystem',
  templateUrl: './ecosystem.component.html',
  styleUrls: ['./ecosystem.component.less'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class EcosystemComponent implements OnInit, OnDestroy {
  backtoLink = '#';
  @Input() currentApp: EcosystemKeyEnum;
  @Input() isTitle = true;
  @Input() isDarkMode = false;
  @Input() position = 'right';
  @Output() handleRedirect: EventEmitter<IEcosystem> = new EventEmitter<IEcosystem>();

  iconToggleStatus = false;
  ecosystemProducts: IEcosystem[] = [
    {
      key: EcosystemKeyEnum.CMS,
      route: EcosystemRouteEnum.CMS,
      title: EcosystemTitleEnum.CMS,
      activeStatus: false,
      icon: EcosystemIconWhiteEnum.CMS,
      backgroundImg: '',
      colorCode: EcosystemColorEnum.CMS,
      allowChangeRoute: true,
    },
    {
      key: EcosystemKeyEnum.SOCIAL,
      route: EcosystemRouteEnum.SOCIAL,
      title: EcosystemTitleEnum.SOCIAL,
      activeStatus: false,
      icon: EcosystemIconWhiteEnum.SOCIAL,
      backgroundImg: '',
      colorCode: EcosystemColorEnum.SOCIAL,
      allowChangeRoute: true,
    },
    {
      key: EcosystemKeyEnum.AUTODIGI,
      route: EcosystemRouteEnum.AUTODIGI,
      title: EcosystemTitleEnum.AUTODIGI,
      activeStatus: false,
      icon: EcosystemIconWhiteEnum.AUTODIGI,
      backgroundImg: '',
      colorCode: EcosystemColorEnum.AUTODIGI,
      allowChangeRoute: true,
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.ecosystemProducts.map((item) => {
      if (item.key === this.currentApp) {
        item.activeStatus = true;
        item.allowChangeRoute = false;
      }
    });
    // if (!this.handleRedirect.closed) this.handleRedirect = new Subject<IEcosystem>();
    // this.setActiveEcosystemProduct();
    // Note : Will set after implements all product
  }

  ngOnDestroy(): void {
    // this.handleRedirect.unsubscribe();
  }

  setActiveEcosystemProduct(): void {
    const { href } = window.location;
    this.ecosystemProducts.forEach((item) => {
      if (href.includes(item.key)) {
        item.activeStatus = true;
      } else {
        item.activeStatus = false;
      }
    });
  }
  onToggleIconStatus(): void {
    this.iconToggleStatus = !this.iconToggleStatus;
  }

  onOutsideContainer(event: boolean): void {
    if (event) {
      this.iconToggleStatus = false;
    }
  }

  onRouteRedirect(system: IEcosystem) {
    if (system.allowChangeRoute) {
      // if (system.key === EcosystemKeyEnum.AUTODIGI) {
      this.handleRedirect.emit(system);
      // } else {
      // window.location.href = system.route;
      // }
    }
  }
}
