import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IStep } from '@reactor-room/itopplus-model-lib';
import { isObservable, Observable, Subject } from 'rxjs';

@Component({
  selector: 'reactor-room-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.less'],
})
export class StepComponent implements OnInit, OnDestroy {
  isObservable = isObservable;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() Step: IStep;
  @Input() RouteStatus: boolean;
  @Input() Total$: Observable<number>;
  @Input() TotalAsync: Observable<number>;
  @Input() isLast: boolean;
  @Input() isGreyBg: boolean;
  @Input() routerLink: string;
  @Input() showLastAmount = true;

  @ViewChild('cardstep') cardStep: ElementRef;
  @Output() cardStepOffsetLeft = new EventEmitter<number>();

  constructor() {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setCardStepPosition() {
    this.cardStepOffsetLeft.emit(this.cardStep.nativeElement.offsetLeft - 60);
  }

  ngOnInit(): void {}

  isNumber(data: any): boolean {
    return typeof data === 'number';
  }
}
