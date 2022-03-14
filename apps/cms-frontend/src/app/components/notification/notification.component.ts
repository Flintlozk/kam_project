import { Component, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [FadeAnimate.fadeInOutYAnimation],
})
export class NotificationComponent implements OnInit {
  toggleStatus = false;
  hasNotification = true;
  constructor() {}

  ngOnInit(): void {}

  onToggleStatus(): void {
    this.toggleStatus = !this.toggleStatus;
  }

  onOutsideNotification(event: boolean): void {
    if (event) this.toggleStatus = false;
  }
}
