import { AfterContentInit, Component, ContentChildren, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
import { Mixin } from 'ts-mixer';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { ComponentThemeDirective } from '../../../directives/component-theme//component-theme.directive';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { CmsEditThemeService } from '../../../services/cms-theme.service';
import { Children } from '../../../../../shares/utils';
import {
  ILayoutRenderingSetting,
  IRenderingComponentData,
  IThemeRendering,
  IThemeOption,
  IThemeRenderingSettingFont,
  IThemeDevice,
  IThemeGeneralInfo,
  IThemeRenderingSettingCustomize,
  IThemeSharingComponentConfig,
} from '@reactor-room/cms-models-lib';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { WebsiteService } from '../../../services/website.service';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, EMPTY, Subject, Subscription } from 'rxjs';
import { CmsLayoutRenderingComponent } from '../cms-layout-rendering/cms-layout-rendering.component';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { ThemeContentChildren } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';

@Component({
  selector: 'cms-next-cms-theme-rendering',
  templateUrl: './cms-theme-rendering.component.html',
  styleUrls: ['./cms-theme-rendering.component.scss'],
})
export class CmsThemeRenderingComponent extends Mixin(ComponentThemeDirective) implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('themeInsertPoint', { static: true, read: ViewContainerRef }) public themeInsertPoint: ViewContainerRef;
  @ContentChildren(Children, { descendants: true, emitDistinctChangesOnly: true }) public cmsComponentRenderingContainers!: QueryList<ThemeContentChildren>;
  public onFocus = false;
  public componentType = 'CmsThemeRenderingComponent';
  renderingThemeData: IThemeRendering;
  public themeOption: IThemeOption;
  renderingComponentDataList: IRenderingComponentData[];
  themeGeneralSettingSubscription: Subscription;
  themeDeviceSettingSubscription: Subscription;
  themeColorSettingSubscription: Subscription;
  themeFontSettingSubscription: Subscription;
  array: IRenderingComponentData[];
  destroy$ = new Subject();
  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private cmsThemeService: CmsEditThemeService,
    private websiteService: WebsiteService,
    private settingWebsiteService: SettingWebsiteService,
    private routeParam: ActivatedRoute,
    private cmsPublishService: CmsPublishService,
  ) {
    super(el, sidebarService);
  }

  ngOnInit(): void {
    this.onThemeFocusEvent();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
  ngAfterContentInit(): void {
    const pageTheme$ = this.websiteService.$pageTheme;
    const sharingThemeConfig$ = this.websiteService.$sharingThemeConfig;
    const renderingComponentDataList$ = this.websiteService.$pageComponent;
    const renderingThemeComponentDataList$ = this.websiteService.$themeComponents;
    const configStyle$ = this.settingWebsiteService.$configStyle;
    // this.cmsPublishService.saveThemeComponentQueryList(this.cmsComponentRenderingContainers);
    pageTheme$
      .pipe(
        switchMap((pageTheme) => {
          if (pageTheme) {
            this.renderingThemeData = pageTheme;
            return sharingThemeConfig$;
          } else return EMPTY;
        }),
        switchMap((themeConfig: IThemeSharingComponentConfig) => {
          if (themeConfig) {
            this.renderingThemeData.devices = themeConfig.devices;
            this.renderingThemeData.settings.color = themeConfig.color;
            this.renderingThemeData.settings.font = themeConfig.font;
            return configStyle$;
          } else return EMPTY;
        }),
        tap((style) => {
          this.initThemeDataFormRenderingThemeData(this.renderingThemeData, style);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
    combineLatest([renderingComponentDataList$, renderingThemeComponentDataList$])
      .pipe(
        debounceTime(0),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap(([pageComponent, themeComponents]) => {
          this.renderingComponentDataList = [...pageComponent.components, ...themeComponents];

          if (this.renderingComponentDataList) {
            this.initComponentDataFormRenderingComponentData(this.renderingComponentDataList);
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
    // this.cmsComponentRenderingChildren.forEach((c, i) => {
    //   const rootViewRef = getRootViewRef(c) as ViewRef;
    //   this.themeInsertPoint.move(rootViewRef, i);
    // });
  }

  initThemeDataFormRenderingThemeData(themeData: IThemeRendering, style: string): void {
    if (!themeData) return;
    const { font, color } = themeData.settings;
    const customize: IThemeRenderingSettingCustomize = {
      cssStyle: style,
      elementId: null,
    };
    this.el.nativeElement.classList.add('rendering-item');
    this.el.nativeElement.classList.add('itp-font-family-default');
    this.el.nativeElement.classList.add('itp-theme');
    this.cmsThemeService.setThemeFontSetting(font);
    this.cmsThemeService.setThemeColorSetting(color);
    this.performThemeSettingCustomizeValueToElementStyle(customize);
  }

  initComponentDataFormRenderingComponentData(componentDataList: IRenderingComponentData[]): void {
    if (!componentDataList) return;
    this.cmsComponentRenderingContainers.forEach((cmsComponent) => {
      const _id = cmsComponent.el.nativeElement.getAttribute('id');
      const componentData = this.getComponentData(_id, componentDataList);
      if (componentData) {
        cmsComponent.renderingComponentData$.next(componentData);
        cmsComponent.themeOption = componentData?.themeOption;
        if (cmsComponent instanceof CmsLayoutRenderingComponent) {
          const cmsLayoutRenderingComponent = cmsComponent as CmsLayoutRenderingComponent;
          const { containerSettings } = componentData.options as ILayoutRenderingSetting;
          cmsLayoutRenderingComponent.renderingComponentDataContainers = [];
          if (containerSettings) {
            containerSettings.forEach((container) => {
              cmsLayoutRenderingComponent.renderingComponentDataContainers.push(container);
            });
          }
          cmsLayoutRenderingComponent.contentTextChildren.forEach((cmsComponent) => {
            const _id = cmsComponent.el.nativeElement.getAttribute('id');
            const componentData = this.getComponentData(_id, componentDataList);
            if (componentData) {
              cmsComponent.renderingComponentData$.next(componentData);
            }
          });
        }
      }
    });
  }

  getComponentData(id: string, componentDataList: IRenderingComponentData[]): IRenderingComponentData {
    let componentData: IRenderingComponentData = null;
    componentDataList.forEach((data) => {
      const idCondition = data?.themeOption?.themeIdentifier ? data.themeOption.themeIdentifier : data._id;
      if (idCondition === id) {
        componentData = data;
        return;
      }
    });
    return componentData;
  }

  onThemeFocusEvent(): void {
    this.cmsThemeService.getThemeFocus.pipe().subscribe((isFocus: boolean) => {
      if (isFocus) {
        this.onThemeFocusComponent(this);
        this.sidebarService.setSidebarMode(null);
        setTimeout(() => {
          this.sidebarService.setSidebarMode(ESidebarMode.TEMPLATE_SETTING);
          this.setElementStyleToThemeSettingCustomizeFormValue();
          this.setThemeGeneralDataToFormValue();
          this.setThemeDeviceDataToFormValue();
          this.setThemeSettingFontDataToFormValue();
          this.setThemeSettingColorDataToFormValue();
        }, 0);
      }
    });
  }

  onThemeFocusComponent(component: CmsThemeRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(this);
    this.setThemeSettingCustomizeValueToElementStyle();
    this.setFormValueToThemeGeneralData();
    this.setFormValueToThemeDeviceData();
    this.setFormValueToThemeSettingFontData();
    this.setFormValueToThemeSettingColorData();
  }

  saveThemeGeneralSettingData(): void {
    this.cmsThemeService.setThemeGeneralSetting(null);
  }

  setFormValueToThemeGeneralData(): void {
    if (this.themeGeneralSettingSubscription) return;
    this.themeGeneralSettingSubscription = this.cmsThemeService.getThemeGeneralSetting
      .pipe(
        tap((value: IThemeGeneralInfo) => {
          if (!value) return;
          this.renderingThemeData.html[0].name = value.html[0].name;
          this.renderingThemeData.html[0].thumbnail.path = value.html[0].thumbnail.path;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  setThemeGeneralDataToFormValue(): void {
    const setting: IThemeGeneralInfo = {
      _id: '',
      html: [
        {
          name: this.renderingThemeData.name,
          html: '',
          thumbnail: {
            path: this.renderingThemeData.html[0].thumbnail.path,
          },
        },
      ],
    };
    this.cmsThemeService.setThemeGeneralSettingFormValue(setting);
  }

  saveThemeDeviceSettingData(): void {
    this.cmsThemeService.setThemeDeviceSetting(null);
  }

  setFormValueToThemeDeviceData(): void {
    // if (this.themeDeviceSettingSubscription) return;
    this.themeDeviceSettingSubscription = this.cmsThemeService.getThemeDevice
      .pipe(
        tap((value: IThemeDevice[]) => {
          if (!value) return;
          this.renderingThemeData.devices = value;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  setThemeDeviceDataToFormValue(): void {
    this.cmsThemeService.setThemeDeviceSettingFormValue(this.renderingThemeData.devices);
  }

  saveThemeFontSettingData(): void {
    this.cmsThemeService.setThemeFontSetting(null);
  }

  setFormValueToThemeSettingFontData(): void {
    //if (this.themeFontSettingSubscription) return;
    this.themeFontSettingSubscription = this.cmsThemeService.getThemeFontSetting
      .pipe(
        tap((value: IThemeRenderingSettingFont[]) => {
          if (!value) return;
          this.renderingThemeData.settings.font = value;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  setThemeSettingFontDataToFormValue(): void {
    this.cmsThemeService.setThemeFontSettingFormValue(this.renderingThemeData.settings.font);
  }

  saveThemeColorSettingData(): void {
    this.cmsThemeService.setThemeColorSetting(null);
  }

  setFormValueToThemeSettingColorData(): void {
    // if (this.themeColorSettingSubscription) return;
    this.themeColorSettingSubscription = this.cmsThemeService.getThemeColorSetting
      .pipe(
        tap((value) => {
          if (!value) return;
          this.renderingThemeData.settings.color = value?.color ? value.color : value;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  setThemeSettingColorDataToFormValue(): void {
    this.cmsThemeService.setThemeColorSettingFormValue(this.renderingThemeData.settings.color);
  }
}
