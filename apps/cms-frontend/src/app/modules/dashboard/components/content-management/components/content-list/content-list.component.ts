import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnumLanguageCultureUI, IContentEditor, IContentEditorWithLength, RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { ITableFilter } from '@reactor-room/model-lib';
import { CmsCategoryService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-category.service';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, startWith, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../../../../components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from '../../../../../../components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { ITableHeader } from '../../../../../../components/table-theme/table-theme.model';
import { CmsContentEditService } from '../../../../../cms/services/cms-content-edit.service';
import { EContentManagementStatusTitle } from '../../content-management.model';

@Component({
  selector: 'cms-next-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss'],
})
export class ContentListComponent implements OnInit, OnDestroy {
  searchForm = new FormControl('');
  RouteLinkEnum = RouteLinkEnum;

  tableHeader: ITableHeader[] = [
    {
      title: 'Content Name',
      sort: true,
      key: 'name',
      asc: true,
      isSorted: true,
    },
    {
      title: 'Category',
      sort: false,
      key: 'category',
      asc: true,
      isSorted: false,
    },
    {
      title: 'Published Date',
      sort: true,
      key: 'startDate',
      asc: true,
      isSorted: false,
    },
    {
      title: 'Status',
      sort: true,
      key: 'isPublish',
      asc: true,
      isSorted: false,
    },
    {
      title: 'Action',
      sort: false,
      key: null,
      asc: null,
      isSorted: null,
    },
  ];
  tableFilter: ITableFilter = {
    search: '',
    currentPage: 0,
    pageSize: 10,
    orderBy: ['name'],
    orderMethod: 'desc',
  };
  defaultCultureUI: EnumLanguageCultureUI;
  isDataEmpty = true;

  EContentManagementStatusTitle = EContentManagementStatusTitle;
  destroy$ = new Subject();
  contentsList: IContentEditor[] = [];

  constructor(private dialog: MatDialog, private cmsContentEditService: CmsContentEditService, private snackBar: MatSnackBar, private categoryService: CmsCategoryService) {}

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        startWith(''),
        distinctUntilChanged(),
        tap((searchTerm) => {
          this.tableFilter.search = searchTerm;
          this.onGetContentsList();
        }),
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onGetContentsList() {
    this.cmsContentEditService
      .getContentsList(this.tableFilter)
      .pipe(
        takeUntil(this.destroy$),
        tap((list: IContentEditorWithLength) => {
          if (list) {
            this.isDataEmpty = list.contents.length >= 1 ? false : true;
            this.contentsList = list.contents;
            this.mapContentsListTableData();
          }
        }),
        catchError((e) => {
          this.showUnexpectedError();
          throw e;
        }),
      )
      .subscribe();
  }

  mapContentsListTableData() {
    this.contentsList.map(async (contents) => {
      contents.startDate = dayjs(+contents.startDate).format('DD/MM/YYYY');
    });
  }

  sortTableData(event: { type: string; index: number }) {
    const { type } = event;
    this.tableFilter.orderMethod = type;
    this.onGetContentsList();
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  onConfirmStatusDialog(index: number): void {
    console.log(`index`, index);
    const text = '';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: `${text} Confirm`,
        content: `<div class="w-96">Are you sure to ${text} this content</div>`,
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('object :>> ', result);
      }
    });
  }

  onConfirmDeleteDialog(index: number): void {
    console.log(`index`, index);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Delete Confirm',
        content: `<div class="w-96">Are you sure to delete this content?</div>`,
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('object :>> ', result);
      }
    });
  }
}
