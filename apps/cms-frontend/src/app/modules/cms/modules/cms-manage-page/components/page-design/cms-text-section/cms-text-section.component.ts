import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { IPageDesignMenu } from '../page-design.model';
import { CmsComponent, MenuGenericType, TextType } from '@reactor-room/cms-models-lib';
import { CmsEditService } from '../../../../../services/cms-edit.service';
import { DragDrop } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { DragRefData } from '../../../../cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';

@Component({
  selector: 'cms-next-cms-text-section',
  templateUrl: './cms-text-section.component.html',
  styleUrls: ['./cms-text-section.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsTextSectionComponent implements OnInit, OnDestroy {
  @ViewChild('text1', { static: true }) text1: ElementRef<HTMLImageElement>;
  @ViewChild('text2', { static: true }) text2: ElementRef<HTMLImageElement>;
  @ViewChild('text3', { static: true }) text3: ElementRef<HTMLImageElement>;
  @ViewChild('text4', { static: true }) text4: ElementRef<HTMLImageElement>;
  @ViewChild('text5', { static: true }) text5: ElementRef<HTMLImageElement>;
  destroy$ = new Subject();
  public pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/text-section.svg',
    activeIcon: 'assets/design-sections/text-section-a.svg',
    title: 'Text Section',
    isActive: false,
  };

  public textInlineTemplateComponentList: CmsComponent[] = [
    {
      name: 'simple text 1',
      picture: 'assets/components/text/1.simpletext.svg',
    },
    {
      name: 'simple text 2',
      picture: 'assets/components/text/2.simpletext.svg',
    },
    {
      name: 'simple text 3',
      picture: 'assets/components/text/3.simpletext.svg',
    },
    {
      name: 'simple text 4',
      picture: 'assets/components/text/4.simpletext.svg',
    },
    {
      name: 'simple text 5',
      picture: 'assets/components/text/5.simpletext.svg',
    },
  ];

  constructor(private cmsEditService: CmsEditService, private dragDrop: DragDrop) {}

  ngOnInit(): void {
    const dragRef1 = this.dragDrop.createDrag<DragRefData>(this.text1);
    dragRef1.data = { dropListRef: null, type: TextType.Text1, genericType: MenuGenericType.TEXT };
    this.cmsEditService.dragHandler(dragRef1, this.destroy$);
    const dragRef2 = this.dragDrop.createDrag<DragRefData>(this.text2);
    dragRef2.data = { dropListRef: null, type: TextType.Text2, genericType: MenuGenericType.TEXT };
    this.cmsEditService.dragHandler(dragRef2, this.destroy$);
    const dragRef3 = this.dragDrop.createDrag<DragRefData>(this.text3);
    dragRef3.data = { dropListRef: null, type: TextType.Text3, genericType: MenuGenericType.TEXT };
    this.cmsEditService.dragHandler(dragRef3, this.destroy$);
    const dragRef4 = this.dragDrop.createDrag<DragRefData>(this.text4);
    dragRef4.data = { dropListRef: null, type: TextType.Text4, genericType: MenuGenericType.TEXT };
    this.cmsEditService.dragHandler(dragRef4, this.destroy$);
    const dragRef5 = this.dragDrop.createDrag<DragRefData>(this.text5);
    dragRef5.data = { dropListRef: null, type: TextType.Text5, genericType: MenuGenericType.TEXT };
    this.cmsEditService.dragHandler(dragRef5, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef1);
    this.cmsEditService.addMenuDragRef(dragRef2);
    this.cmsEditService.addMenuDragRef(dragRef3);
    this.cmsEditService.addMenuDragRef(dragRef4);
    this.cmsEditService.addMenuDragRef(dragRef5);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onActivateChildContainer(): void {
    this.pageDesignMenu.isActive = !this.pageDesignMenu.isActive;
  }
}
