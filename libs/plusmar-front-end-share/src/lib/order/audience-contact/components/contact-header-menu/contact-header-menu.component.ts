import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { LeadsActionComponent } from '@reactor-room/plusmar-front-end-share/order/leads/components/leads-action/leads-action.component';
import { ComponentLoaderDirective, ComponentLoaderService } from '@reactor-room/itopplus-front-end-helpers';
import { AudienceDomainStatus, AudienceDomainType, AudienceViewType, IAudience } from '@reactor-room/itopplus-model-lib';
import { AudienceActionComponent } from '@reactor-room/plusmar-front-end-share/order/audience/components/audience-action/audience-action.component';
import { OrderActionComponent } from '@reactor-room/plusmar-front-end-share/order/follow-customer/components/order-action/order-action.component';

@Component({
  selector: 'reactor-room-contact-header-menu',
  templateUrl: './contact-header-menu.component.html',
  styleUrls: ['./contact-header-menu.component.scss'],
})
export class ContactHeaderMenuComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(ComponentLoaderDirective, { static: true }) public componentLoader: ComponentLoaderDirective;
  @Input() audience: IAudience;
  @Input() route: AudienceViewType;

  selector = 'HEADER';

  constructor(public componentLoaderService: ComponentLoaderService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.loadComponent();
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  loadComponent(): void {
    switch (this.audience.domain) {
      case AudienceDomainType.CUSTOMER: {
        if (this.route === AudienceViewType.LEAD) {
          const instance = this.componentLoaderService.loadComponent(LeadsActionComponent, this.componentLoader).instance as AudienceActionComponent;
          instance.selector = this.selector;
        } else {
          const instance = this.componentLoaderService.loadComponent(OrderActionComponent, this.componentLoader).instance as OrderActionComponent;
          instance.selector = this.selector;
        }
        break;
      }
      case AudienceDomainType.AUDIENCE: {
        if (this.audience.status === AudienceDomainStatus.LEAD) {
          const instance = this.componentLoaderService.loadComponent(LeadsActionComponent, this.componentLoader).instance as AudienceActionComponent;
          instance.selector = this.selector;
        } else {
          const instance = this.componentLoaderService.loadComponent(AudienceActionComponent, this.componentLoader).instance as AudienceActionComponent;
          instance.selector = this.selector;
        }
        break;
      }
      case AudienceDomainType.LEADS: {
        const instance = this.componentLoaderService.loadComponent(LeadsActionComponent, this.componentLoader).instance as AudienceActionComponent;
        instance.selector = this.selector;
        break;
      }
      default: {
        break;
      }
    }
  }
}
