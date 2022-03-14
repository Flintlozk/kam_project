import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[reactorRoomOnDomChange]',
})
export class OnDomChangeDirective implements OnDestroy {
  private changes: MutationObserver;

  @Output()
  public reactorRoomOnDomChange = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    const element = this.elementRef.nativeElement;

    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => this.reactorRoomOnDomChange.emit(mutation));
    });

    this.changes.observe(element, {
      attributes: true,
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
