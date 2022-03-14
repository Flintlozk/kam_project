import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IThemeGeneralInfo } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'cms-next-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss'],
})
export class ThemeListComponent implements OnInit {
  constructor() {}
  @Input() themes: IThemeGeneralInfo[] = [];
  @Output()
  themeIndexEmitter = new EventEmitter<number>();
  ngOnInit(): void {
    this.onSelectTemplate();
  }
  destroy$ = new Subject();
  buttonSelectTheme$ = new Subject<number>();
  buttonSelectThemeEvent$ = this.buttonSelectTheme$.pipe(distinctUntilChanged(), takeUntil(this.destroy$));
  trackByIndex(index: number): number {
    return index;
  }
  onSelectTemplate(): void {
    this.buttonSelectThemeEvent$.pipe(takeUntil(this.destroy$)).subscribe((themeIndex) => {
      this.themeIndexEmitter.emit(themeIndex);
    });
  }
}
