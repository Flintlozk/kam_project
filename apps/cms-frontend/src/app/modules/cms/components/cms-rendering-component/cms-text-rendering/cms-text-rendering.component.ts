import { Attribute, Component, ElementRef, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, ViewChild, ViewRef } from '@angular/core';
import { QuillEditorComponent, Range } from 'ngx-quill';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { ITextSelectionEvent } from './cms-text-rederding.model';
import { CmsTextEditorService } from '../../../services/cms-text-editor.service';
import { debounceTime, distinctUntilChanged, pairwise, takeUntil, tap } from 'rxjs/operators';
import { DragRefData, ViewRefAndElementRefAndComponent } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { Mixin } from 'ts-mixer';
import { ComponentCommonDirective } from '../../../directives/component-common/component-common.directive';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { Children, clearDragRef, getRootViewRef } from '../../../../../shares/utils';
import { PARENT_LAYOUT_CONTAINER, ParentLayoutContainer } from '../cms-layout-rendering/token';
import { ContentChange } from 'ngx-quill/lib/quill-editor.component';
import { UndoRedoService } from '../../../../../services/undo-redo.service';
import stringify from 'fast-json-stable-stringify';
import {
  ColumnType,
  EDecoration,
  EFontFamilyCode,
  EFontStyle,
  IContentManageText,
  IRenderingComponentData,
  ITextRenderingSetting,
  ITextSettingInit,
  MenuGenericType,
  TextID,
  TextType,
  IThemeOption,
  EnumThemeRenderingSettingFontType,
  fontList,
  EnumThemeRenderingSettingColorType,
  IContentEditorComponentTextHTML,
  ITextRenderingSettingCultureUI,
} from '@reactor-room/cms-models-lib';
import { ESidebarLayoutTab } from '../../../containers/cms-sidebar/components/cms-layout/cms-layout.model';
import { ContentContainer, CONTENT_CONTAINER } from '../cms-content-container-rendering/token';
import { HeaderContainer, HEADER_CONTAINER } from '../cms-header-container-rendering/token';
import { FooterContainer, FOOTER_CONTAINER } from '../cms-footer-container-rendering/token';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { CmsCommonService } from '../../../services/cms-common.service';
import { ICmsLanguageSwitch } from '../../common/cms-language-switch/cms-language-switch.model';
import { environment } from '../../../../../../environments/environment';
import { CmsPublishService } from '../../../services/cms-publish.service';

@Component({
  selector: 'cms-next-cms-text-rendering',
  templateUrl: './cms-text-rendering.component.html',
  styleUrls: ['./cms-text-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsTextRenderingComponent) }],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: environment.cms.CMS_FRONTEND_COMPONENT_CLASS,
  },
})
export class CmsTextRenderingComponent extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective) implements OnInit, OnDestroy {
  @Input() public initTextSetting: ITextSettingInit;
  @Input() public type: TextType;
  //TOTO: Input ??? Attribute???
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('column') @Attribute('column') public column: ColumnType;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('id') @Attribute('id') public textID: TextID;
  renderingComponentData$ = new Subject<IRenderingComponentData>();
  @ViewChild('editor') editor: QuillEditorComponent;
  public viewRef: ViewRef;
  public dragRef: DragRef<DragRefData>;
  public onFocus = false;
  public componentType = 'CmsTextRenderingComponent';
  public themeOption: IThemeOption;
  public theHtmlString: string;
  public savingData: ITextRenderingSettingCultureUI[];
  currentLangage: ICmsLanguageSwitch;
  public isThemeGlobal: boolean;
  textSelectionEvent: ITextSelectionEvent;
  private destroy$ = new Subject();
  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    private textEditorService: CmsTextEditorService,
    private cmsEditService: CmsEditService,
    private dragDrop: DragDrop,
    public cmsPublishService: CmsPublishService,
    @Optional() @Inject(PARENT_LAYOUT_CONTAINER) private parentLayoutContainer: ParentLayoutContainer,
    @Optional() @Inject(CONTENT_CONTAINER) private contentContainer: ContentContainer,
    @Optional() @Inject(HEADER_CONTAINER) private headerContainer: HeaderContainer,
    @Optional() @Inject(FOOTER_CONTAINER) private footerContainer: FooterContainer,
    private undoRedoService: UndoRedoService,
    private cmsCommonService: CmsCommonService,
  ) {
    super(el, sidebarService, cmsPublishService);
  }

  ngOnInit(): void {
    this.renderingComponentData$
      .pipe(
        debounceTime(1),
        takeUntil(this.destroy$),
        tap((renderingData) => {
          if (renderingData) {
            if (renderingData.themeOption) {
              this.themeOption = renderingData.themeOption;
              const regex = new RegExp('^[0-9a-fA-F]{24}$');
              if (!regex.test(renderingData.themeOption.themeIdentifier)) {
                this.isThemeGlobal = true;
              }
            }
            this.el.nativeElement.classList.add('rendering-item');
            let { options } = renderingData;
            if (options) {
              options = options as ITextRenderingSetting;
              if (options) {
                this.savingData = options.quillHTMLs;
                this.initQuillHTML();
              }
            }
            const { commonSettings } = renderingData;
            if (commonSettings) {
              if (commonSettings.border) this.performSetLayoutSettingBorderValueToElementStyle(commonSettings.border);
              if (commonSettings.shadow) this.performsetLayoutSettingShadowValueToElementStyle(commonSettings.shadow);
              if (commonSettings.hover) this.performSetLayoutSettingHoverValueToElementStyle(commonSettings.hover);
              if (commonSettings.advance) this.performSetLayoutSettingAdvanceValueToElementStyle(commonSettings.advance);
              if (commonSettings.background) this.performSetLayoutSettingBackgroundValueToElementStyle(commonSettings.background);
              if (commonSettings.customize) this.performSetLayoutSettingCustomizeValueToElementStyle(commonSettings.customize);
            }
            this.setTextType(this.textID);
          }
        }),
      )
      .subscribe();
    setTimeout(() => {
      this.initComponent();
      this.viewRef = getRootViewRef(this);
    }, 500);
    this.textEditorService.getTextEditorFormValue
      .pipe(distinctUntilChanged(), pairwise(), debounceTime(100), takeUntil(this.destroy$))
      .subscribe((val: [IContentManageText, IContentManageText]) => {
        const [before, after] = val;
        if (stringify(before) !== stringify(after)) {
          if (this.editor && this.textSelectionEvent) {
            const range = this.textSelectionEvent.range ? this.textSelectionEvent.range : this.textSelectionEvent.oldRange;
            this.setEditorValueToQuill(range, after);
            this.handleThemeStyleSwitcher(before.themeStyle, after.themeStyle);
          }
        }
      });
    this.textEditorService.getTextEmoji.pipe(takeUntil(this.destroy$)).subscribe((emoji: string) => {
      if (this.editor && this.textSelectionEvent) {
        const range = this.textSelectionEvent.range ? this.textSelectionEvent.range : this.textSelectionEvent.oldRange;
        this.editor.quillEditor.insertText(range.index, emoji, 'user');
      }
    });
  }

  initQuillHTML(): void {
    this.cmsCommonService.getCmsLanguageSwitch.pipe(takeUntil(this.destroy$)).subscribe((language: ICmsLanguageSwitch) => {
      if (language) {
        this.currentLangage = language;
        if (this.savingData[0].cultureUI === undefined || this.savingData[0].cultureUI === null) {
          this.savingData[0].cultureUI = this.cmsCommonService.defaultCultureUI;
        }
        const defaultQuillHTML = this.savingData.find((item) => item?.cultureUI === this.cmsCommonService.defaultCultureUI);
        const quillHTML = this.savingData.find((item) => item?.cultureUI === language.cultureUI);
        this.theHtmlString = quillHTML?.quillHTML ? quillHTML?.quillHTML : defaultQuillHTML?.quillHTML;
        if (this.onFocus) this.editor.quillEditor.root.innerHTML = this.theHtmlString;
      }
    });
  }

  onAssignQuillEditorToSavingData(): void {
    const activeLanguageHTML = this.savingData.find((item) => item.cultureUI === this.currentLangage.cultureUI);
    if (!activeLanguageHTML) {
      const addLanguageHTML: IContentEditorComponentTextHTML = {
        cultureUI: this.currentLangage.cultureUI,
        quillHTML: this.theHtmlString,
      };
      this.savingData.push(addLanguageHTML);
    } else {
      activeLanguageHTML.quillHTML = this.theHtmlString;
    }
  }

  handleThemeStyleSwitcher(beforeThemeStyle: EnumThemeRenderingSettingFontType, afterThemeStyle: EnumThemeRenderingSettingFontType): void {
    const quillElement = this.editor.quillEditor.root as HTMLElement;
    const pTags = quillElement.getElementsByTagName('P') as HTMLCollection;
    const pTagsArray = Array.from(pTags);
    if (!afterThemeStyle) {
      pTagsArray.forEach((pTag: HTMLElement) => {
        const spans = pTag.querySelectorAll('SPAN');
        const spanElementArray = Array.from(spans);
        if (!pTag.classList.contains('itp-theme-block-true')) {
          pTag.classList.remove('itp-line-height-true');
          pTag.classList.remove('itp-letter-spacing-true');
          spanElementArray.forEach((span: HTMLElement) => {
            span.classList.remove('itp-text-color-true');
            span.classList.remove('itp-text-opacity-true');
            span.classList.remove('itp-font-family-true');
            span.classList.remove('itp-font-size-true');
            span.classList.remove('itp-font-style-true');
          });
        }
      });
    }
    if (beforeThemeStyle !== afterThemeStyle && afterThemeStyle) {
      pTagsArray.forEach((pTag: HTMLElement) => {
        const spans = pTag.querySelectorAll('SPAN');
        const spanElementArray = Array.from(spans);
        const strongs = pTag.querySelectorAll('STRONG');
        const strongElementArray = Array.from(strongs);
        const ems = pTag.querySelectorAll('EM');
        const emElementArray = Array.from(ems);
        if (pTag.classList.contains('itp-theme-block-true')) {
          pTag.classList.add('itp-line-height-true');
          pTag.classList.add('itp-letter-spacing-true');
          pTag.style.removeProperty('line-height');
          pTag.style.removeProperty('letter-spacing');
          spanElementArray.forEach((span: HTMLElement) => {
            this.triggerThemeProperties(span);
          });
          strongElementArray.forEach((strong: HTMLElement) => {
            this.triggerThemeProperties(strong);
            strong.outerHTML = strong.outerHTML.replace('strong', 'span');
          });
          emElementArray.forEach((em: HTMLElement) => {
            this.triggerThemeProperties(em);
            em.outerHTML = em.outerHTML.replace('em', 'span');
          });
        }
      });
    }
  }

  triggerThemeProperties(element: HTMLElement): void {
    element.classList.add('itp-text-color-true');
    element.classList.add('itp-text-opacity-true');
    element.classList.add('itp-font-family-true');
    element.classList.add('itp-font-size-true');
    element.classList.add('itp-font-style-true');
    element.style.removeProperty('color');
    element.style.removeProperty('font-family');
    element.style.removeProperty('font-size');
    element.style.removeProperty('opactity');
    fontList.forEach((font) => {
      element.classList.remove('ql-font-' + font);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    clearDragRef(this.dragRef);
  }

  checkTextType(type: TextType): void {
    let setting: ITextSettingInit;
    let htmlContent = '';
    switch (type) {
      case TextType.Text1:
        {
          setting = { color: '#000000', font: EFontFamilyCode.PROMPT, size: '18px' };
          htmlContent =
            // eslint-disable-next-line max-len
            '<p><span class="ql-font-prompt" style="color: rgb(0, 0, 0); font-size: 18px;">Loream</span></p><p><span class="ql-font-prompt" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>';
        }
        break;
      case TextType.Text2:
        {
          setting = { color: '#000000', font: EFontFamilyCode.RACING_SANS_ONE, size: '18px' };
          htmlContent =
            // eslint-disable-next-line max-len
            '<p><span class="ql-font-racing" style="color: rgb(0, 0, 0); font-size: 18px;">Loream</span></p><p><span class="ql-font-racing" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>';
        }
        break;
      case TextType.Text3:
        {
          setting = { color: '#000000', font: EFontFamilyCode.QUANTICO, size: '14px' };
          htmlContent =
            // eslint-disable-next-line max-len
            '<p><span class="ql-font-quantico" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>';
        }
        break;
      case TextType.Text4:
        {
          setting = { color: '#000000', font: EFontFamilyCode.POST_NO_BILLS_COLOMBO, size: '14px' };
          htmlContent =
            // eslint-disable-next-line max-len
            /* html */ '<p><span class="ql-font-colombo" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>';
        }
        break;
      case TextType.Text5:
        {
          setting = { color: '#000000', font: EFontFamilyCode.NEUCHA, size: '14px' };
          htmlContent =
            // eslint-disable-next-line max-len
            /* html */ '<p><span class="ql-font-neucha" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est enim nam tristique. </span></p>';
        }
        break;
      default: {
        console.error('checkTextElement Error: Unhandled element' + type);
        return;
      }
    }
    this.initTextSetting = setting;
    this.theHtmlString = htmlContent;
  }

  initComponent(): void {
    const dropListRef = this.getCurrentDropZoneListRef();
    if (dropListRef) {
      const { viewRefAndElementRefAndComponents, dragRefs } = dropListRef.data;
      const viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent = {
        component: this,
      };
      this.insertComponentRef(viewRefAndElementRefAndComponents, viewRefAndElementRefAndComponents?.length, viewRefAndElementRefAndComponent);
      const dragRef = this.createAndInsertDragRefToContainer(this.el, dragRefs.length, dropListRef);
      this.dragRef = dragRef;
      this.dragRef.data.component = this;
      if (this.isThemeGlobal) {
        this.dragRef.disabled = true;
      }
    }
  }
  setTextType(id: TextID): void {
    switch (id) {
      case TextID.Text1:
        this.type = TextType.Text1;
        break;
      case TextID.Text2:
        this.type = TextType.Text2;
        break;
      case TextID.Text3:
        this.type = TextType.Text3;
        break;
      case TextID.Text4:
        this.type = TextType.Text4;
        break;
      case TextID.Text5:
        this.type = TextType.Text5;
        break;
      default:
        this.type = TextType.Text1;
    }
  }

  getCurrentDropZoneListRef(): DropListRef {
    if (this.parentLayoutContainer) {
      switch (this.column) {
        case ColumnType.COLUMN_1:
          return this.parentLayoutContainer.layoutDropListRef1;
        case ColumnType.COLUMN_2:
          return this.parentLayoutContainer.layoutDropListRef2;
        case ColumnType.COLUMN_3:
          return this.parentLayoutContainer.layoutDropListRef3;
        case ColumnType.COLUMN_4:
          return this.parentLayoutContainer.layoutDropListRef4;
        default:
          return this.parentLayoutContainer.layoutDropListRef1;
      }
    } else if (this.headerContainer) return this.cmsEditService.headerDropListRef;
    else if (this.footerContainer) return this.cmsEditService.footerDropListRef;
    else if (this.contentContainer) return this.cmsEditService.dropZoneDropListRef;
    else return null;
  }

  createAndInsertDragRefToContainer(elementRef: ElementRef, at: number, container: DropListRef): DragRef {
    const dragRef = this.dragDrop.createDrag<DragRefData>(elementRef);
    container.data.dragRefs.splice(at, 0, dragRef);
    container.withItems(container.data.dragRefs);
    dragRef.data = { dropListRef: container, type: this.type, genericType: MenuGenericType.TEXT };
    this.cmsEditService.dragHandler(dragRef, this.destroy$);
    return dragRef;
  }

  insertComponentRef(viewRefAndElementRefAndComponents: ViewRefAndElementRefAndComponent[], at: number, viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent): void {
    viewRefAndElementRefAndComponents.splice(at, 0, viewRefAndElementRefAndComponent);
  }

  onLeftColResize(event: MouseEvent): void {
    console.log('clientX :>> ', event.clientX);
    console.log('offsetX :>> ', event.offsetX);
    console.log('pageX :>> ', event.pageX);
  }

  onRightColResize(event: MouseEvent): void {
    console.log('clientX :>> ', event.clientX);
    console.log('offsetX :>> ', event.offsetX);
    console.log('pageX :>> ', event.pageX);
  }

  onBottomRowResize(event: MouseEvent): void {
    console.log('clientX :>> ', event.clientX);
    console.log('offsetX :>> ', event.offsetX);
    console.log('pageX :>> ', event.pageX);
  }

  setEditorValueToQuill(range: Range, val: IContentManageText): void {
    const isTheme = val.themeStyle ? true : false;
    const isColorMode = val.text.colorStyle ? true : false;
    this.editor.quillEditor.formatText(
      range.index,
      range.length,
      {
        bold: val.isThemeStyle ? null : val.text.fontStyle === EFontStyle.BOLD,
        italic: val.isThemeStyle ? null : val.text.fontStyle === EFontStyle.ITALIC,
        size: val.isThemeFontSize ? null : val.text.fontSize ? val.text.fontSize : textDefault.defaultFontSizePx,
        underline: val.typography.decoration === EDecoration.UNDERLINE,
        strike: val.typography.decoration === EDecoration.CROSSWORD,
        script: val.typography.numberPosition,
        color: val.isThemeTextColor ? null : isColorMode ? null : val.text.textColor ? val.text.textColor : textDefault.defaultTextLightColor,
        opacity: val.isThemeTextOpacity ? null : val.text.textOpacity ? val.text.textOpacity : 1,
        font: val.isThemeFontFamily ? null : val.text.fontFamily ? val.text.fontFamily : textDefault.defaultFontFamilyCode,
        isThemeFontFamily: val.isThemeFontFamily,
        isThemeFontSize: val.isThemeFontSize,
        isThemeTextColor: val.isThemeTextColor,
        isThemeTextOpacity: val.isThemeTextOpacity,
        isThemeStyle: val.isThemeStyle,
        isColorModeHeader: val.text.colorStyle === EnumThemeRenderingSettingColorType.HEADER,
        isColorModeSubHeader: val.text.colorStyle === EnumThemeRenderingSettingColorType.SUB_HEADER,
        isColorModeDetail: val.text.colorStyle === EnumThemeRenderingSettingColorType.DETAIL,
        isColorModeSubDetail: val.text.colorStyle === EnumThemeRenderingSettingColorType.SUB_DETAIL,
        isColorModeAsset1: val.text.colorStyle === EnumThemeRenderingSettingColorType.ASSERT1,
        isColorModeAsset2: val.text.colorStyle === EnumThemeRenderingSettingColorType.ASSERT2,
        isColorModeAsset3: val.text.colorStyle === EnumThemeRenderingSettingColorType.ASSERT3,
      },
      'user',
    );
    if (val.link.linkValue) {
      this.editor.quillEditor.formatText(
        range.index,
        range.length,
        {
          link: false,
        },
        'user',
      );
      this.editor.quillEditor.formatText(
        range.index,
        range.length,
        {
          link: {
            href: val.link.linkValue,
            url: val.link.linkValue,
            type: val.link.linkType,
            parent: val.link.parentID,
          },
        },
        'user',
      );
    } else {
      this.editor.quillEditor.formatText(
        range.index,
        range.length,
        {
          link: false,
        },
        'user',
      );
    }
    this.editor.quillEditor.formatLine(
      range.index,
      range.length,
      {
        align: val.text.textAlignment,
        list: val.typography.bullet,
        lineheight: val.isThemeLineHeight ? null : val.typography.lineHeight ? val.typography.lineHeight : textDefault.defaultParagraphSetting,
        letterspacing: val.isThemeLetterSpacing ? null : val.typography.letterSpacing ? val.typography.letterSpacing : textDefault.defaultParagraphSetting,
        isThemeLineHeight: isTheme && val.isThemeLineHeight,
        isThemeLetterSpacing: isTheme && val.isThemeLetterSpacing,
        isThemeHeader: val.themeStyle === EnumThemeRenderingSettingFontType.HEADER,
        isThemeSubHeader: val.themeStyle === EnumThemeRenderingSettingFontType.SUB_HEADER,
        isThemeDetail: val.themeStyle === EnumThemeRenderingSettingFontType.DETAIL,
        isThemeSubDetail: val.themeStyle === EnumThemeRenderingSettingFontType.SUB_DETAIL,
        isThemeBlock: isTheme,
      },
      'user',
    );
    this.theHtmlString = this.editor.quillEditor.root.innerHTML;
    this.theHtmlString = this.theHtmlString.replace('background-color: rgb(221, 221, 221)', '');
    this.onAssignQuillEditorToSavingData();
  }

  onTextEditorFocusEvent(): void {
    if (!this.onFocus) {
      setTimeout(() => {
        this.editor.quillEditor.focus();
        if (this.editor.quillEditor.hasFocus()) {
          if (this.editor.quillEditor.root.innerText.length === 1) {
            this.editor.quillEditor.root.innerHTML = this.theHtmlString;
          }
        }
      }, 0);
    } else {
      return;
    }
    this.onTextEditorFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_TEXT);
      this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
    }, 0);
  }

  onTextEditorFocusComponent(component: CmsTextRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
  }

  onTextSelectionEditor(event: ITextSelectionEvent): void {
    const quill = event.editor;
    if (event.range) {
      quill.formatText(0, quill.getLength(), 'background', false, 'silent');
      quill.formatText(event.range.index, event.range.length, 'background', '#dddddd', 'silent');
      this.textSelectionEvent = event;
      this.textEditorService.updateQuillEditor(this.editor);
      this.textEditorService.updateTextSelectionRange(event.range);
    }
  }

  onTextContentChange(event: ContentChange): void {
    if (event.source === 'silent') {
      return;
    }
    const { editor, delta, oldDelta } = event;
    if (!event.text || event.text?.length === 1) {
      this.editor.quillEditor.format('font', this.initTextSetting.font, 'silent');
      this.editor.quillEditor.format('size', this.initTextSetting.size, 'silent');
      this.editor.quillEditor.format('color', this.initTextSetting.color, 'silent');
      this.textEditorService.updateQuillEditor(this.editor);
    } else {
      if (this.theHtmlString !== this.editor.quillEditor.root.innerHTML) {
        this.theHtmlString = this.editor.quillEditor.root.innerHTML;
        this.theHtmlString = this.theHtmlString.replace('background-color: rgb(221, 221, 221)', '');
        this.onAssignQuillEditorToSavingData();
        this.cmsPublishService.savingTrigger$.next(this.theHtmlString);
      }
    }
    const history = this.editor.quillEditor.getModule('history');
    history.clear();
    this.undoRedoService.addDeltaUndo(this.theHtmlString, editor, delta, oldDelta);
  }

  onRemoveCurrentComponent(): void {
    this.cmsEditService.onRemoveCurrentComponent(this.dragRef).pipe(takeUntil(this.destroy$)).subscribe();
  }
}
