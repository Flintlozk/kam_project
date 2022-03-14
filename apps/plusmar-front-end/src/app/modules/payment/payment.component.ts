import { Component, OnInit } from '@angular/core';
declare const braintree;
declare const paypal;

@Component({
  selector: 'reactor-room-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const ClientID = 'AV4euy7Sk8Vwat0wwoFIjIp8pqzvmuBbS-FSLcUKrDX_da_KU5Q3aAquf0IieXC3Gy1gPmK9pi6zIwDt'; // SANDBOX
    const checkout = document.createElement('script');
    checkout.src = 'https://www.paypal.com/sdk/js?client-id=' + ClientID;
    checkout.onload = () => {
      if (paypal) {
        paypal.Buttons().render('#paypal-button');
      }
    };
    document.head.appendChild(checkout);
  }
}
