import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayEffectTitleType, OverlayEffectType } from '@reactor-room/cms-models-lib';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingAnimation } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-setting-animation',
  templateUrl: './cms-menu-custom-setting-animation.component.html',
  styleUrls: ['./cms-menu-custom-setting-animation.component.scss'],
})
export class CmsMenuCustomSettingAnimationComponent implements OnInit, OnDestroy {
  menuSettingAnimationForm: FormGroup;
  animationStyles = [
    {
      title: OverlayEffectTitleType.NONE,
      value: OverlayEffectType.NONE,
      imgUrl: 'assets/cms/text-overlay-style/none.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/none-active.svg',
      status: true,
    },
    {
      title: OverlayEffectTitleType.FADE,
      value: OverlayEffectType.FADE,
      imgUrl: 'assets/cms/text-overlay-style/fade.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/fade-active.svg',
      status: false,
    },
    {
      title: OverlayEffectTitleType.ZOOM_IN,
      value: OverlayEffectType.ZOOM_IN,
      imgUrl: 'assets/cms/text-overlay-style/zoom-in.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/zoom-in-active.svg',
      status: false,
    },
    {
      title: OverlayEffectTitleType.ZOOM_OUT,
      value: OverlayEffectType.ZOOM_OUT,
      imgUrl: 'assets/cms/text-overlay-style/zoom-out.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/zoom-out-active.svg',
      status: false,
    },
    {
      title: OverlayEffectTitleType.SLIDE_IN,
      value: OverlayEffectType.SLIDE_IN,
      imgUrl: 'assets/cms/text-overlay-style/slide-in.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/slide-in-active.svg',
      status: false,
    },
    {
      title: OverlayEffectTitleType.MOVE_UP,
      value: OverlayEffectType.MOVE_UP,
      imgUrl: 'assets/cms/text-overlay-style/move-up.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/move-up-active.svg',
      status: false,
    },
  ];
  destroy$ = new Subject();
  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {
    this.menuSettingAnimationForm = this.getMenuSettingAnimationForm();
    this.sidebarService.getMenuSettingAnimationFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((menuSettingAnimation) => {
      if (menuSettingAnimation) {
        this.menuSettingAnimationForm.patchValue(menuSettingAnimation);
        this.onActiveAnimationCurrentStyle(menuSettingAnimation.animation);
      }
    });
    this.onMenuSettingAnimationFormValueChange();
  }

  onMenuSettingAnimationFormValueChange(): void {
    this.menuSettingAnimationForm.valueChanges
      .pipe(
        startWith(this.menuSettingAnimationForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setMenuSettingAnimationValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuSettingAnimation: MenuRenderingSettingAnimation = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuSettingAnimation(menuSettingAnimation);
          }
        }
      });
  }

  getMenuSettingAnimationForm(): FormGroup {
    const formGroup = this.fb.group({
      animation: [OverlayEffectType.NONE],
      component: null,
      menuSettingAnimation: [''],
    });
    return formGroup;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onActiveAnimationStyle(index: number): void {
    this.animationStyles.forEach((item) => (item.status = false));
    this.animationStyles[index].status = true;
    this.menuSettingAnimationForm.get('animation').patchValue(this.animationStyles[index].value);
  }

  onActiveAnimationCurrentStyle(currentStyle: OverlayEffectType): void {
    this.animationStyles.forEach((style) => (style.status = false));
    const found = this.animationStyles.find((style) => style.value === currentStyle);
    found.status = true;
  }
}
