import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { ICustomerNote } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-customer-notes',
  templateUrl: './customer-notes.component.html',
  styleUrls: ['./customer-notes.component.scss'],
  animations: [slideInOutAnimation],
})
export class CustomerNotesComponent implements OnInit, OnChanges {
  addField: FormControl;
  searchField: FormControl;
  editField: FormControl;
  originNotes: ICustomerNote[] = [];
  notes: ICustomerNote[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  updatingNoteID: number;
  updatedID: number;
  totalNote = 0;
  @Output() collapseNotes = new EventEmitter();
  @ViewChildren('noteItem') noteItems: QueryList<ElementRef>;
  @ViewChildren('editInput') editInput: QueryList<ElementRef>;
  @Input() collapsed: boolean;
  @Input() customerId: string;
  @Input() extraHeight = false;
  addInvalid = false;

  toastPosition = 'toast-bottom-right';

  constructor(private customerService: CustomerService, private fb: FormBuilder, public dialog: MatDialog, public toastr: ToastrService, public translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.customerId?.currentValue) {
      this.getNotes(true);
    }
  }

  ngOnInit(): void {
    this.addField = new FormControl('', [Validators.required, Validators.min(1)]);
    this.searchField = new FormControl('');
    this.editField = new FormControl('');
    this.noteInputSearch();
  }

  onClickEditNote(note: ICustomerNote, noteItem: HTMLLIElement, index: number): void {
    this.noteItems.forEach((elem) => (<HTMLElement>elem.nativeElement).classList.remove('edit'));
    document.getElementById(noteItem.id).classList.add('edit');
    this.editField.patchValue(note.note);
    this.editInput.toArray()[index].nativeElement.focus();
  }

  handleCancelEdittingNote(index: number): void {
    (<HTMLElement>this.noteItems.toArray()[index].nativeElement).classList.remove('edit');
    this.editField.setValue('');
  }

  handleSaveEdittingNote(event: MouseEvent, note: ICustomerNote, index: number): void {
    event.preventDefault();
    if (!isEmpty(this.editField.value.trim())) {
      note.note = this.editField.value;

      this.customerService
        .upsertNote({ note: this.editField.value, name: '', id: note.id, customer_id: Number(this.customerId) })
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          (<HTMLElement>this.noteItems.toArray()[index].nativeElement).classList.remove('edit');
          this.editField.setValue('');
          this.getNotes();
        });
    } else {
      this.toastr.warning(this.translate.instant('Note not allowed to be empty'), this.translate.instant('Adding note'), { positionClass: this.toastPosition });
    }
  }

  clearFormArray(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  getNotes(resetSearch = true): void {
    this.customerService
      .getNotes(Number(this.customerId))
      .pipe(takeUntil(this.destroy$))
      .pipe(
        map((notes: ICustomerNote[]) =>
          notes.map((note: ICustomerNote) => {
            return { ...note, searchText: true };
          }),
        ),
      )
      .subscribe((notes) => {
        this.originNotes = notes;
        if (resetSearch) this.notes = notes;
        this.totalNote = notes.filter((x) => x.searchText).length;
      });
  }

  addNote(): void {
    if (!isEmpty(this.addField.value.trim())) {
      if (this.addField.valid) {
        this.addInvalid = false;
        this.customerService
          .upsertNote({ note: this.addField.value, name: '', id: -1, customer_id: Number(this.customerId) })
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.addField.setValue('');
            const resetSearchOn = this.searchField.value === '';
            this.getNotes(resetSearchOn);
          });
      } else {
        this.addInvalid = true;
      }
    } else {
      this.toastr.warning(this.translate.instant('Note not allowed to be empty'), this.translate.instant('Adding note'), { positionClass: this.toastPosition });
      this.addInvalid = true;
    }
  }

  removeNote(note: ICustomerNote): void {
    const data = { title: this.translate.instant('Delete note'), text: this.translate.instant('Are you sure you want to delete') };
    const dialogRef = this.dialog.open<ConfirmDialogComponent>(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((yes: boolean) => {
        if (yes) {
          delete note.searchText;
          this.customerService
            .removeNote(note)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.getNotes(false);
            });
        }
      });
  }

  trackByIndex(index: number): number {
    return index;
  }

  noteInputSearch(): void {
    this.searchField.valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$),
        map((text) => text.toLocaleLowerCase()),
      )
      .subscribe((text: string) => {
        this.notes = this.originNotes.map((note) => {
          return { ...note, searchText: note.note.toLocaleLowerCase().indexOf(text) !== -1 };
        });
        this.totalNote = this.notes.filter((x) => x.searchText).length;
      });
  }

  clickOutsideEvent(isOutside: boolean): void {
    if (isOutside) {
      this.noteItems.forEach((elem) => (<HTMLElement>elem.nativeElement).classList.remove('edit'));
      this.editField.setValue('');
    }
  }
}
