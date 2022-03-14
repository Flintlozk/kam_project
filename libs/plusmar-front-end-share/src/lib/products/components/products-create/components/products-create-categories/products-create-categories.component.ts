import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { ICatSubCatHolder, IProductCategory, IProductCategoryList, IProductSubCategoryArray } from '@reactor-room/itopplus-model-lib';
import { flatMap } from 'lodash';
import { Subscription } from 'rxjs';
import { ProductsCategoriesDialogComponent } from '../../../products-categories-dialog/products-categories-dialog.component';

@Component({
  selector: 'reactor-room-products-create-categories',
  templateUrl: './products-create-categories.component.html',
  styleUrls: ['./products-create-categories.component.scss'],
})
export class ProductsCreateCategoriesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() removedChip: ICatSubCatHolder;
  categoriesCount = 0;
  filterCategoryData: IProductCategory;
  storedCategoryData: IProductCategoryList[];
  _searchKey: string;
  productCategorySubscription: Subscription;
  catSubCatValueHolder: string[];
  categoryAfterSave = [] as IProductCategoryList[];

  set searchKey(value: string) {
    this.filterCategories(value);
    this._searchKey = value;
  }
  get searchKey(): string {
    return this._searchKey;
  }

  constructor(private dialog: MatDialog, private categoryService: ProductCommonService, private productService: ProductsService) {}

  ngOnInit(): void {
    this.getCategoryData();
    this.categoryService.shareCatgoriesData.subscribe((data) => {
      if (data) {
        this.filterCategoryData = data;
        this.storedCategoryData = data.categories;
        this.setCategoryCount(this.filterCategoryData);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.removedChip.currentValue) {
      this.uncheckCategory(this.removedChip);
    }
  }

  uncheckCategory(removedChip: ICatSubCatHolder): void {
    if (removedChip) {
      if (removedChip.subCatID) {
        const subCatInputID = `subCatInputID${removedChip.subCatID}`;
        const subCatElement = document.getElementById(subCatInputID) as HTMLElement;
        subCatElement['checked'] = false;
      } else {
        const catInputID = `catInputID${removedChip.id}`;
        const catElement = document.getElementById(catInputID) as HTMLElement;
        catElement['checked'] = false;
      }
    }
  }

  getCategoryData(): void {
    this.productCategorySubscription = this.productService.getProductCategoryList().subscribe((result: IProductCategoryList[]) => {
      if (result?.length > 0) {
        this.categoryService.setCatgoriesData({ categories: result });
        this.prepareCatSubCatValueArray(result);
        setTimeout(() => {
          this.setCategoryAfterSave();
        }, 600);
      }
    });
  }

  getSubCatAfterSavedList(catList: IProductCategoryList[]): ICatSubCatHolder[] {
    const subCatList: ICatSubCatHolder[][] = catList?.map((cat) => {
      const id = cat.categoryID;
      return cat?.subCategories.map((subCat) => ({
        id,
        name: subCat.subCategory,
        subCatID: subCat.subCategoryID,
      }));
    });

    return flatMap(subCatList) as ICatSubCatHolder[];
  }

  setCategoryAfterSave(): void {
    if (this.categoryAfterSave?.length) {
      const catList = this.filterCategoryData.categories;
      const subCatListArray = this.getSubCatAfterSavedList(catList);
      this.categoryAfterSave.map((catAfterSave) => {
        const catListCategory = catList.find((catListCategory) => catListCategory.category === catAfterSave.category);
        this.setCategoryCheckedAfterSave(catListCategory);
        this.setSubCategoryCheckedAfterSave(catAfterSave?.subCategories, subCatListArray);
      });
    }
  }

  setSubCategoryCheckedAfterSave(subCatSaved: IProductSubCategoryArray[], subCatList: ICatSubCatHolder[]): void {
    subCatSaved?.map((subCatSaved) => {
      const subCatItem = subCatList?.find((subCatList) => subCatList?.name === subCatSaved.subCategory);
      const subCatItemID = subCatItem?.subCatID;
      const subCatListID = `subCatInputID${subCatItemID}`;
      const subCatElement = document.getElementById(subCatListID) as HTMLElement;
      if (!subCatElement) return;
      const subCatChecked = subCatElement['checked'];
      if (subCatChecked) return;
      subCatElement['checked'] = true;
      const { id, name, subCatID } = subCatItem || {};
      this.setSubCategoryToHolder(id, name, subCatID);
    });
  }

  setCategoryCheckedAfterSave(catListCategory: IProductCategoryList): void {
    if (catListCategory?.categoryID) {
      const catListCategoryID = `catInputID${catListCategory.categoryID}`;
      const catElement = document.getElementById(catListCategoryID) as HTMLElement;
      if (!catElement) return;
      const catChecked = catElement['checked'];
      if (catChecked) return;
      catElement['checked'] = true;
      this.setCategoryToHolder(catListCategory.categoryID, catListCategory.category);
    }
  }

  prepareCatSubCatValueArray(catData: IProductCategoryList[]): void {
    this.catSubCatValueHolder = [];
    catData.map((cat) => {
      this.catSubCatValueHolder.push(cat.category);
      cat.subCategories.map((subCat) => this.catSubCatValueHolder.push(subCat.subCategory));
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProductsCategoriesDialogComponent, {
      width: '100%',
      data: this.catSubCatValueHolder,
    });

    dialogRef.afterClosed().subscribe((catDialogData: [IHTTPResult, IProductCategoryList[]]) => {
      const [result, categoryAfterSave] = catDialogData || [];
      if (result?.status === 200) {
        this.categoryAfterSave = categoryAfterSave;
        this.getCategoryData();
      }
    });
  }

  filterCategories(value: string): void {
    if (value) {
      const tempCategoryData = [];
      value = value.toLowerCase();
      if (this.filterCategoryData) {
        this.filterCategoryData.categories.map((category) => {
          if (category.category.toLowerCase().indexOf(value) >= 0) {
            tempCategoryData.push(category);
          } else {
            category.subCategories.find((subCategory) => {
              if (subCategory.subCategory.toLowerCase().indexOf(value) >= 0) {
                tempCategoryData.push(category);
              }
            });
          }
        });
        this.filterCategoryData.categories = tempCategoryData;
        this.setCategoryCount(this.filterCategoryData);
      } else {
        this.filterCategoryData.categories = this.storedCategoryData;
      }
    } else {
      this.filterCategoryData.categories = this.storedCategoryData;
      this.setCategoryCount(this.filterCategoryData);
    }
  }

  setCategoryCount(data: IProductCategory): void {
    if (data?.categories?.length > 0) {
      this.categoriesCount = data.categories.length;
    } else {
      this.categoriesCount = 0;
    }
  }

  onCheckBoxClickCategory(event, category: IProductCategoryList): void {
    if (category) {
      const parentCheckboxChecked: boolean = event.currentTarget.checked;
      if (parentCheckboxChecked) {
        this.setCategoryToHolder(category.categoryID, category.category);
      } else {
        this.categoryService.removeCategoryFromHolder(category.category);
      }
    }
  }

  onCheckBoxClickSubCategory(event, categoryID: number, subCategoryID: number, subCategoryName: string): void {
    const subCatInputID = `subCatInputID${subCategoryID}`;
    const subCatElement = document.getElementById(subCatInputID) as HTMLElement;
    const subCatChecked = subCatElement['checked'];
    if (subCatChecked) {
      this.setSubCategoryToHolder(categoryID, subCategoryName, subCategoryID);
    } else {
      this.categoryService.removedSubCategoryFromHolder(subCategoryID);
    }
  }

  onToggleSubCategoryDisplay(categoryID: number): void {
    const subContentID = `subContentID${categoryID}`;
    const subContentElement = document.getElementById(subContentID) as HTMLElement;
    const plusID = `plus${categoryID}`;
    const plusElement = document.getElementById(plusID) as HTMLElement;
    const minusID = `minus${categoryID}`;
    const minusElement = document.getElementById(minusID) as HTMLElement;
    if (subContentElement.style.display === 'block') {
      subContentElement.style.display = 'none';
      plusElement.style.display = 'block';
      minusElement.style.display = 'none';
    } else {
      subContentElement.style.display = 'block';
      plusElement.style.display = 'none';
      minusElement.style.display = 'block';
    }
  }

  onCheckAll(event): void {
    if (this.filterCategoryData) {
      this.categoryService.clearCatSubCatSelector();
      const allCheckBoxStatus = event.currentTarget.checked;
      this.filterCategoryData.categories.forEach((category) => {
        const catInputID = `catInputID${category.categoryID}`;
        const catElement = document.getElementById(catInputID) as HTMLElement;
        catElement['checked'] = allCheckBoxStatus;
        if (catElement['checked']) {
          this.setCategoryToHolder(category.categoryID, category.category);
        } else {
          this.categoryService.removeCategoryFromHolder(category.category);
        }
        category.subCategories.forEach((subCategory) => {
          const subCatInputID = `subCatInputID${subCategory.subCategoryID}`;
          const subCatElement = document.getElementById(subCatInputID) as HTMLElement;
          subCatElement['checked'] = allCheckBoxStatus;
          if (subCatElement['checked']) {
            this.setSubCategoryToHolder(category.categoryID, subCategory.subCategory, subCategory.subCategoryID);
          } else {
            this.categoryService.removedSubCategoryFromHolder(subCategory.subCategoryID);
          }
        });
      });
    }
  }

  setCategoryToHolder(id: number, name: string): void {
    this.categoryService.setCatSubCatSeletor(id, name, null);
  }

  setSubCategoryToHolder(id: number, name: string, subCatID: number): void {
    this.categoryService.setCatSubCatSeletor(id, name, subCatID);
  }

  ngOnDestroy(): void {
    this.productCategorySubscription.unsubscribe();
  }
}
