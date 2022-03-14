import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { FormTemplate, MessageTemplatesFilters } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TemplatesService } from '../templates.service';

@Component({
  selector: 'reactor-room-form-templates',
  templateUrl: './form-templates.component.html',
  styleUrls: ['./form-templates.component.scss'],
})
export class FormTemplatesComponent implements OnInit {
  filterForm: FormGroup;
  selectedIds: number[] = [];
  isAllchecked = false;
  tableFilters: MessageTemplatesFilters = {
    search: '',
    currentPage: 1,
    pageSize: isMobile() ? 4 : 10,
    orderBy: 'updated_at',
    orderMethod: 'desc',
  };
  totalRows = 0;
  tableHeader = [
    { sort: true, title: this.translate.instant('Message'), key: 'name' },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];

  forms: FormTemplate[] = [];
  @Input() messageType: string;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  @Output() closeModal = new Subject<void>();
  constructor(private fb: FormBuilder, public translate: TranslateService, public templateService: TemplatesService) {}

  ngOnInit(): void {
    this.getFormsTemplates();
    this.initForm();
    this.setChangesListener();
  }

  getFormsTemplates(): void {
    // if (this.tableFilters.currentPage !== null)
    this.templateService.getFormsTemplates(this.tableFilters).subscribe(
      (result: FormTemplate[]) => {
        this.totalRows = result[0]?.totalrows || 0;
        this.forms = result;
      },
      (err) => {
        console.log(err);
      },
    );
  }

  setChangesListener(): void {
    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.searchByName(value);
    });
  }

  searchByName(value: { search: string }): void {
    this.tableFilters.search = value.search;

    this.goToFirstPage();
    this.getFormsTemplates();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      search: [null],
    });
  }

  changePage($event: PageEvent): void {
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getFormsTemplates();
  }

  goToFirstPage(): void {
    this.tableFilters.currentPage = 1;
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
  }

  sortTableData(event: { type: string; index: number }): void {
    const { type, index } = event;
    this.tableFilters.orderBy = this.tableHeader[index].key;
    this.tableFilters.orderMethod = type;
    this.goToFirstPage();
    this.getFormsTemplates();
  }

  selectForm(id: number): void {
    this.templateService.changeMessage(id, 'forms');
    this.closeModal.next(null);
  }

  trackBy(index: number, el: FormTemplate): number {
    return el.id;
  }
}
