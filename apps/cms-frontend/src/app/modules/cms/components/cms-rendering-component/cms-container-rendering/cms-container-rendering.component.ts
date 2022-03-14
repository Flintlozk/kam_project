import { DragRef } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICommonSettings, IThemeOption } from '@reactor-room/cms-models-lib';
import { Mixin } from 'ts-mixer';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { ESidebarLayoutTab } from '../../../containers/cms-sidebar/components/cms-layout/cms-layout.model';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { DragRefData } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { clearDragRef } from '../../../../../shares/utils';
import { ComponentLayoutDirective } from '../../../directives/component-layout/component-layout.directive';
import { CmsPublishService } from '../../../services/cms-publish.service';

@Component({
  selector: 'cms-next-cms-container-rendering',
  templateUrl: './cms-container-rendering.component.html',
  styleUrls: ['./cms-container-rendering.component.scss'],
})
export class CmsContainerRenderingComponent
  extends Mixin(ComponentDesignDirective, ComponentSettingDirective, ComponentLayoutDirective)
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  public onFocus = false;
  public dragRef: DragRef<DragRefData>;
  public themeOption: IThemeOption;
  public componentType = 'CmsContainerRenderingComponent';
  @ViewChild('container') container: ElementRef;
  isChildEnter = false;
  isEmptyContainer = true;
  DOMObserver$: MutationObserver;
  constructor(public el: ElementRef, public sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, public cmsPublishService: CmsPublishService) {
    super(el, sidebarService, cmsPublishService);
  }

  @Input() renderingComponentDataContainer: ICommonSettings;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    clearDragRef(this.dragRef);
    if (this.DOMObserver$) {
      this.DOMObserver$.disconnect();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.renderingComponentDataContainer.currentValue && this.renderingComponentDataContainer) {
      this.el.nativeElement.classList.add('rendering-item');
      const { border, shadow, effect, advance, background, customize, hover } = this.renderingComponentDataContainer;
      if (border) this.performSetLayoutSettingBorderValueToElementStyle(border);
      if (shadow) this.performsetLayoutSettingShadowValueToElementStyle(shadow);
      if (effect) this.performSetLayoutEffectValueToElementStyle(effect);
      if (advance) this.performSetLayoutSettingAdvanceValueToElementStyle(advance);

      if (hover) this.performSetLayoutSettingHoverValueToElementStyle(hover);
      if (background) this.performSetLayoutSettingBackgroundValueToElementStyle(background);
      if (customize) this.performSetLayoutSettingCustomizeValueToElementStyle(customize);
    }
  }

  ngAfterViewInit(): void {
    this.onCheckEmptyContainer();
  }

  onCheckEmptyContainer(): void {
    let containerLength = this.container.nativeElement.children.length;
    this.isEmptyContainer = containerLength ? false : true;
    this.DOMObserver$ = new MutationObserver(() => {
      containerLength = this.container.nativeElement.children.length;
      this.isEmptyContainer = containerLength ? false : true;
    });
    const config = { attributes: true, childList: true, characterData: false };
    this.DOMObserver$.observe(this.container.nativeElement, config);
  }

  onContainerEditorFocusEvent(): void {
    if (this.isChildEnter) return;
    this.onContainerEditorFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_CONTAINER);
      this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DESIGN);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
    }, 0);
  }

  onContainerEditorFocusComponent(component: CmsContainerRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
  }

  mouseEnterEvent(): void {
    this.isChildEnter = true;
  }

  mouseLeaveEvent(): void {
    this.isChildEnter = false;
  }
}
