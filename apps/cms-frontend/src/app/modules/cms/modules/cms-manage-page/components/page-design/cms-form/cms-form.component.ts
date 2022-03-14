import { Component, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { IPageDesignMenu } from '../page-design.model';

@Component({
  selector: 'cms-next-cms-form',
  templateUrl: './cms-form.component.html',
  styleUrls: ['./cms-form.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsFormComponent implements OnInit {
  pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/form.svg',
    activeIcon: 'assets/design-sections/form-a.svg',
    title: 'Form',
    isActive: false,
  };
  constructor() {}

  ngOnInit(): void {}

  onActivateChildContainer(): void {
    this.pageDesignMenu.isActive = !this.pageDesignMenu.isActive;
  }
}
