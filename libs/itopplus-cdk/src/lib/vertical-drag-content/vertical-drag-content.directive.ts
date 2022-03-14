import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[verticalDragContent]',
})
export class VerticalDragContentDirective {
  isDown = false;
  startY: any;
  scrollTop: any;

  constructor(private el: ElementRef) {}

  //Mouse Event
  @HostListener('mousedown', ['$event'])
  onMouseDown(ev: MouseEvent) {
    this.isDown = true;
    this.el.nativeElement.classList.add('active');
    this.startY = ev.pageY - this.el.nativeElement.offsetTop;
    this.scrollTop = this.el.nativeElement.scrollTop;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(ev: MouseEvent) {
    this.isDown = false;
    this.el.nativeElement.classList.remove('active');
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(ev: MouseEvent) {
    this.isDown = false;
    this.el.nativeElement.classList.remove('active');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(ev: MouseEvent) {
    if (!this.isDown) return;
    ev.preventDefault();
    const y = ev.pageY - this.el.nativeElement.offsetTop;
    const walk = y - this.startY;
    this.el.nativeElement.scrollTop = this.scrollTop - walk;
  }

  //Touch Event
  @HostListener('touchstart', ['$event'])
  onTouchStart(ev: TouchEvent) {
    this.isDown = true;
    this.el.nativeElement.classList.add('active');
    this.startY = ev.changedTouches[0].pageY - this.el.nativeElement.offsetTop;
    this.scrollTop = this.el.nativeElement.scrollTop;
  }

  @HostListener('touchcancel', ['$event'])
  onTouchCancel(ev: TouchEvent) {
    this.isDown = false;
    this.el.nativeElement.classList.remove('active');
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(ev: TouchEvent) {
    this.isDown = false;
    this.el.nativeElement.classList.remove('active');
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(ev: TouchEvent) {
    if (!this.isDown) return;
    ev.preventDefault();
    const y = ev.changedTouches[0].pageY - this.el.nativeElement.offsetTop;
    const walk = y - this.startY;
    this.el.nativeElement.scrollTop = this.scrollTop - walk;
  }
}
