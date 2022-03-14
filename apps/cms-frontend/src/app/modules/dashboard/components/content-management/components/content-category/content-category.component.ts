import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory, ICategoryCulture, IContentEditor } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { CRUD_MODE, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { ITablePage } from 'apps/cms-frontend/src/app/components/table-theme/table-theme.model';
import { CmsCategoryService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-category.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { ContentCategoryService } from '../../../../services/content-management/category.service';
import { ContentSubCategoryDialogComponent } from './content-sub-category-dialog/content-sub-category-dialog.component';

@Component({
  selector: 'cms-next-content-category',
  templateUrl: './content-category.component.html',
  styleUrls: ['./content-category.component.scss'],
})
export class ContentCategoryComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  totalRows = 0;
  tableFilter: ITableFilter = {
    search: '',
    currentPage: 0,
    pageSize: 10,
    orderBy: ['updatedAt'],
    orderMethod: 'desc',
  };
  searchField: FormControl;
  toggleButton = true;
  isDataEmpty = true;
  tableData = [] as ICategory[];
  isAllchecked = false;
  selectedCategoriesIds = [] as string[];
  categoryForm: FormControl;
  contentsList: IContentEditor[] = [];
  addMode = CRUD_MODE.ADD;
  editMode = CRUD_MODE.EDIT;
  editCategoryData;
  tableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: 'Title', key: 'category' },
    { sort: false, title: 'Action', key: null },
  ];
  constructor(private dialog: MatDialog, private cmsCategoryService: CmsCategoryService, public contentCategoryService: ContentCategoryService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.categoryForm = new FormControl();
    this.searchField = new FormControl();
    this.getContentCategories();
    this.searchField.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.searchByName(value);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
  searchByName(value: string) {
    this.tableFilter.currentPage = 0;
    this.tableFilter.search = value;
    this.getContentCategories();
  }
  setUpDefaultChecked(category: ICategory[]): ICategory[] {
    category.forEach((parenCategory) => {
      parenCategory.checked = false;
      parenCategory.subCategories.forEach((childCaterogy) => {
        childCaterogy.checked = false;
      });
    });
    return category;
  }
  getContentCategories(): void {
    this.cmsCategoryService
      .getAllCategories(this.tableFilter)
      .pipe(
        takeUntil(this.destroy$),
        tap(
          (categoriesWithLength) => {
            this.isDataEmpty = categoriesWithLength.categories.length >= 1 ? false : true;
            this.tableData = this.setUpDefaultChecked(categoriesWithLength.categories);
            this.totalRows = categoriesWithLength.total_rows;
            if (this.wasItAllChecked()) this.selectAllHandler(true);
            else this.checkAllSelected(this.selectedCategoriesIds);
          },
          () => this.displaySnackBar(StatusSnackbarType.ERROR, 'Failed! Error Occured'),
        ),
      )
      .subscribe();
  }
  selectAllHandler(isChecked: boolean) {
    this.isAllchecked = isChecked;
    this.tableData.forEach((category) => {
      category.checked = isChecked;
      if (!isChecked) this.removingFromSelected(category._id);
      else if (!this.selectedCategoriesIds.includes(category._id)) this.selectedCategoriesIds.push(category._id);
      category.subCategories.forEach((subCategory) => {
        subCategory.checked = isChecked;
        if (!isChecked) this.removingFromSelected(subCategory._id);
        else if (!this.selectedCategoriesIds.includes(subCategory._id)) this.selectedCategoriesIds.push(subCategory._id);
      });
    });
  }
  sortTableData(event: { type: string; index: number }) {
    const { type } = event;
    this.tableFilter.orderMethod = type;
    this.getContentCategories();
  }
  setUpAndSaveCategory(): void {
    const params = {
      _id: null,
      pageID: 0,
      name: this.categoryForm.value,
      language: [],
      featuredImg: '',
      parentId: null,
      status: true,
    };
    this.contentCategoryService
      .addContentCategory(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result.status === 200) {
          this.toggleButton = true;
          this.getContentCategories();
          this.categoryForm.reset();
          this.displaySnackBar(StatusSnackbarType.SUCCESS, 'Successfully created new category');
        } else this.displaySnackBar(StatusSnackbarType.ERROR, 'Failed! Error Occured');
      });
  }
  addCategories(): void {
    if (this.categoryForm.value === null || this.categoryForm.value === '') this.displaySnackBar(StatusSnackbarType.ERROR, 'Failed! Please Enter Valid Category Name');
    else
      this.contentCategoryService
        .checkCategoryNameExist(this.categoryForm.value, null)
        .pipe(
          takeUntil(this.destroy$),
          tap((result: IHTTPResult) => {
            if (result.status === 200 && result.value === 'true') this.displaySnackBar(StatusSnackbarType.ERROR, 'Failed! Category Name Already Exists');
            else if (result.status === 200 && result.value === 'false') this.setUpAndSaveCategory();
            else this.displaySnackBar(StatusSnackbarType.ERROR, 'Error Occured! Please Try Again');
          }),
        )
        .subscribe();
  }
  addSubCategoryDialog(category: ICategory, subCategories: ICategoryCulture[]): void {
    const dialogRef = this.dialog.open(ContentSubCategoryDialogComponent, {
      data: { data: category, allSubCategories: subCategories, mode: '' },
      panelClass: 'content-categories-dialog',
    });
    dialogRef.afterClosed().subscribe((result: StatusSnackbarModel) => {
      if (result) {
        this.displaySnackBar(result.type, result.message);
        this.getContentCategories();
      }
    });
  }
  selectCategoryRow(category: ICategory, index: number, event): void {
    const { checked } = event.target;
    checked ? this.addParentCategoryId(category._id, index) : this.removeParentCategoryId(category._id, index);
  }
  addParentCategoryId(categoryId: string, index: number) {
    this.selectedCategoriesIds.push(categoryId);
    this.tableData[index].checked = true;
    this.tableData[index].subCategories.forEach((subCategory) => {
      if (!subCategory.checked) {
        this.selectedCategoriesIds.push(subCategory._id);
        subCategory.checked = true;
      }
    });
    if (this.wasItAllChecked() && !this.isAllchecked) this.isAllchecked = true;
  }
  removeParentCategoryId(categoryId: string, index: number) {
    this.removingFromSelected(categoryId);
    this.tableData[index].checked = false;
    this.tableData[index].subCategories.forEach((subCategory) => {
      this.removingFromSelected(subCategory._id);
      subCategory.checked = false;
    });
    if (!this.wasItAllChecked() && this.isAllchecked) this.isAllchecked = false;
  }
  selectSubCategoryRow(subCat: ICategory, parentIndex: number, childIndex: number, event): void {
    const { checked } = event.target;
    checked ? this.addChildCategoryId(subCat._id, parentIndex, childIndex) : this.removeChildCategoryId(subCat._id, parentIndex, childIndex);
  }
  addChildCategoryId(subID: string, parentIndex: number, childIndex: number): void {
    this.selectedCategoriesIds.push(subID);
    this.tableData[parentIndex].subCategories[childIndex].checked = true;
    if (this.wasItAllChecked() && !this.isAllchecked) this.isAllchecked = true;
  }
  removeChildCategoryId(subId: string, parentIndex: number, childIndex: number): void {
    this.removingFromSelected(subId);
    if (this.tableData[parentIndex].checked) {
      this.removingFromSelected(this.tableData[parentIndex]._id);
      this.tableData[parentIndex].checked = false;
    }
    this.tableData[parentIndex].subCategories[childIndex].checked = false;
    if (!this.wasItAllChecked() && this.isAllchecked) this.isAllchecked = false;
  }
  removingFromSelected(idToRemove: string): void {
    const indexOf = this.selectedCategoriesIds.indexOf(idToRemove);
    if (indexOf !== null || indexOf !== undefined || indexOf !== -1) {
      this.selectedCategoriesIds.splice(indexOf, 1);
    }
  }
  checkAllSelected(allIDs: string[]): void {
    this.isAllchecked = false;
    this.tableData.forEach((parentCategory) => {
      if (allIDs.includes(parentCategory._id)) {
        parentCategory.checked = true;
        parentCategory.subCategories.forEach((childCategory) => {
          childCategory.checked = true;
        });
      } else
        parentCategory.subCategories.forEach((childCategory) => {
          if (allIDs.includes(childCategory._id)) childCategory.checked = true;
        });
    });
  }
  openEditDialog(category: ICategory, subCategories: ICategoryCulture[]): void {
    const dialogRef = this.dialog.open(ContentSubCategoryDialogComponent, {
      data: { data: category, allSubCategories: subCategories, mode: 'EDIT' },
      panelClass: 'content-categories-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.displaySnackBar(result.type, result.message);
        this.getContentCategories();
      }
    });
  }
  deleteCategory(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Selected item will be deleted',
        content: 'Are you sure you want to delete',
      } as ConfirmDialogModel,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.contentCategoryService
          .deleteCategoryByID(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (result) => {
              if (result.status === 200) {
                this.removingFromSelected(id);
                this.getContentCategories();
                this.displaySnackBar(StatusSnackbarType.SUCCESS, 'Deleted Succefully');
              }
            },
            () => this.displaySnackBar(StatusSnackbarType.ERROR, 'Failed! Error Occured'),
          );
      }
    });
  }
  deleteMultipleCategories(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Selected item will be deleted',
        content: 'Are you sure you want to delete',
      } as ConfirmDialogModel,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result)
        this.contentCategoryService
          .deleteCategoriesByID(this.selectedCategoriesIds)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (result) => {
              if (result.status === 200) {
                this.selectedCategoriesIds = [];
                this.getContentCategories();
                this.displaySnackBar(StatusSnackbarType.SUCCESS, 'Deleted Succefully');
              }
            },
            () => this.displaySnackBar(StatusSnackbarType.ERROR, 'Failed! Error Occured'),
          );
    });
  }
  toggleAddCategories(): void {
    this.toggleButton = !this.toggleButton;
  }
  trackBy(index: number, item: ICategory): string {
    return item._id;
  }
  subTrackBy(index: number, item: ICategory): string {
    return item._id;
  }
  wasItAllChecked(): boolean {
    let checked = false;
    checked = this.tableData.every((category) => {
      if (!this.selectedCategoriesIds.includes(category._id)) {
        return false;
      }
      return true;
    });

    return checked;
  }
  changePage(params: ITablePage) {
    this.tableFilter.currentPage = params.pageIndex;
    this.tableFilter.pageSize = params.pageSize;
    this.getContentCategories();
  }
  displaySnackBar(type: StatusSnackbarType, message: string) {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: type,
        message: message,
      } as StatusSnackbarModel,
    });
  }
}
