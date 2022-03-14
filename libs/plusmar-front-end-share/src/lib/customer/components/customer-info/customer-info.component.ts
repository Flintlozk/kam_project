import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerInfoComponent implements OnInit {
  INDEXES = {
    information: 0,
    history: 1,
    order: 2,
    activity: 3,
    // log: 3,
  };
  selectedIndex: number;
  customerId: number;
  constructor(private route: ActivatedRoute, private router: Router) {}

  handleIndexChange(newIndex: number): void {
    const firstPage = newIndex ? 1 : ''; // information tab has no pagination
    const newRoute = ['/customer', this.customerId, getKeyByValue(this.INDEXES, newIndex), firstPage];
    void this.router.navigate(newRoute);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: { id: string; tab: string }) => {
      this.customerId = +params['id'];
      this.selectedIndex = params['tab'] ? this.INDEXES[params['tab']] : 0;
    });
  }
}
