import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  EBackground,
  EBackgroundPosition,
  ElinkType,
  ElinkTypeTitle,
  EMegaMenuType,
  IDialogData,
  IMediaGalleryList,
  IMegaConfig,
  IMegaConfigCustom,
  IMegaConfigTextImage,
  IMegaFooterConfig,
  IMegaFooterConfigCustom,
  IMegaFooterConfigTextImage,
  IMegaFooterOption,
  IMegaFooterOptionCustom,
  IMegaFooterOptionTextImage,
  IMegaOption,
  IMegaOptionCustom,
  IMegaOptionTextImage,
  IWebPageConfiguration,
  IWebPageDetails,
  IWebPagePage,
  WebPagePermissionType,
} from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { CRUD_MODE } from '@reactor-room/model-lib';
import { cloneDeep, isEqual } from 'lodash';
import { EMPTY, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ICmsLanguageSwitch } from '../../../../components/common/cms-language-switch/cms-language-switch.model';
import { CmsCommonService } from '../../../../services/cms-common.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { CmsSiteMenuPageService } from '../../../../services/cms-site-menu-page.service';
import { CmsMenuCustomService } from '../../../../services/menu-custom.service';
import { WebsiteService } from '../../../../services/website.service';
import { fontAwesomeList } from '../../../../shared/icons.model';
import { ESidebarMode } from '../../cms-sidebar.model';
import { CmsMediaModalComponent } from '../cms-media-management/cms-media-modal/cms-media-modal.component';

@Component({
  selector: 'cms-next-cms-site-setting',
  templateUrl: './cms-site-setting.component.html',
  styleUrls: ['./cms-site-setting.component.scss'],
})
export class CmsSiteSettingComponent implements OnInit, OnDestroy {
  siteSettingForm: FormGroup;
  iconList: string[] = fontAwesomeList;
  editorOptions = { theme: 'vs-dark', language: 'html', minimap: { enabled: false } };
  isEveryonePermission = true;
  isPasswordPermission = false;
  isMemberPermission = false;
  isPageToggle = true;
  isIconToggle = false;
  isContentToggle = false;
  isPermissionToggle = false;
  isSeoToggle = false;
  isSocialToggle = false;
  isSaving = false;
  destroy$ = new Subject();
  siteData: IWebPagePage;
  siteSavingData: IWebPagePage;
  subscription: Subscription;
  searchIconFormControl = new FormControl();
  megaMenuType = [
    {
      title: 'Custom',
      value: EMegaMenuType.CUSTOM,
    },
    {
      title: 'Image & Text',
      value: EMegaMenuType.IMAGE_TEXT,
    },
  ];
  eMegaMenuType = EMegaMenuType;
  backgroundPosition = [
    {
      postion: EBackgroundPosition.LEFT_TOP,
      selected: false,
    },
    {
      postion: EBackgroundPosition.CENTER_TOP,
      selected: false,
    },
    {
      postion: EBackgroundPosition.RIGHT_TOP,
      selected: false,
    },
    {
      postion: EBackgroundPosition.LEFT_CENTER,
      selected: false,
    },
    {
      postion: EBackgroundPosition.CENTER_CENTER,
      selected: true,
    },
    {
      postion: EBackgroundPosition.RIGHT_CENTER,
      selected: false,
    },
    {
      postion: EBackgroundPosition.LEFT_BOTTOM,
      selected: false,
    },
    {
      postion: EBackgroundPosition.CENTER_BOTTOM,
      selected: false,
    },
    {
      postion: EBackgroundPosition.RIGHT_BOTTOM,
      selected: false,
    },
  ];
  linkTypeData = [
    {
      value: ElinkType.URL,
      title: ElinkTypeTitle.URL,
    },
    {
      value: ElinkType.PAGE,
      title: ElinkTypeTitle.PAGE,
    },
    {
      value: ElinkType.PRODUCT,
      title: ElinkTypeTitle.PRODUCT,
    },
    {
      value: ElinkType.CONTENT,
      title: ElinkTypeTitle.CONTENT,
    },
    {
      value: ElinkType.POPUP,
      title: ElinkTypeTitle.POPUP,
    },
    {
      value: ElinkType.ANCHOR,
      title: ElinkTypeTitle.ANCHOR,
    },
    {
      value: ElinkType.EMAIL,
      title: ElinkTypeTitle.EMAIL,
    },
  ];
  ElinkType = ElinkType;
  currentLinkType: ElinkType = ElinkType.URL;
  pageData = [
    {
      value: 'Home',
      title: 'Home',
    },
    {
      value: 'Contact us',
      title: 'Contact us',
    },
    {
      value: 'About us',
      title: 'About us',
    },
  ];
  productPageData = [
    {
      value: 'Product Home',
      title: 'Product Home',
    },
    {
      value: 'Product 1',
      title: 'Product 1',
    },
    {
      value: 'Product 2',
      title: 'Product 2',
    },
  ];
  contentPageData = [
    {
      value: 'Content 1',
      title: 'Content 1',
    },
    {
      value: 'Content 2',
      title: 'Content 2',
    },
    {
      value: 'Content 3',
      title: 'Content 3',
    },
  ];
  popupPageData = [
    {
      value: 'Popup 1',
      title: 'Popup 1',
    },
    {
      value: 'Popup 2',
      title: 'Popup 2',
    },
    {
      value: 'Popup 3',
      title: 'Popup 3',
    },
  ];
  anchorData = [
    {
      value: 'Anchor 1',
      title: 'Anchor 1',
    },
    {
      value: 'Anchor 2',
      title: 'Anchor 2',
    },
    {
      value: 'Anchor 3',
      title: 'Anchor 3',
    },
  ];
  siteId: string;
  menuGroupId: string;
  get themeLayoutModeForm() {
    return this.siteSettingForm.get('themeLayoutMode') as FormGroup;
  }
  constructor(
    private sidebarService: CmsSidebarService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private siteMenuPageService: CmsSiteMenuPageService,
    private menuCustomService: CmsMenuCustomService,
    private cmsCommonService: CmsCommonService,
    private websiteService: WebsiteService,
  ) {}

  ngOnInit(): void {
    this.siteSettingForm = this.getSiteSettingFormGroup();
    this.onSearchIconValueChange();
    this.sidebarService.getSiteId
      .pipe(
        takeUntil(this.destroy$),
        switchMap((siteID) => {
          if (!siteID) {
            this.onDismissSettingMode();
            return EMPTY;
          } else {
            this.siteId = siteID;
            return this.sidebarService.getMenuGroupId;
          }
        }),
        switchMap((menuGroupId) => {
          if (menuGroupId) {
            this.menuGroupId = menuGroupId;
            return this.menuCustomService.getMenuPageByMenuPageID(this.siteId, this.menuGroupId);
          } else return this.siteMenuPageService.getWebPageByWebPageID(this.siteId);
        }),
        tap((webpageDetails) => {
          if (webpageDetails) {
            this.siteData = webpageDetails;
            this.siteSavingData = cloneDeep(this.siteData);
            this.siteSettingFormPatchValue();
          } else this.onDismissSettingMode();
        }),
        catchError((e) => {
          console.log('e  => ngOnInit :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
    const themeLayoutForm = this.siteSettingForm.controls['themeLayoutMode'] as FormGroup;
    themeLayoutForm.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe((themeLayout) => {
      this.websiteService.$pageTheme.subscribe((themeData) => {
        if (themeLayout.useThemeLayoutMode && typeof themeLayout.themeLayoutIndex === 'number') {
          if (themeLayout.themeLayoutIndex <= themeData.themeLayoutLength - 1) {
            const themeLayoutModeForm = this.siteSettingForm.get('themeLayoutMode') as FormGroup;
            themeLayoutModeForm.get('themeLayoutIndex').patchValue(Math.round(themeLayout.themeLayoutIndex));
            this.websiteService.$themeLayoutIndex.next(Math.round(themeLayout.themeLayoutIndex));
          } else {
            this.showUnexpectedError('index is out of scope');
            themeLayoutForm.controls['themeLayoutIndex'].patchValue(0);
            this.websiteService.$themeLayoutIndex.next(0);
          }
        }
      });
    });
  }

  onSearchIconValueChange(): void {
    this.searchIconFormControl.valueChanges.pipe(distinctUntilChanged(), debounceTime(300), takeUntil(this.destroy$), startWith('')).subscribe((val: string) => {
      if (!val) {
        this.iconList = fontAwesomeList;
      } else {
        this.iconList = this.iconList.filter((icon) => icon.includes(val.toLowerCase()));
      }
    });
  }

  onLinkTypeChange(event: MatSelectChange): void {
    this.currentLinkType = event.value;
    this.siteSettingForm.get('mega').get('primaryOption').get('linkUrl').patchValue('');
  }

  onSelectedIcon(icon: string): void {
    this.siteSettingForm.get('pageIcon').patchValue(icon);
  }

  onSelectedBackgroundPostion(index: number): void {
    this.backgroundPosition.forEach((postion) => (postion.selected = false));
    this.backgroundPosition[index].selected = true;
    this.siteSettingForm.get('mega').get('primaryOption').get('imagePosition').patchValue(this.backgroundPosition[index].postion);
    this.setSelectedBackgroundPosition(this.backgroundPosition[index].postion);
  }

  setSelectedBackgroundPosition(position: EBackgroundPosition): void {
    this.backgroundPosition.forEach((postion) => (postion.selected = false));
    const found = this.backgroundPosition.find((item) => item.postion === position);
    found.selected = true;
  }

  onMediaGalleryDialog(): void {
    const dialogRef = this.dialog.open(CmsMediaModalComponent, {
      height: '90%',
      data: {
        message: EBackground.IMAGE,
      } as IDialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mediaGalleryList: IMediaGalleryList) => {
        if (mediaGalleryList) {
          this.siteSettingForm.get('mega').get('primaryOption').get('image').patchValue(mediaGalleryList.url);
        }
      });
  }

  siteSettingFormPatchValue(): void {
    const { name, permission, setting, configs, themeLayoutMode } = this.siteSavingData;
    this.siteSettingForm.get('pageName').patchValue(name);
    if (setting) {
      this.siteSettingForm.get('isOpenNewTab').patchValue(setting.isOpenNewTab);
      this.siteSettingForm.get('isMaintenancePage').patchValue(setting.isMaintenancePage);
      this.siteSettingForm.get('isIcon').patchValue(setting.isIcon);
      this.siteSettingForm.get('pageIcon').patchValue(setting.pageIcon);
      this.siteSettingForm.get('isMega').patchValue(setting.isMega);
      this.siteSettingForm.get('socialShare').patchValue(setting.socialShare);
      const primaryTypeFormControl = this.siteSettingForm.get('mega').get('primaryType');
      const footerTypeFormControl = this.siteSettingForm.get('mega').get('footerType');
      const primaryOptionFormGroup = this.siteSettingForm.get('mega').get('primaryOption') as FormGroup;
      const footerOptionFormGroup = this.siteSettingForm.get('mega').get('footerOption') as FormGroup;
      this.onMegaTypeValueChange(primaryOptionFormGroup, primaryTypeFormControl, setting.mega.primaryOption, setting.mega.primaryType, false, false);
      this.onMegaTypeValueChange(footerOptionFormGroup, footerTypeFormControl, setting.mega.footerOption, setting.mega.footerType, false, true);
    }
    if (permission) {
      const permissionForm = this.siteSettingForm.get('permission') as FormGroup;
      switch (permission.type) {
        case WebPagePermissionType.EVERYONE:
          this.onActiveEveryonePermission();
          break;
        case WebPagePermissionType.PASSWORD:
          this.onActivePasswordPermission();
          permissionForm.get('password').patchValue(permission.option.password);
          break;
        case WebPagePermissionType.MEMBER:
          this.onActiveMemberPermission();
          permissionForm.get('onlyPaidMember').patchValue(permission.option.onlyPaidMember);
          break;
        default:
          break;
      }
    }
    if (configs) {
      const primaryTypeFormControl = this.siteSettingForm.get('mega').get('primaryType');
      const footerTypeFormControl = this.siteSettingForm.get('mega').get('footerType');
      const configPrimaryMegaForm = this.siteSettingForm.get('config').get('primaryMega');
      const configFooterMegaForm = this.siteSettingForm.get('config').get('footerMega');
      this.onMegaTypeValueChange(configPrimaryMegaForm as FormGroup, primaryTypeFormControl, configs[0].primaryMega, setting.mega.primaryType, true, false);
      this.onMegaTypeValueChange(configFooterMegaForm as FormGroup, footerTypeFormControl, configs[0].footerMega, setting.mega.footerType, true, true);
      this.cmsCommonService.getCmsLanguageSwitch
        .pipe(
          takeUntil(this.destroy$),
          tap((currentLanguage: ICmsLanguageSwitch) => {
            if (currentLanguage) {
              this.subscription?.unsubscribe();
              const config = this.getCurrentConfig(currentLanguage.cultureUI);
              if (config) {
                if (config.mode !== CRUD_MODE.ADD) config.mode = CRUD_MODE.EDIT;
                this.onPatchConfigValueToForm(config);
              } else {
                const newConfig: IWebPageConfiguration = {
                  displayName: configs[0].displayName,
                  cultureUI: currentLanguage.cultureUI,
                  seo: {
                    title: configs[0].seo.title,
                    shortUrl: configs[0].seo.shortUrl,
                    description: configs[0].seo.description,
                    keyword: configs[0].seo.keyword,
                  },
                  primaryMega: configs[0].primaryMega,
                  footerMega: configs[0].footerMega,
                  mode: CRUD_MODE.ADD,
                };
                this.siteSavingData?.configs.push({ ...newConfig });
                this.onPatchConfigValueToForm(newConfig);
              }
              this.onSetFormValueToSiteSavingData();
            }
          }),
        )
        .subscribe();
    }
    if (themeLayoutMode) {
      const themeLayoutModeForm = this.siteSettingForm.get('themeLayoutMode') as FormGroup;
      themeLayoutModeForm.get('useThemeLayoutMode').patchValue(themeLayoutMode.useThemeLayoutMode);
      themeLayoutModeForm.get('themeLayoutIndex').patchValue(themeLayoutMode.themeLayoutIndex);
    }
  }

  onMegaTypeValueChange(
    formGroup: FormGroup,
    formControl: AbstractControl,
    object: IMegaOption | IMegaFooterOption | IMegaConfig | IMegaFooterConfig | string,
    defaultMegaType: EMegaMenuType,
    isConfig: boolean,
    isFooter: boolean,
  ): void {
    formControl.patchValue(defaultMegaType);
    formControl.valueChanges.pipe(startWith(defaultMegaType), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((value: EMegaMenuType) => {
      this.removeAllControlsFromForm(formGroup);
      if (isEqual(value, defaultMegaType)) {
        this.setControlFromObjectToForm(formGroup, object);
      } else {
        switch (value) {
          case EMegaMenuType.CUSTOM:
            {
              const primaryOption: IMegaOptionCustom = {
                isHTML: true,
                custom: '',
              };
              const primaryConfig: IMegaConfigCustom = {
                html: '',
                custom: '',
              };
              const primaryFooterOption: IMegaFooterOptionCustom = {
                isFooterHTML: true,
                custom: '',
              };
              const primaryFooterConfig: IMegaFooterConfigCustom = {
                html: '',
                custom: '',
              };
              if (isConfig) {
                if (isFooter) this.setControlFromObjectToForm(formGroup, primaryFooterConfig);
                else this.setControlFromObjectToForm(formGroup, primaryConfig);
              } else {
                if (isFooter) this.setControlFromObjectToForm(formGroup, primaryFooterOption);
                else this.setControlFromObjectToForm(formGroup, primaryOption);
              }
            }

            break;
          case EMegaMenuType.IMAGE_TEXT:
            {
              const primaryOption: IMegaOptionTextImage = {
                linkType: ElinkType.URL,
                linkParent: '',
                linkUrl: '',
                image: '',
                imagePosition: EBackgroundPosition.CENTER_CENTER,
                isTopTitle: false,
                textImage: '',
                isHTML: true,
              };
              const primaryConfig: IMegaConfigTextImage = {
                topTitle: '',
                description: '',
                html: '',
                textImage: '',
              };
              const primaryFooterOption: IMegaFooterOptionTextImage = {
                isFooterHTML: true,
                textImage: '',
              };
              const primaryFooterConfig: IMegaFooterConfigTextImage = {
                html: '',
                textImage: '',
              };
              if (isConfig) {
                if (isFooter) this.setControlFromObjectToForm(formGroup, primaryFooterConfig);
                else this.setControlFromObjectToForm(formGroup, primaryConfig);
              } else {
                if (isFooter) this.setControlFromObjectToForm(formGroup, primaryFooterOption);
                else this.setControlFromObjectToForm(formGroup, primaryOption);
              }
            }
            break;
          default:
            break;
        }
      }
    });
  }

  removeAllControlsFromForm(formGroup: FormGroup): void {
    const array = Object.keys(formGroup.controls).map((key) => ({ key, value: formGroup.controls[key] }));
    array.forEach(({ key }) => {
      formGroup.removeControl(key);
    });
  }

  setControlFromObjectToForm<T>(formGroup: FormGroup, object: T): void {
    const array = Object.keys(object).map((key) => ({ key, value: object[key] }));
    array.forEach(({ key, value }) => {
      formGroup.addControl(key, new FormControl(value));
    });
  }

  getCurrentConfig(currentCultureUI: string): IWebPageConfiguration {
    return this.siteSavingData.configs.find((item) => item.cultureUI === currentCultureUI);
  }

  onPatchConfigValueToForm(config: IWebPageConfiguration): void {
    const configForm = this.siteSettingForm.get('config') as FormGroup;
    const configSeoForm = this.siteSettingForm.get('config').get('seo') as FormGroup;
    configForm.get('displayName').patchValue(config.displayName);
    configForm.get('cultureUI').patchValue(config.cultureUI);
    configSeoForm.get('title').patchValue(config.seo.title);
    configSeoForm.get('shortUrl').patchValue(config.seo.shortUrl);
    configSeoForm.get('description').patchValue(config.seo.description);
    configSeoForm.get('keyword').patchValue(config.seo.keyword);
    const configPrimaryMegaForm = this.siteSettingForm.get('config').get('primaryMega');
    const configFooterMegaForm = this.siteSettingForm.get('config').get('footerMega');
    configPrimaryMegaForm.patchValue(config.primaryMega);
    configFooterMegaForm.patchValue(config.footerMega);
  }

  onSetFormValueToSiteSavingData(): void {
    this.subscription = this.siteSettingForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap((formValue) => {
          const { permission, setting } = this.siteSavingData;
          setting.isOpenNewTab = formValue?.isOpenNewTab;
          setting.isMaintenancePage = formValue?.isMaintenancePage;
          setting.socialShare = formValue?.socialShare;
          setting.isIcon = formValue?.isIcon;
          setting.pageIcon = formValue?.pageIcon;
          setting.isMega = formValue?.isMega;
          setting.mega.primaryType = formValue?.mega?.primaryType;
          setting.mega.footerType = formValue?.mega?.footerType;
          setting.mega.primaryOption = formValue?.mega?.primaryOption;
          setting.mega.footerOption = formValue?.mega?.footerOption;
          permission.type = formValue?.permission?.type;
          permission.option.password = formValue?.permission?.password ? formValue.permission.password : '';
          permission.option.onlyPaidMember = formValue?.permission?.onlyPaidMember;
          const config = this.getCurrentConfig(formValue?.config?.cultureUI);
          config.displayName = formValue?.config?.displayName;
          config.seo.title = formValue?.config?.seo?.title;
          config.seo.description = formValue?.config?.seo?.description;
          config.seo.shortUrl = formValue?.config?.seo?.shortUrl;
          config.seo.keyword = formValue.config?.seo?.keyword;
          config.primaryMega = formValue?.config?.primaryMega;
          config.footerMega = formValue?.config?.footerMega;
        }),
      )
      .subscribe();
  }

  onUpdateWebPageDetails(): void {
    if (this.siteSettingForm.valid) {
      const { _id, permission, setting, configs } = cloneDeep(this.siteSavingData);
      const pageDetails: IWebPageDetails = {
        setting,
        permission,
        configs,
      };
      const isCustomMenu = this.menuGroupId;
      setting.mega.primaryOption = JSON.stringify(setting.mega.primaryOption);
      setting.mega.footerOption = JSON.stringify(setting.mega.footerOption);
      configs.forEach((config) => {
        config.primaryMega = JSON.stringify(config.primaryMega);
        config.footerMega = JSON.stringify(config.footerMega);
      });
      if (isCustomMenu) {
        this.menuCustomService
          .updateMenuPageDetails(_id, pageDetails, this.menuGroupId)
          .pipe(
            tap((result) => {
              if (result?.status !== 200) {
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.ERROR,
                    message: `${result?.value}`,
                  } as StatusSnackbarModel,
                });
              } else {
                configs.forEach((config) => {
                  if (config?.mode === CRUD_MODE.ADD) {
                    config.mode = CRUD_MODE.EDIT;
                  }
                });
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.SUCCESS,
                    message: 'Page Setting is saved!',
                  } as StatusSnackbarModel,
                });
                this.websiteService.$triggerMenuHTML.next(null);
              }
            }),
            catchError((e) => {
              this.showUnexpectedError();
              console.log('e => onUpdateWebPageDetails :>> ', e);
              return EMPTY;
            }),
            takeUntil(this.destroy$),
          )
          .subscribe();
      } else {
        this.siteMenuPageService
          .updateWebPageDetails(_id, pageDetails)
          .pipe(
            tap((result) => {
              if (result?.status !== 200) {
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.ERROR,
                    message: `${result?.value}`,
                  } as StatusSnackbarModel,
                });
              } else {
                configs.forEach((config) => {
                  if (config?.mode === CRUD_MODE.ADD) {
                    config.mode = CRUD_MODE.EDIT;
                  }
                });
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.SUCCESS,
                    message: 'Page Setting is saved!',
                  } as StatusSnackbarModel,
                });
                this.websiteService.$triggerMenuHTML.next(null);
              }
            }),
            catchError((e) => {
              this.showUnexpectedError();
              console.log('e => onUpdateWebPageDetails :>> ', e);
              return EMPTY;
            }),
            takeUntil(this.destroy$),
          )
          .subscribe();
      }
    } else {
      this.snackBar.openFromComponent(StatusSnackbarComponent, {
        data: {
          type: StatusSnackbarType.ERROR,
          message: 'Please check all values before updating!',
        } as StatusSnackbarModel,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
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

  onDismissSettingMode(): void {
    this.sidebarService.setSidebarMode(ESidebarMode.SITE_MANAGE);
  }

  onTogglePage(): void {
    this.isPageToggle = !this.isPageToggle;
    this.isIconToggle = false;
    this.isContentToggle = false;
    this.isPermissionToggle = false;
    this.isSeoToggle = false;
    this.isSocialToggle = false;
  }

  onToggleIcon(): void {
    this.isPageToggle = false;
    this.isIconToggle = !this.isIconToggle;
    this.isContentToggle = false;
    this.isPermissionToggle = false;
    this.isSeoToggle = false;
    this.isSocialToggle = false;
  }

  onToggleContent(): void {
    this.isPageToggle = false;
    this.isIconToggle = false;
    this.isContentToggle = !this.isContentToggle;
    this.isPermissionToggle = false;
    this.isSeoToggle = false;
    this.isSocialToggle = false;
  }

  onTogglePermission(): void {
    this.isPageToggle = false;
    this.isIconToggle = false;
    this.isContentToggle = false;
    this.isPermissionToggle = !this.isPermissionToggle;
    this.isSeoToggle = false;
    this.isSocialToggle = false;
  }

  onToggleSeo(): void {
    this.isPageToggle = false;
    this.isIconToggle = false;
    this.isContentToggle = false;
    this.isPermissionToggle = false;
    this.isSeoToggle = !this.isSeoToggle;
    this.isSocialToggle = false;
  }

  onToggleSocial(): void {
    this.isPageToggle = false;
    this.isIconToggle = false;
    this.isContentToggle = false;
    this.isPermissionToggle = false;
    this.isSeoToggle = false;
    this.isSocialToggle = !this.isSocialToggle;
  }

  getSiteSettingFormGroup(): FormGroup {
    const sitSettingFormGroup = this.fb.group({
      pageName: [{ value: '', disabled: true }, Validators.required],
      isOpenNewTab: [false],
      isMaintenancePage: [false],
      isIcon: [false],
      pageIcon: [''],
      isMega: [false],
      permission: this.getPermissionFormGroup(),
      config: this.getConfigFormGroup(),
      mega: this.getMegaFormGroup(),
      socialShare: [''],
      themeLayoutMode: this.getThemeLayoutModeFormGroup(),
    });
    return sitSettingFormGroup;
  }

  getMegaFormGroup(): FormGroup {
    const megaFormGroup = this.fb.group({
      primaryType: [EMegaMenuType.IMAGE_TEXT],
      footerType: [EMegaMenuType.IMAGE_TEXT],
      primaryOption: this.getMegaPrimaryOptionFormGroup(),
      footerOption: this.getMegaFooterOptionFormGroup(),
    });
    return megaFormGroup;
  }

  getMegaPrimaryOptionFormGroup(): FormGroup {
    const megaPrimaryOptionFormGroup = this.fb.group({});
    return megaPrimaryOptionFormGroup;
  }

  getMegaFooterOptionFormGroup(): FormGroup {
    const megaFooterOptionFormGroup = this.fb.group({});
    return megaFooterOptionFormGroup;
  }
  getThemeLayoutModeFormGroup(): FormGroup {
    const themeLayoutModeFormGroup = this.fb.group({
      useThemeLayoutMode: false,
      themeLayoutIndex: 0,
    });
    return themeLayoutModeFormGroup;
  }
  onSelectSocialShareImage(event: HTMLInputElement): void {
    if (event.files && event.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.files[0]);
      reader.onload = (e) => {
        this.siteSettingForm.get('socialShare').patchValue(e.target.result);
      };
    }
  }

  getPermissionFormGroup(): FormGroup {
    const permissionFormGroup = this.fb.group({
      type: [WebPagePermissionType.EVERYONE],
    });
    return permissionFormGroup;
  }

  getConfigFormGroup(): FormGroup {
    const configFormGroup = this.fb.group({
      cultureUI: [''],
      displayName: [''],
      seo: this.getConfigSeoFormGroup(),
      primaryMega: this.getConfigPrimaryMegaFormGroup(),
      footerMega: this.getConfigFooterMegaFormGroup(),
    });
    return configFormGroup;
  }

  getConfigSeoFormGroup(): FormGroup {
    const configSeoFormGroup = this.fb.group({
      title: [''],
      shortUrl: [''],
      description: [''],
      keyword: [''],
    });
    return configSeoFormGroup;
  }

  getConfigPrimaryMegaFormGroup(): FormGroup {
    const configPrimaryFormGroup = this.fb.group({});
    return configPrimaryFormGroup;
  }

  getConfigFooterMegaFormGroup(): FormGroup {
    const configFooterFormGroup = this.fb.group({});
    return configFooterFormGroup;
  }

  onActiveEveryonePermission(): void {
    this.isEveryonePermission = true;
    this.isPasswordPermission = false;
    this.isMemberPermission = false;
    this.siteSettingForm.get('permission').get('type').patchValue(WebPagePermissionType.EVERYONE);
    const permissionForm = this.siteSettingForm.get('permission') as FormGroup;
    permissionForm.removeControl('password');
    permissionForm.removeControl('onlyPaidMember');
  }

  onActivePasswordPermission(): void {
    this.isEveryonePermission = false;
    this.isPasswordPermission = true;
    this.isMemberPermission = false;
    this.siteSettingForm.get('permission').get('type').patchValue(WebPagePermissionType.PASSWORD);
    const permissionForm = this.siteSettingForm.get('permission') as FormGroup;
    permissionForm.addControl('password', this.fb.control('', Validators.required));
    permissionForm.removeControl('onlyPaidMember');
  }
  onActiveMemberPermission(): void {
    this.isEveryonePermission = false;
    this.isPasswordPermission = false;
    this.isMemberPermission = true;
    this.siteSettingForm.get('permission').get('type').patchValue(WebPagePermissionType.MEMBER);
    const permissionForm = this.siteSettingForm.get('permission') as FormGroup;
    permissionForm.removeControl('password');
    permissionForm.addControl('onlyPaidMember', this.fb.control(false, Validators.required));
  }
}
