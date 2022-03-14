import { Component, ElementRef, forwardRef, OnDestroy, OnInit, QueryList, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  contentEditorComponentTextDefault,
  EContentEditorComponentType,
  EDecoration,
  EFontStyle,
  EnumThemeRenderingSettingColorType,
  EnumThemeRenderingSettingFontType,
  fontList,
  IContentEditorComponent,
  IContentEditorComponentText,
  IContentEditorComponentTextHTML,
  IContentManageText,
} from '@reactor-room/cms-models-lib';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Children, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { ContentChange, QuillEditorComponent, Range } from 'ngx-quill';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, takeUntil } from 'rxjs/operators';
import { ESidebarMode } from '../../../../containers/cms-sidebar/cms-sidebar.model';
import { ContentChildrenComponentType } from '../../../../modules/cms-edit-mode/components/cms-edit-rendering-content/cms-edit-rendering-content.model';
import { CmsCommonService } from '../../../../services/cms-common.service';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { CmsTextEditorService } from '../../../../services/cms-text-editor.service';
import { ICmsLanguageSwitch } from '../../../common/cms-language-switch/cms-language-switch.model';
import { ITextSelectionEvent } from '../../cms-text-rendering/cms-text-rederding.model';
import stringify from 'fast-json-stable-stringify';
import { Router } from '@angular/router';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'cms-next-cms-content-text-rendering',
  templateUrl: './cms-content-text-rendering.component.html',
  styleUrls: ['./cms-content-text-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsContentTextRenderingComponent) }],
})
export class CmsContentTextRenderingComponent implements OnInit, OnDestroy {
  componentPoint: ViewContainerRef;
  componentChildren: QueryList<ContentChildrenComponentType>;
  componentType = EContentEditorComponentType.TEXT;
  viewRef: ViewRef;
  onFocus = false;
  renderingData$ = new Subject<IContentEditorComponent>();
  destroy$ = new Subject();
  savingData = deepCopy(contentEditorComponentTextDefault);
  quillHTML = '';
  currentLangage: ICmsLanguageSwitch;
  @ViewChild('editor') editor: QuillEditorComponent;
  textSelectionEvent: ITextSelectionEvent;
  isViewMode = false;
  constructor(
    public el: ElementRef,
    private cmsContentEditService: CmsContentEditService,
    private dialog: MatDialog,
    private cmsCommonService: CmsCommonService,
    private sidebarService: CmsSidebarService,
    private textEditorService: CmsTextEditorService,
    private undoRedoService: UndoRedoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.renderingData$.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe((data: IContentEditorComponentText) => {
      if (!data) return;
      this.savingData = data;
      this.initQuillHTML();
    });
    setTimeout(() => {
      this.viewRef = getRootViewRef(this) as ViewRef;
    }, 0);
    this.textEditorService.getTextEditorFormValue
      .pipe(distinctUntilChanged(), pairwise(), debounceTime(300), takeUntil(this.destroy$))
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
    this.onCheckViewMode();
  }

  onCheckViewMode(): void {
    if (this.router.url.includes('cms/edit/site-management')) this.isViewMode = true;
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
    this.quillHTML = this.editor.quillEditor.root.innerHTML;
    this.quillHTML = this.quillHTML.replace('background-color: rgb(221, 221, 221)', '');
    this.onAssignQuillEditorToSavingData();
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
    if (!event.text || event.text?.length === 1) {
      this.textEditorService.updateQuillEditor(this.editor);
    } else {
      this.quillHTML = this.editor.quillEditor.root.innerHTML;
      this.quillHTML = this.quillHTML.replace('background-color: rgb(221, 221, 221)', '');
    }
    this.onAssignQuillEditorToSavingData();
  }

  initQuillHTML(): void {
    this.cmsCommonService.getCmsLanguageSwitch.pipe(takeUntil(this.destroy$)).subscribe((language: ICmsLanguageSwitch) => {
      if (language) {
        this.currentLangage = language;
        const defaultQuillHTML = this.savingData.quillHTMLs.find((item) => item.cultureUI === this.cmsCommonService.defaultCultureUI);
        const quillHTML = this.savingData.quillHTMLs.find((item) => item.cultureUI === language.cultureUI);
        this.quillHTML = quillHTML?.quillHTML ? quillHTML?.quillHTML : defaultQuillHTML?.quillHTML;
        if (this.onFocus) this.editor.quillEditor.root.innerHTML = this.quillHTML;
      }
    });
  }

  onAssignQuillEditorToSavingData(): void {
    const activeLanguageHTML = this.savingData.quillHTMLs.find((item) => item.cultureUI === this.currentLangage.cultureUI);
    if (!activeLanguageHTML) {
      const addLanguageHTML: IContentEditorComponentTextHTML = {
        cultureUI: this.currentLangage.cultureUI,
        quillHTML: this.quillHTML,
      };
      this.savingData.quillHTMLs.push(addLanguageHTML);
    } else {
      activeLanguageHTML.quillHTML = this.quillHTML;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onFocusEvent(): void {
    if (!this.onFocus) {
      setTimeout(() => {
        this.editor.quillEditor.focus();
        if (this.editor.quillEditor.hasFocus()) {
          if (this.editor.quillEditor.root.innerText.length === 1) {
            this.editor.quillEditor.root.innerHTML = this.quillHTML;
          }
        }
      }, 0);
    } else {
      return;
    }
    this.onFocusComponent(this);
    this.sidebarService.setSidebarLayoutMode(null);
    this.onNavigate(null);
    setTimeout(() => {
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_TEXT);
    }, 0);
  }

  onFocusComponent(component: CmsContentTextRenderingComponent): void {
    if (this !== component) return;
    this.cmsContentEditService.onFocusCurrentComponent(this);
  }

  onRemoveComponent(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Delete Component Confirmation',
        content: 'Are you sure to delete this component?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.cmsContentEditService.onRemoveComponent(this.componentPoint, this.componentChildren, this.viewRef);
      }
    });
  }

  onNavigate(key: string): void {
    this.cmsContentEditService.onNavigate(this.componentPoint, this.componentChildren, this.viewRef, key, this.el);
  }
}
