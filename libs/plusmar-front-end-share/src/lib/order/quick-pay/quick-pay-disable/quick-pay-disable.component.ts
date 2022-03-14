import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'reactor-room-quick-pay-disable',
  templateUrl: './quick-pay-disable.component.html',
  styleUrls: ['./quick-pay-disable.component.scss'],
})
export class QuickPayDisableComponent {
  constructor(private router: Router) {}

  openPaymentSettings() {
    this.router.navigate(['/setting/payment']);
  }
}
