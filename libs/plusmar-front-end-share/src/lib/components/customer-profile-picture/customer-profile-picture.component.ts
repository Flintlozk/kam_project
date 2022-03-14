import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'reactor-room-customer-profile-picture',
  templateUrl: './customer-profile-picture.component.html',
  styleUrls: ['./customer-profile-picture.component.scss'],
})
export class CustomerProfilePictureComponent implements OnInit {
  @Input() psid: string | number;
  @Input() line_user_id: string | number;
  @Input() url: string;
  constructor() {}

  ngOnInit(): void {}

  handleNoImage(e: any, psid: string | number): void {
    e.target.src = 'assets/img/customer/customer_error.svg';
  }
}
