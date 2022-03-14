import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-change-primary-email-info',
  templateUrl: './change-primary-email-info.component.html',
  styleUrls: ['./change-primary-email-info.component.scss'],
})
export class ChangePrimaryEmailInfoComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document, public translate: TranslateService, private renderer2: Renderer2) {}

  ngOnInit(): void {
    const script = this.renderer2.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://gateway.autodigi.net/bundle.js?wid=5facb6d53574f8001c9d3fdd';
    script.text = '';
    this.renderer2.appendChild(this.document.body, script);
    this.renderer2.setStyle(this.document.body, 'padding', '10px');
    this.renderer2.setStyle(this.document.body, 'overflow-x', 'visible');
  }
}
