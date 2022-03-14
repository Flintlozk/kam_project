import { Component, OnInit, ViewEncapsulation, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomersComponent implements OnInit, OnDestroy {
  selectedIndex: number;
  tabWidth: string;
  menuStatus: boolean;
  INDEXES = {
    list: 0,
    tags: 1,
    companies: 2,
    histories: 3,
  };

  constructor(private route: ActivatedRoute, private router: Router, private layoutservice: LayoutCommonService) {
    this.layoutservice.shareMenuStatus.subscribe((result) => (this.menuStatus = result));
  }

  handleResize(target: any): void {
    if (window.innerWidth <= 992) {
      this.tabWidth = target - 40 + 'px';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.handleResize(event.target.innerWidth);
  }

  handleIndexChange(newIndex: number): void {
    const newRoute = ['/customers/details', getKeyByValue(this.INDEXES, newIndex), 1];
    void this.router.navigate(newRoute, { relativeTo: this.route.parent });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: { id: string; tab: string }) => {
      this.selectedIndex = this.INDEXES[params['tab']];
    });
    if (window.innerWidth <= 992) {
      this.tabWidth = window.innerWidth - 40 + 'px';
    }
  }

  ngOnDestroy(): void {}
}
