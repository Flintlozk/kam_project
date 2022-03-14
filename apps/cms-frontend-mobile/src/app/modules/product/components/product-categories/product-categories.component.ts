import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss'],
  animations: [FadeAnimate.fadeLeftAnimation],
})
export class ProductCategoriesComponent implements OnInit, AfterContentChecked {
  prefixCategories = RouteLinkEnum.PREFIX_CATEGORIES;
  productCategories = [
    {
      routeLink: 'all',
      title: 'All',
    },
    {
      routeLink: 'jackets-vests',
      title: 'Jackets & Vests',
    },
    {
      routeLink: 'shoes',
      title: 'Shoes',
    },
    {
      routeLink: 'accessories',
      title: 'Accessories',
    },
    {
      routeLink: 'men',
      title: "Men's",
    },
    {
      routeLink: 'women',
      title: "Women's",
    },
    {
      routeLink: 'kids',
      title: "Kids'",
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    const activeRouteKey = this.route.snapshot.firstChild.paramMap.get('type');
    this.scrollToActiveProductCategory(activeRouteKey);
  }

  scrollToActiveProductCategory(type: string): void {
    if (type) {
      const productCategory = document.getElementById(type) as HTMLElement;
      const productCategories = document.getElementById('product-categories-container') as HTMLElement;
      if (productCategories && productCategory) productCategories.scrollLeft = productCategory.offsetLeft - 30;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
