import { DragDrop } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FadeAnimate } from '@reactor-room/animation';
import { shoppingCartTypeList } from '@reactor-room/cms-models-lib';
import { ConfirmDialogType } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, IConfirmDialogBtnLabels, IConfirmDialogResult } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CmsEditService } from '../../../../../services/cms-edit.service';
import { DragRefData } from '../../../../cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { IPageDesignMenu } from '../page-design.model';
import { MenuGenericType, ShoppingCartTypes } from './../../../../../../../../../../../libs/cms-models-lib/src/lib/component/component.model';

@Component({
  selector: 'cms-next-cms-shopping-cart',
  templateUrl: './cms-shopping-cart.component.html',
  styleUrls: ['./cms-shopping-cart.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsShoppingCartComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingCart1', { static: true }) shoppingCart1: ElementRef<HTMLElement>;
  @ViewChild('shoppingCart2', { static: true }) shoppingCart2: ElementRef<HTMLElement>;
  @ViewChild('shoppingCart3', { static: true }) shoppingCart3: ElementRef<HTMLElement>;

  pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/shopping-cart.svg',
    activeIcon: 'assets/design-sections/shopping-cart-a.svg',
    title: 'Shopping Cart',
    isActive: false,
  };
  shoppingCartTypeList1 = shoppingCartTypeList[0];
  shoppingCartTypeList2 = shoppingCartTypeList[1];
  shoppingCartTypeList3 = shoppingCartTypeList[2];

  destroy$ = new Subject();
  constructor(private cmsEditService: CmsEditService, private dragDrop: DragDrop, private dialog: MatDialog) {}

  ngOnInit(): void {
    const dragRef1 = this.dragDrop.createDrag<DragRefData>(this.shoppingCart1);
    dragRef1.data = { dropListRef: null, type: this.shoppingCartTypeList1.type, genericType: MenuGenericType.SHOPPING_CART };
    this.cmsEditService.dragHandler(dragRef1, this.destroy$);
    const dragRef2 = this.dragDrop.createDrag<DragRefData>(this.shoppingCart2);
    dragRef2.data = { dropListRef: null, type: this.shoppingCartTypeList2.type, genericType: MenuGenericType.SHOPPING_CART };
    this.cmsEditService.dragHandler(dragRef2, this.destroy$);
    const dragRef3 = this.dragDrop.createDrag<DragRefData>(this.shoppingCart3);
    dragRef3.data = { dropListRef: null, type: this.shoppingCartTypeList3.type, genericType: MenuGenericType.SHOPPING_CART };
    this.cmsEditService.dragHandler(dragRef3, this.destroy$);
    this.cmsEditService.addMenuDragRef(dragRef1);
    this.cmsEditService.addMenuDragRef(dragRef2);
    this.cmsEditService.addMenuDragRef(dragRef3);
  }

  onClickShoppingCart(cartType: ShoppingCartTypes): void {
    const btnLabels: IConfirmDialogBtnLabels = {
      highlightBtn: 'Add a new page',
      nonHighlightBtn: 'Append current page',
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Add template as new page?',
        checkbox: {
          isCheckBox: true,
          checkBoxLabel: `Don't show again`,
        },
        btnLabels,
      } as ConfirmDialogModel,
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        tap((result: IConfirmDialogResult) => {
          //TODO:// need to add actions
          console.log('😍 ~ result', result, cartType);
        }),
      )
      .subscribe();
  }

  onActivateChildContainer(): void {
    this.pageDesignMenu.isActive = !this.pageDesignMenu.isActive;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
