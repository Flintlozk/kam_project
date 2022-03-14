import { DragDrop } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { MenuGenericType, MenuRenderingType } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { CmsEditService } from '../../../../../services/cms-edit.service';
import { DragRefData } from '../../../../cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { IPageDesignMenu } from '../page-design.model';

@Component({
  selector: 'cms-next-cms-menu',
  templateUrl: './cms-menu.component.html',
  styleUrls: ['./cms-menu.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsMenuComponent implements OnInit, OnDestroy {
  @ViewChild('menu', { static: true }) menuRef: ElementRef<HTMLDivElement>;
  pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/menu.svg',
    activeIcon: 'assets/design-sections/menu-a.svg',
    title: 'Menu',
    isActive: false,
  };
  destroy$ = new Subject();
  constructor(private cmsEditService: CmsEditService, private dragDrop: DragDrop) {}

  ngOnInit(): void {
    const dragRef = this.dragDrop.createDrag<DragRefData>(this.menuRef);
    dragRef.data = { dropListRef: null, type: MenuRenderingType.MENU_TYPE_1, genericType: MenuGenericType.MENU };
    this.cmsEditService.dragHandler(dragRef, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onActivateChildContainer(): void {
    this.pageDesignMenu.isActive = !this.pageDesignMenu.isActive;
  }
}
