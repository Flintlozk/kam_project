import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[reactorRoomNumeric]',
})

/*
Example usage
 // to support numbers
<input numeric type="text">
 // to support decimal
<input numeric decimals="2" type="text">
*/
export class NumericDirective {
  @Input() decimals = 0;
  private onlyNumberRegex = new RegExp(/^[0-9]*$/g);

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {}

  /*   @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    console.log('NumericDirective -> onPaste -> event', event);
  } */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const current: string = this.el.nativeElement.value;

    const next: string = current.concat(event.key);

    if (+this.decimals === 0) {
      if (next && !String(next).match(this.onlyNumberRegex)) {
        event.preventDefault();
      }
    } else {
      const decimalRegex = '^\\s*((\\d+(\\.\\d{0,' + this.decimals + '})?)|((\\d*(\\.\\d{1,' + this.decimals + '}))))\\s*$';
      if (next && !String(next).match(decimalRegex)) {
        event.preventDefault();
      }
    }
  }
}
