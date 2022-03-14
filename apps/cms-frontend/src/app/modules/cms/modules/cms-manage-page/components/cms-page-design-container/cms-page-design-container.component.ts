import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CmsEditService } from '../../../../services/cms-edit.service';
import { DragDrop, DropListRef } from '@angular/cdk/drag-drop';
import { DragRefs } from '../../../cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { ELandingMode } from '../../../../containers/cms-sidebar/cms-sidebar.model';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';

@Component({
  selector: 'cms-next-cms-page-design-container',
  templateUrl: './cms-page-design-container.component.html',
  styleUrls: ['./cms-page-design-container.component.scss'],
})
export class CmsPageDesignContainerComponent implements OnInit, OnDestroy {
  @ViewChild('section', { static: true }) section: ElementRef<HTMLElement>;
  @ViewChild('removedZone', { static: true }) removedZone: ElementRef<HTMLElement>;
  dropListRef: DropListRef;
  landingMode: ELandingMode = null;
  ELandingMode = ELandingMode;
  constructor(private cmsEditService: CmsEditService, private dragDrop: DragDrop, private cmsSidebarService: CmsSidebarService) {}

  ngOnInit(): void {
    this.dropListRef = this.dragDrop.createDropList<DragRefs>(this.section);
    this.dropListRef.sortingDisabled = true;
    this.dropListRef.data = { dragRefs: [] };
    this.cmsEditService.addMenuDropListRef(this.dropListRef);
    this.cmsSidebarService.getLandingMode.subscribe((mode) => {
      this.landingMode = mode;
    });
  }
  ngOnDestroy(): void {
    this.dropListRef.dispose();
  }
}
