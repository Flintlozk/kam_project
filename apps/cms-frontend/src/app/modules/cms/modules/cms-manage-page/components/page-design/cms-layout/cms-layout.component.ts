import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { IPageDesignMenu } from '../page-design.model';
import { CmsEditService } from '../../../../../services/cms-edit.service';
import { DragDrop } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { ELayoutColumns, MenuGenericType } from '@reactor-room/cms-models-lib';
import { DragRefData } from '../../../../cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';

@Component({
  selector: 'cms-next-cms-layout',
  templateUrl: './cms-layout.component.html',
  styleUrls: ['./cms-layout.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('layout1', { static: true }) layout1: ElementRef<HTMLDivElement>;
  @ViewChild('layout2', { static: true }) layout2: ElementRef<HTMLDivElement>;
  @ViewChild('layout3', { static: true }) layout3: ElementRef<HTMLDivElement>;
  @ViewChild('layout4', { static: true }) layout4: ElementRef<HTMLDivElement>;
  @ViewChild('layout5', { static: true }) layout5: ElementRef<HTMLDivElement>;
  @ViewChild('layout6', { static: true }) layout6: ElementRef<HTMLDivElement>;
  @ViewChild('layout7', { static: true }) layout7: ElementRef<HTMLDivElement>;
  @ViewChild('layout8', { static: true }) layout8: ElementRef<HTMLDivElement>;
  pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/layout.svg',
    activeIcon: 'assets/design-sections/layout-a.svg',
    title: 'Layout',
    isActive: false,
  };
  destroy$ = new Subject();
  constructor(private cmsEditService: CmsEditService, private dragDrop: DragDrop) {}

  ngOnInit(): void {
    const dragRef1 = this.dragDrop.createDrag<DragRefData>(this.layout1);
    dragRef1.data = { dropListRef: null, type: ELayoutColumns.ONE_COLUMN, genericType: MenuGenericType.LAYOUT };
    this.cmsEditService.dragHandler(dragRef1, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef1);

    const dragRef2 = this.dragDrop.createDrag<DragRefData>(this.layout2);
    dragRef2.data = { dropListRef: null, type: ELayoutColumns.FIVE_FIVE_COLUMN, genericType: MenuGenericType.LAYOUT };
    this.cmsEditService.dragHandler(dragRef2, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef2);

    const dragRef3 = this.dragDrop.createDrag<DragRefData>(this.layout3);
    dragRef3.data = { dropListRef: null, type: ELayoutColumns.SIX_FOUR_COLUMN, genericType: MenuGenericType.LAYOUT };
    this.cmsEditService.dragHandler(dragRef3, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef3);

    const dragRef4 = this.dragDrop.createDrag<DragRefData>(this.layout4);
    dragRef4.data = { dropListRef: null, type: ELayoutColumns.FOUR_SIX_COLUMN, genericType: MenuGenericType.LAYOUT };
    this.cmsEditService.dragHandler(dragRef4, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef4);

    const dragRef5 = this.dragDrop.createDrag<DragRefData>(this.layout5);
    dragRef5.data = { dropListRef: null, type: ELayoutColumns.SEVEN_THREE_COLUMN, genericType: MenuGenericType.LAYOUT };
    this.cmsEditService.dragHandler(dragRef5, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef5);

    const dragRef6 = this.dragDrop.createDrag<DragRefData>(this.layout6);
    dragRef6.data = { dropListRef: null, type: ELayoutColumns.THREE_SEVEN_COLUMN, genericType: MenuGenericType.LAYOUT };
    this.cmsEditService.dragHandler(dragRef6, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef6);

    const dragRef7 = this.dragDrop.createDrag<DragRefData>(this.layout7);
    dragRef7.data = { dropListRef: null, type: ELayoutColumns.THREE_COLUMN, genericType: MenuGenericType.LAYOUT };
    this.cmsEditService.dragHandler(dragRef7, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef7);

    const dragRef8 = this.dragDrop.createDrag<DragRefData>(this.layout8);
    dragRef8.data = { dropListRef: null, type: ELayoutColumns.FOUR_COLUMN, genericType: MenuGenericType.LAYOUT };
    this.cmsEditService.dragHandler(dragRef8, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef8);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onActivateChildContainer(): void {
    this.pageDesignMenu.isActive = !this.pageDesignMenu.isActive;
  }
}
