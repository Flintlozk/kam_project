import { Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@reactor-room/itopplus-cdk';
import { isImageByExtension } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ImageSetTemplate } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil } from 'rxjs/operators';
import { TemplatesService } from '../templates.service';

const hasToGoToFirstPage = (prev, next) => !Object.is(prev, next) && prev.currentPage === next.currentPage && next.currentPage > 1;
const MAX_TOTAL_SIZE = 26214400;
@Component({
  selector: 'reactor-room-images-templates',
  templateUrl: './images-templates.component.html',
  styleUrls: ['./images-templates.component.scss'],
})
export class ImagesTemplatesComponent implements OnInit, OnDestroy {
  @Input() messageType: string;
  isItemSetEdit = false;
  masterForm: FormGroup;
  selectedForm: FormGroup;
  totalRows = 0;
  isSaveButtonDisabled = false;
  tableHeader = [
    { sort: false, title: 'Image sets', key: null },
    { sort: false, title: 'Shortcut', key: null },
    { sort: false, title: 'Action', key: null },
  ];
  subscription: Subscription;
  loadingText = this.translate.instant('Uploading the image set');
  @ViewChild('shortcut') shortcut: ElementRef;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;
  sets: ImageSetTemplate[];
  private unsubscribe$ = new Subject<void>();
  toastPosition = 'toast-bottom-right';
  isImageByExtension = isImageByExtension;
  @Output() closeModal = new Subject<void>();
  constructor(private toastr: ToastrService, public translate: TranslateService, private fb: FormBuilder, public templateService: TemplatesService) {}

  sizeExceededValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return control?.value?.size > MAX_TOTAL_SIZE ? { sizeExceeded: true } : null;
  }

  ngOnInit(): void {
    this.initForm();
    this.getImageSets();
    this.setFiltersListener();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.masterForm = this.fb.group({
      filters: this.fb.group({
        search: new FormControl(''),
        currentPage: [1],
        pageSize: [5],
        orderBy: 'shortcut',
        orderMethod: 'desc',
      }),
      content: new FormArray([]),
      selected: this.fb.group({
        shortcut: [null, Validators.required],
        id: [null],
      }),
    });
  }

  openItemSetEdit(): void {
    this.isItemSetEdit = true;
    setTimeout(() => {
      this.shortcut.nativeElement.focus();
    }, 100);
  }

  getImageSets(): void {
    this.templateService
      .getImageSets(this.masterForm.get('filters').value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result: ImageSetTemplate[]) => {
          this.totalRows = result[0]?.totalrows;
          const content = this.masterForm.get('content') as FormArray;
          this.clearFormArray(content);
          result.map((images_set) => content.push(new FormControl(images_set)));
        },
        (err) => {
          console.log(err);
        },
      );
  }

  saveImageSets(): void {
    if (!this.masterForm.valid) {
      this.selectedForm = this.masterForm.controls.selected as FormGroup;
      return;
    }
    if (this.isSaveButtonDisabled) return;

    const { images, shortcut, id } = this.masterForm.controls.selected.value;
    if (images.length > 0) {
      this.isSaveButtonDisabled = true;
      this.templateService
        .addImageSets({
          images: images.map((image) => {
            if (image?.url?.length > 400) return { extension: image.extension, file: image.file, filename: image.filename };
            return image;
          }),
          shortcut,
          id,
        })
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (result) => {
            if (result.status === 200) {
              this.getImageSets();
              this.showToast('success', result.value, 'Success');
            } else {
              this.showToast('error', result.value, 'Error');
            }

            if (result.failedList.length > 0) {
              this.showToast('error', `${result.failedList.join(', ')}`, "Can't upload following file");
            }

            this.closeImagesEdit();
          },
          (err) => {
            console.log(err);
            this.showToast('error', err.message, 'Error');
            // this.toastr.error(this.translate.instant(err.message), this.translate.instant('Error'), { positionClass: this.toastPosition });
            // this.closeImagesEdit();
          },
        )
        .add(() => {
          this.isSaveButtonDisabled = false;
        });
    }
  }

  // showToast(method: string, message: string, title: string): void {
  //   this.toastr[method](this.translate.instant(message), this.translate.instant(title), { positionClass: this.toastPosition });
  // }

  setFiltersListener(): void {
    this.subscription = this.masterForm
      .get('filters')
      .valueChanges.pipe(startWith(''), pairwise(), debounceTime(1000), distinctUntilChanged())
      .subscribe(([prev, next]) => {
        if (hasToGoToFirstPage(prev, next)) this.goToFirstPage();
        this.getImageSets();
      });
  }

  sortTableData({ type }: { type: string; index: number }): void {
    this.masterForm.get('filters').patchValue({ orderMethod: type });
    this.goToFirstPage();
  }

  goToFirstPage(): void {
    this.masterForm.get('filters').patchValue({ currentPage: 1 });
    if (this.paginatorWidget) this.paginatorWidget.paginator.pageIndex = 0;
  }

  changePage($event: PageEvent): void {
    this.masterForm.get('filters').patchValue({ currentPage: $event.pageIndex + 1 });
  }

  closeImagesEdit(): void {
    this.isItemSetEdit = false;
  }

  trimValue(e: KeyboardEvent): void {
    if (e.key.includes(' ')) e.preventDefault();
  }

  clearFormArray = (formArray: FormArray): void => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  resetSelected(selected: FormGroup): void {
    setTimeout(() => {
      this.clearFormArray(selected.get('images') as FormArray);
      selected.patchValue({ shortcut: null, id: null });
    });
  }

  updateSelected(selected: FormGroup, images_set: ImageSetTemplate): void {
    setTimeout(() => {
      selected.patchValue({ shortcut: images_set.shortcut, id: images_set.id });
      const images = this.masterForm.get('selected').get('images') as FormArray;
      images_set.images.map((image) => images?.push(new FormControl(image)));
    }, 10);
  }

  editImageSet(images_set?: ImageSetTemplate): void {
    const selected = this.masterForm.get('selected') as FormGroup;
    this.openItemSetEdit();

    this.resetSelected(selected);
    if (images_set) this.updateSelected(selected, images_set);
  }

  deleteImageSets(id: number): void {
    this.templateService
      .deleteMessageTemplate(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result: IHTTPResult) => {
          this.getImageSets();
          this.showToast('success', result.value, 'Success');
        },
        (err) => {
          console.log(err);
          this.showToast('error', err.value, 'Error');
        },
      );
  }

  selectImageSet(data: ImageSetTemplate): void {
    if (this.messageType === 'CHAT') this.templateService.changeMessage(data.images, 'images-set');
    else this.templateService.returnMessage(data.images);
    this.closeModal.next(null);
  }

  showToast(method: string, message: string, title: string): void {
    if (message.indexOf('Payload Too Large') !== -1) {
      this.toastr[method](this.translate.instant('Maximum files limit exceed'), this.translate.instant(title), { positionClass: this.toastPosition });
    } else if (message.indexOf('FILESIZE_EXCEEDED') !== -1) {
      this.toastr[method](this.translate.instant('FILESIZE_EXCEEDED'), this.translate.instant(title), { positionClass: this.toastPosition });
    } else {
      this.toastr[method](this.translate.instant(message), this.translate.instant(title), { positionClass: this.toastPosition });
    }
  }

  trackByID(el: { id: number }): number {
    return el.id;
  }

  trackByURL(el: { url: string }): string {
    return el.url;
  }

  deleteImageFromSet(e: Event, image_index: number, set_id: number): void {
    e.stopPropagation();
    this.templateService
      .deleteImageFromSet(set_id, image_index)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result: IHTTPResult) => {
          this.getImageSets();
          this.showToast('success', result.value, 'Success');
        },
        (err) => {
          console.log(err);
          this.showToast('error', err.value, 'Error');
        },
      );
  }
}
