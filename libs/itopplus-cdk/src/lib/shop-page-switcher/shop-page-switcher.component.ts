import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnumAuthScope, EnumWizardStepType, IPagesContext, IPageWithStatus, IUserContext } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-shop-page-switcher',
  templateUrl: './shop-page-switcher.component.html',
  styleUrls: ['./shop-page-switcher.component.scss'],
})
export class ShopPageSwitcherComponent implements OnInit {
  @Input() userContext: IUserContext;
  @Input() facebookPageData: IPageWithStatus[] = [];
  @Input() pageTitleActive: string;
  @Input() pageImgUrlActive: string;
  @Input() isOwner: boolean;
  @Input() enableCreateShop: boolean;
  @Input() menuStatus: boolean;
  @Output() pageListClicked = new EventEmitter<boolean>();
  @Output() pageDataClicked = new EventEmitter<IPagesContext>();
  @Output() createPageClicked = new EventEmitter<void>();

  @Input() theme: EnumAuthScope;
  themeType = EnumAuthScope;

  tooglePageListStatus = false;
  EnumWizardStep = EnumWizardStepType;
  constructor() {}

  ngOnInit(): void {}

  clickOutsidePageListEvent(event): void {
    if (event) {
      this.tooglePageListStatus = false;
    }
  }
  togglePageList(): void {
    this.tooglePageListStatus = !this.tooglePageListStatus;
    this.pageListClicked.emit(this.tooglePageListStatus);
  }
  setPageItemStatus(page: IPagesContext): void {
    this.tooglePageListStatus = false;
    this.pageDataClicked.emit(page);
  }
  createPage() {
    this.tooglePageListStatus = false;
    this.createPageClicked.emit();
  }
}
