import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent, SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { CRUD_MODE, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { ICatSubCatHolder, IProductAttributeList, IProductSubAttributeArray, ProductRouteTypes } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, finalize } from 'rxjs/operators';
import { ProductsAttributesMagageDialogComponent } from '../products-attributes-magage-dialog/products-attributes-magage-dialog.component';

@Component({
  selector: 'reactor-room-products-attributes',
  templateUrl: './products-attributes.component.html',
  styleUrls: ['./products-attributes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsAttributesComponent implements OnInit {
  isRemoveLoader: boolean;
  tableColSpan: number;
  editAttributeData: IProductAttributeList;
  isAllchecked = false;
  tableData: IProductAttributeList[];
  searchField: FormControl;
  totalRows = 0;
  selectedAttributeIds = [] as ICatSubCatHolder[];
  totalAttrSubAttr = 0;
  addMode = CRUD_MODE.ADD;
  editMode = CRUD_MODE.EDIT;
  isNoData = false;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  toastPosition = 'toast-bottom-right';

  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 10,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
  };

  tableHeader: ITableHeader[] = [
    { sort: false, title: null, key: null, isSelectAll: true },
    { sort: true, title: this.translate.instant('Attribute'), key: '"attributeName" ' },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];

  constructor(
    private dialog: MatDialog,
    private commonService: CommonMethodsService,
    public translate: TranslateService,
    private router: Router,
    private productService: ProductsService,
    private toastr: ToastrService,
    private productCommonService: ProductCommonService,
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.getProductAttributes();
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.searchByName(value);
    });
  }

  getProductAttributes(): void {
    this.tableColSpan = this.tableHeader.length;
    this.productService.getProductAttributeManagement(this.tableFilters).subscribe(
      (result) => this.processGetAttributes(result),
      (err) => console.log('Error in getting attributes :>> ', err),
    );
  }

  processGetAttributes(attributeData: IProductAttributeList[]): void {
    if (attributeData?.length) {
      this.isNoData = false;
      this.tableData = attributeData;
      this.totalRows = this.tableData[0]?.totalrows;
      this.setTotalNumberOfAttrItems();
      this.deselectAllCheckbox();
    } else {
      this.noAttributeData();
    }
  }

  noAttributeData() {
    this.isNoData = true;
    this.totalRows = 0;
    this.tableData = [];
  }

  searchByName(value: string): void {
    this.tableFilters.search = value;
    this.goToFirstPage();
    this.getProductAttributes();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.ATTRIBUTE);
    void this.router.navigate([routerInit, this.tableFilters.currentPage]);
  }

  selectAllHandler(isChecked: boolean): void {
    this.isAllchecked = isChecked;
    this.selectedAttributeIds = [];
    this.tableData.forEach((attr) => {
      const attrInputID = `attrInputID${attr.attributeID}`;
      const attrElement = document.getElementById(attrInputID) as HTMLElement;
      if (this.isAllchecked) {
        attrElement['checked'] = this.isAllchecked;
        this.addAttributeId(attr);
      } else {
        attrElement['checked'] = this.isAllchecked;
        this.removeAttributeId(attr);
      }
    });
  }

  toggleExpandSubAttribute(index: number): void {
    this.tableData[index].status = !this.tableData[index].status;
  }

  sortTableData(event): void {
    const { type, index } = event;

    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;

    this.goToFirstPage();
    this.getProductAttributes();
  }

  openAttributeManageDialog(mode: string): void {
    if (mode === this.addMode) this.editAttributeData = null;
    const dialogRef = this.dialog.open(ProductsAttributesMagageDialogComponent, {
      width: '100%',
      data: this.editAttributeData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProductAttributes();
    });
  }

  openResponseDialog(data: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = data;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe((result) => {
      this.getProductAttributes();
      this.selectedAttributeIds = [];
    });
  }

  selectAttributeRow(cat: IProductAttributeList, event): void {
    const { checked } = event.target;
    checked ? this.addAttributeId(cat) : this.removeAttributeId(cat);
    this.setIsAllchecked();
  }

  addAttributeId(attrData: IProductAttributeList, mode = 'CHECK'): void {
    const seletedAttribute: ICatSubCatHolder = {
      id: attrData.attributeID,
      name: attrData.attributeName.toString(),
      subCatID: -1,
    };
    this.selectedAttributeIds.push(seletedAttribute);
    attrData?.subAttributes?.map((subAttr) => {
      const subAttrInputID = `subAttrInputID${subAttr.subAttributeID}`;
      const subAttrElement = document.getElementById(subAttrInputID) as HTMLElement;
      if (!subAttrElement['checked']) {
        if (mode === 'CHECK') subAttrElement['checked'] = true;
        this.addSubAttrID(attrData.attributeID, attrData.attributeName, subAttr);
      }
    });
  }

  removeAttributeId(attributeData: IProductAttributeList): void {
    this.selectedAttributeIds = this.selectedAttributeIds.filter((attrHolder) => attrHolder.id !== attributeData.attributeID);
    attributeData?.subAttributes?.map((subAttr) => {
      const subAttrInputID = `subAttrInputID${subAttr.subAttributeID}`;
      const subAttrElement = document.getElementById(subAttrInputID) as HTMLElement;
      subAttrElement['checked'] = false;
    });
  }

  addSubAttrID(attrID: number, attrName: string, subAttr: IProductSubAttributeArray): void {
    const subAttrSelected: ICatSubCatHolder = {
      id: attrID,
      name: subAttr.subAttributeName?.toString(),
      subCatID: subAttr.subAttributeID,
    };
    this.selectedAttributeIds.push(subAttrSelected);
  }

  removeSubCategoryID(subCatID: number): void {
    this.selectedAttributeIds = this.selectedAttributeIds.filter((attrHolder) => attrHolder.subCatID !== subCatID);
  }

  setIsAllchecked(): void {
    this.selectedAttributeIds?.length === this.totalAttrSubAttr ? (this.isAllchecked = true) : (this.isAllchecked = false);
  }

  setTotalNumberOfAttrItems(): void {
    this.totalAttrSubAttr = 0;
    this.tableData.map((attr) => {
      this.totalAttrSubAttr++;
      attr.subAttributes.map((subCat) => this.totalAttrSubAttr++);
    });
  }

  selectSubAttributeRow(attr: IProductAttributeList, subAttr: IProductSubAttributeArray, event): void {
    const { checked } = event.target;
    checked ? this.addSubAttrID(attr.attributeID, attr.attributeName, subAttr) : this.removeSubCategoryID(subAttr.subAttributeID);
    this.setIsAllchecked();
  }

  openDeleteConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });
    const title = this.translate.instant('Are you sure you want to delete');
    dialogRef.componentInstance.data = { title, text: '', btnOkClick: this.remove.bind(this) };
    dialogRef.afterClosed().subscribe((result) => {
      this.getProductAttributes();
      this.selectedAttributeIds = [];
    });
  }

  remove() {
    this.isRemoveLoader = true;
    this.productService
      .removeProductAttribute(this.selectedAttributeIds)
      .pipe(finalize(() => this.postRemoveResponse()))
      .subscribe(
        (result: IHTTPResult[]) => this.processRemoveResponse(result),
        (err) => this.processRemoveErrorResponse(),
      );
  }

  processRemoveErrorResponse(): void {
    const text = this.translate.instant('Error removing Product Attributes');
    const title = this.translate.instant('Error');
    this.openResponseDialog({ text, title }, true);
  }

  processRemoveResponse(result: IHTTPResult[]) {
    if (result.length) {
      result.map((response) => {
        if (response?.status === 200) {
          this.showRemoveResponse(response, false);
        } else {
          this.showRemoveResponse(response, true);
        }
      });
    } else {
      const noChangeText = this.translate.instant('No changes were made');
      this.showRemoveResponse({ status: 200, value: noChangeText }, true);
    }
  }

  postRemoveResponse(): void {
    this.selectedAttributeIds = [];
    this.isRemoveLoader = false;
    this.isAllchecked = false;
    this.deselectAllCheckbox();
  }

  editAttribute(attrData: IProductAttributeList) {
    this.editAttributeData = attrData;
    this.openAttributeManageDialog(this.editMode);
  }

  showRemoveResponse(result: IHTTPResult, isError: boolean): void {
    const errorTitle = this.translate.instant('Error');
    const successTitle = this.translate.instant('Removed Attribute');
    const translateValue = this.commonService.getTranslatedResponse(result.value);
    isError
      ? this.toastr.error(translateValue, errorTitle, { positionClass: this.toastPosition })
      : this.toastr.success(translateValue, successTitle, { positionClass: this.toastPosition });
    this.getProductAttributes();
  }

  changePage($event: PageEvent): void {
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getProductAttributes();
    const routerInit = this.productCommonService.getProjectScopeURL(ProductRouteTypes.ATTRIBUTE);
    void this.router.navigate([routerInit, this.tableFilters.currentPage]);
  }

  deleteSingleAttribute(attrData: IProductAttributeList) {
    this.addAttributeId(attrData, 'NOCHECK');
    this.openDeleteConfirmDialog();
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }

  deselectAllCheckbox() {
    const checkboxes = document.getElementsByClassName('check-box-attr');
    for (let index = 0; index < checkboxes?.length; index++) {
      const element = checkboxes[index];
      element['checked'] = false;
    }
  }
}
