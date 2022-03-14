import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IProductAttribute, IProductAttributeForm, IProductAttributeList, IProductSubAttributeArray } from '@reactor-room/itopplus-model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { IAttribSubAttribHolder, INameIDPair } from '@reactor-room/plusmar-front-end-share/app.model';
import { differenceWith, isEmpty, isEqual } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'reactor-room-products-attributes-card',
  templateUrl: './products-attributes-card.component.html',
  styleUrls: ['./products-attributes-card.component.scss'],
})
export class ProductsAttributesCardComponent implements OnInit, OnDestroy {
  @Input() manageAttribute = true;
  @Input() type: string;
  @Input() currentChipSelected: number;
  @Input() attributeExistsByTyping: IProductAttributeList;

  attributeData = [] as IProductAttributeList[];
  subAttributeDataLocal = [] as INameIDPair[];
  storedAttributeData = [] as IProductAttributeList[];
  attributeFormData: IProductAttributeForm[];
  attributeNewData = [];
  attributeFormList = [];
  subAttributeFormList = [];

  attributeFormDataSubscription: Subscription;
  removeAttributeSubscription: Subscription;
  removeSubAttributeSubscription: Subscription;
  attributeByTypingSubscription: Subscription;
  subAttributeByTypingSubscription: Subscription;
  subAttributeFromSubscription: Subscription;
  attributeDataSubscription: Subscription;
  toastPosition = 'toast-bottom-right';

  constructor(private attributeService: ProductCommonService, private toastr: ToastrService, public translate: TranslateService) {}

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.attributeSubscriptions();
    this.subAttributeSubscriptions();
  }

  attributeSubscriptions(): void {
    this.attributeFormDataSubscription = this.attributeService.getAttributeDataFormObs.subscribe((value: IProductAttributeForm[]) => {
      this.attributeFormData = value;
    });

    this.attributeDataSubscription = this.attributeService.getAttributesDataObs.subscribe((value: IProductAttribute) => {
      if (!isEmpty(value)) {
        this.attributeData = value?.attributes;
        this.maintainAttributeCardWithForm();
      }
      if (!isEmpty(value)) this.storedAttributeData = value.attributes;
    });

    this.attributeByTypingSubscription = this.attributeService.getAttributeFoundByTyping.subscribe((value: IProductAttributeList) => {
      this.onAttributeSelected(value);
    });

    this.removeAttributeSubscription = this.attributeService.getRemoveAttributeContextObs.subscribe((value: INameIDPair) => {
      if (!isEmpty(value)) this.addAgainToAttribute(value);
    });
  }

  subAttributeSubscriptions(): void {
    this.subAttributeByTypingSubscription = this.attributeService.getSubAttributeFoundByTyping.subscribe((value: INameIDPair) => {
      this.onSubAttributeSelected(value);
    });

    if (this.type === 'SUBATTRIBUTE') {
      this.maintainSubAttributeCardWithForm();

      this.subAttributeFromSubscription = this.attributeService.getSubAttributeDataFromSelectorObs.subscribe((value: INameIDPair[]) => {
        if (!isEmpty(value)) {
          this.subAttributeDataLocal = value;
        }
      });

      this.removeSubAttributeSubscription = this.attributeService.getRemoveSubAttributeContextObs.subscribe((value: INameIDPair) => {
        this.addAgainToSubAttribute(value);
      });
    }
  }

  performTypingActions(attribute: IProductAttributeList): void {
    this.removeFromAttribute(attribute);
    this.attributeService.setAttributeDataSubj({ attributes: this.attributeData });
  }

  onAttributeSelected(attribute: IProductAttributeList): void {
    const attribData = this.attributeFormData[this.currentChipSelected];
    if (!attribData?.attributeID) {
      if (attribute?.type === 'NEW') {
        const attributeTransform = this.transfromAttribute(attribute.attributeID, attribute.attributeName, [], this.currentChipSelected);
        this.attributeService.setAttributeDataFromSelector(attributeTransform);
      } else {
        const subAttrib = attribute.subAttributes ? this.transformSubAttribute(attribute?.subAttributes, this.currentChipSelected) : null;
        const attributeTransform = this.transfromAttribute(attribute.attributeID, attribute.attributeName, subAttrib, this.currentChipSelected);
        this.attributeService.setAttributeDataFromSelector(attributeTransform);
        this.removeFromAttribute(attribute);
        this.attributeService.setAttributeDataSubj({ attributes: this.attributeData });
      }
    } else {
      const warningTitle = this.translate.instant('Warning');
      const warningText = this.translate.instant('Attribute is already selected');
      this.toastr.warning(warningText, warningTitle, { positionClass: this.toastPosition });
    }
  }

  transfromAttribute(id: number, name: string, subAttrib, currentIndex: number): IAttribSubAttribHolder {
    return {
      id: id,
      name: name,
      subAttrib: subAttrib,
      currentIndex: currentIndex,
    };
  }

  removeFromAttribute(attribute: IProductAttributeList): void {
    this.attributeData = this.attributeData.filter((attrib) => attrib.attributeID !== attribute.attributeID);
  }

  addAgainToAttribute(removedAttribute: IAttribSubAttribHolder): void {
    if (removedAttribute?.id) {
      const retransfromToAttribute: IProductAttributeList = {
        attributeID: removedAttribute.id,
        attributeName: removedAttribute.name,
        subAttributes: removedAttribute.subAttrib
          ? removedAttribute?.subAttrib?.map((subData) => ({
              subAttributeID: subData.id,
              subAttributeName: subData.name,
            }))
          : null,
      };

      this.attributeData.push(retransfromToAttribute);
    }
  }

  addAgainToSubAttribute(removedSubAttribute: INameIDPair): void {
    if (removedSubAttribute?.id) {
      this.subAttributeDataLocal?.push(removedSubAttribute);
    }
  }

  onSubAttributeSelected(subAttributes: INameIDPair): void {
    this.attributeService.setSubAttributeFromSelector(subAttributes);
    this.removeFromSubAttributes(subAttributes);
    this.attributeService.setSubAttributeFromSelectorList(this.subAttributeDataLocal);
  }

  removeFromSubAttributes(subAttribute: INameIDPair): void {
    const subData = this.subAttributeDataLocal?.filter((subAttrib) => subAttrib.id !== subAttribute.id);
    if (subData) this.subAttributeDataLocal = subData;
  }

  transformSubAttribute(subAttributes: IProductSubAttributeArray[], currentIndex: number): INameIDPair[] {
    return subAttributes
      ? subAttributes?.map((sub) => ({
          id: sub.subAttributeID,
          name: sub.subAttributeName,
          currentIndex: currentIndex,
        }))
      : [];
  }

  maintainAttributeCardWithForm(): void {
    this.attributeFormList = this.attributeFormData.map((item) => item);
    this.attributeFormList.map((attribForm) => {
      this.attributeData = this.attributeData.filter((attribData) => attribData.attributeID !== attribForm.attributeID);
    });
  }

  maintainSubAttributeCardWithForm(): void {
    const currentAttributeForm = this.attributeFormData ? this.attributeFormData?.filter((attribForm) => attribForm?.currentIndex === this.currentChipSelected) : [];
    const currentAttributeData = this.storedAttributeData ? this.storedAttributeData?.filter((attribData) => attribData?.attributeID === currentAttributeForm[0]?.attributeID) : [];
    let tempSubAttribArr = [] as IProductSubAttributeArray[];
    if (currentAttributeForm[0]?.subAttributes?.length) {
      const transformFormSubAttrib = currentAttributeForm[0]?.subAttributes?.map((item) => ({
        subAttributeID: item.id,
        subAttributeName: item.name,
      }));
      tempSubAttribArr = differenceWith(currentAttributeData[0]?.subAttributes, transformFormSubAttrib, isEqual);
    } else {
      tempSubAttribArr = currentAttributeData[0]?.subAttributes;
    }

    const subAttribList = this.transformSubAttribute(tempSubAttribArr, this.currentChipSelected);
    this.subAttributeDataLocal = subAttribList;
  }

  ngOnDestroy(): void {
    this.removeAttributeSubscription.unsubscribe();
    this.attributeFormDataSubscription.unsubscribe();
    this.attributeByTypingSubscription.unsubscribe();
    this.attributeDataSubscription.unsubscribe();
    this.removeAttributeSubscription.unsubscribe();
    if (this.type === 'SUBATTRIBUTE') {
      this.removeSubAttributeSubscription.unsubscribe();
      this.subAttributeByTypingSubscription.unsubscribe();
      this.subAttributeFromSubscription.unsubscribe();
    }
  }
}
