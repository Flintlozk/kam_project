import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, startWith } from 'rxjs/operators';
import { IShortcut } from '../../my-shortcut.model';

@Component({
  selector: 'cms-next-my-shortcut-dialog',
  templateUrl: './my-shortcut-dialog.component.html',
  styleUrls: ['./my-shortcut-dialog.component.scss'],
})
export class MyShortcutDialogComponent implements OnInit, OnDestroy {
  shortcuts: IShortcut[];
  destroy$ = new Subject();
  checkboxShortcut$ = new Subject<number>();
  checkboxShortcutEvent$ = this.checkboxShortcut$.pipe(takeUntil(this.destroy$), startWith(-1));

  applyButton$ = new Subject();
  applyButtonEvent$ = this.applyButton$.pipe(distinctUntilChanged(), takeUntil(this.destroy$));

  constructor(private dialogRef: MatDialogRef<MyShortcutDialogComponent>, @Inject(MAT_DIALOG_DATA) private shortcutData: IShortcut[]) {
    this.shortcuts = this.shortcutData;
  }

  ngOnInit(): void {
    this.onSelectShortcut();
    this.onApplyShortcut();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onApplyShortcut(): void {
    this.applyButtonEvent$.subscribe(() => {
      this.dialogRef.close(this.shortcuts);
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSelectShortcut(): void {
    this.checkboxShortcutEvent$.subscribe((id) => {
      let count = 0;
      this.shortcuts.forEach((shortcut) => {
        if (shortcut.shortcutId === id) {
          shortcut.isActive = !shortcut.isActive;
          this.setActiveAllChildNode(shortcut);
        }
        if (shortcut.childNode.length) {
          shortcut.childNode.forEach((child) => {
            if (child.shortcutId === id) {
              child.isActive = !child.isActive;
            }
            if (child.isActive) count++;
          });
          this.setActiveParentNode(shortcut, count);
        }
      });
    });
  }
  setActiveParentNode(shortcut: IShortcut, count: number): void {
    if (count === shortcut.childNode.length) {
      shortcut.isActive = true;
    } else {
      shortcut.isActive = false;
    }
  }

  setActiveAllChildNode(shortcut: IShortcut): void {
    if (shortcut.isActive) {
      shortcut.childNode.forEach((child) => {
        child.isActive = true;
      });
    } else {
      shortcut.childNode.forEach((child) => {
        child.isActive = false;
      });
    }
  }

  onToggleChildNode(index: number): void {
    if (this.shortcuts[index].childNode.length) this.shortcuts[index].isToggle = !this.shortcuts[index].isToggle;
  }
}
