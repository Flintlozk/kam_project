import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[cmsNextClickOutside]',
})
export class ClickOutsideDirective {
  @Output() outside = new EventEmitter();
  @Input() clickOutsideHandler = null;

  constructor(private el: ElementRef) {}

  @Output('cmsNextClickOutside') clickOutside: EventEmitter<boolean> = new EventEmitter();

  @HostListener('document:mousedown', ['$event.target']) onMouseDown(targetElement: MouseEvent): void {
    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (clickedInside) {
      this.outside.emit(false);
    } else {
      this.outside.emit(true);
    }
  }
  @HostListener('document:touchstart', ['$event.target']) onTouchStart(targetElement: TouchEvent): void {
    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (clickedInside) {
      this.outside.emit(false);
    } else {
      this.outside.emit(true);
      if (this.clickOutsideHandler) this.clickOutsideHandler();
    }
  }
}
