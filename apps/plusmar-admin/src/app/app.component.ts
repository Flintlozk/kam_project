import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showLayout = false;
  constructor(private router: Router) {}
}
