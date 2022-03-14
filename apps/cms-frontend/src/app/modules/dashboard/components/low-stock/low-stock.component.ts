import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-low-stock',
  templateUrl: './low-stock.component.html',
  styleUrls: ['./low-stock.component.scss'],
})
export class LowStockComponent implements OnInit {
  heading: IHeading = {
    title: 'Low Inventory',
    subTitle: 'E-Commerce / Low Inventory',
  };
  show = true;

  currentPage: 'INVENTORY' | 'SETTING' = 'INVENTORY';

  //currentPage: 'INVENTORY' | 'SETTING' = localStorage.getItem("path") | 'INVENTORY';
  // currentPage2:'SETTING' | 'INVENTORY' = 'SETTING'

  constructor(public router: Router) {}

  ngOnInit(): void {
    if (window.location.pathname === '/dashboard/low-stock/low-stock-setting') {
      this.currentPage = 'SETTING';
    }
  }

  //ค่าส่วนหัว
  navigateTo(path?: 'INVENTORY' | 'SETTING'): void {
    this.currentPage = path;
    //localStorage.setItem("path", path);
    // TODO : Check path IF === INVENTORY -> Navgiate Setting
    // TODO : Check path IF === Setting -> Navgiate INVENTORY

    // How to Check URL ?
    //

    switch (this.currentPage) {
      case 'INVENTORY':
        this.router.navigate(['/dashboard/low-stock/low-stock-inventory']);
        break;
      case 'SETTING':
        this.router.navigate(['/dashboard/low-stock/low-stock-setting']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}
