import { Component, DoCheck, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';
import { Subject } from 'rxjs';

@Component({
  selector: 'reactor-room-shop-owner-info',
  templateUrl: './shop-owner-info.component.html',
  styleUrls: ['./shop-owner-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShopOwnerInfoComponent implements OnInit, DoCheck, OnDestroy {
  INDEXES = { info: 0, credit: 1 };
  selectedIndex: number;
  isLoading = true as boolean;
  tabWidth: string;
  menuStatus: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private layoutservice: LayoutCommonService, private router: Router, private route: ActivatedRoute) {
    this.layoutservice.shareMenuStatus.subscribe((result) => (this.menuStatus = result));
  }

  // resize handlers
  handleResize(target: any) {
    if (window.innerWidth <= 992) {
      this.tabWidth = target - 40 + 'px';
    } else {
      this.tabWidth = target + (this.menuStatus ? -310 : -115) + 'px';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleResize(event.target.innerWidth);
  }

  ngDoCheck(): void {
    this.handleResize(window.innerWidth);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.handleResize(window.innerWidth);
      this.selectedIndex = params['tab'] ? this.INDEXES[params['tab']] : 0;
    });
  }

  handleIndexChange(newIndex: number): void {
    console.log('newIndex ::::::::::>>> ', newIndex);

    const newRoute = [`/shopowner/${getKeyByValue(this.INDEXES, newIndex)}`];
    void this.router.navigate(newRoute);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  onClickBack(): void {
    const newRoute = [`/setting/owner`];
    void this.router.navigate(newRoute);
  }
}
