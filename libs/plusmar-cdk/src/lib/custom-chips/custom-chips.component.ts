import { ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { TranslateService } from '@ngx-translate/core';
import { IChip } from '@reactor-room/model-lib';
import { INameIDPair, IProductAttribute, IProductAttributeList, IProductSubAttributeArray } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProductCommonService } from '../services/product-common.service';

@Component({
  selector: 'reactor-room-custom-chips',
  templateUrl: './custom-chips.component.html',
  styleUrls: ['./custom-chips.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomChipsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  constructor(private toastr: ToastrService, public translate: TranslateService, private productService: ProductCommonService, private cdref: ChangeDetectorRef) {}

  @Input() placeholder: string;
  @Input() defaultColor: string;
  @Input() dataFromSelector;
  @Input() disabled = false;
  @Input() mainChip = false;
  @Input() componentType: string;
  @Input() dataList: any;
  @Input() currentChipSelected?: number;
  @Input() removeChipOnError;
  @Input() chipFoundByTyping;
  @Input() patchTagData: INameIDPair[];
  @Output() chipEvent = new EventEmitter<{ type: string; chips: IChip[] | IChip; currentChip?: number }>();
  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipInput') chipMatInput: MatChipInput;

  chipSelected: number;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  chips = [] as IChip[];
  categoryChip = [];
  currentAttributeData;
  isNewAttrib = false;
  isLoading = false;
  loaderText = this.translate.instant('Loading. Please wait');
  errorTitle = this.translate.instant('Error');
  isTagsPatched = false;

  //for common services

  mainAttributeData: IProductAttribute;
  mainTagsData: INameIDPair[];
  storedTagsData: INameIDPair[];
  attributeDataSubject: Subscription;
  currentAttributeDataSubject: Subscription;
  clearChipDataSubscription: Subscription;
  toastPosition = 'toast-bottom-right';

  ngOnDestroy(): void {
    this.attributeDataSubject.unsubscribe();
    this.currentAttributeDataSubject.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.chipInput.nativeElement.blur();
  }

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.attributeDataSubject = this.productService.getAttributesDataObs.subscribe((value) => {
      this.mainAttributeData = value;
    });

    this.currentAttributeDataSubject = this.productService.getCurrentAttributeContext.subscribe((value) => {
      this.currentAttributeData = value;
    });

    this.productService.getChipSelectedIndexObs.subscribe((value: number) => {
      this.chipSelected = value;
    });

    this.productService.getTagsDataObs.subscribe((value: INameIDPair[]) => {
      this.mainTagsData = value;
      this.storedTagsData = value;
    });
  }

  addChipButton() {
    const input = this.chipInput?.nativeElement;
    const value = input.value.trim();
    if (this.componentType === 'ATTRIBUTE' && this.chips?.length === 1) return false;
    const chipMatInputObj = {
      input,
      value,
    };
    this.add(chipMatInputObj);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.patchTagData && !this.isTagsPatched) {
      this.patchTagDataToChip();
    }

    this.performChipActionByType();

    if (this.removeChipOnError && this.componentType === 'TAG') {
      this.removeTagErrorOccured();
    }
  }

  patchTagDataToChip(): void {
    this.isTagsPatched = true;
    this.patchTagData.map((tag) => {
      this.chips.push(tag);
      this.sendChips();
    });
  }

  addCategoryData(dataFromSelector): void {
    if (dataFromSelector) {
      this.chips = dataFromSelector;
      this.sendChips();
    }
  }

  removeTagErrorOccured(): void {
    const index = this.chips.indexOf(this.removeChipOnError);
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }

  clearChipData(): void {
    this.chips = [];
  }

  add(event: MatChipInputEvent): void {
    if (this.componentType === 'ATTRIBUTE') {
      this.addAttribute(event);
    } else if (this.componentType === 'SUBATTRIBUTE') {
      this.addSubAttribute(event);
    } else if (this.componentType === 'TAG') {
      this.addTag(event);
    } else {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
        const tagFound = this.isTagExists(value);
        if (!tagFound) {
          this.chips.push({ id: -1, name: value.trim() });
          this.mainChipValidation();
          this.sendChips();
        } else {
          this.toastr.error(this.translate.instant('Tag already exists'), this.translate.instant('Error'), { positionClass: this.toastPosition });
        }
      }
      if (input) {
        input.value = '';
      }
    }
  }

  performChipActionByType(): void {
    if (this.dataFromSelector) {
      switch (this.componentType) {
        case 'TAG':
          if (this.removeChipOnError === undefined) {
            this.chips.push(this.dataFromSelector);
            this.sendChips();
          }
          break;
        case 'ATTRIBUTE':
          if (this.chipInput) this.chipInput.nativeElement.value = '';
          this.chips.pop();
          this.chips.push(this.dataFromSelector);
          this.sendChips();
          this.mainChipValidation();

          break;
        case 'SUBATTRIBUTE':
          if (this.dataFromSelector.id === -2) {
            this.clearChipData();
            this.sendChips();
          } else {
            this.chips.push(this.dataFromSelector);
            this.sendChips();
          }
          break;
        case 'CATEGORY':
          this.addCategoryData(this.dataFromSelector);
          break;
        default:
          throw new Error('Not a valid chip component type');
      }
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    if ((value || '').trim()) {
      const tagFound = this.isTagExists(value);
      if (!tagFound) {
        const isTagData = this.mainTagsData?.find(({ name }) => name === value);
        if (isTagData) {
          this.chips.push({ id: isTagData.id, name: isTagData.name });
          this.mainChipValidation();
          this.sendChips();
        } else {
          this.addTagData(value);
        }

        if (input) {
          input.value = '';
        }
      } else {
        this.toastr.error(this.translate.instant('Tag already exists'), this.translate.instant('Error'), { positionClass: this.toastPosition });
      }
    }
  }

  addTagData(tagname: string): void {
    this.isLoading = true;
    this.loaderText = this.translate.instant('Adding Tag Please wait');
    this.productService.addProductTag(tagname).subscribe(
      (result: INameIDPair) => {
        const { id, name } = result || {};
        this.chips.push({ id, name });
        this.mainTagsData.push({ id, name });
        this.mainChipValidation();
        this.sendChips();
        this.isLoading = false;
      },
      (error) => {
        const tagErrorText = this.translate.instant('Tag cannot be saved');
        const tagErrorTitle = this.translate.instant('Error');
        this.toastr.error(tagErrorText, tagErrorTitle, { positionClass: this.toastPosition });
        this.isLoading = false;
      },
    );
  }

  addSubAttributeData(input: HTMLInputElement, attributeID: number, subAttributeName: string): void {
    this.isLoading = true;
    this.loaderText = this.translate.instant('Adding Sub Attribute Please wait');
    this.productService.addProductSubAttribute(attributeID, subAttributeName).subscribe(
      (result) => {
        if (result.status === 200) {
          const attributeJson = JSON.parse(result.value);
          const attribObj = {
            id: attributeJson.id,
            name: attributeJson.name,
            currentIndex: this.currentChipSelected,
          };
          this.chips.push(attribObj);
          this.mainChipValidation();
          this.sendChips();
          if (input) {
            input.value = '';
          }
          this.isLoading = false;
        } else {
          const errorText = subAttributeName + ' ' + this.translate.instant(result.value);
          this.toastr.error(errorText, this.errorTitle, { positionClass: this.toastPosition });
          this.isLoading = false;
        }
      },
      (err) => {
        const errText = this.translate.instant('Error in saving sub attribute');
        this.toastr.error(errText, this.errorTitle, { positionClass: this.toastPosition });
        this.isLoading = false;
      },
    );
  }
  addSubAttributeExistsData(input: HTMLInputElement, isSubAttribExists: IProductSubAttributeArray): void {
    this.chips.push({
      id: isSubAttribExists.subAttributeID,
      name: isSubAttribExists.subAttributeName,
      currentIndex: this.currentChipSelected,
    });
    this.productService.subAttributeFoundByTyping.next({ id: isSubAttribExists.subAttributeID, name: isSubAttribExists.subAttributeName });
    this.mainChipValidation();
    this.sendChips();
    if (input) {
      input.value = '';
    }
  }

  addSubAttribute(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    const currentAttributeID = this.currentAttributeData.attributeID;
    if ((value || '').trim()) {
      if (currentAttributeID) {
        const findAttribute = this.productService.storedAttributeData?.find((attr) => attr.attributeID === currentAttributeID);
        const isSubAttribExists = findAttribute?.subAttributes?.find((subAttr) => subAttr.subAttributeName === value);
        if (isSubAttribExists) {
          const warningTitle = this.translate.instant('Warning');
          const warningText = this.translate.instant('Sub Attribute already exists');
          const isChipExists = this.chips?.find((subAttr) => subAttr.name === value);
          isChipExists === undefined
            ? this.addSubAttributeExistsData(input, isSubAttribExists)
            : this.toastr.warning(warningText, warningTitle, { positionClass: this.toastPosition });
        } else {
          this.addSubAttributeData(input, currentAttributeID, value.trim());
        }
      } else {
        const errText = this.translate.instant('Please add or select attribute first');
        this.toastr.error(errText, this.errorTitle, { positionClass: this.toastPosition });
      }
    }

    if (input) {
      input.value = '';
    }
  }

  addAttribute(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    if ((value || '').trim()) {
      const attributeExists = this.mainAttributeData?.attributes?.find((attrib) => attrib?.attributeName.toLowerCase() === value.toLowerCase());
      if (attributeExists) {
        this.processAttributeExists(input, attributeExists);
      } else {
        this.processAttributeNew(value, input);
      }
    }
  }

  processAttributeExists(input: HTMLInputElement, attributeExists: IProductAttributeList): void {
    this.chips.push({
      id: attributeExists.attributeID,
      name: attributeExists.attributeName,
      currentIndex: this.currentChipSelected,
    });
    this.productService.attributeFoundByTyping.next(attributeExists);
    this.mainChipValidation();
    this.sendChips();
    if (input) {
      input.value = '';
    }
  }

  processAttributeNew(value: string, input: HTMLInputElement): void {
    this.isLoading = true;
    this.loaderText = this.translate.instant('Adding Attribute Please wait');
    this.productService.addProductAttribute(value.trim()).subscribe((result) => {
      if (result.status === 200) {
        const attributeJson = JSON.parse(result.value);
        this.chips.push({ id: attributeJson.id, name: attributeJson.name, currentIndex: this.currentChipSelected, type: 'NEW' });
        const attribMainType: IProductAttributeList = {
          attributeID: attributeJson.id,
          attributeName: attributeJson.name,
          type: 'NEW',
        };
        this.productService.attributeFoundByTyping.next(attribMainType);
        this.productService.isNewAttribute.next({ status: true, attribData: attribMainType });
        this.mainChipValidation();
        this.sendChips();
        if (input) {
          input.value = '';
        }
        this.isLoading = false;
      } else {
        const errorText = value + ' ' + this.translate.instant(result.value);
        this.toastr.error(errorText, this.errorTitle, { positionClass: this.toastPosition });
        this.isLoading = false;
      }
    });
  }

  isTagExists(value: string): boolean {
    if (this.chips) {
      const isTagFound = this.chips.find(({ name }) => name === value);
      if (isTagFound) {
        return true;
      } else {
        return false;
      }
    }
  }

  remove(chip: IChip): void {
    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
      this.removeChips(chip);
    }
  }

  sendChips(): void {
    this.maintainChipData();
    this.chipEvent.emit({ type: 'add', chips: this.chips, currentChip: this.currentChipSelected });
  }

  removeChips(chip: IChip): void {
    this.maintainChipData();
    this.chipEvent.emit({ type: 'remove', chips: chip });
    this.mainChipValidation();
  }

  maintainChipData(): void {
    if (this.componentType === 'CATEGORY') {
      this.productService.chipCategoryData.next(this.chips);
    } else if (this.componentType === 'TAG') {
      this.productService.chipTagData.next(this.chips);
    }
  }

  mainChipValidation(): void {
    if (this.chips.length === 1 && this.mainChip) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
}
