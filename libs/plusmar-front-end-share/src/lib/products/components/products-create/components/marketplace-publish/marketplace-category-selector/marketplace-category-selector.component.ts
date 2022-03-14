import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { LanguageTypes } from '@reactor-room/model-lib';
import { ICategorySelectedEmitter, ILazadaCategories, IProductMarketPlaceCategoryTree, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { concat, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductMarketPlaceService } from '../../../../../services/product-marketplace.service';

@Component({
  selector: 'reactor-room-marketplace-category-selector',
  templateUrl: './marketplace-category-selector.component.html',
  styleUrls: ['./marketplace-category-selector.component.scss'],
})
export class MarketplaceCategorySelectorComponent implements OnInit, OnDestroy {
  @Input() categoryLevels = [] as {
    [key: number]: IProductMarketPlaceCategoryTree[];
  }[];
  @Input() isCategorySelectedBySuggestion = false;
  @Input() marketPlaceType: SocialTypes;
  @Input() selectCategory = [] as IProductMarketPlaceCategoryTree[];
  @Input() selectedCategory: ILazadaCategories;
  @Output() categorySelectedFromSelector = new EventEmitter<ICategorySelectedEmitter>();
  @ViewChild('categorySelectorContainer') categorySelectorContainer!: ElementRef;
  language = LanguageTypes.ENGLISH;
  baseCategoryID = -1;
  isSelectedCategoryLeaf = false;

  constructor(public marketPlaceService: ProductMarketPlaceService) {}

  ngOnDestroy(): void {
    this.categoryLevels = [];
  }

  ngOnInit(): void {
    const isSelectedCategoryBySelector = !isEmpty(this.getCategoryLeafSelected()) && !isEmpty(this.selectedCategory);
    const isSelectedCategoryBySuggestion = !isEmpty(this.selectedCategory) && this.isCategorySelectedBySuggestion;
    if (isSelectedCategoryBySelector) {
      this.autoSelectedCategory();
    } else if (isSelectedCategoryBySuggestion) {
      const { categoryId } = this.selectedCategory;
      const queryByCategory = true;
      this.marketPlaceService
        .getProductMarketPlaceCategoryTree(this.marketPlaceType, categoryId, queryByCategory, this.language)
        .pipe(
          tap((categoryTree) => {
            this.selectCategory = categoryTree;
            this.autoSelectedCategory();
          }),
        )
        .subscribe();
    } else {
      this.getCategoryTreeMainLeaf(0).subscribe();
    }
  }

  autoSelectedCategory(): void {
    const selectedCategoryObs = [];
    const selectCategoryCopy = deepCopy(this.selectCategory);
    const queryByCategory = false;
    this.selectCategory = [];
    selectCategoryCopy.forEach((category, index) =>
      index === 0
        ? selectedCategoryObs.push(this.getCategoryTreeMainLeaf(index))
        : selectedCategoryObs.push(this.getCategoryTreeLeafs(this.marketPlaceType, category, index, queryByCategory)),
    );
    concat(...selectedCategoryObs)
      .pipe(tap(() => (this.selectCategory = selectCategoryCopy)))
      .subscribe();
  }

  onCategoryItemClick(categoryData: IProductMarketPlaceCategoryTree, level: number): void {
    this.isCategorySelectedBySuggestion = false;
    if (!categoryData) {
      this.getCategoryTreeMainLeaf(level).subscribe();
    } else {
      const queryByCategory = false;
      const obs = this.getCategoryTreeLeafs(this.marketPlaceType, categoryData, level, queryByCategory);
      obs.subscribe();
    }
    if (this.categoryLevels.length > 2) this.categoryLevels = this.categoryLevels?.slice(0, level + 2);
  }

  getCategoryTreeMainLeaf(level: number): Observable<IProductMarketPlaceCategoryTree[]> {
    const queryByCategory = false;
    return this.marketPlaceService.getProductMarketPlaceCategoryTree(this.marketPlaceType, this.baseCategoryID, queryByCategory, this.language).pipe(
      tap((val) => {
        this.categoryLevels = [{ 0: val }];
        this.setIsLeadCategorySelected(level);
      }),
    );
  }

  setIsLeadCategorySelected(level: number): void {
    const isLeafSelected = this.getCategoryLeafSelected();
    this.isSelectedCategoryLeaf = isEmpty(isLeafSelected) ? false : true;
    if (this.isSelectedCategoryLeaf) this.categoryLevels = this.categoryLevels?.slice(0, level + 1);
  }

  getCategoryLeafSelected(): IProductMarketPlaceCategoryTree {
    return this.selectCategory.find((category) => category?.leaf === true);
  }

  getCategoryTreeLeafs(
    socialType: SocialTypes,
    categoryData: IProductMarketPlaceCategoryTree,
    level: number,
    queryByCategory: boolean,
  ): Observable<IProductMarketPlaceCategoryTree[]> {
    const id = this.isCategorySelectedBySuggestion ? categoryData.parentID : categoryData.categoryID;
    return this.marketPlaceService.getProductMarketPlaceCategoryTree(socialType, id, queryByCategory, this.language).pipe(
      tap((val) => {
        this.selectCategory = this.selectCategory?.slice(0, level);
        this.selectCategory[level] = categoryData;
        if (this.isCategorySelectedBySuggestion) this.categoryLevels[level] = { [level]: val };
        if (!categoryData?.leaf) this.categoryLevels[level + 1] = { [level + 1]: val };
        this.setIsLeadCategorySelected(level);
        setTimeout(() => {
          const categorySelectorNative = this.categorySelectorContainer.nativeElement as HTMLElement;
          categorySelectorNative.scrollLeft = categorySelectorNative.scrollWidth + categorySelectorNative.offsetWidth;
        }, 200);
      }),
    );
  }

  onCategoryFromSelector(): void {
    const categorySelected = this.getCategoryLeafSelected();
    if (isEmpty(categorySelected)) {
      this.setCategorySelected(null, null);
    } else {
      const { categoryID: categoryId, name: categoryName } = categorySelected;
      const categoryPath = this.selectCategory.map(({ name }) => name).join('>');
      this.selectedCategory = {
        categoryId,
        categoryName,
        categoryPath,
      };
      this.setCategorySelected(categoryPath, categoryId);
      const showCategorySelector = false;
      this.emitCategorySelected(showCategorySelector, this.selectedCategory, this.selectCategory, this.categoryLevels);
    }
  }

  emitCategorySelected(
    showCategorySelector: boolean,
    selectedCategory: ILazadaCategories,
    selectCategory: IProductMarketPlaceCategoryTree[],
    categoryLevels: {
      [key: number]: IProductMarketPlaceCategoryTree[];
    }[],
  ): void {
    this.categorySelectedFromSelector.emit({ showCategorySelector, selectedCategory, selectCategory, categoryLevels });
  }

  onCancelCategorySuggestion(): void {
    const showCategorySelector = false;
    const selectedCategory = this.selectedCategory;
    const selectCategory = this.selectCategory;
    const categoryLevels = this.categoryLevels;
    this.categorySelectedFromSelector.emit({ showCategorySelector, selectedCategory, selectCategory, categoryLevels });
  }

  setCategorySelected(categoryPath: string, categoryId: number): void {
    this.marketPlaceService.setFormCategorySelected$.next({ categoryId, categoryPath });
  }
}
