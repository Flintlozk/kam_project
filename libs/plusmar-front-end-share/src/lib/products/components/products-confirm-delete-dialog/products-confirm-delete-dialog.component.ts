import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';

@Component({
  selector: 'reactor-room-products-confirm-delete-dialog',
  templateUrl: './products-confirm-delete-dialog.component.html',
  styleUrls: ['./products-confirm-delete-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsConfirmDeleteDialogComponent implements OnInit {
  tableHeader: ITableHeader[] = [
    { sort: true, title: 'No', key: null },
    { sort: true, title: 'Products', key: null },
    { sort: true, title: 'Status', key: null },
    { sort: false, title: 'Actions', key: null },
  ];

  tableData = [
    { productImgUrl: 'assets/img/sample-shirt.svg', productName: 'dasdas', status: 1, statusName: 'Selling' },
    { productImgUrl: 'assets/img/sample-shirt.svg', productName: 'dasdasd', status: 2, statusName: 'Out of Stock' },
    { productImgUrl: 'assets/img/sample-shirt.svg', productName: 'dasdsad', status: 3, statusName: 'Cancel Selling' },
  ];

  constructor(public dialogRef: MatDialogRef<ProductsConfirmDeleteDialogComponent>) {}
  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onConfirmYes(): void {
    this.dialogRef.close();
  }

  trackBy(index: number, el: any): number {
    return el.id;
  }
}
