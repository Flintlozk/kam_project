import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IShoppingCartPatternList, IShoppingCartPatternSetting, ShoppingCartTypes } from '@reactor-room/cms-models-lib';
import { CmsShoppingCartRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-shopping-cart-rendering/cms-shopping-cart-rendering.component';
import { ShoppingCartPatternSetting } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { productPatternList } from '../../../../cms-layout.list';
@Component({
  selector: 'cms-next-cms-layout-shopping-cart-pattern',
  templateUrl: './cms-layout-shopping-cart-pattern.component.html',
  styleUrls: ['./cms-layout-shopping-cart-pattern.component.scss'],
})
export class CmsLayoutShoppingCartPatternComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() shoppingCartRenderType: ShoppingCartTypes;
  imagePath = 'assets/cms/media-style/shopping-cart/';
  currentCartImage = null;
  isShowChangePattern = true;
  isShowAdvanceSetting = false;
  patternList = [] as IShoppingCartPatternList[];
  shoppingCartPatternListLength: number;
  patternForm = this.fb.group({
    type: [],
    component: null,
    shoppingCartPatternSetting: [''],
  });
  destroy$ = new Subject<void>();
  shoppingCartAdvanceSetting = null;

  get patternFormControl(): FormControl {
    return this.patternForm.get('type') as FormControl;
  }

  get patternAdvanceFormGroup(): FormGroup {
    return this.patternForm.get('advanceSetting') as FormGroup;
  }

  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private undoRedoService: UndoRedoService, private cmsEditService: CmsEditService) {}

  ngOnInit(): void {}

  subscribeToAdvanceSettingChanges(): void {
    this.sidebarService.getCmsLayoutBottomValueChange
      .pipe(
        takeUntil(this.destroy$),
        tap((value) => {
          this.patternForm.patchValue({ advanceSetting: value });
        }),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.sidebarService.getShoppingCartPatternSettingFormValue.pipe(distinctUntilChanged()).subscribe((shoppingCartPatternSetting: IShoppingCartPatternSetting) => {
      if (shoppingCartPatternSetting) {
        this.patternForm.patchValue(shoppingCartPatternSetting);
        this.setPatternToForm(shoppingCartPatternSetting.type);
        this.patternAdvanceFormGroup.patchValue(shoppingCartPatternSetting.advanceSetting);
      }
    });
    this.onPatternFormValueChanges();
  }

  onPatternFormValueChanges(): void {
    this.patternForm.valueChanges
      .pipe(
        startWith(this.patternForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.shoppingCartRenderType = value;
            this.sidebarService.setSidebarShoppingCartPatternChange(value);
            this.setCurrentCartImage();
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const shoppingCartPatternSetting: ShoppingCartPatternSetting = {
            type: oldValue.pattern,
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsShoppingCartRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addShoppingCartPatternSetting(shoppingCartPatternSetting);
          }
        }
      });
  }

  ngOnChanges(): void {
    this.setCurrentCartImage();
    this.setPatternList();
    this.setPatternToForm(this.shoppingCartRenderType);
  }

  setPatternToForm(pattern: string | ShoppingCartTypes): void {
    if (pattern) {
      this.deactiveAllPattern();
      this.patternFormControl.setValue(pattern);
      const currentPattern = this.patternList.find((list) => (list.type as string) == (pattern as unknown as string));
      if (!isEmpty(currentPattern)) currentPattern.selected = true;
    }
  }

  deactiveAllPattern(): void {
    this.patternList.forEach((pattern) => (pattern.selected = false));
  }

  setPatternList(): void {
    const notAvailablePattern = 11;
    const shoppingCartList = [ShoppingCartTypes.SHOPPING_CART_1, ShoppingCartTypes.SHOPPING_CART_2, ShoppingCartTypes.SHOPPING_CART_3];
    this.shoppingCartPatternListLength = shoppingCartList.length;
    this.patternList = [...productPatternList];
    for (let index = 1; index <= notAvailablePattern; index++) {
      const patternName = `Pattern ${shoppingCartList.length + index}`;
      this.patternList.push({ type: patternName, imgURL: null, activeImageURL: null, selected: null });
    }
  }

  onClickPattern(index: number, pattern: ShoppingCartTypes): void {
    if (index <= this.shoppingCartPatternListLength - 1) {
      this.setPatternToForm(pattern);
    }
  }

  setCurrentCartImage(): void {
    switch (this.shoppingCartRenderType) {
      case ShoppingCartTypes.SHOPPING_CART_1:
        this.currentCartImage = `${this.imagePath}cart-1.svg`;
        break;
      case ShoppingCartTypes.SHOPPING_CART_2:
        this.currentCartImage = `${this.imagePath}cart-2.svg`;
        break;
      case ShoppingCartTypes.SHOPPING_CART_3:
        this.currentCartImage = `${this.imagePath}cart-3.svg`;
        break;
      default:
        break;
    }
  }

  onClickChangePattern(): void {
    this.isShowChangePattern = true;
  }

  closeChangePattern(): void {
    this.isShowChangePattern = false;
  }

  onClickAdvanceSetting(): void {
    this.isShowAdvanceSetting = !this.isShowAdvanceSetting;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
