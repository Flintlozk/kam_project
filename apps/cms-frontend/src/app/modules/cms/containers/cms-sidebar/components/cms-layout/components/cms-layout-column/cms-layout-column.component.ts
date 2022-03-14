import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil } from 'rxjs/operators';
import { CmsSidebarService } from '../../../../../../../../modules/cms/services/cms-sidebar.service';
import { Subject } from 'rxjs';
import { UndoRedoService } from '../../../../../../../../services/undo-redo.service';
import { LayoutColumn } from '../../../../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../../../../services/cms-edit.service';
import { CmsLayoutRenderingComponent } from '../../../../../../components/cms-rendering-component/cms-layout-rendering/cms-layout-rendering.component';
import { tap } from 'rxjs/operators';
import { ELayoutColumns, ELayoutColumnTitles } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-layout-column',
  templateUrl: './cms-layout-column.component.html',
  styleUrls: ['./cms-layout-column.component.scss'],
})
export class CmsLayoutColumnComponent implements OnInit, AfterViewInit, OnDestroy {
  destroy$ = new Subject();
  columnLayout = [
    {
      value: ELayoutColumns.ONE_COLUMN,
      title: ELayoutColumnTitles.ONE_COLUMN,
      icon: 'assets/cms/column-style/style-1.svg',
      iconActive: 'assets/cms/column-style/style-1-a.svg',
      status: true,
    },
    {
      value: ELayoutColumns.FIVE_FIVE_COLUMN,
      title: ELayoutColumnTitles.FIVE_FIVE_COLUMN,
      icon: 'assets/cms/column-style/style-2.svg',
      iconActive: 'assets/cms/column-style/style-2-a.svg',
      status: false,
    },
    {
      value: ELayoutColumns.SIX_FOUR_COLUMN,
      title: ELayoutColumnTitles.SIX_FOUR_COLUMN,
      icon: 'assets/cms/column-style/style-3.svg',
      iconActive: 'assets/cms/column-style/style-3-a.svg',
      status: false,
    },
    {
      value: ELayoutColumns.FOUR_SIX_COLUMN,
      title: ELayoutColumnTitles.FOUR_SIX_COLUMN,
      icon: 'assets/cms/column-style/style-4.svg',
      iconActive: 'assets/cms/column-style/style-4-a.svg',
      status: false,
    },
    {
      value: ELayoutColumns.SEVEN_THREE_COLUMN,
      title: ELayoutColumnTitles.SEVEN_THREE_COLUMN,
      icon: 'assets/cms/column-style/style-5.svg',
      iconActive: 'assets/cms/column-style/style-5-a.svg',
      status: false,
    },
    {
      value: ELayoutColumns.THREE_SEVEN_COLUMN,
      title: ELayoutColumnTitles.THREE_SEVEN_COLUMN,
      icon: 'assets/cms/column-style/style-6.svg',
      iconActive: 'assets/cms/column-style/style-6-a.svg',
      status: false,
    },
    {
      value: ELayoutColumns.THREE_COLUMN,
      title: ELayoutColumnTitles.THREE_COLUMN,
      icon: 'assets/cms/column-style/style-7.svg',
      iconActive: 'assets/cms/column-style/style-7-a.svg',
      status: false,
    },
    {
      value: ELayoutColumns.FOUR_COLUMN,
      title: ELayoutColumnTitles.FOUR_COLUMN,
      icon: 'assets/cms/column-style/style-8.svg',
      iconActive: 'assets/cms/column-style/style-8-a.svg',
      status: false,
    },
  ];

  layoutColumnForm: FormGroup;
  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private undoRedoService: UndoRedoService, private cmsEditService: CmsEditService) {}

  ngOnInit(): void {
    this.layoutColumnForm = this.getLayoutColumnFormGroup();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.sidebarService.getlayoutColumnFormValue.pipe(distinctUntilChanged()).subscribe((value: LayoutColumn) => {
      if (value) {
        this.layoutColumnForm.patchValue(value);
        this.onActiveCurrentColumn(value.column);
      }
    });
    this.onLayoutColumnFormValueChange();
  }

  onLayoutColumnFormValueChange(): void {
    this.layoutColumnForm.valueChanges
      .pipe(
        startWith(this.layoutColumnForm.value),
        takeUntil(this.destroy$),
        debounceTime(100),
        distinctUntilChanged(),
        tap((value) => {
          if (value) {
            this.sidebarService.setLayoutColumnValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const layoutColumn: LayoutColumn = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsLayoutRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutColumnUndo(layoutColumn);
          }
        }
      });
  }

  getLayoutColumnFormGroup(): FormGroup {
    const layoutColumnFormGroup = this.fb.group({
      column: this.columnLayout[0].value,
      gap: [0],
      component: null,
    });
    return layoutColumnFormGroup;
  }

  onActiveCurrentColumn(currentColumn: string): void {
    this.columnLayout.forEach((column) => (column.status = false));
    const found = this.columnLayout.find((column) => column.value === currentColumn);
    found.status = true;
  }

  onActiveColumn(index: number): void {
    this.columnLayout.forEach((column) => (column.status = false));
    this.columnLayout[index].status = true;
    this.layoutColumnForm.patchValue({ column: this.columnLayout[index].value, component: null });
  }
}
