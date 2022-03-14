import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[reactorRoomClickOutside]',
})
export class ClickOutsideDirective {
  @Output() outside = new EventEmitter();
  @Input() clickOutsideHandler = null;

  constructor(private el: ElementRef) {}

  @Output('reactorRoomClickOutside') clickOutside: EventEmitter<any> = new EventEmitter();

  @HostListener('document:mousedown', ['$event.target']) onMouseDown(targetElement) {
    const clickedInside = this.el.nativeElement.contains(targetElement);
    const isMatOption = 'mat-option-text';
    if (clickedInside || targetElement.classList.contains(isMatOption)) {
      this.outside.emit(false);
    } else {
      this.outside.emit(true);
    }
  }
  @HostListener('document:touchstart', ['$event.target']) onTouchStart(targetElement) {
    const clickedInside = this.el.nativeElement.contains(targetElement);
    const isMatOption = 'mat-option-text';
    if (clickedInside || targetElement.classList.contains(isMatOption)) {
      this.outside.emit(false);
    } else {
      this.outside.emit(true);
      if (this.clickOutsideHandler) this.clickOutsideHandler();
    }
  }
}
