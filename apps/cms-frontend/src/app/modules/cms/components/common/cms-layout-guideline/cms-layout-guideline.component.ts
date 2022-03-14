import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CmsEditService } from '../../../services/cms-edit.service';
import { UndoRedoService } from '../../../../../services/undo-redo.service';
import { IThemeOption } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-layout-guideline',
  templateUrl: './cms-layout-guideline.component.html',
  styleUrls: ['./cms-layout-guideline.component.scss'],
})
export class CmsLayoutGuidelineComponent implements OnInit {
  @Input() el: ElementRef;
  @Input() onFocus = false;
  @Input() isChildEnter = false;
  @Input() themeOption: IThemeOption;
  @Input() title: string;
  @Output() removeEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('dragHandler', { static: true }) dragHandler: ElementRef;
  constructor(private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {}

  onDecreaseDropIndex(): void {
    this.cmsEditService.onChangeLayoutIndex(this.el.nativeElement, 'desc');
    this.undoRedoService.addLayoutMoveUndo(this.el.nativeElement, 'desc');
  }

  onIncreaseDropIndex(): void {
    this.cmsEditService.onChangeLayoutIndex(this.el.nativeElement, 'asc');
    this.undoRedoService.addLayoutMoveUndo(this.el.nativeElement, 'asc');
  }

  onRemoveCurrentComponent(): void {
    this.removeEvent.emit(true);
  }
}
