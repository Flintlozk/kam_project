import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CrudType } from '@reactor-room/crm-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { IProductAttributeForm, IProductAttributeList } from '@reactor-room/itopplus-model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { IAttribSubAttribHolder, INameIDPair } from '@reactor-room/plusmar-front-end-share/app.model';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

const ADD_EDIT_SECOND_ATTRIBUTE_INDEX = 2;
@Component({
  selector: 'reactor-room-products-attributes-dialog',
  templateUrl: './products-attributes-dialog.component.html',
  styleUrls: ['./products-attributes-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsAttributesDialogComponent implements OnInit, AfterContentChecked, OnDestroy {
  attributeData: IProductAttributeList[];
  attributeForm: FormGroup;
  attributeDataFromSelector = [] as IAttribSubAttribHolder[];
  subAttributeDataFromSelector = [] as INameIDPair[];
  attributeDialogStatus = [] as boolean[];
  subAttributeDialogStatus = [] as boolean[];
  attributeFoundByTyping: IProductAttributeList;
  maintainAttributeExists: IProductAttributeList[];
  attributeSupported = environmentLib.attributeSupported;
  detectData: { attributes: IProductAttributeForm[] };
  crudType = CrudType.ADD;
  errorTitle = this.translate.instant('Error');
  crudTypes = CrudType;
  destroy$ = new Subject();
  attributeIndex: number;

  get formAttributeArray(): FormArray {
    return <FormArray>this.attributeForm.get('attributes');
  }

  constructor(
    private dialogRef: MatDialogRef<ProductsAttributesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private storedAttributeData,
    private fb: FormBuilder,
    private productService: ProductsService,
    private attributeService: ProductCommonService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    public translate: TranslateService,
  ) {
    this.detectData = this.storedAttributeData.storedAttribute;
    this.crudType = this.storedAttributeData.crudType;
    this.attributeIndex = this.storedAttributeData?.attributeIndex;
    if (this.attributeIndex === ADD_EDIT_SECOND_ATTRIBUTE_INDEX) {
      this.attributeService.setAttributeFormData([]);
    }
  }

  ngOnInit(): void {
    this.attributeForm = this.fb.group({
      attributes: this.fb.array([this.getAttributeFormGroup()]),
    });
    this.attributeDialogStatus.push(false);
    this.subAttributeDialogStatus.push(false);
    if (!this.detectData) {
      this.getAttributeData();
    } else {
      this.buildAttributeForm();
    }

    this.attributeForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value?.attributes) {
        this.attributeService.setAttributeFormData(value.attributes);
        this.getAttributeData();
      }
    });

    this.attributeService.getIsNewAttributeObs.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.status) {
        this.getAttributeData();
      }
    });
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  buildAttributeForm(): void {
    this.getAttributeData();
    this.subscribeToAttribute();
    this.subscribeToSubAttribute();
    this.detectData?.attributes?.map((attrib, index) => {
      if (attrib?.attributeID === -1) return false;
      if (index > 0) {
        this.addAttribute(index);
      }
      const trans: IAttribSubAttribHolder = {
        id: attrib.attributeID,
        name: attrib.attributeName,
        currentIndex: index,
      };
      setTimeout(() => {
        this.attributeService.setAttributeDataFromSelector(trans);
      }, 1);
      const subAttrib = attrib?.subAttributes;
      if (subAttrib) {
        subAttrib?.map((sub) => {
          setTimeout(() => {
            this.attributeService.setSubAttributeFromSelector(sub);
          }, 1);
        });
      }
    });
  }

  getAttributeData() {
    this.productService
      .getProductAttributeList()
      .pipe(
        takeUntil(this.destroy$),
        tap((result: IProductAttributeList[]) => {
          if (result?.length > 0) {
            const cloneResult = deepCopy(result).map((attrib) => {
              if (attrib.subAttributes) {
                if (attrib.subAttributes[0].subAttributeID === null) {
                  attrib.subAttributes = null;
                  return attrib;
                } else {
                  return attrib;
                }
              } else {
                return attrib;
              }
            });
            this.attributeData = cloneResult;
            this.maintainAttributeExists = cloneResult;
            this.attributeService.storedAttributeData = cloneResult;
            this.attributeService.setAttributeDataSubj({ attributes: cloneResult });
          }
        }),
        catchError((error) => {
          this.showErrorToast();
          throw error;
        }),
      )
      .subscribe();

    this.subscribeToAttribute();
    this.subscribeToSubAttribute();
  }

  showErrorToast(): void {
    const errMessage = this.translate.instant('Error Please try again later');
    this.toastr.error(errMessage, this.errorTitle);
    this.onNoClick();
  }

  subscribeToAttribute(): void {
    this.attributeService.getAttributeDataFromSelectorObs.pipe(takeUntil(this.destroy$)).subscribe((value: IAttribSubAttribHolder) => {
      if (value?.id) {
        const { currentIndex } = value;
        this.attributeDataFromSelector[currentIndex] = value;
      }
    });
  }

  subscribeToSubAttribute(): void {
    this.attributeService.getSubAttributeDataSelectedObs.pipe(takeUntil(this.destroy$)).subscribe((value: INameIDPair) => {
      if (value?.id) {
        const { currentIndex } = value;
        this.subAttributeDataFromSelector[currentIndex] = value;
      }
    });
  }

  getAttributeFormGroup(): FormGroup {
    return this.fb.group({
      attributeID: ['', [Validators.required]],
      attributeName: ['', [Validators.required]],
      type: [''],
      currentIndex: [null],
      subAttributes: ['', Validators.required],
    });
  }

  getSubAttributeFormArray(): FormArray {
    return this.fb.array([]);
  }

  getSubAttributeFromGroup(): FormGroup {
    return this.fb.group({
      subAttributeID: [null, [Validators.required]],
      subAttributeName: ['', [Validators.minLength(1)]],
    });
  }

  addAttribute(i: number): void {
    this.attributeFoundByTyping = undefined;
    this.formAttributeArray.push(this.getAttributeFormGroup());
    this.attributeService.setSubAttributeFromSelectorList([]);
    this.attributeDialogStatus.push(false);
    this.subAttributeDialogStatus.push(false);
  }

  removeAttribute(i: number): void {
    this.formAttributeArray.removeAt(i);
    this.attributeDialogStatus.slice(i, 1);
    this.subAttributeDialogStatus.slice(i, 1);
  }

  processAddingOfAttributeChip(event): void {
    let chipDataID = event.chips[0].id;
    let chipDataName = event.chips[0].name;
    const { currentChip } = event;
    this.attributeFoundByTyping = this.maintainAttributeExists?.find((attribute) => attribute.attributeName === chipDataName);
    if (this.attributeFoundByTyping) {
      this.maintainAttributeExists = this.maintainAttributeExists.filter((attrib) => attrib.attributeID !== this.attributeFoundByTyping.attributeID);
      chipDataID = this.attributeFoundByTyping.attributeID;
      chipDataName = this.attributeFoundByTyping.attributeName;
    }
    const attribFormGroup = <FormArray>this.formAttributeArray.controls[currentChip];
    attribFormGroup.get('attributeID').patchValue(chipDataID);
    attribFormGroup.get('attributeName').patchValue(chipDataName);
    attribFormGroup.get('currentIndex').patchValue(currentChip);
  }

  receiveMainChips(i: number, event): void {
    if (event.type === 'add') {
      this.processAddingOfAttributeChip(event);
    } else if (event.type === 'remove') {
      this.processRemoveOfChip(event, i);
    } else {
      throw new Error('Error while receiving data');
    }
  }

  processRemoveOfChip(event: any, i: number): void {
    this.attributeDialogStatus[i] = true;
    // waiting for child rendering cycle -- need to remove settimeout in future
    setTimeout(() => {
      const attribFormGroup = <FormArray>this.formAttributeArray.controls[i];
      attribFormGroup.get('attributeID').patchValue(null);
      attribFormGroup.get('attributeName').patchValue('');
      this.clearSubChipData(i);
      if (event?.id !== -1) {
        this.attributeService.removeAttributeContext.next(event.chips);
      }
    }, 1);
  }

  receiveSubChips(i: number, event): void {
    const subAttribFormArray: FormArray = <FormArray>this.formAttributeArray.controls[i].get('subAttributes');
    if (event.type === 'add') {
      const chipSubData = event.chips;
      subAttribFormArray.patchValue(chipSubData);
    } else if (event.type === 'remove') {
      if (event.id !== -1) {
        this.subAttributeDialogStatus[i] = true;
        setTimeout(() => {
          this.attributeService.removeSubAttributeContext.next(event.chips);
          this.subAttributeDataFromSelector[i] = null;
        }, 1);
      }
    }
    if (subAttribFormArray.value.length === 0) {
      subAttribFormArray.patchValue(null);
    }
  }

  clearSubChipData(i: number): void {
    this.subAttributeDataFromSelector[i] = {
      id: -2,
      name: 'remove',
    };
  }

  mainCardActive(i: number): void {
    this.attributeDialogStatus[i] = true;
    this.subAttributeDialogStatus[i] = false;
    this.attributeService.chipSelectedIndex.next(i);
  }

  subCardActive(i: number): void {
    this.attributeService.chipSelectedIndex.next(i);
    if (this.subAttributeDialogStatus[i] === false) {
      this.attributeDialogStatus[i] = false;
      this.subAttributeDialogStatus[i] = true;
      this.attributeService.currentAttributeContext.next(this.attributeForm.value.attributes[i]);
      const currentAttributeID = this.attributeForm.value.attributes[i].attributeID;
      this.processSubCardActive(currentAttributeID, i);
    }
  }

  processSubCardActive(attributeID: number, i: number): void {
    if (attributeID) {
      const allSubAttributes: INameIDPair[] = this.attributeDataFromSelector[i]?.subAttrib;
      const subAttributeData = this.attributeForm.value.attributes[i]?.subAttributes;
      if (subAttributeData) {
        const subAttributeArrayDiff = allSubAttributes?.filter((a) => !subAttributeData?.map((b) => b.id).includes(a.id));
        this.attributeService.setSubAttributeFromSelectorList(subAttributeArrayDiff);
      } else {
        this.attributeService.setSubAttributeFromSelectorList(allSubAttributes);
      }
    } else {
      this.attributeService.setSubAttributeFromSelectorList([]);
    }
  }

  clickOutsideCatEvent(event, type: string, i: number): void {
    if (event) {
      if (type === 'ATTRIBUTE') {
        this.attributeDialogStatus[i] = false;
      } else if (type === 'SUBATTRIBUTE') {
        this.subAttributeDialogStatus[i] = false;
      }
    }
  }

  saveAttribute(): void {
    this.dialogRef.close(this.attributeForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onAttributeKeyStroke(i: number): void {
    this.mainCardActive(i);
  }

  onSubAttributeKeyStroke(i: number): void {
    this.subCardActive(i);
  }

  ngOnDestroy(): void {
    this.attributeService.setSubAttributeFromSelector(null);
    this.attributeService.setAttributeDataFromSelector(null);
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
