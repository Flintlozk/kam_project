import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { EMPTY, Observable, Subject } from 'rxjs';
import { startWith, map, catchError, tap } from 'rxjs/operators';
import { CmsTagsService } from '../../../../services/cms-tags.service';

@Component({
  selector: 'cms-next-cms-tag-setting',
  templateUrl: './cms-tag-setting.component.html',
  styleUrls: ['./cms-tag-setting.component.scss'],
})
export class CmsTagSettingComponent implements OnInit, OnChanges, OnDestroy {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filterTags$: Observable<string[]>;
  tagCtrl = new FormControl({ value: '', disabled: true });
  tagData: string[] = [];
  destroy$ = new Subject();
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @Input() tags: string[] = [];
  @Output() tagsEvent$ = new EventEmitter<string[]>();

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private tagsService: CmsTagsService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.tags) {
      this.tagsService
        .getTags()
        .pipe(
          tap((tags) => {
            if (tags) {
              this.tagData = tags;
              this.tags.forEach((tag) => {
                const index = this.tagData.indexOf(tag);
                if (index >= 0) {
                  this.tagData.splice(index, 1);
                }
              });
              this.onFilterTagValueChange();
            }
          }),
          catchError((e) => {
            console.log('e  => ngOnInit getTags :>> ', e);
            this.showUnexpectedError();
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onFilterTagValueChange(): void {
    this.filterTags$ = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      map((tag: string | null) => (tag ? this._filter(tag) : this.tagData.slice())),
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const index = this.tagData.indexOf(event.option.viewValue);
    if (index >= 0) {
      this.tagData.splice(index, 1);
      this.tags.push(event.option.viewValue);
      this.tagInput.nativeElement.value = '';
      this.tagCtrl.setValue(null);
      this.tagsEvent$.emit(this.tags);
    }
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tagData.filter((tag) => tag.toLowerCase().includes(filterValue));
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.tagData.push(tag);
      this.tagsEvent$.emit(this.tags);
    }
  }
}
