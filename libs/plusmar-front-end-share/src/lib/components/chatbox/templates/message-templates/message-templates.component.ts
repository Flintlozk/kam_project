import { Component, ElementRef, OnInit, ViewChild, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { MessageTemplates, MessageTemplatesFilters } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { TemplatesService } from '../templates.service';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { Subject, Subscription } from 'rxjs';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-message-templates',
  templateUrl: './message-templates.component.html',
  styleUrls: ['./message-templates.component.scss'],
})
export class MessageTemplatesComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  selectedIds: number[] = [];
  isAllchecked = false;
  totalRows;
  tableFilters: MessageTemplatesFilters = {
    search: '',
    currentPage: 1,
    pageSize: isMobile() ? 6 : 10,
    orderBy: 'updated_at',
    orderMethod: 'desc',
  };
  isMessageEdit = false;
  @ViewChild('messageEdit') messageEdit: ElementRef;
  @ViewChild('shortcutEdit') shortcutEdit: ElementRef;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  subscription: Subscription;
  @Input() messageType: string;
  private destroy$ = new Subject<void>();
  @Output() closeModal = new Subject<void>();

  tableHeader = [
    { sort: true, title: this.translate.instant('Message'), key: 'message' },
    { sort: false, title: 'Shortcut', key: null },
    { sort: false, title: this.translate.instant('Action'), key: null },
  ];

  messages = [
    {
      text: this.translate.instant('Greetings first_name thank you for contacting us'),
      shortcut: '',
      id: null,
    },
  ];
  toastPosition = 'toast-bottom-right';

  constructor(private toastr: ToastrService, private fb: FormBuilder, public translate: TranslateService, public templateService: TemplatesService) {}

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.getMessagesTemplates();
    this.initForm();
    this.setChangesListener();
  }

  getMessagesTemplates(): void {
    // if (this.tableFilters.currentPage !== null)
    this.templateService
      .getMessageTemplates(this.tableFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: MessageTemplates[]) => {
          this.totalRows = result[0]?.totalrows;
          this.messages = result.map((i) => ({ ...i.messages, ...{ id: i.id } }));
        },
        (err) => {
          console.log(err);
        },
      );
  }

  showToast(method: string, message: string, title: string): void {
    this.toastr[method](this.translate.instant(message), this.translate.instant(title), { positionClass: this.toastPosition });
  }

  addMessageTemplate(): void {
    const { text, shortcut, id } = this.filterForm.value;
    if (text)
      this.templateService
        .addMessageTemplate({ text, shortcut, id })
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result: IHTTPResult) => {
            if (result.status === 200) {
              this.getMessagesTemplates();
              this.showToast('success', result.value, 'Success');
            } else this.showToast('error', result.value, 'Error');
          },
          (err) => {
            console.log(err);
            this.showToast('error', err.value, 'Error');
          },
        );
  }

  deleteMessageTemplate(id: number): void {
    this.templateService
      .deleteMessageTemplate(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: IHTTPResult) => {
          this.getMessagesTemplates();
          this.showToast('success', result.value, 'Success');
        },
        (err) => {
          console.log(err);
          this.showToast('error', err.value, 'Error');
        },
      );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.destroy$?.unsubscribe();
  }

  setChangesListener(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(500))
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: { search: string; shortcut: string }) => {
        this.searchByName(value);
      });
  }

  trimValue(e: KeyboardEvent): void {
    if (e.key.includes(' ')) e.preventDefault();
  }

  searchByName(value: { search: string }): void {
    this.tableFilters.search = value.search;

    this.goToFirstPage();
    this.getMessagesTemplates();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      shortcut: [null, Validators.required],
      text: [null, Validators.required],
      id: [null],
    });
  }

  changePage($event: PageEvent): void {
    this.tableFilters.currentPage = $event.pageIndex + 1;
    this.getMessagesTemplates();
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
    this.getMessagesTemplates();
  }

  // Actions
  editMessage(message): void {
    this.openMessageEditor(false);
    this.filterForm.patchValue({ ...message });
  }

  openMessageEditor(isCreate = false): void {
    this.isMessageEdit = true;
    setTimeout(() => {
      if (isCreate) {
        this.shortcutEdit.nativeElement.focus();
      } else {
        this.messageEdit.nativeElement.focus();
      }
    }, 100);
  }

  closeMessageEdit(isSave?: boolean): void {
    if (isSave) {
      if (!this.filterForm.valid) {
        return;
      }
      this.addMessageTemplate();
    }
    this.isMessageEdit = false;
    this.filterForm.reset({
      search: '',
      shortcut: null,
      text: '',
      id: null,
    });
  }

  selectMessage(data): void {
    if (this.messageType === 'CHAT') this.templateService.changeMessage(data.text, 'message');
    else this.templateService.returnMessage(data.text);
    this.closeModal.next(null);
  }

  trackBy(el: any): number {
    return el.id;
  }
}
