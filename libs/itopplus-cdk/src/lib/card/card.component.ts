import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'reactor-room-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
})
export class CardComponent implements OnInit {
  @Input() withTitle = false;
  @Input() moreRouteLink: string;
  @Input() borderRadius = '10px' as string;
  @Input() padding = '20px' as string;
  @Input() background = 'white' as string;
  @Input() color = '#343D46' as string;
  @Input() boxShadow = '' as string;
  @Input() backgroundActive = false as boolean;
  @Input() height = 'auto' as string;
  @Input() topPadding = '0px' as string;
  @Input() paddingBottom = '20px' as string;
  stylus = {
    padding: '20px',
    background: 'white',
    borderRadius: '10px',
    color: '#343D46',
    boxShadow: '',
    height: 'auto',
  };
  topStyle = {
    padding: '0px',
    paddingBottom: '20px',
  };

  constructor() {}

  ngOnInit(): void {
    this.styleComponent();
  }

  styleComponent() {
    this.stylus.padding = this.padding;
    this.stylus.borderRadius = this.borderRadius;
    this.stylus.boxShadow = this.boxShadow;
    this.stylus.height = this.height;
    if (this.backgroundActive) {
      this.stylus.background = '#54B1FF';
      this.stylus.color = 'white';
    } else {
      this.stylus.background = this.background;
      this.stylus.color = this.color;
    }
    this.topStyle.padding = this.topPadding;
    this.topStyle.paddingBottom = this.paddingBottom;
  }
}
