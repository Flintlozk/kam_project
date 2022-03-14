import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
})
export class ProductCategoryComponent implements OnInit {
  productCategoryData = [
    {
      productTitle: 'Michael Korns Michael Korns Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: '30.03',
      price: '119.00',
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
    {
      productTitle: 'Michael Korns',
      productImage: 'assets/images/shared/sample.jpg',
      amount: '35',
      discount: 433.43,
      price: 454444,
    },
  ];

  sortCategoryStatus = false;
  constructor() {}

  ngOnInit(): void {}

  toggleSortCategoryStatus(): void {
    this.sortCategoryStatus = !this.sortCategoryStatus;
  }
}
