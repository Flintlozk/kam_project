import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'reactor-room-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less'],
})
export class ModalComponent implements OnInit, OnChanges {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  @Input() isModalShown = false;
  @ViewChild('insideElement') insideElement;
  ngOnChanges(changes: SimpleChanges) {
    const { currentValue } = changes.isModalShown;
    const handlerIn = currentValue ? 'add' : 'remove';
    this.document.body.classList[handlerIn]('modal-active');
  }

  ngOnInit(): void {}

  public onClick(e) {
    console.log('object', this.insideElement);
    const clickedInside = this.insideElement.nativeElement.contains(e.target);
    if (!clickedInside) {
      console.log('outside clicked');
    }
  }
}
