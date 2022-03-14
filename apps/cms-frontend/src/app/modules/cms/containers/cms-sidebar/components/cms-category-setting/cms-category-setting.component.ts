import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory, ICategoryWithLength } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { ITableFilter } from '@reactor-room/model-lib';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { CmsCategoryService } from '../../../../services/cms-category.service';

@Component({
  selector: 'cms-next-cms-category-setting',
  templateUrl: './cms-category-setting.component.html',
  styleUrls: ['./cms-category-setting.component.scss'],
})
export class CmsCategorySettingComponent implements OnInit, OnChanges, OnDestroy {
  destroy$ = new Subject();
  tableFilter: ITableFilter = {
    search: '',
    currentPage: 0,
    pageSize: 10,
    orderBy: ['updateAt'],
    orderMethod: 'desc',
  };
  categories: ICategory[] = [];
  dataCategories: ICategory[] = [];
  selectedCategories: ICategory[] = [];
  categories$: Observable<ICategory[]>;
  categoriesCtrl = new FormControl({ value: '', disabled: true });
  @Input() categoryIds: string[] = [];
  @Output() categoryIdsEvent$ = new EventEmitter<string[]>();
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private cmsCategoryService: CmsCategoryService, private snackBar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges): void {
    const currentIds = changes?.categoryIds?.currentValue;
    if (currentIds) {
      if (this.categories.length || this.selectedCategories.length) {
        //UNDO/REDO Opertator
        this.selectedCategories = [];
        this.initCategoryDataOnIds();
        this.onFilterCategoryValueChange();
      }
    }
  }

  ngOnInit(): void {
    this.cmsCategoryService
      .getAllCategories(this.tableFilter)
      .pipe(
        takeUntil(this.destroy$),
        tap((categoriesWithLength: ICategoryWithLength) => {
          this.dataCategories = categoriesWithLength.categories;
          if (!this.categories.length && !this.selectedCategories.length) {
            this.initCategoryDataOnIds();
            this.onFilterCategoryValueChange();
          }
        }),
      )
      .subscribe({
        next: () => {},
        error: (error: HttpErrorResponse) => {
          this.showUnexpectedError(error.message);
        },
        complete: () => {},
      });
  }

  initCategoryDataOnIds(): void {
    this.categories = deepCopy(this.dataCategories);
    this.categoryIds.forEach((categoryId) => {
      const foundCategory = this.categories.find((category) => category._id === categoryId);
      const index = this.categories.indexOf(foundCategory);
      if (foundCategory) {
        this.selectedCategories.push(foundCategory);
        this.categories.splice(index, 1);
      }
    });
  }

  showUnexpectedError(errorMessage: string): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!' + errorMessage,
      } as StatusSnackbarModel,
    });
  }

  onFilterCategoryValueChange(): void {
    this.categories$ = this.categoriesCtrl.valueChanges.pipe(
      startWith(''),
      map((categoryName: string | null) => (categoryName ? this._filter(categoryName) : this.categories.slice())),
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.categories.indexOf(event.option.value);
    if (index >= 0) {
      this.categories.splice(index, 1);
      this.selectedCategories.push(event.option.value);
      this.categoryInput.nativeElement.value = '';
      this.categoriesCtrl.setValue(null);
      this.emitCategoryIdsEvent(this.selectedCategories);
    }
  }

  remove(category: ICategory): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
      this.categories.push(category);
      this.emitCategoryIdsEvent(this.selectedCategories);
    }
  }

  emitCategoryIdsEvent(selectedCategories: ICategory[]) {
    const categoryIds: string[] = [];
    selectedCategories.forEach((category) => {
      categoryIds.push(category._id);
    });
    this.categoryIdsEvent$.emit(categoryIds);
  }

  _filter(value: string): ICategory[] {
    if (typeof value !== 'string') return null;
    const filterValue = value?.toLowerCase();
    const filterResult = this.categories.filter((category) => category.name.toLowerCase().includes(filterValue));
    return filterResult;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
