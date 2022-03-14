import { Injectable, OnDestroy, QueryList, ViewContainerRef } from '@angular/core';
import { getComponent, getComponentFromLView, getDOMElement, getLView } from '../../../shares/utils';
import { CmsLayoutRenderingComponent } from '../components/cms-rendering-component/cms-layout-rendering/cms-layout-rendering.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ColumnType,
  ComponentOptions,
  ComponentTypeEnum,
  IButtonRenderingSetting,
  ICommonSettings,
  IContentManagementRenderingSetting,
  IDeltaRenderingComponentData,
  ILandingContentManagementRenderingSetting,
  IMediaGalleryItemRenderingSetting,
  IMediaGalleryRenderingSetting,
  IMenuRenderingSetting,
  IRenderingComponentData,
  IShoppingCartRenderingSetting,
  ITextRenderingSetting,
} from '@reactor-room/cms-models-lib';
import { CmsThemeRenderingComponent } from '../components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { CmsContainerRenderingComponent } from '../components/cms-rendering-component/cms-container-rendering/cms-container-rendering.component';
import { CmsTextRenderingComponent } from '../components/cms-rendering-component/cms-text-rendering/cms-text-rendering.component';
import { CmsMediaGalleryRenderingComponent } from '../components/cms-rendering-component/cms-media-gallery-rendering/cms-media-gallery-rendering.component';
import { CmsMediaGalleryItemRenderingComponent } from '../components/cms-rendering-component/cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.component';
import { CmsContentManagementRenderingComponent } from '../components/cms-rendering-component/cms-content-management-rendering/cms-content-management-rendering.component';
import { WebsiteService } from './website.service';
import { CmsButtonRenderingComponent } from '../components/cms-rendering-component/cms-button-rendering/cms-button-rendering.component';
import * as lzString from 'lz-string';
import stringify from 'fast-json-stable-stringify';
import { ThemeContentChildren } from '../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsHeaderContainerRenderingComponent } from '../components/cms-rendering-component/cms-header-container-rendering/cms-header-container-rendering.component';
import { CmsFooterContainerRenderingComponent } from '../components/cms-rendering-component/cms-footer-container-rendering/cms-footer-container-rendering.component';
import { CmsContentContainerRenderingComponent } from '../components/cms-rendering-component/cms-content-container-rendering/cms-content-container-rendering.component';
import { generatePrevId } from '../../../domain/publish/publish.domain';
import { catchError, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { CmsMenuRenderingComponent } from '../components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { CmsContentManagementLandingRenderingComponent } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-management-landing-rendering.component';
import { CmsContentColumnRenderingComponent } from '../components/cms-rendering-component/cms-content-editor/cms-content-column-rendering/cms-content-column-rendering.component';
import { CmsContentEmbededRenderingComponent } from '../components/cms-rendering-component/cms-content-editor/cms-content-embeded-rendering/cms-content-embeded-rendering.component';
import { CmsContentImageRenderingComponent } from '../components/cms-rendering-component/cms-content-editor/cms-content-image-rendering/cms-content-image-rendering.component';
import { CmsContentSectionRenderingComponent } from '../components/cms-rendering-component/cms-content-editor/cms-content-section-rendering/cms-content-section-rendering.component';
import { CmsContentTextRenderingComponent } from '../components/cms-rendering-component/cms-content-editor/cms-content-text-rendering/cms-content-text-rendering.component';
import { CmsShoppingCartRenderingComponent } from './../components/cms-rendering-component/cms-shopping-cart-rendering/cms-shopping-cart-rendering.component';

function makeComponentKeys(components: IRenderingComponentData[], key: '_id' | 'prevId' | 'nextId'): { [key: string]: IRenderingComponentData } {
  const keys: { [key: string]: IRenderingComponentData } = {};
  for (let i = 0; i < components.length; i++) {
    const c = components[i];
    const id = c[key];
    keys[id] = c;
  }
  return keys;
}

@Injectable()
export class CmsPublishService implements OnDestroy {
  private themeComponentQueryList: QueryList<ThemeContentChildren>;
  private componentData: IRenderingComponentData[] = [];
  private themeData: IRenderingComponentData[] = [];
  webPageID: string;
  idMappingPageComponent: { [key: string]: string } = {};
  destroy$: Subject<boolean> = new Subject<boolean>();
  savingTrigger$ = new Subject();
  newIdUpdated$ = new Subject<string>();
  private isPublish$ = new BehaviorSubject(false);
  getIsPublish = this.isPublish$.asObservable();
  constructor(private websiteService: WebsiteService, private snackBar: MatSnackBar) {}
  setIsPublish(status: boolean): void {
    this.isPublish$.next(status);
  }
  initComponentData(componentData: IRenderingComponentData[], webPageID: string): void {
    this.componentData = deepCopy(componentData);
    this.componentData.forEach((component) => {
      delete component?.commonSettings?.className;
    });
    this.webPageID = webPageID;
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  initThemeData(themeData: IRenderingComponentData[]): void {
    const filterType = [
      ComponentTypeEnum.CMS_NEXT_CMS_HEADER_CONTAINER_RENDERING,
      ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_CONTAINER_RENDERING,
      ComponentTypeEnum.CMS_NEXT_CMS_FOOTER_CONTAINER_RENDERING,
    ];
    themeData.forEach((component) => {
      component._id = component.themeOption?.themeIdentifier;
      delete component.commonSettings?.className;
      delete component.section;
    });
    this.themeData = deepCopy(themeData.filter((themeComponent) => !filterType.includes(themeComponent.componentType)));
  }

  savePageThemeComponents(insertPoint: ViewContainerRef, headerInsertPoint: ViewContainerRef, footerInsertPoint: ViewContainerRef): void {
    let currentComponentData = this.getAllComponentData(insertPoint);
    const componentsDelta = this.getDeltaComponent(currentComponentData, this.componentData);
    const headerData = this.getAllComponentData(headerInsertPoint);
    if (headerData[0]) {
      headerData[0].prevId = getDOMElement(headerInsertPoint).id;
    }
    const footerData = this.getAllComponentData(footerInsertPoint);
    if (footerData[0]) {
      footerData[0].prevId = getDOMElement(footerInsertPoint).id;
    }
    let themeData = headerData.concat(footerData);
    const themeComponentsDelta = this.getDeltaComponent(themeData, this.themeData);
    if (headerData.length > 0 && themeComponentsDelta) {
      themeComponentsDelta.lastHeaderId = headerData[headerData.length - 1]._id;
    }
    if (footerData.length > 0 && themeComponentsDelta) {
      themeComponentsDelta.lastFooterId = footerData[footerData.length - 1]._id;
    }

    if (themeComponentsDelta || componentsDelta) {
      this.websiteService
        .updateWebPageAllComponents({ themeComponentsDelta, componentsDelta })
        .pipe(
          catchError((e) => {
            this.showUnexpectedError();
            console.log('e => savePageThemeComponents :>> ', e);
            return EMPTY;
          }),
          takeUntil(this.destroy$),
        )
        .subscribe({
          next: (result) => {
            if (result.status === 200) {
              const value = JSON.parse(result?.value);
              if (value) {
                const keys = Object.keys(value);
                const values = Object.values(value);
                if (keys.length && values.length) {
                  [currentComponentData, themeData] = this.replaceComponentTempIds(keys, values as string[], currentComponentData, themeData);
                }
              }
              this.componentData = deepCopy(currentComponentData);
              this.themeData = deepCopy(themeData);
            }
          },
          error: (err) => {
            // TODO: Alert Dialog Error
            alert(err);
          },
        });
    }
  }

  replaceComponentTempIds(
    keys: string[],
    values: string[],
    currentComponentData: IRenderingComponentData[],
    themeData: IRenderingComponentData[],
  ): [IRenderingComponentData[], IRenderingComponentData[]] {
    keys.forEach((key, index) => {
      const tempIdElement = document.getElementById(key);
      if (tempIdElement) {
        tempIdElement.setAttribute('id', values[index]);
        this.newIdUpdated$.next(values[index]);
      }
      const currentComponent = currentComponentData.find((item) => item._id === key);
      if (currentComponent) currentComponent._id = values[index];
      const currentTheme = themeData.find((item) => item._id === key);
      if (currentTheme) currentTheme._id = values[index];
    });
    return [currentComponentData, themeData];
  }

  getDeltaComponent(currentData: IRenderingComponentData[], oldData: IRenderingComponentData[]): IDeltaRenderingComponentData {
    const delta = this.findDifferenceBetweenTwoComponent(currentData, oldData);
    if (delta.added.length === 0 && delta.moved.length === 0 && delta.mutated.length === 0 && delta.removed.length === 0 && delta.movedWithMutated.length === 0) {
      console.log('no changes');
      return null;
    } else {
      return delta;
    }
  }
  findDifferenceBetweenTwoComponent(componentData: IRenderingComponentData[], initComponentData: IRenderingComponentData[]): IDeltaRenderingComponentData {
    const delta: IDeltaRenderingComponentData = {
      webPageID: this.webPageID,
      added: [],
      moved: [],
      movedWithMutated: [],
      removed: [],
      mutated: [],
      lastId: '',
      lastHeaderId: '',
      lastFooterId: '',
    };
    const keyIds = makeComponentKeys(initComponentData, '_id');
    let i;
    for (i = 0; i < componentData.length; i++) {
      let c = JSON.parse(JSON.stringify(componentData[i]));
      const id = c._id;
      const oldComponent = id ? keyIds[id] : null;
      if (!oldComponent) {
        // UI id not exist in database = new component
        c = this.mappingIdToMongoId(c);
        delta.added.push(lzString.compress(JSON.stringify(c)));
      } else {
        const { prevId: skip1, nextId: skip2, ...cWithoutPrevId } = c;
        const { prevId: skip3, nextId: skip4, ...oldComponentWithoutPrevId } = oldComponent;
        // UI component id exist in database
        if (c.prevId !== oldComponent.prevId) {
          // prevId is changed
          if (stringify(cWithoutPrevId) !== stringify(oldComponentWithoutPrevId)) {
            // mutated?

            c = this.mappingIdToMongoId(c);
            delta.movedWithMutated.push(lzString.compress(JSON.stringify(c)));
          } else {
            // prevId change only
            c = this.mappingIdToMongoId(c);
            delta.moved.push(lzString.compress(JSON.stringify(c)));
          }
          delete keyIds[id];
        } else {
          // prevId is not changed

          if (stringify(cWithoutPrevId) !== stringify(oldComponentWithoutPrevId)) {
            // mutated?

            c = this.mappingIdToMongoId(c);
            delta.mutated.push(lzString.compress(JSON.stringify(c)));
          }
          // no change
          delete keyIds[id];
        }
      }
    }
    Object.values(keyIds).forEach((c) => {
      // The remaining id from database means it has been removed in UI
      c = this.mappingIdToMongoId(c);
      delta.removed.push(lzString.compress(JSON.stringify(c)));
    });

    // last component next id should be null
    delta.lastId = componentData[i - 1]?._id || '';
    return delta;
  }
  getAllComponentData(insertPoint: ViewContainerRef) {
    const componentData: IRenderingComponentData[] = [];
    this.getComponentData(componentData, insertPoint);
    return componentData;
  }
  getComponentData(componentData: any[], vcr: ViewContainerRef, layoutID?: string, layoutPosition?: number) {
    const { length } = vcr;
    if (!length) {
      return [];
    }
    for (let i = 0; i < length; i++) {
      const rootViewRef = vcr.get(i);
      const c = getComponent(rootViewRef);
      const id = c.nativeElement.id;
      const last = componentData.length - 1;
      const prevId = componentData[last]?._id;
      const component = this.extractComponentData(c, id, layoutID, layoutPosition, prevId);
      componentData.push(component);
      if (c instanceof CmsLayoutRenderingComponent) {
        this.getComponentData(componentData, c.insertPoint1, id, Number(ColumnType.COLUMN_1));
        this.getComponentData(componentData, c.insertPoint2, id, Number(ColumnType.COLUMN_2));
        this.getComponentData(componentData, c.insertPoint3, id, Number(ColumnType.COLUMN_3));
        this.getComponentData(componentData, c.insertPoint4, id, Number(ColumnType.COLUMN_4));
      }
    }
  }
  extractComponentData(c: any, _id: string, layoutID?: string, layoutPosition?: number, prevId?: string): IRenderingComponentData {
    if (!c) {
      return null;
    }
    const componentType = this.getComponentType(c);
    const commonSettings = this.getCommonSettings(c);
    const themeOption = c?.themeOption;
    const options = this.getOptions(c);
    const { isActive } = c;
    return {
      _id,
      componentType,
      commonSettings,
      themeOption,
      options,
      layoutID: layoutID || null,
      layoutPosition: layoutPosition === undefined ? null : layoutPosition,
      isActive,
      prevId: prevId === undefined ? null : prevId,
    };
  }
  getComponentType(c: any): ComponentTypeEnum {
    switch (c.constructor) {
      case CmsThemeRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_THEME_RENDERING;
      case CmsLayoutRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_LAYOUT_RENDERING;
      case CmsContainerRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_CONTAINER_RENDERING;
      case CmsTextRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_TEXT_RENDERING;
      case CmsMediaGalleryRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING;
      case CmsMediaGalleryItemRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_MEDIA_GALLERY_ITEM_RENDERING;
      case CmsContentManagementRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_RENDERING;
      case CmsContentManagementLandingRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_LANDING_RENDERING;
      case CmsMenuRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_MENU_RENDERING;
      case CmsButtonRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_BUTTON_RENDERING;
      case CmsHeaderContainerRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_HEADER_CONTAINER_RENDERING;
      case CmsContentContainerRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_CONTAINER_RENDERING;
      case CmsFooterContainerRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_FOOTER_CONTAINER_RENDERING;
      case CmsShoppingCartRenderingComponent:
        return ComponentTypeEnum.CMS_NEXT_CMS_SHOPPING_CART_RENDERING;
      default:
        return null;
    }
  }
  getCommonSettings(c: any): ICommonSettings {
    const {
      layoutSettingBorderValue,
      layoutSettingShadowValue,
      layoutSettingAdvanceValue,
      layoutSettingBackgroundValue,
      layoutSettingCustomizeValue,
      layoutSettingHoverValue,
      layoutEffectValue,
    } = c;
    return {
      border: layoutSettingBorderValue || null,
      shadow: layoutSettingShadowValue || null,
      hover: layoutSettingHoverValue || null,
      effect: layoutEffectValue || null,
      background: layoutSettingBackgroundValue || null,
      advance: layoutSettingAdvanceValue || null,
      customize: layoutSettingCustomizeValue || null,
    };
  }
  getOptions(c: any): ComponentOptions {
    switch (c.constructor) {
      case CmsThemeRenderingComponent:
        return null;
      case CmsLayoutRenderingComponent:
        return {
          setting: c.layoutColumnValue,
          containerSettings: c.containers.toArray().map((_c) => this.getCommonSettings(_c)), // TODO:
        };
      case CmsContainerRenderingComponent:
        return null;
      case CmsShoppingCartRenderingComponent: {
        const x = {
          pattern: c.shoppingCartSaveData.pattern,
        } as IShoppingCartRenderingSetting;
        return x;
      }
      case CmsTextRenderingComponent:
        return {
          quillHTMLs: c.savingData,
        } as ITextRenderingSetting;
      case CmsMediaGalleryRenderingComponent:
        return {
          gallery: c.mediaGalleryFormValue.gallery,
          control: c.mediaGalleryFormValue.control,
        } as IMediaGalleryRenderingSetting;
      case CmsMediaGalleryItemRenderingComponent:
        return {
          link: c.mediaGalleryItemFormValue.generalLinkSetting,
          text: c.mediaGalleryItemFormValue.generalTextSetting,
        } as IMediaGalleryItemRenderingSetting;
      case CmsContentManagementRenderingComponent:
        return {
          general: c.contentManagementValue.general,
          contents: c.contentManagementValue.contents,
          landing: c.contentManagementValue.landing,
        } as IContentManagementRenderingSetting;
      case CmsMenuRenderingComponent: {
        return {
          source: c.menuData.source,
          setting: c.menuData.setting,
          mobile: c.menuData.mobile,
          level: c.menuData.level,
        } as IMenuRenderingSetting;
      }
      case CmsButtonRenderingComponent: {
        return {
          buttonSetting: c.buttonData.buttonSetting,
          buttonBorder: c.buttonData.buttonBorder,
          buttonText: c.buttonData.buttonText,
          generalLinkSetting: c.buttonData.generalLinkSetting,
          buttonHover: c.buttonData.buttonHover,
        } as IButtonRenderingSetting;
      }
      case CmsContentManagementLandingRenderingComponent: {
        return {
          landing: null,
          pattern: null,
        } as ILandingContentManagementRenderingSetting;
      }
      case CmsHeaderContainerRenderingComponent:
      case CmsContentContainerRenderingComponent:
      case CmsFooterContainerRenderingComponent:
      case CmsContentSectionRenderingComponent:
      case CmsContentColumnRenderingComponent:
      case CmsContentTextRenderingComponent:
      case CmsContentEmbededRenderingComponent:
      case CmsContentImageRenderingComponent:
        console.log('Ignore Component Options on Saving');
        return null;
      default:
        console.error('not implemented component:', c);
        return null;
    }
  }
  pushComponentData(componentData: any[], element: Element, layoutID?: string, layoutPosition?: number) {
    const { children } = element;
    const { length } = children;
    for (let i = 0; i < length; i++) {
      const el = children[i];
      const lView = getLView(el);
      let c;
      if (lView) {
        c = getComponentFromLView(lView);
      }
      if (el.tagName.indexOf('-') === -1) {
        // DOM Element
        if (el.children.length > 0) {
          // have Children
          const parentID = el.id;
          this.pushComponentData(componentData, el, parentID, layoutPosition);
        } else {
          // No children, stop recursive
        }
      } else if (c && c instanceof CmsLayoutRenderingComponent) {
        // CmsLayoutRenderingComponent (<cms-layout-rendering-component>)
        console.error('Error: Layout in Layout');
        console.error('layoutID', layoutID);
        console.error('layoutPosition', layoutPosition);
        console.error('id', element.id);
      } else {
        // Non CmsLayoutRenderingComponent (<cms-xxx-rendering-component>)
        const { nativeElement } = c;
        const id = nativeElement.id;
        const prevId = generatePrevId(nativeElement);
        if (prevId === null) {
          this.showUnexpectedError('PREVID === NULL');
          throw Error('PREVID === NULL');
        }
        const component = this.extractComponentData(c, id, layoutID, layoutPosition, prevId);
        componentData.push(component);
      }
    }
  }
  getComponentDataOnly(componentData: any[], vcr: ViewContainerRef, layoutID?: string, layoutPosition?: number) {
    const element = vcr.element.nativeElement as HTMLElement;
    // cms-container-rendering.component.html#104
    const divContainerRendering = element.parentElement;
    this.pushComponentData(componentData, divContainerRendering, layoutID, layoutPosition);
  }
  extractComponentDataFromNoneContent(components: any[]) {
    if (components.length === 0) {
      return [];
    }
    const componentData: IRenderingComponentData[] = [];
    for (const c of components) {
      const { nativeElement }: { nativeElement: HTMLElement } = c.el;
      const id = nativeElement.id;
      const prevId = generatePrevId(nativeElement);
      if (prevId === null) {
        this.showUnexpectedError('PREVID === NULL');
        throw Error('PREVID === NULL');
      }
      const parentId = nativeElement.parentElement.id;
      const renderingComponentData = this.extractComponentData(c, id, parentId, null, prevId);
      componentData.push(renderingComponentData);
      if (c instanceof CmsLayoutRenderingComponent) {
        this.getComponentDataOnly(componentData, c.insertPoint1, id, Number(ColumnType.COLUMN_1));
        this.getComponentDataOnly(componentData, c.insertPoint2, id, Number(ColumnType.COLUMN_2));
        this.getComponentDataOnly(componentData, c.insertPoint3, id, Number(ColumnType.COLUMN_3));
        this.getComponentDataOnly(componentData, c.insertPoint4, id, Number(ColumnType.COLUMN_4));
      }
    }
    return componentData;
  }
  saveThemeComponentQueryList(queryList: QueryList<ThemeContentChildren>) {
    this.themeComponentQueryList = queryList;
  }
  // orderNumber: number;
  // layoutID: string; // -1 0 null
  // layoutPosition: number; // 50 % 50 1 2
  // webPageID: string;
  mappingIdToMongoId(c: IRenderingComponentData): IRenderingComponentData {
    c._id = this.idMappingPageComponent[c._id] ? this.idMappingPageComponent[c._id] : c._id;
    c.prevId = this.idMappingPageComponent[c.prevId] ? this.idMappingPageComponent[c.prevId] : c.prevId;
    c.layoutID = this.idMappingPageComponent[c.layoutID] ? this.idMappingPageComponent[c.layoutID] : c.layoutID;
    return c;
  }
  showUnexpectedError(errorMessage?: string): void {
    if (errorMessage) {
      this.snackBar.openFromComponent(StatusSnackbarComponent, {
        data: {
          type: StatusSnackbarType.ERROR,
          message: errorMessage,
        } as StatusSnackbarModel,
      });
    } else {
      this.snackBar.openFromComponent(StatusSnackbarComponent, {
        data: {
          type: StatusSnackbarType.ERROR,
          message: 'Unexpected Error occured...Try again later!',
        } as StatusSnackbarModel,
      });
    }
  }
}
