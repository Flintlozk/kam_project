import { Component, OnInit } from '@angular/core';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { IProductLowStockTotal } from 'libs/itopplus-model-lib/src/lib/product/product-low-inventory.model';
import { ProductLowInventoryService } from 'apps/cms-frontend/src/app/services/product-low-inventory.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'cms-next-e-commerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss'],
})
export class ECommerceComponent implements OnInit {
  moreLink = RouteLinkEnum.DASHBOARD_ECOMMERCE;
  moreLinkLowstock = RouteLinkEnum.DASHBOARD_LOW_STOCK;
  productLowStockTotal: IProductLowStockTotal[] = [] as IProductLowStockTotal[];
  destroy$: Subject<void> = new Subject<void>();
  errorMessage = '';
  totalRows = 0;
  isNoData = false;
  ecommerceData = [
    {
      title: 'Order Transaction',
      subTitle: 'E-Commerce',
      value: 193,
      isPositive: true,
      percentage: 5.86,
      unpaid: 'Unpaid',
      valueunpaid: '3',
      paid: 'Paid',
      valuepaid: '190',
    },
    {
      title: 'Revenue',
      subTitle: 'E-Commerce',
      value: '฿107,921',
      isPositive: false,
      percentage: 5.86,
      unpaid: 'Unpaid',
      valueunpaid: '฿7,401',
      paid: 'Paid',
      valuepaid: '฿10,520',
    },
  ];

  constructor(public router: Router, public productLowInventoryService: ProductLowInventoryService) {}

  ngOnInit(): void {
    this.getProductLowStockTotal();
  }

  getProductLowStockTotal(): void {
    this.productLowInventoryService
      .getProductLowStockTotal()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: IProductLowStockTotal[]) => {
          // console.log(result)
          this.productLowStockTotal = result
        },
        error: (error) => {
          console.log(error);
        },
      });
  }


  // getProductListData(): void {
  //   this.tableForProduct.isLoading = true;
  //   this.loaderText = this.translate.instant('Loading your products. Please wait');
  //   this.productListService
  //     .getProductAllList(this.tableFilters)
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       tap((productList) => (productList?.length ? this.processReceivedProductList(productList) : this.processNoProductList())),
  //       catchError((err) => {
  //         console.log(' err => ', err);
  //         this.processNoProductList();
  //         return EMPTY;
  //       }),
  //     )
  //     .subscribe();
  // }
  

  // getProductLowStockTotal(): void{
  //   this.productLowInventoryService
  // }

  // getProductLowInventory(): void {
  // this.productLowInventoryService
  //   .productLowStockTotal()
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe({
  //   });
  // }

  trackByIndex(index: number): number {
    return index;
  }
}

// <div class="bg-gray-500 min-h-screem flex items-center">
//         <div class="flex-1 max-w-4x1 mx-auto p-10">
//             <di class="grid grid-cols-5 grid-rows-3 gap-1">
//                 <div class="col-span-4 bg-blue-300 rounded-lg shadow-xl">
//                     <div class="h-24 flex justify-center items-center">col-span-4</div>
//                 </div>
//                 <div class="row-span-3 bg-red-200" style="margin-left: 5px">
//                     <div class="h-24 flex justify-center items-center">row-span-4</div>
//                 </div>
//                 <div class="col-span-2 row-span-1 bg-yellow-300">
//                     <div class="h-24 flex justify-around items-center">
//                         <div class="flex flex-col space-y-4">
//                             <div>1.11</div>
//                             <div>1.2</div>
//                         </div>
//                         <div>2</div>
//                     </div>
//                 </div>
//                 <div class="col-span-2 row-span-1 bg-yellow-300">
//                     <div class="h-24 flex justify-center items-center">
//                         col-span-2 row-span-2
//                     </div>
//                 </div>
//                 <div class="col-span-1 row-span-1 bg-white">
//                     <div class="h-24 flex justify-between items-center">
//                         <div class="pb-10 pl-5">u</div>

//                         <div class="pr-4 pt-6">123</div>
//                     </div>
//                 </div>
//                 <div class="col-span-1 row-span-1 bg-white">
//                     <div class="h-24 flex justify-between items-center">
//                         <div class="pb-10 pl-5">u</div>
//                         <div class="pr-4 pt-6">123</div>
//                     </div>
//                 </div>
//                 <div class="col-span-1 row-span-1 bg-white">
//                     <div class="h-24 flex justify-between items-center">
//                         <div class="pb-10 pl-5">u</div>
//                         <div class="pr-4 pt-6">123</div>
//                     </div>
//                 </div>
//                 <div class="col-span-1 row-span-1 bg-white">
//                     <div class="h-24 flex justify-between items-center">
//                         <div class="pb-10 pl-5">u</div>
//                         <div class="pr-4 pt-6">123</div>
//                     </div>
//                 </div>
//                 <!-- <li class="col-start-5 col-end-7 bg-blue-300 rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">
//               col-start-5 col-end-7
//             </div>
//           </li>
//           <li class="col-span-2 row-span-2 bg-red-200 rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">
//               col-span-2 row-span-2
//             </div>
//           </li>
//           <li class="col-span-2 row-span-3 bg-yellow-300 rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">
//               col-span-2 row-span-3
//             </div>
//           </li>
//           <li class="col-span-2 bg-white rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">col-span-2</div>
//           </li>
//           <li class="col-span-2 bg-white rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">col-span-2</div>
//           </li>
//           <li class="col-span-2 bg-white rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">col-span-2</div>
//           </li>
//           <li class="col-span-2 bg-white rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">col-span-2</div>
//           </li>
//           <li class="col-span-3 bg-white rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">col-span-3</div>
//           </li>
//           <li class="col-span-3 bg-white rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">col-span-3</div>
//           </li>
//           <li class="col-span-6 bg-white rounded-lg shadow-xl">
//             <div class="h-24 flex justify-center items-center">col-span-6</div>
//           </li> -->
//             </di>
//         </div>
//     </div>
