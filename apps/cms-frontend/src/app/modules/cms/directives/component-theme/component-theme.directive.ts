import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { IThemeRenderingSettingCustomize } from '@reactor-room/cms-models-lib';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CmsSidebarService } from '../../services/cms-sidebar.service';

@Directive({
  selector: '[cmsNextComponentTheme]',
})
export class ComponentThemeDirective implements OnDestroy {
  nativeElement: HTMLElement;
  themeSettingCustomizeSubscription: Subscription;
  themeSettingCustomizeValue: IThemeRenderingSettingCustomize = {
    cssStyle: '',
    elementId: '',
  };
  constructor(public el: ElementRef<HTMLElement>, public sidebarService: CmsSidebarService) {
    this.nativeElement = this.el.nativeElement;
  }
  ngOnDestroy(): void {
    this.themeSettingCustomizeSubscription?.unsubscribe();
  }

  saveElementStyleToThemeSettingCustomizeValue(): void {
    this.sidebarService.setThemeSettingCustomizeValue(null);
  }

  setThemeSettingCustomizeValueToElementStyle(): void {
    if (this.themeSettingCustomizeSubscription) return;
    this.themeSettingCustomizeSubscription = this.sidebarService.getThemeSettingCustomizeValue
      .pipe(
        tap((value: IThemeRenderingSettingCustomize) => {
          if (!value) return;
          this.performThemeSettingCustomizeValueToElementStyle(value);
        }),
      )
      .subscribe();
  }

  performThemeSettingCustomizeValueToElementStyle(value: IThemeRenderingSettingCustomize): void {
    this.themeSettingCustomizeValue = value;
    const id = this.nativeElement.getAttribute('id');
    const sheet = new CSSStyleSheet();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sheet.replaceSync(value?.cssStyle ? value.cssStyle : `[id="${id}"]{}`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }

  setElementStyleToThemeSettingCustomizeFormValue(): void {
    const id = this.nativeElement.getAttribute('id');
    this.themeSettingCustomizeValue.elementId = id;
    if (!this.themeSettingCustomizeValue.cssStyle) {
      this.themeSettingCustomizeValue.cssStyle = `[id="${id}"]{}`;
    }
    this.sidebarService.setThemeSettingCustomizeFormValue(this.themeSettingCustomizeValue);
  }
}
