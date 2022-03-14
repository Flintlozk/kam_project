import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ShoppingCartTypes } from '@reactor-room/cms-models-lib';
import { CmsShoppingCartRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-shopping-cart-rendering/cms-shopping-cart-rendering.component';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ESidebarElement, ISidebarElement } from '../../../../cms-sidebar.model';
import { shoppingCartLayoutList } from '../../cms-layout.list';

@Component({
  selector: 'cms-next-cms-layout-setting-shopping-cart',
  templateUrl: './cms-layout-setting-shopping-cart.component.html',
  styleUrls: ['./cms-layout-setting-shopping-cart.component.scss'],
})
export class CmsLayoutSettingShoppingCartComponent implements OnInit {
  shoppingCartForm = new FormGroup({});
  ESidebarElement = ESidebarElement;
  toggleData: ISidebarElement[] = shoppingCartLayoutList;
  componentType: CmsShoppingCartRenderingComponent;
  shoppingCartRenderType: ShoppingCartTypes;

  constructor(private cmsSidebarService: CmsSidebarService, private cmsEditService: CmsEditService) {
    this.cmsSidebarService.getSidebarElement.subscribe((sidebarElement: { element: ESidebarElement; isUndoRedo: boolean }) => {
      if (sidebarElement) this.toggleData = this.cmsSidebarService.sidebarElementHandler(sidebarElement.element, this.toggleData, sidebarElement.isUndoRedo);
    });
  }

  ngOnInit(): void {
    this.setShoppingCartRenderType();
  }

  setShoppingCartRenderType(): void {
    this.componentType = this.cmsEditService.currentComponent as CmsShoppingCartRenderingComponent;
    this.shoppingCartRenderType = this.componentType.shoppingCartRenderType;
  }

  onToggleItem(element: ESidebarElement): void {
    this.cmsSidebarService.setSidebarElement(element, false);
  }
}
