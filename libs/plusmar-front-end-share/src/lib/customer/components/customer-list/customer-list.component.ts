import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { emptyText, PaginationComponent } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { convertUTCdate, deepCopy, getUTCDayjs, isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { FilterEmits } from '@reactor-room/plusmar-cdk';
import { exportAndDownloadXLSX, removeObjectProptery } from '@reactor-room/plusmar-front-end-helpers';
import { IDropDown } from '@reactor-room/plusmar-front-end-share/app.model';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import { AudienceDomainStatus, AudienceDomainType, CustomerFilters, CUSTOMER_TAG_COLOR, ICustomerTemp } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerFilterService } from '../../services/customer-filter.service';

const TOAST_BOTTOM_RIGHT = 'toast-bottom-right';
@Component({
  selector: 'reactor-room-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, OnDestroy {
  customerTagDropDown: IDropDown[] = [{ value: null, label: 'Customer Tag' }];
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  audiencePlatformType = AudiencePlatformType;

  totalRows = 0;
  tableHeader;
  tableData: ICustomerTemp[] = [];
  isLoading = true as boolean;
  isNoData = false as boolean;
  tableColSpan: number;
  selectedIds: number[] = [];
  isAllchecked = false;
  customerRoute = 'customers/details/list/';
  customerTagEnum = CUSTOMER_TAG_COLOR;

  tableFilters: CustomerFilters = {
    search: '',
    currentPage: null,
    pageSize: 10,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
    customer_tag: null,
    exportAllRows: false,
    noTag: false,
  };

  successDialog;
  fields = [
    'id',
    // 'nickname',
    // 'name',
    'first_name',
    'last_name',
    'phone_number',
    'tags',
    'city',
    'address',
    'district',
    'province',
    'post_code',
    // 'notes',
    'email',
    'updated_at',
    'psid',
  ];
  // location: {
  //   city: 'ราชเทวี',
  //   amphoe: '10400',
  //   address: '44444พพพพ',
  //   district: 'ถนนพญาไท',
  //   province: 'กรุงเทพมหานคร',
  //   post_code: '10400'
  // },

  pageIndex: number;
  subIndex: number;
  triggerReady = false;
  destroy$: Subject<void> = new Subject<void>();

  activeSearchBar = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private dialog: MatDialog,
    public translate: TranslateService,
    public audienceService: AudienceService,
    private toastr: ToastrService,
    private routeService: RouteService,
    private customerFilterService: CustomerFilterService,
  ) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  setLabels(): void {
    this.tableHeader = [
      { sort: false, title: null, key: null, isSelectAll: true },
      { sort: true, title: this.translate.instant('Name'), key: ['first_name', 'last_name'] },
      { sort: true, title: this.translate.instant('Email'), key: 'email' },
      { sort: true, title: this.translate.instant('Latest Update'), key: 'updated_at' },
      { sort: true, title: this.translate.instant('Status'), key: 'blocked' },
      { sort: false, title: this.translate.instant('Action'), key: null },
    ];
  }

  ngOnInit(): void {
    this.tableFilters.search = this.customerFilterService.customerSearchField.getValue();
    this.setLabels();
    this.isLoading = true;
  }

  ngOnDestroy(): void {}

  getCustomerData(saveToJson = false): void {
    this.triggerReady = true;
    this.tableColSpan = this.tableHeader.length;
    if (this.tableFilters.currentPage !== null)
      this.customerService.getCustomers(this.tableFilters).subscribe(
        (result: ICustomerTemp[]) => {
          this.tableData = !saveToJson ? this.refactorTableData(result) : this.tableData;
          this.isLoading = false;
          this.isNoData = false;
          if (saveToJson) {
            this.setDataForExport(result);
          }
        },
        (err) => {
          console.log(err);
          this.isLoading = false;
          this.isNoData = true;
        },
      );
  }

  exportSelectedHandler(): void {
    const selectedRows = this.tableData.filter((row) => this.selectedIds.includes(row.id));
    this.setDataForExport(selectedRows);
  }

  setDataForExport(value: ICustomerTemp[]): void {
    const jsonData = deepCopy(value);
    convertUTCdate(jsonData, 'updated_at');
    removeObjectProptery<ICustomerTemp>(jsonData, 'location', 'nickname');
    exportAndDownloadXLSX(this.prepareForExport<ICustomerTemp[]>(jsonData), `Customers Report_${getUTCDayjs().format('DD-MM-YYYY')}`);
  }

  prepareForExport<T>(rows): T {
    return rows?.map((row) => ({ ...row, tags: row?.tags?.map((tag) => tag.name).join(', ') }));
  }

  exportAllHandler(): void {
    this.tableFilters.exportAllRows = true;
    this.getCustomerData(true);
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = 0;
      void this.router.navigate([this.customerRoute, this.tableFilters.currentPage]);
    }
  }

  sortTableData(event: { type: string; index: number }): void {
    const { type, index } = event;
    this.tableFilters.orderBy = this.tableHeader[index].key;
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getCustomerData();
  }

  searchByName(value: string): void {
    this.tableFilters.search = value;

    this.goToFirstPage();
    this.getCustomerData();
  }

  refactorTableData(customerData: ICustomerTemp[]): ICustomerTemp[] {
    this.totalRows = customerData[0]?.totalrows;
    return customerData.map((customer) => ({
      ...customer,
      ...customer.location,
      name: `${customer.first_name} ${emptyText(customer.last_name)}`,
    }));
  }

  changePage($event: PageEvent): void {
    if (this.tableFilters.pageSize !== this.paginatorWidget.paginator.pageSize) {
      this.tableFilters.pageSize = this.paginatorWidget.paginator.pageSize;
      this.tableFilters.currentPage = 1;
    } else {
      this.tableFilters.currentPage = $event.pageIndex + 1;
    }
    this.getCustomerData();
    void this.router.navigate([this.customerRoute, this.tableFilters.currentPage]);
  }

  openSuccessDialog(data: { text: string; title: string }, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  // Remove user
  openConfirmDialog(id?: number, name?: string): void {
    this.successDialog = undefined;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });
    this.selectedIds = id ? [...this.selectedIds, id] : this.selectedIds;
    dialogRef.componentInstance.data = {
      title: name ? `Are you sure you want to delete ${name}?` : 'Are you sure you want to delete?',
      text: '',
      btnOkClick: this.remove.bind(this),
    };
  }

  removeRequest(id): void {
    this.customerService.removeCustomer(id).subscribe(
      () => {
        this.getCustomerData();

        if (!this.successDialog) {
          this.openSuccessDialog({ text: this.translate.instant('Customer successfully removed'), title: this.translate.instant('Remove customer') });
        }
        this.selectedIds = [];
      },
      (err) => {
        console.log(err);
        this.selectedIds = [];
      },
    );
  }

  remove(): void {
    this.selectedIds.forEach((selectedId) => {
      this.removeRequest(selectedId);
    });
  }
  // Remove user

  // Block user
  openConfirmBlockDialog(id, name): void {
    this.successDialog = undefined;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = {
      title: this.translate.instant('Block'),
      text: `${this.translate.instant('Are you sure you want to block')} ${name}, ? ${this.translate.instant('This action will only affect on More-Commerce')}`,
      btnOkClick: () => this.blockRequest(id),
    };
  }

  blockRequest(id): void {
    this.customerService.blockCustomer(id).subscribe(
      () => {
        this.getCustomerData();

        if (!this.successDialog) {
          this.openSuccessDialog({ text: this.translate.instant('Customer successfully blocked'), title: this.translate.instant('Block customer') });
        }
        this.selectedIds = [];
      },
      (err) => {
        console.log(err);
        this.selectedIds = [];
      },
    );
  }

  unblockRequest(id): void {
    this.customerService.unblockCustomer(id).subscribe(
      () => {
        this.getCustomerData();

        if (!this.successDialog) {
          this.openSuccessDialog({ text: this.translate.instant('Customer successfully unblocked'), title: this.translate.instant('Unblock customer') });
        }
        this.selectedIds = [];
      },
      (err) => {
        console.log(err);
        this.selectedIds = [];
      },
    );
  }
  // Block user

  // ROWS SELECTION
  isIdSelected(dataId: number): boolean {
    return this.selectedIds.includes(dataId);
  }

  selectAllHandler(isChecked: boolean): void {
    this.selectedIds = isChecked ? this.tableData.map((item) => item.id as number) : [];
    this.setIsAllchecked();
  }

  selectRow(dataId: number, event): void {
    const { checked } = event.target;
    checked ? this.addId(dataId) : this.removeId(dataId);
    this.setIsAllchecked();
  }

  addId(dataId: number): void {
    this.selectedIds.push(dataId);
  }

  removeId(dataId: number): void {
    this.selectedIds = this.selectedIds.filter((id) => id !== dataId);
  }

  setIsAllchecked(): void {
    this.isAllchecked = this.tableData.every((data, i) => this.selectedIds.includes(data.id));
  }
  // ROWS SELECTION

  initPagination(): void {
    setTimeout(() => {
      this.route.params.subscribe((params) => {
        this.tableFilters.currentPage = +params['page']; // (+) converts string 'id' to a number
        if (this.paginatorWidget) {
          this.paginatorWidget.paginator.pageIndex = this.tableFilters.currentPage - 1;
          this.getCustomerData();
        }
      });
    }, 100);
  }

  onFilterSubmit(event): void {
    this.tableFilters.noTag = event.noTag;
    this.tableFilters.tags = event.tags;
    this.goToFirstPage();
    this.getCustomerData();
  }

  handleFilterUpdate(value: FilterEmits): void {
    const tag = Number(value.customDropdown) !== -1 ? value.customDropdown : null;
    this.customerFilterService.setCustomerSearchField(value.search);
    // this.search
    this.tableFilters = {
      ...this.tableFilters,
      search: value.search,
      customer_tag: tag,
      noTag: Number(value.customDropdown) === -1,
    };

    value.initial ? this.initPagination() : this.goToFirstPage();
    this.getCustomerData();
  }

  navToCustomerInfo(id: string): void {
    const newRoute = ['/customers', id];
    void this.router.navigate(newRoute, { relativeTo: this.route.parent });
  }
  navToCustomerHistory(id: string): void {
    const newRoute = [`/customer/${id}/history/1`];
    void this.router.navigate(newRoute, { relativeTo: this.route.parent });
  }

  trackBy(index: number, el: ICustomerTemp): number {
    return el.id;
  }

  openNewChat(customerID: number): void {
    this.routeService.setRouteRef(this.router.url);
    const getLastCustomerAudience = this.audienceService.getLastAudienceByCustomerID(Number(customerID));
    const closedAudience = ['CLOSED', 'EXPIRED', 'REJECT'];

    getLastCustomerAudience.pipe(takeUntil(this.destroy$)).subscribe(
      ([result]) => {
        if (result && !closedAudience.includes(result.status)) {
          if (result.status === AudienceDomainStatus.LEAD) {
            void this.router.navigate(['/follows/chat', result.id, 'lead']);
          } else {
            void this.router.navigate(['/follows/chat', result.id, 'post']);
          }
        } else {
          this.audienceService.createNewAudience(Number(customerID), AudienceDomainType.AUDIENCE, AudienceDomainStatus.FOLLOW).subscribe(
            ({ id: newAudienceID }) => {
              if (newAudienceID) void this.router.navigate(['/follows/chat', newAudienceID, 'post']);
            },
            (err) => this.toastr.error(err, 'Error', { positionClass: TOAST_BOTTOM_RIGHT }),
          );
        }
      },
      (err) => this.toastr.error(err, 'Error', { positionClass: TOAST_BOTTOM_RIGHT }),
    );
  }
}
