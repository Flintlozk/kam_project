import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input, OnChanges } from '@angular/core';
import { ComponentLoaderDirective, ComponentLoaderService } from '@reactor-room/itopplus-front-end-helpers';

import { AudienceActionComponent } from '@reactor-room/plusmar-front-end-share/order/audience/components/audience-action/audience-action.component';
import { OrderActionComponent } from '@reactor-room/plusmar-front-end-share/order/follow-customer/components/order-action/order-action.component';
import { IAudience, AudienceDomainType, AudienceDomainStatus, AudienceViewType } from '@reactor-room/itopplus-model-lib';
import { LeadsActionComponent } from '@reactor-room/plusmar-front-end-share/order/leads/components/leads-action/leads-action.component';

@Component({
  selector: 'reactor-room-contact-chat-menu',
  templateUrl: './contact-chat-menu.component.html',
  styleUrls: ['./contact-chat-menu.component.scss'],
})
export class ContactChatMenuComponent implements OnInit, OnChanges {
  @ViewChild(ComponentLoaderDirective, { static: true }) public componentLoader: ComponentLoaderDirective;
  @Input() audience: IAudience;
  @Input() route: AudienceViewType;
  componentToLoad = AudienceActionComponent;

  selector = 'BUTTON';

  constructor(public componentLoaderService: ComponentLoaderService) {}

  ngOnInit(): void {
    this.loadComponent();
  }
  ngOnChanges(): void {
    this.loadComponent();
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
