import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICmsSite } from '../../../cms-site-menu.model';
import { SiteOptionActionTypes } from './cms-site-menu-option.model';

@Component({
  selector: 'cms-next-cms-site-menu-option',
  templateUrl: './cms-site-menu-option.component.html',
  styleUrls: ['./cms-site-menu-option.component.scss'],
})
export class CmsSiteMenuOptionComponent implements OnInit {
  @Input() siteItem: ICmsSite;
  @Input() showHide = false;
  @Output() siteMenuOptionEvent: EventEmitter<SiteOptionActionTypes> = new EventEmitter();
  siteOptionActionTypes = SiteOptionActionTypes;
  constructor() {}

  ngOnInit(): void {}

  onMenuIOptionAction(action: SiteOptionActionTypes): void {
    this.siteMenuOptionEvent.emit(action);
  }
}
