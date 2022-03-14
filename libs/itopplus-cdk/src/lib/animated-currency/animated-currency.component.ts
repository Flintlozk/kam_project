import { Component, ElementRef, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges, HostListener } from '@angular/core';

@Component({
  selector: 'reactor-animated-currency',
  templateUrl: './animated-currency.component.html',
})
export class AnimatedCurrencyComponent implements AfterViewInit, OnChanges {
  @Input() duration: number;
  @Input() digit: string;
  @Input() steps: number;
  @Input() decimal: string;
  @Input() id = 'currencyView';
  currencyView: any;
  ViewValidate = false;
  ScrollToBottom = false;
  instance = false;
  @ViewChild('animatedCurrency') animatedCurrency: ElementRef;

  animateCount(): void {
    if (!this.duration) {
      this.duration = 300;
    }
    if (!this.decimal) {
      this.decimal = '1.0-2';
    }

    if (this.animatedCurrency) {
      this.counterFunc(this.digit, this.duration);
    }
  }

  counterFunc(endValue: string, durationMs: number): void {
    if (!this.steps) {
      this.steps = 12;
    }

    const stepCount = Math.abs(durationMs / this.steps);
    const valueIncrement = (Number(endValue) - 0) / stepCount;
    const sinValueIncrement = Math.PI / stepCount;

    let currentValue = 0;
    let currentSinValue = 0;
    //eslint-disable-next-line
    const _this = this;
    function step() {
      currentSinValue += sinValueIncrement;
      currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;
      setTimeout(() => {
        _this.digit = Math.abs(currentValue).toFixed(2);
      });
      if (currentSinValue < Math.PI) {
        window.requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          _this.digit = endValue;
        });
      }
    }

    step();
  }

  // checkVisible(elm): boolean {
  //   const rect = elm.getBoundingClientRect();
  //   const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  //   return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  // }

  ngAfterViewInit(): void {
    if (this.digit) {
      this.animateCount();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['digit']) {
      this.animateCount();
    }
  }
}
