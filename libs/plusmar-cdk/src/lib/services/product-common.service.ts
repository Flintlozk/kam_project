import { Injectable } from '@angular/core';
import {
  EnumAuthScope,
  IAttribSubAttribHolder,
  ICatSubCatHolder,
  INameIDPair,
  IProductAttribute,
  IProductAttributeForm,
  IProductAttributeFormProcessResult,
  IProductAttributeList,
  IProductCategory,
  IProductTag,
  ProductRouteTypes,
} from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductCommonService {
  projectScope = null as EnumAuthScope;
  constructor(private apollo: Apollo) {}

  productAddVariantProcessAttribute$ = new BehaviorSubject<IProductAttributeFormProcessResult>(null);
  //tags
  tagDataDb = [] as INameIDPair[];
  private tagsData = new BehaviorSubject(this.tagDataDb);
  getTagsDataObs = this.tagsData.asObservable();

  tagFromSelectorArray = [] as INameIDPair[];
  private tagFromSelector = new Subject();
  getTagFromSelector = this.tagFromSelector.asObservable();

  public removedTagFromInput = new Subject<INameIDPair>();
  getRemovedTagFromInput = this.removedTagFromInput.asObservable();

  public chipTagData = new Subject<INameIDPair[]>();
  getChipTagDataObs = this.chipTagData.asObservable();

  tagsSelected = [] as INameIDPair[];
  private tagsSelectedData = new BehaviorSubject(this.tagsSelected);
  getTagsSelectedData = this.tagsSelectedData.asObservable();

  public tagExistsAtDB = new Subject<INameIDPair>();
  getTabExistsAtDBObs = this.tagExistsAtDB.asObservable();

  public patchTags = [] as INameIDPair[];
  public patchCategories = [] as ICatSubCatHolder[];

  //Categories

  private categoryData = {} as IProductCategory;
  private catgoriesData = new BehaviorSubject(this.categoryData);
  shareCatgoriesData = this.catgoriesData.asObservable();

  //user category selection

  private catSubCatHolder = [] as ICatSubCatHolder[];
  private catSubCatSelector = new BehaviorSubject(this.catSubCatHolder);
  getCatSubCatSelector = this.catSubCatSelector.asObservable();
  public chipCategoryData = new Subject<ICatSubCatHolder[]>();
  getChipCategoryDataObs = this.chipCategoryData.asObservable();

  //attributes

  public storedAttributeData = [] as IProductAttributeList[];
  public attributeData = {} as IProductAttribute;
  private attributesDataSubject = new BehaviorSubject(this.attributeData);
  getAttributesDataObs = this.attributesDataSubject.asObservable();
  //
  private attributeDataForm = [] as IProductAttributeForm[];
  private attributeDataFormSubject = new BehaviorSubject(this.attributeDataForm);
  getAttributeDataFormObs = this.attributeDataFormSubject.asObservable();

  //attribute data from selector
  private attributeDataFromSelector = {} as IAttribSubAttribHolder;
  private attributeDataFromSelectorSubject = new BehaviorSubject(this.attributeDataFromSelector);
  getAttributeDataFromSelectorObs = this.attributeDataFromSelectorSubject.asObservable();

  //sub attribute data for list
  private subAttributeDataFromSelector = [] as INameIDPair[];
  private subAttributeDataFromSelectorSubject = new BehaviorSubject(this.subAttributeDataFromSelector);
  getSubAttributeDataFromSelectorObs = this.subAttributeDataFromSelectorSubject.asObservable();

  private subAttributeDataSelectedSubject = new Subject();
  getSubAttributeDataSelectedObs = this.subAttributeDataSelectedSubject.asObservable();

  //attribute by typing
  public attributeFoundByTyping = new Subject<IProductAttributeList>();
  getAttributeFoundByTyping = this.attributeFoundByTyping.asObservable();

  //sub attribute by typing
  public subAttributeFoundByTyping = new Subject<INameIDPair>();
  getSubAttributeFoundByTyping = this.subAttributeFoundByTyping.asObservable();

  //current attribute context
  public currentAttributeContext = new Subject();
  getCurrentAttributeContext = this.currentAttributeContext.asObservable();

  //remove attribute
  public removeAttributeContext = new Subject();
  getRemoveAttributeContextObs = this.removeAttributeContext.asObservable();

  //remove attribute
  public removeSubAttributeContext = new Subject();
  getRemoveSubAttributeContextObs = this.removeSubAttributeContext.asObservable();

  //new attribute subscription
  public isNewAttribute = new Subject<{ status: boolean; attribData: IProductAttributeList }>();
  getIsNewAttributeObs = this.isNewAttribute.asObservable();

  //current chip selected
  public chipSelectedIndex = new Subject();
  getChipSelectedIndexObs = this.chipSelectedIndex.asObservable();

  public isProductSaveClicked = new Subject<boolean>();
  getIsProductSaveClicked = this.isProductSaveClicked.asObservable();

  setTagsData(data: INameIDPair[]): void {
    this.tagsData.next(data);
  }

  setTagFromSelector(tag: INameIDPair): void {
    this.tagFromSelectorArray.push(tag);
    this.tagFromSelector.next(tag);
  }

  setTagSelected(tags: INameIDPair[]): void {
    this.tagsSelectedData.next(tags);
  }

  addProductTag(name: string): Observable<IProductTag> {
    const addTag = this.apollo.mutate({
      mutation: gql`
        mutation addProductTag($name: String) {
          addProductTag(name: $name) {
            id
            name
          }
        }
      `,
      variables: {
        name,
      },
    });

    return addTag.pipe(map((x) => x.data['addProductTag']));
  }

  //attributes

  setAttributeDataSubj(data: IProductAttribute): void {
    this.attributesDataSubject.next(data);
  }

  setAttributeDataFromSelector(data: IAttribSubAttribHolder): void {
    this.attributeDataFromSelectorSubject.next(data);
    this.subAttributeDataFromSelectorSubject.next(data?.subAttrib);
  }

  setAttributeFormData(data: IProductAttributeForm[]): void {
    if (data) this.attributeDataFormSubject.next(data);
  }

  setSubAttributeFromSelectorList(data: INameIDPair[]): void {
    this.subAttributeDataFromSelectorSubject.next(data);
  }

  setSubAttributeFromSelector(data: INameIDPair): void {
    this.subAttributeDataSelectedSubject.next(data);
  }

  addProductAttribute(name: string): Observable<IHTTPResult> {
    const addAttribute = this.apollo.mutate({
      mutation: gql`
        mutation addProductAttribute($name: String) {
          addProductAttribute(name: $name) {
            status
            value
          }
        }
      `,
      variables: {
        name,
      },
    });

    return addAttribute.pipe(map((x) => x.data['addProductAttribute']));
  }

  addProductSubAttribute(attributeID: number, subAttributeName: string): Observable<IHTTPResult> {
    const subAttributeData = {
      attributeID,
      subAttributeName,
    };

    const addSubAttribute = this.apollo.mutate({
      mutation: gql`
        mutation addProductSubAttribute($subAttributeData: ProductSubAttribAddInput) {
          addProductSubAttribute(subAttributeData: $subAttributeData) {
            status
            value
          }
        }
      `,
      variables: {
        subAttributeData,
      },
    });

    return addSubAttribute.pipe(map((x) => x.data['addProductSubAttribute']));
  }

  //categories function

  setCatgoriesData(data: IProductCategory): void {
    this.catgoriesData.next(data);
  }

  setCatSubCatSeletor(id: number, name: string, subCatID: number, mainID?: number): void {
    const obj = {
      mainID,
      id,
      name,
      subCatID,
    };
    this.catSubCatSelector.next([...this.catSubCatSelector.getValue(), obj]);
  }

  clearCatSubCatSelector(): void {
    this.catSubCatSelector.next([]);
  }

  removeCategoryFromHolder(categoryName: string): void {
    const removedCategoryData = this.catSubCatSelector.getValue().filter((item) => item.name !== categoryName);
    this.catSubCatSelector.next(removedCategoryData);
  }

  removedSubCategoryFromHolder(subCategoryID: number): void {
    const removedCategoryData = this.catSubCatSelector.getValue().filter((item) => item.subCatID !== subCategoryID);
    this.catSubCatSelector.next(removedCategoryData);
  }

  getProjectScopeURL(routeType: ProductRouteTypes): string {
    return this.projectScope ? `/dashboard${routeType}` : routeType;
  }
}
