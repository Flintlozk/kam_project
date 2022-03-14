import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { convertNumberToPx } from '@reactor-room/cms-frontend-helpers-lib';
import { ELayoutAttributes, ELayoutColumns, ILayoutColumn, ILayoutDesignEffect, layoutColumnDefault, layoutEffectDefault } from '@reactor-room/cms-models-lib';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, tap } from 'rxjs/operators';
import { CmsPublishService } from '../../services/cms-publish.service';
import { CmsSidebarService } from '../../services/cms-sidebar.service';

@Directive({
  selector: '[cmsNextComponentLayout]',
})
export class ComponentLayoutDirective implements OnDestroy {
  nativeElement: HTMLElement;
  layoutColumnSubscription: Subscription;
  layoutColumnValue = deepCopy(layoutColumnDefault);
  layoutEffectSubscription: Subscription;
  layoutEffectValue = deepCopy(layoutEffectDefault);
  constructor(public el: ElementRef<HTMLElement>, public sidebarService: CmsSidebarService, public cmsPublishService: CmsPublishService) {
    this.initLayoutStyle();
  }

  ngOnDestroy(): void {
    this.layoutColumnSubscription?.unsubscribe();
    this.layoutEffectSubscription?.unsubscribe();
  }

  initLayoutStyle(): void {
    this.nativeElement = this.el.nativeElement;
    this.nativeElement.style.display = 'grid';
    this.nativeElement.style.alignContent = 'start';
    this.nativeElement.style.alignItems = 'start';
  }

  saveElementStyleToLayoutColumnValue(): void {
    this.sidebarService.setLayoutColumnValue(null);
  }

  saveElementStyleToLayoutEffectValue(): void {
    this.sidebarService.setLayoutDesignEffectValue(null);
  }

  setLayoutColumnValueToElementStyle(): void {
    if (this.layoutColumnSubscription) return;
    this.layoutColumnSubscription = this.sidebarService.getLayoutColumnValue
      .pipe(
        startWith(this.layoutColumnValue),
        distinctUntilChanged(),
        pairwise(),
        tap(([oldValue, newVaLue]: [ILayoutColumn, ILayoutColumn]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.performSetLayoutColumnValueToElementStyle(newVaLue);
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  performSetLayoutColumnValueToElementStyle(layoutColumn: ILayoutColumn): void {
    this.layoutColumnValue = layoutColumn;
    this.nativeElement.setAttribute(ELayoutAttributes.COLUMN, layoutColumn.column);
    this.nativeElement.setAttribute(ELayoutAttributes.GAP, layoutColumn.gap.toString());
    this.nativeElement.style.gridTemplateColumns = layoutColumn.column;
    this.nativeElement.style.gap = convertNumberToPx(layoutColumn.gap);
  }

  setElementStyleToLayoutColumnFormValue(): void {
    const column = this.nativeElement.getAttribute(ELayoutAttributes.COLUMN) as ELayoutColumns;
    const gap = this.nativeElement.getAttribute(ELayoutAttributes.GAP);
    this.layoutColumnValue.column = column ? column : ELayoutColumns.ONE_COLUMN;
    this.layoutColumnValue.gap = gap ? +gap : 0;
    this.sidebarService.setLayoutColumnFormValue(this.layoutColumnValue);
  }

  setLayoutEffectValueToElementStyle(): void {
    if (this.layoutEffectSubscription) return;
    this.layoutEffectSubscription = this.sidebarService.getLayoutDesignEffectValue
      .pipe(
        startWith(this.layoutEffectValue),
        distinctUntilChanged(),
        pairwise(),
        tap(([oldValue, newVaLue]: [ILayoutDesignEffect, ILayoutDesignEffect]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.performSetLayoutEffectValueToElementStyle(newVaLue);
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  performSetLayoutEffectValueToElementStyle(layoutEffect: ILayoutDesignEffect): void {
    this.layoutEffectValue = layoutEffect;
  }

  setElementStyleToLayoutEffectFormValue(): void {
    this.sidebarService.setLayoutDesignEffectFormValue(this.layoutEffectValue);
  }
}
