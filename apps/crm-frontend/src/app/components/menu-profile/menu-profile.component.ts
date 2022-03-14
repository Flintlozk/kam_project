import { Component, Input } from '@angular/core';

@Component({
  selector: 'reactor-room-menu-profile',
  templateUrl: './menu-profile.component.html',
  styleUrls: ['./menu-profile.component.scss'],
})
export class MenuProfileComponent {
  @Input() memberFlow;

  trackByIndex(index: number): number {
    return index;
  }
}
