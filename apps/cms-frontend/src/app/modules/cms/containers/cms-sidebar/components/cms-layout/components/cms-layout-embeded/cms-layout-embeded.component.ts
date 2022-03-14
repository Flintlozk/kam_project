import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IContentEditorComponentEmbededOption } from '@reactor-room/cms-models-lib';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { Subject } from 'rxjs';
import { startWith, takeUntil, debounceTime, tap } from 'rxjs/operators';
import { ESidebarMode } from '../../../../cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-layout-embeded',
  templateUrl: './cms-layout-embeded.component.html',
  styleUrls: ['./cms-layout-embeded.component.scss'],
})
export class CmsLayoutEmbededComponent implements OnInit, OnDestroy {
  @Input() isContentEditor = false;
  layoutEmbededForm: FormGroup;
  destroy$ = new Subject();
  constructor(private sidebarService: CmsSidebarService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.layoutEmbededForm = this.getLayoutEmbededFormGroup();
    this.sidebarService.getLayoutEmbededFormValue.pipe().subscribe((layoutEmbeded: IContentEditorComponentEmbededOption) => {
      if (layoutEmbeded) {
        this.layoutEmbededForm.patchValue(layoutEmbeded);
      }
    });
    this.onLayoutEmbededFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getLayoutEmbededFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      embeded: [''],
    });
    return formGroup;
  }

  onLayoutEmbededFormValueChange(): void {
    this.layoutEmbededForm.valueChanges
      .pipe(
        startWith(this.layoutEmbededForm.value),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setLayoutEmbededValue(value);
          }
        }),
      )
      .subscribe();
  }

  onDismissContentEditor(): void {
    this.sidebarService.setSidebarMode(ESidebarMode.CONTENT_MANAGE);
    this.sidebarService.setSidebarLayoutMode(null);
  }
}
