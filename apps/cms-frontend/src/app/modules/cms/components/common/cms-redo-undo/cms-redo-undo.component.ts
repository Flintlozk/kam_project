import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { IUndoRedo } from './cms-redo-undo.model';
import { UndoRedoService } from '../../../../../services/undo-redo.service';

@Component({
  selector: 'cms-next-cms-redo-undo',
  templateUrl: './cms-redo-undo.component.html',
  styleUrls: ['./cms-redo-undo.component.scss'],
})
export class CmsRedoUndoComponent implements OnInit, OnDestroy {
  buttonUndo$ = new Subject<number>();
  buttonRedo$ = new Subject<number>();
  destroy$ = new Subject();
  constructor(public undoRedoService: UndoRedoService) {}
  undoRedoData: IUndoRedo = {
    maxStep: 5,
    currentUndoStep: 1,
    currentRedoStep: 1,
  };

  ngOnInit(): void {
    this.onUndo();
    this.onRedo();
  }

  onUndo(): void {
    this.buttonUndo$.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      // this.undoRedoData.currentUndoStep = this.undoRedoService.past.length;
      // this.undoRedoData.currentRedoStep = this.undoRedoService.future.length;
      this.undoRedoService.undo();
    });
  }

  onRedo(): void {
    this.buttonRedo$.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      // this.undoRedoData.currentUndoStep = this.undoRedoService.past.length;
      // this.undoRedoData.currentRedoStep = this.undoRedoService.future.length;
      this.undoRedoService.redo();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
