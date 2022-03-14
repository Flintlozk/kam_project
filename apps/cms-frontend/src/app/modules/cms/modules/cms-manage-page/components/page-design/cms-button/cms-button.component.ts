import { DragDrop } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { ButtonType, MenuGenericType } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { CmsEditService } from '../../../../../services/cms-edit.service';
import { DragRefData } from '../../../../cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { IPageDesignMenu } from '../page-design.model';

@Component({
  selector: 'cms-next-cms-button',
  templateUrl: './cms-button.component.html',
  styleUrls: ['./cms-button.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsButtonComponent implements OnInit, OnDestroy {
  @ViewChild('button', { static: true }) buttonRef: ElementRef<HTMLDivElement>;
  pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/button.svg',
    activeIcon: 'assets/design-sections/button-a.svg',
    title: 'Button',
    isActive: false,
  };
  destroy$ = new Subject();
  constructor(private cmsEditService: CmsEditService, private dragDrop: DragDrop) {}

  ngOnInit(): void {
    const dragRef = this.dragDrop.createDrag<DragRefData>(this.buttonRef);
    dragRef.data = { dropListRef: null, type: ButtonType.TYPE_1, genericType: MenuGenericType.BUTTON };
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
