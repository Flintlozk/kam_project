import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[routerLinkActiveMatch]',
})
export class RouterLinkActiveMatchDirective implements OnInit {
  @Input() routerLinkActiveMatch: string;

  constructor(private el: ElementRef, private router: Router) {}

  ngOnInit(): void {
    if (this.routerLinkActiveMatch) {
      this.router.events.pipe(filter((e: RouterEvent) => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
        const isNodeActive = e.url.split('/').includes(this.routerLinkActiveMatch);
        const handler = isNodeActive ? 'add' : 'remove';
        setTimeout(() => {
          this.el.nativeElement.classList[handler]('active');
        });
      });
    }
  }
}
