import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductCommonService } from '@reactor-room/plusmar-cdk';
import { INameIDPair } from '@reactor-room/plusmar-front-end-share/app.model';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { IProductTag } from '@reactor-room/itopplus-model-lib';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-products-create-tags',
  templateUrl: './products-create-tags.component.html',
  styleUrls: ['./products-create-tags.component.scss'],
})
export class ProductsCreateTagsComponent implements OnInit, OnDestroy {
  @Output() popUpEvent = new EventEmitter<{ data: []; type: string }>();

  tagCount = 0;
  tagsData = [] as INameIDPair[];
  storedTagsData = [] as INameIDPair[];
  mainTagsData: IProductTag[];
  tagDataSelectedSubscription: Subscription;
  tagRemovedFromInputSubscription: Subscription;
  tagExistsAtDBSubscription: Subscription;
  tagSubscription: Subscription;
  patchTagSubscription: Subscription;

  constructor(private tagService: ProductCommonService, private productService: ProductsService) {}

  ngOnInit(): void {
    this.getProductTags();
    this.tagDataSelectedSubscription = this.tagService.getTagsSelectedData.subscribe((value: INameIDPair[]) => {
      if (value.length) {
        this.tagsData = value;
        this.storedTagsData = value;
        this.setTagLength();
      }
    });

    this.tagRemovedFromInputSubscription = this.tagService.getRemovedTagFromInput.subscribe((value: INameIDPair) => {
      const tagExists = this.mainTagsData?.find(({ name }) => name === value.name);
      if (tagExists?.id) {
        this.tagsData.push(tagExists);
      } else {
        this.tagsData.push(value);
      }
      this.setTagLength();
    });

    this.tagExistsAtDBSubscription = this.tagService.getTabExistsAtDBObs.subscribe((value: INameIDPair) => {
      if (value) this.addDynamicTag(value);
    });
  }

  getProductTags(): void {
    this.tagSubscription = this.productService
      .getProductTag()
      .pipe(first())
      .subscribe(
        (result: IProductTag[]) => {
          if (result?.length) {
            this.tagsData = result;
            this.storedTagsData = result;
            this.mainTagsData = result;
            this.removePatchedTags();
            this.tagService.setTagsData(this.tagsData);
            this.setTagLength();
          }
        },
        (error) => {
          console.log('err->', error);
        },
      );
  }

  removePatchedTags(): void {
    const patchedData = this.tagService.patchTags;
    patchedData.map((patchedTag) => {
      const indexOfTag = this.tagsData.findIndex((tag) => tag.id === patchedTag.id);
      if (indexOfTag !== -1) this.tagsData.splice(indexOfTag, 1);
    });
    this.storedTagsData = this.tagsData;
  }

  addDynamicTag(tag: INameIDPair): void {
    if (tag) {
      const dynamicTag = this.tagsData.find((item) => item.name === tag.name);
      const filteredTagData = this.tagsData.filter((item) => item.name !== tag.name);
      this.tagsData = filteredTagData;
      this.storedTagsData = filteredTagData;
      this.tagService.setTagSelected(filteredTagData);
      this.setTagLength();
    }
  }

  emitData(result): void {
    this.popUpEvent.emit({ data: result, type: 'add' });
  }

  setTagLength(): void {
    this.tagCount = this.tagsData ? this.tagsData.length : 0;
  }

  onTagClick(tag: INameIDPair): void {
    if (tag) {
      const filteredTagData = this.tagsData.filter((item) => item !== tag);
      this.tagsData = filteredTagData;
      this.storedTagsData = filteredTagData;
      this.tagService.setTagSelected(filteredTagData);
      this.setTagLength();
      //return;
      this.tagService.setTagFromSelector(tag);
    }
  }

  filterTagData(event): void {
    const text: string = event.target.value;
    if (text) {
      const filteredData = this.storedTagsData.filter(({ name }) => name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
      this.tagsData = filteredData;
      this.setTagLength();
    } else {
      this.tagsData = this.storedTagsData;
      this.setTagLength();
    }
  }

  ngOnDestroy(): void {
    this.tagExistsAtDBSubscription.unsubscribe();
    this.tagRemovedFromInputSubscription.unsubscribe();
  }
}
