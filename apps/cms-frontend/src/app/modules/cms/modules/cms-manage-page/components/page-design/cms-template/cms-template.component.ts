import { DragDrop } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { MenuGenericType } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { CmsEditService } from '../../../../../services/cms-edit.service';
import { DragRefData } from '../../../../cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { IPageDesignMenu } from '../page-design.model';

@Component({
  selector: 'cms-next-cms-template',
  templateUrl: './cms-template.component.html',
  styleUrls: ['./cms-template.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsTemplateComponent implements OnInit, OnDestroy {
  @ViewChild('template', { static: true }) template: ElementRef<HTMLImageElement>;
  destroy$ = new Subject();
  pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/template.svg',
    activeIcon: 'assets/design-sections/template-a.svg',
    title: 'Template',
    isActive: false,
  };
  constructor(private cmsEditService: CmsEditService, private dragDrop: DragDrop) {}

  ngOnInit(): void {
    const dragRef = this.dragDrop.createDrag<DragRefData>(this.template);
    dragRef.data = { dropListRef: null, type: null, genericType: MenuGenericType.TEMPLATE_ELEMENTS };
    this.cmsEditService.dragHandler(dragRef, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef);
  }

  onActivateChildContainer(): void {
    this.pageDesignMenu.isActive = !this.pageDesignMenu.isActive;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
