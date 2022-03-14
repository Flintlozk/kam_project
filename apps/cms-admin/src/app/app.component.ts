import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'reactor-room-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cms-admin';
  constructor(private router: Router) {}
}
