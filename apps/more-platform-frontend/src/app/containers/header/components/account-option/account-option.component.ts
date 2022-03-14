import { Component, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'more-platform-account-option',
  templateUrl: './account-option.component.html',
  styleUrls: ['./account-option.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class AccountOptionComponent implements OnInit {
  toggleStatus = false;
  currentAccount = {
    name: 'Haha Hahaha Habahabaha',
    role: 'Member',
    imgUrl: 'assets/img/haha.svg',
  };
  constructor() {}

  ngOnInit(): void {}

  onToggleStatus(): void {
    this.toggleStatus = !this.toggleStatus;
  }

  onOutsideProfileBox(event: boolean): void {
    if (event) this.toggleStatus = false;
  }
}
